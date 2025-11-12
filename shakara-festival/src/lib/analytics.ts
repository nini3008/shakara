type DataLayer = Array<Record<string, unknown>>

declare global {
  interface Window {
    dataLayer?: DataLayer
  }
}

export type EcommerceItem = {
  item_id: string
  item_name: string
  price: number
  quantity: number
  currency?: string
  item_category?: string
  item_variant?: string
}

type EcommercePayload = {
  currency?: string
  value?: number
  tax?: number
  transaction_id?: string
  items?: EcommerceItem[]
  [key: string]: unknown
}

export interface DataLayerEvent {
  event: string
  ecommerce?: EcommercePayload
  [key: string]: unknown
}

function ensureDataLayer(): DataLayer | undefined {
  if (typeof window === 'undefined') return undefined
  if (!Array.isArray(window.dataLayer)) {
    window.dataLayer = []
  }
  return window.dataLayer
}

/**
 * Safely push events to the GTM dataLayer, clearing any stale ecommerce state first.
 */
export function pushDataLayer(event: DataLayerEvent | null | undefined) {
  if (!event || typeof event !== 'object') return
  const layer = ensureDataLayer()
  if (!layer) return

  try {
    layer.push({ ecommerce: null })
  } catch {
    // no-op
  }

  const payload = JSON.parse(JSON.stringify(event)) as DataLayerEvent
  layer.push(payload)
}

export function trackEvent(event: string, data?: Omit<DataLayerEvent, 'event'>) {
  pushDataLayer({ event, ...(data ?? {}) })
}

function roundValue(value: number | undefined): number | undefined {
  if (typeof value !== 'number' || Number.isNaN(value)) return undefined
  return Number(value.toFixed(2))
}

function normalizeItem(item: EcommerceItem): EcommerceItem {
  return {
    ...item,
    price: roundValue(item.price) ?? 0,
    quantity: typeof item.quantity === 'number' && !Number.isNaN(item.quantity) ? item.quantity : 1,
  }
}

function trackEcommerceEvent(
  event: string,
  {
    items,
    currency = 'NGN',
    value,
    ...rest
  }: {
    items: EcommerceItem[]
    currency?: string
    value?: number
    [key: string]: unknown
  }
) {
  if (!Array.isArray(items) || items.length === 0) return
  const normalizedItems = items.map(normalizeItem).map((item) => ({
    ...item,
    currency: item.currency ?? currency,
  }))
  const computedValue =
    typeof value === 'number'
      ? value
      : normalizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  trackEvent(event, {
    ecommerce: {
      currency,
      value: roundValue(computedValue),
      items: normalizedItems,
      ...rest,
    },
  })
}

export function trackAddToCart({
  items,
  currency = 'NGN',
  value,
}: {
  items: EcommerceItem[]
  currency?: string
  value?: number
}) {
  trackEcommerceEvent('add_to_cart', { items, currency, value })
}

export function trackBeginCheckout(params: {
  items: EcommerceItem[]
  currency?: string
  value?: number
}) {
  trackEcommerceEvent('begin_checkout', params)
}

export function trackPurchase(params: {
  items: EcommerceItem[]
  currency?: string
  value?: number
  transaction_id: string
  tax?: number
}) {
  const { transaction_id, tax, ...rest } = params
  trackEcommerceEvent('purchase', {
    ...rest,
    transaction_id,
    tax,
  })
}

