type Plan = {
  id: 'starter' | 'pro' | 'business';
  title: string;
  description: string;
  free?: string
  price?: number;
  period?: string;
  badge?: string; // e.g. 'Recommended'
  highlight?: boolean; // true to emphasize the card
  ctaLabel: string;
  ctaHref: string;
  features: { label: string; included: boolean }[];
};
