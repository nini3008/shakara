import { client } from './sanity'
import type { DiscountCode, ResolvedDiscount } from '@/types'

export interface ValidateDiscountOptions {
  code: string
  cartTotal: number
  cartSkus?: string[]
  customerEmail?: string
}

export interface ValidateDiscountResult {
  valid: boolean
  discount?: ResolvedDiscount
  error?: string
}

// Normalize discount codes (uppercase, trimmed)
export function normalizeCode(code: string): string {
  return code.trim().toUpperCase()
}

// Fetch discount code from Sanity
export async function fetchDiscountCode(code: string): Promise<DiscountCode | null> {
  const normalizedCode = normalizeCode(code)
  const query = `*[_type == "discountCode" && code == $code][0]`
  return client.fetch<DiscountCode | null>(query, { code: normalizedCode })
}

// Calculate discount value for a given cart total
export function calculateDiscountValue(discount: DiscountCode, cartTotal: number): number {
  if (discount.type === 'percentage') {
    // Cap percentage at 100%
    const percentage = Math.min(discount.amount, 100) / 100
    return Math.round(cartTotal * percentage)
  } else {
    // Flat discount, but never exceed cart total
    return Math.min(discount.amount, cartTotal)
  }
}

// Validate a discount code with all constraints
export async function validateDiscountCode(
  options: ValidateDiscountOptions
): Promise<ValidateDiscountResult> {
  const { code, cartTotal, cartSkus = [], customerEmail } = options

  // Fetch the discount code
  const discount = await fetchDiscountCode(code)
  
  if (!discount) {
    return { valid: false, error: 'Invalid discount code' }
  }

  // Check if active
  if (!discount.active) {
    return { valid: false, error: 'This discount code is no longer active' }
  }

  // Check date validity
  const now = new Date()
  if (discount.validFrom && new Date(discount.validFrom) > now) {
    return { valid: false, error: 'This discount code is not yet valid' }
  }
  if (discount.validTo && new Date(discount.validTo) < now) {
    return { valid: false, error: 'This discount code has expired' }
  }

  // Check max uses
  if (discount.maxUses !== undefined && discount.usageCount !== undefined) {
    if (discount.usageCount >= discount.maxUses) {
      return { valid: false, error: 'This discount code has reached its usage limit' }
    }
  }

  // Check max uses per email if email provided
  if (customerEmail && discount.maxUsesPerEmail !== undefined) {
    // For now, we'll check this server-side in the prepare route
    // This would require tracking usage per email in Sanity
  }

  // Check applicable SKUs
  if (discount.applicableSkus && discount.applicableSkus.length > 0) {
    const hasApplicableSku = cartSkus.some(sku => 
      discount.applicableSkus!.includes(sku)
    )
    if (!hasApplicableSku) {
      return { valid: false, error: 'This discount code is not applicable to items in your cart' }
    }
  }

  // Calculate discount value
  const valueApplied = calculateDiscountValue(discount, cartTotal)

  // Ensure discount doesn't exceed cart total
  if (valueApplied <= 0) {
    return { valid: false, error: 'Discount cannot be applied to this order' }
  }

  const resolvedDiscount: ResolvedDiscount = {
    code: discount.code,
    label: discount.label,
    type: discount.type,
    amount: discount.amount,
    valueApplied
  }

  return { valid: true, discount: resolvedDiscount }
}

// Check usage per email (would need to be called server-side with writeClient)
export async function checkEmailUsage(
  discountId: string,
  email: string,
  maxUsesPerEmail: number
): Promise<{ allowed: boolean; usageCount: number }> {
  // Count orders with this discount code and email
  const query = `count(*[_type == "order" && discount.code == $code && email == $email])`
  const usageCount = await client.fetch<number>(query, { 
    code: discountId, 
    email: email.toLowerCase() 
  })
  
  return {
    allowed: usageCount < maxUsesPerEmail,
    usageCount
  }
}

// Format discount display text
export function formatDiscountText(discount: ResolvedDiscount): string {
  if (discount.type === 'percentage') {
    return `${discount.amount}% off`
  } else {
    return `₦${discount.amount.toLocaleString()} off`
  }
}

// Format discount value for display
export function formatDiscountValue(value: number): string {
  return `-₦${value.toLocaleString()}`
}
