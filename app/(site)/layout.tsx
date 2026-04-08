import type { Metadata } from 'next';
import { Barlow_Condensed, Inter } from 'next/font/google';
import '../globals.css';
import Footer from '@/components/ui/Footer';
import Header from '@/components/ui/Header';
import JsonLd from '@/components/ui/JsonLd';
import MobileBar from '@/components/ui/MobileBar';
import UtilityBar from '@/components/ui/UtilityBar';
import { getSiteContent } from '@/lib/admin-api';
import { SITE } from '@/lib/site';

export const dynamic = 'force-dynamic';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.defaultTitle,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    'executive protection',
    'event security',
    'site guarding',
    'corporate security',
    'residential security',
    'security consulting',
  ],
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  openGraph: {
    type: 'website',
    locale: SITE.locale,
    url: SITE.url,
    siteName: SITE.name,
    title: SITE.defaultTitle,
    description: SITE.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.defaultTitle,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

function generateOrganizationJsonLd(cityNames: string[]) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: SITE.name,
      url: SITE.url,
      description: SITE.description,
      email: SITE.email,
      telephone: SITE.phoneRaw,
      areaServed: ['Gujarat', ...cityNames],
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          telephone: SITE.phoneRaw,
          email: SITE.email,
          availableLanguage: ['English'],
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE.name,
      url: SITE.url,
    },
  ];
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = await getSiteContent();
  const organizationJsonLd = generateOrganizationJsonLd(content.cities.map((city) => city.name));

  return (
    <html lang="en" className={`${inter.variable} ${barlowCondensed.variable}`}>
      <body>
        <JsonLd data={organizationJsonLd} />
        <UtilityBar />
        <Header navLinks={content.navLinks} />
        <main id="main-content">{children}</main>
        <Footer cities={content.cities} />
        <MobileBar />
        <SpeedInsights />
      </body>
    </html>
  );
}
