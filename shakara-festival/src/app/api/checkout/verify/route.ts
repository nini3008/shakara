import { NextRequest, NextResponse } from 'next/server'
import Flutterwave from 'flutterwave-node-v3'

export async function POST(req: NextRequest) {
  try {
    const { transactionId, expectedAmount, expectedCurrency } = await req.json()
    if (!transactionId) return NextResponse.json({ error: 'Missing transactionId' }, { status: 400 })

    const flw = new Flutterwave(
      process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY!,
      process.env.FLW_SECRET_KEY!
    )

    const response = await flw.Transaction.verify({ id: transactionId })
    const data = response?.data

    const ok =
      data?.status === 'successful' &&
      (expectedAmount ? Number(data?.amount) >= Number(expectedAmount) : true) &&
      (expectedCurrency ? data?.currency === expectedCurrency : true)

    if (!ok) {
      return NextResponse.json({ ok: false, data }, { status: 400 })
    }

    // TODO: issue ticket / persist order (out of scope here)
    return NextResponse.json({ ok: true, data })
  } catch {
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}


