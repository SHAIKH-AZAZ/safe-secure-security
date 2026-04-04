import type { Metadata } from 'next';
import Link from 'next/link';
import { IconArrowRight, IconLocation } from '@/components/icons';
import CoverageMap from '@/components/ui/CoverageMap';
import SectionReveal from '@/components/ui/SectionReveal';
import { CITIES } from '@/lib/constants';
import { buildMetadata } from '@/lib/site';

export const metadata: Metadata = buildMetadata({
  title: 'Coverage',
  description:
    'Review Sentinel Security coverage across Gujarat, including major cities and regional deployment areas.',
  path: '/coverage',
});

export default function CoveragePage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <SectionReveal>
            <span className="section-label">Coverage Footprint</span>
            <h1 className="page-title">
              Coverage across
              <br />
              all of
              <br />
              <span style={{ color: 'var(--gold)' }}>Gujarat.</span>
            </h1>
            <p className="page-description">
              We support planned and urgent deployments across Gujarat for executive protection,
              events, commercial sites, and residential estates.
            </p>
          </SectionReveal>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <SectionReveal>
            <CoverageMap />
          </SectionReveal>

          <SectionReveal delay={80} style={{ marginTop: 32 }}>
            <div className="page-grid-4">
              {CITIES.map((city, index) => (
                <SectionReveal key={city.name} delay={index * 40} className="card" style={{ padding: '24px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <span style={{ color: 'var(--gold)' }}>
                      <IconLocation size={16} />
                    </span>
                    <h3 style={{ fontSize: 21, fontWeight: 800 }}>{city.name}</h3>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-dimmed)', letterSpacing: '0.06em', marginBottom: 14 }}>
                    {city.region}
                  </p>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{city.coverageLabel}</p>
                </SectionReveal>
              ))}
            </div>
          </SectionReveal>

          <SectionReveal
            delay={160}
            style={{
              marginTop: 40,
              background: 'var(--bg-card)',
              border: '1px solid var(--gold-border)',
              padding: '28px 32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 24,
              flexWrap: 'wrap',
            }}
          >
            <div>
              <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Need coverage in another district?</h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>
                Use the quote form to share the exact Gujarat location, travel profile, and operating environment.
              </p>
            </div>
            <Link href="/contact" className="btn btn-primary">
              Discuss requirements
              <IconArrowRight size={15} />
            </Link>
          </SectionReveal>
        </div>
      </section>
    </>
  );
}
