type Plan = {
  id: string;
  title: string;
  description: string;
  monthly: number; // price per month (USD)
  yearly: number; // price per month billed yearly (already discounted)
  badge?: string; // e.g. 'Recommended'
  highlight?: boolean; // true to emphasize the card
  ctaLabel: string;
  ctaHref: string;
  features: { label: string; included: boolean }[];
};
