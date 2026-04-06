import type { Metadata } from 'next';
import Link from 'next/link';
import { IconArrowRight } from '@/components/icons';
import JsonLd from '@/components/ui/JsonLd';
import SectionReveal from '@/components/ui/SectionReveal';
import { getSiteContent } from '@/lib/admin-api';
import { buildMetadata, SITE } from '@/lib/site';

export const metadata: Metadata = buildMetadata({
  title: 'Case Studies',
  description:
    'Illustrative deployment scenarios showing how Sentinel Security frames event, executive, and property-security briefs.',
  path: '/case-studies',
});

const caseStudiesJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Sentinel Security Case Studies',
  url: `${SITE.url}/case-studies`,
  description: 'Illustrative case studies pending launch verification.',
};

export default async function CaseStudiesPage() {
  const content = await getSiteContent();

  return (
    <>
      <JsonLd data={caseStudiesJsonLd} />
      <section className="page-hero">
        <div className="container">
          <SectionReveal>
            <span className="section-label">Illustrative Scenarios</span>
            <h1 className="page-title">
              Strategy,
              <br />
              staffing, and
              <br />
              <span style={{ color: 'var(--gold)' }}>operational thinking.</span>
            </h1>
            <p className="page-description">
              These examples are fictional placeholders for launch planning. They are useful for tone
              and structure, but the final site should only publish verified client stories.
            </p>
          </SectionReveal>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="page-note" style={{ marginBottom: 24 }}>
            Illustrative content only. Verify before launch.
          </div>

          <div className="page-stack">
            {content.caseStudies.map((study, index) => (
              <SectionReveal
                key={study.id}
                delay={index * 80}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-card)',
                  padding: '36px 32px',
                  display: 'grid',
                  gap: 24,
                }}
              >
                <div>
                  <span className="badge badge-gold">{study.tag}</span>
                  <p style={{ fontSize: 22, fontWeight: 800, marginTop: 12 }}>{study.clientType}</p>
                </div>

                <div className="page-grid-3" style={{ gap: 24 }}>
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold-dim)', marginBottom: 8 }}>
                      The Requirement
                    </p>
                    <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>{study.problem}</p>
                  </div>

                  <div>
                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold-dim)', marginBottom: 8 }}>
                      Our Response
                    </p>
                    <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>{study.solution}</p>
                  </div>

                  <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-card)', padding: '16px' }}>
                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#4fb87b', marginBottom: 8 }}>
                      Outcome
                    </p>
                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{study.result}</p>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-sm" style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <SectionReveal>
            <h2 style={{ fontSize: 34, fontWeight: 800, marginBottom: 16 }}>Start with your real brief</h2>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>
              Use the full form to convert requirements into an actual scoped request.
            </p>
            <Link href="/contact" className="btn btn-primary">
              Request security plan
              <IconArrowRight size={15} />
            </Link>
          </SectionReveal>
        </div>
      </section>
    </>
  );
}
