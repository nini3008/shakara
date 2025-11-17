import { NextRequest, NextResponse } from 'next/server'
import { validateDiscountCode } from '@/lib/discounts'
import { z } from 'zod'

const validatePayloadSchema = z.object({
  code: z.string().min(1, 'Discount code is required'),
  cartTotal: z.number().min(0, 'Cart total must be positive'),
  cartSkus: z.array(z.string()).optional(),
  customerEmail: z.string().email().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = validatePayloadSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { code, cartTotal, cartSkus, customerEmail } = parsed.data

    // Validate the discount code
    const result = await validateDiscountCode({
      code,
      cartTotal,
      cartSkus,
      customerEmail,
    })

    if (!result.valid) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: 400 }
      )
    }

    // Return the validated discount
    return NextResponse.json({
      ok: true,
      discount: result.discount,
      amountOff: result.discount!.valueApplied,
    })
  } catch (error) {
    console.error('Discount validation error:', error)
    return NextResponse.json(
      { error: 'Failed to validate discount code' },
      { status: 500 }
    )
  }
}
