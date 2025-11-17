import { z } from 'zod'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

const trimString = z.string().trim()

const optionalPhoneSchema = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value && value.length > 0 ? value : undefined))
  .superRefine((value, ctx) => {
    if (!value) return
    const phone = parsePhoneNumberFromString(value, 'NG') ?? parsePhoneNumberFromString(value)
    if (!phone || !phone.isValid()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Enter a valid phone number' })
    }
  })
  .transform((value) => {
    if (!value) return undefined
    const phone = parsePhoneNumberFromString(value, 'NG') ?? parsePhoneNumberFromString(value)
    if (!phone || !phone.isValid()) {
      return value
    }
    return phone.number
  })

export const checkoutCustomerSchema = z.object({
  firstName: trimString.min(1, 'First Name is required').max(80, 'First Name is too long'),
  lastName: trimString.min(1, 'Last Name is required').max(80, 'Last Name is too long'),
  email: trimString.email('Enter a valid email address'),
  phone: optionalPhoneSchema,
})

export type CheckoutCustomerSchema = typeof checkoutCustomerSchema
export type CheckoutCustomerInput = z.input<CheckoutCustomerSchema>
export type CheckoutCustomer = z.output<CheckoutCustomerSchema>

const selectedDatesSchema = z
  .union([z.array(z.string()), z.string()])
  .optional()
  .transform((value) => {
    if (!value) return undefined
    const array = Array.isArray(value) ? value : String(value).split(',')
    const normalized = array
      .map((date) => date.trim())
      .filter(Boolean)
    if (normalized.length === 0) return undefined
    const unique = Array.from(new Set(normalized))
    unique.sort()
    return unique
  })

const checkoutLineSchema = z.object({
  sku: trimString.min(1, 'Line SKU is required'),
  quantity: z.coerce.number().int('Quantity must be a whole number').min(1, 'Quantity must be at least 1'),
  selectedDate: trimString.optional().transform((value) => (value ? value : undefined)),
  selectedDates: selectedDatesSchema,
})

export const checkoutPreparePayloadSchema = z.object({
  customer: checkoutCustomerSchema,
  lines: z
    .array(checkoutLineSchema)
    .min(1, 'At least one line item is required'),
  discountCode: z.string().trim().optional(),
})

export type CheckoutLineInput = z.input<typeof checkoutLineSchema>
export type CheckoutLine = z.output<typeof checkoutLineSchema>

export type CheckoutPreparePayload = z.infer<typeof checkoutPreparePayloadSchema>


