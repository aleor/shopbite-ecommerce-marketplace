export type FormatPriceOptions = { locale?: string; currency?: string };

export const formatPrice = (
  value: number,
  opts: { locale?: string; currency?: string } = {}
) => {
  const { locale = 'en-US', currency = 'IDR' } = opts;
  const formatter = new Intl.NumberFormat(locale, {
    currency,
    style: 'currency',
    maximumFractionDigits: 2,
  });
  return formatter.format(value);
};
