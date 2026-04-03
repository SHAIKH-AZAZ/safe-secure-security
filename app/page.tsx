import type { Metadata } from 'next';
import CaseStudies from '@/components/home/CaseStudies';
import FaqSection from '@/components/home/FaqSection';
import FinalCta from '@/components/home/FinalCta';
import HeroSection from '@/components/home/HeroSection';
import IndustriesSection from '@/components/home/IndustriesSection';
import ProcessSection from '@/components/home/ProcessSection';
import ServiceGrid from '@/components/home/ServiceGrid';
import Testimonials from '@/components/home/Testimonials';
import Ticker from '@/components/home/Ticker';
import TrustStrip from '@/components/home/TrustStrip';
import WhySentinel from '@/components/home/WhySentinel';
import JsonLd from '@/components/ui/JsonLd';
import { SERVICE_CLUSTERS } from '@/lib/constants';
import { buildMetadata, SITE } from '@/lib/site';

export const metadata: Metadata = buildMetadata({
  description:
    'Sentinel Security delivers executive protection, event coverage, and property guarding through a premium, brief-led security model.',
  path: '/',
});

const homeJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: SITE.defaultTitle,
  url: SITE.url,
  description: SITE.description,
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: SERVICE_CLUSTERS.flatMap((cluster, clusterIndex) =>
      cluster.services.map((service, serviceIndex) => ({
        '@type': 'ListItem',
        position: clusterIndex * 3 + serviceIndex + 1,
        name: service.name,
        url: `${SITE.url}${service.href}`,
      }))
    ),
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={homeJsonLd} />
      <HeroSection />
      <TrustStrip />
      <Ticker />
      <ServiceGrid />
      <IndustriesSection />
      <WhySentinel />
      <CaseStudies />
      <ProcessSection />
      <Testimonials />
      <FaqSection />
      <FinalCta />
    </>
  );
}
