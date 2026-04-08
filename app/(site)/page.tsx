import type { Metadata } from 'next';
import CaseStudies from '@/components/home/CaseStudies';
import FaqSection from '@/components/home/FaqSection';
import FinalCta from '@/components/home/FinalCta';
import HeroSection from '@/components/home/HeroSection';
import ImageShowcase from '@/components/home/ImageShowcase';
import IndustriesSection from '@/components/home/IndustriesSection';
import ProcessSection from '@/components/home/ProcessSection';
import ServiceGrid from '@/components/home/ServiceGrid';
import Testimonials from '@/components/home/Testimonials';
import Ticker from '@/components/home/Ticker';
import TrustStrip from '@/components/home/TrustStrip';
import WhySentinel from '@/components/home/WhySentinel';
import JsonLd from '@/components/ui/JsonLd';
import { getSiteContent } from '@/lib/admin-api';
import { buildMetadata, SITE } from '@/lib/site';

export const metadata: Metadata = buildMetadata({
  description:
    'Sentinel Security delivers VIP security, celebrity protection, executive protection, event coverage, and premium guarding across Gujarat through a brief-led security model.',
  path: '/',
});

export default async function HomePage() {
  const content = await getSiteContent();
  const services = content.serviceClusters.flatMap((cluster) => cluster.services);

  const homeJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: SITE.defaultTitle,
    url: SITE.url,
    description: SITE.description,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: services.map((service, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: service.name,
        url: `${SITE.url}${service.href}`,
      })),
    },
  };

  return (
    <>
      <JsonLd data={homeJsonLd} />
      <HeroSection hero={content.hero} />
      <TrustStrip items={content.trustStripItems} />
      <Ticker />
      <ServiceGrid clusters={content.serviceClusters} />
      <IndustriesSection industries={content.industries} />
      <WhySentinel pillars={content.proofPillars} />
      <ImageShowcase items={content.imageShowcase ?? []} />
      <CaseStudies studies={content.caseStudies} />
      <ProcessSection steps={content.processSteps} />
      <Testimonials testimonials={content.testimonials} />
      <FaqSection faqs={content.faqItems} />
      <FinalCta />
    </>
  );
}
