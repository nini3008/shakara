const readBoolean = (value: string | undefined, defaultValue: boolean): boolean => {
  if (value === undefined) return defaultValue;
  const normalized = value.trim().toLowerCase();
  return normalized === '1' || normalized === 'true' || normalized === 'yes' || normalized === 'on';
};

export const CART_ENABLED: boolean = readBoolean(process.env.NEXT_PUBLIC_CART_ENABLED, false);


