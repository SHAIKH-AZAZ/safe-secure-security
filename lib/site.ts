import type { Metadata } from 'next';

export const SITE = {
  name: 'Safe & Security Service',
  legalName: 'Safe & Security Service',
  shortName: 'Safe',
  url: 'https://safesecurityservice.example',
  email: 'ops@safesecurityservice.example',
  careersEmail: 'careers@safesecurityservice.example',
  phoneDisplay: '+91 9104069717',
  phoneHref: 'tel:+919104069717',
  phoneRaw: '+919104069717',
  whatsappUrl: 'https://wa.me/919104069717',
  locale: 'en_IN',
  defaultTitle: 'Safe & Security Service | Executive Protection, Event Security, and Site Guarding',
  tagline: 'Disciplined protection. Measured response. Discreet execution.',
  description:
    'Premium executive protection, event security, and property guarding for leaders, venues, and high-value sites across key Indian metros.',
  emergencyLabel: '24/7 operations desk',
  mainBranch: {
    address: '8th Floor, 806 Samsar link Building, Opp Vishnudhara, Gradens Building, Jaguar Car Showroom Road, Jagatpura, Gota Ahmedabad 382470',
    phones: ['+91 9104069717', '+91 7096107979']
  },
  branchOffice: {
    address: 'Shams Fitness Point GYM',
    phones: ['+91 9898735375', '+91 9998727695']
  }
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
