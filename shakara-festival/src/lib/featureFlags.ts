const readBoolean = (value: string | undefined, defaultValue: boolean): boolean => {
  if (value === undefined) return defaultValue;
  const normalized = value.trim().toLowerCase();
  return normalized === '1' || normalized === 'true' || normalized === 'yes' || normalized === 'on';
};

// Single source of truth: NEXT_PUBLIC_CHECKOUT_ENABLED controls both checkout and cart UI
export const CHECKOUT_ENABLED: boolean = readBoolean(
  process.env.NEXT_PUBLIC_CHECKOUT_ENABLED,
  false
);

// Alias: all cart UI follows checkout enablement
export const CART_ENABLED: boolean = CHECKOUT_ENABLED;


