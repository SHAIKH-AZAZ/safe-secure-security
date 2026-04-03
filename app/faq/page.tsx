import type { Metadata } from 'next';
import Link from 'next/link';
import FaqSection from '@/components/home/FaqSection';
import JsonLd from '@/components/ui/JsonLd';
import { FAQS } from '@/lib/constants';
import { buildMetadata, SITE } from '@/lib/site';

export const metadata: Metadata = buildMetadata({
  title: 'FAQ',
  description:
    'Common questions about Sentinel Security’s planning process, coverage footprint, urgency handling, and quote structure.',
  path: '/faq',
});

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqJsonLd} />

      <section className="page-hero">
        <div className="container">
          <span className="section-label">FAQ</span>
          <h1 className="page-title">
            Frequently asked
            <br />
            <span style={{ color: 'var(--gold)' }}>questions</span>
          </h1>
          <p className="page-description">
            Straight answers on deployment timing, quote structure, coverage messaging, and launch-stage
            placeholder content.
          </p>
        </div>
      </section>

      <FaqSection showHeader={false} />

      <section className="section-sm" style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>Still need a direct answer?</h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>
            Call the operations desk or send the full intake form.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn btn-primary">
              Send enquiry
            </Link>
            <Link href={`tel:${SITE.phoneRaw}`} className="btn btn-outline">
              Call now
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
