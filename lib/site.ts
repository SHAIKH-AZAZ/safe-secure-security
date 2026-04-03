import type { Metadata } from 'next';

export const SITE = {
  name: 'Safe & Security Service',
  legalName: 'Safe & Security Service',
  shortName: 'Safe',
  url: 'https://safesecurityservice.example',
  email: 'ops@safesecurityservice.example',
  careersEmail: 'careers@safesecurityservice.example',
  phoneDisplay: '+91 9978688882',
  phoneHref: 'tel:+919978688882',
  phoneRaw: '+919978688882',
  whatsappUrl: 'https://wa.me/919978688882',
  locale: 'en_IN',
  defaultTitle: 'Safe & Security Service | Executive Protection, Event Security, and Site Guarding',
  tagline: 'Disciplined protection. Measured response. Discreet execution.',
  description:
    'Premium executive protection, event security, and property guarding for leaders, venues, and high-value sites across key Indian metros.',
  emergencyLabel: '24/7 operations desk',
} as const;

export function buildMetadata({
  title,
  description,
  path = '/',
}: {
  title?: string;
  description: string;
  path?: string;
}): Metadata {
  const url = new URL(path, SITE.url).toString();

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: 'website',
      locale: SITE.locale,
      url,
      siteName: SITE.name,
      title: title ? `${title} | ${SITE.name}` : SITE.defaultTitle,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title: title ? `${title} | ${SITE.name}` : SITE.defaultTitle,
      description,
    },
  };
}
