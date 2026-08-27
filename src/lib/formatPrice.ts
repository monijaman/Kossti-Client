/** Format prices consistently across locale-specific frontend pages. */
export function formatPrice(value: number | string, locale = 'en'): string {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return 'N/A';

  const formatted = amount.toLocaleString(locale === 'bn' ? 'en-BD' : 'en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return locale === 'bn' ? `৳${formatted}` : `$${formatted}`;
}

export function formatPriceLabel(value: number | string, locale = 'en'): string {
  return formatPrice(value, locale).replace(/\.00$/, '');
}

export function formatPriceRange(
  startPrice: number | string,
  endPrice: number | string | undefined,
  locale = 'en',
): string {
  const start = formatPrice(startPrice, locale);
  return endPrice !== undefined && Number(endPrice) > 0
    ? `${start} - ${formatPrice(endPrice, locale)}`
    : start;
}
