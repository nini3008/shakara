import { NextRequest, NextResponse } from 'next/server'
import Flutterwave from 'flutterwave-node-v3'
import crypto from 'crypto'
import { writeClient } from '@/lib/sanity'

function verifySignature(req: NextRequest, body: string) {
  const signature = req.headers.get('verif-hash') || req.headers.get('verif-hash'.toUpperCase())
  const secret = process.env.FLW_WEBHOOK_HASH
  if (!secret || !signature) return false
  const hash = crypto.createHmac('sha256', secret).update(body).digest('hex')
  return hash === signature
}

export async function POST(req: NextRequest) {
  const raw = await req.text()
  try {
    // Verify webhook signature
    if (!verifySignature(req, raw)) {
      console.error('Webhook signature verification failed')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const payload = JSON.parse(raw)
    console.log('Webhook received:', payload.event, payload?.data?.tx_ref)

    // Only process charge.completed events
    if (payload.event !== 'charge.completed') {
      return NextResponse.json({ ok: true })
    }

    const transactionId = payload?.data?.id || payload?.data?.transaction_id
    const txRef = payload?.data?.tx_ref
    
    if (!transactionId || !txRef) {
      console.error('Missing transaction ID or tx_ref in webhook')
      return NextResponse.json({ ok: true })
    }

    // Initialize Flutterwave client
    const flw = new Flutterwave(
      process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY!,
      process.env.FLW_SECRET_KEY!
    )

    // Verify the transaction
    const verification = await flw.Transaction.verify({ id: transactionId })
    const isSuccessful = verification?.data?.status === 'successful'
    
    if (isSuccessful) {
      try {
        const reservation = await writeClient.fetch(
          `*[_type == "reservation" && tx_ref == $tx_ref][0]{ _id, amount, currency, lines[] { sku, units } }`,
          { tx_ref: txRef }
        )
        if (reservation && Number(verification?.data?.amount) === Number(reservation.amount)) {
          await writeClient.transaction()
            .patch(reservation._id, p => p.set({ status: 'confirmed' }))
            .create({
              _type: 'order',
              tx_ref: txRef,
              amount: reservation.amount,
              currency: reservation.currency,
              lines: reservation.lines,
              status: 'paid',
              gateway: 'flutterwave',
              verification: { id: verification?.data?.id, tx_ref: txRef, gateway_amount: verification?.data?.amount },
              createdAt: new Date().toISOString(),
            })
            .commit({ autoGenerateArrayKeys: true })
        }
      } catch (err) {
        console.error('Finalize webhook error:', err)
      }
    } else {
      console.error(`Payment verification failed for tx_ref: ${txRef}`)
    }

    return NextResponse.json({ ok: isSuccessful })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 })
  }
}


