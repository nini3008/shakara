const readBoolean = (value: string | undefined, defaultValue: boolean): boolean => {
  if (value === undefined) return defaultValue;
  const normalized = value.trim().toLowerCase();
  return normalized === '1' || normalized === 'true' || normalized === 'yes' || normalized === 'on';
};

// Checkout feature flag - controls visibility and access to checkout route
export const CHECKOUT_ENABLED: boolean = readBoolean(
  process.env.NEXT_PUBLIC_CHECKOUT_ENABLED,
  false
);

// Cart UI is only available when both cart and checkout are enabled
const BASE_CART_ENABLED: boolean = readBoolean(process.env.NEXT_PUBLIC_CART_ENABLED, false);
export const CART_ENABLED: boolean = BASE_CART_ENABLED && CHECKOUT_ENABLED;


