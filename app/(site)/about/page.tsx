import type { Metadata } from 'next';
import Link from 'next/link';
import { IconArrowRight, IconCheck, IconShield } from '@/components/icons';
import { getSiteContent } from '@/lib/admin-api';
import { buildMetadata, SITE } from '@/lib/site';
import SectionReveal from '@/components/ui/SectionReveal';

export const metadata: Metadata = buildMetadata({
  title: `About ${SITE.name}`,
  description:
    'Learn how Sentinel Security approaches people, process, coverage, and compliance for premium protection assignments.',
  path: '/about',
});

const VALUES = [
  {
    title: 'Discretion',
    desc: 'The work should support the client environment, not dominate it. Sentinel favors calm control over visible theatrics.',
  },
  {
    title: 'Discipline',
    desc: 'Briefs are translated into clear operating roles, not vague promises. Structure is part of the service.',
  },
  {
    title: 'Judgment',
    desc: 'Premium security depends on timing, restraint, and escalation choices that fit the environment.',
  },
];

export default async function AboutPage() {
  const content = await getSiteContent();

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <SectionReveal>
            <span className="section-label">About Sentinel</span>
            <h1 className="page-title">
              Built for clients
              <br />
              who need calm,
              <br />
              <span style={{ color: 'var(--gold)' }}>credible control.</span>
            </h1>
            <p className="page-description">
              Sentinel Security is framed as a premium consultancy, not a commodity staffing vendor.
              The operating model centers on brief quality, professional presence, and measured response.
            </p>
          </SectionReveal>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <SectionReveal>
            <span className="section-label">Core Values</span>
            <h2 className="section-title" style={{ marginBottom: 40 }}>What guides the work</h2>
          </SectionReveal>

          <div className="page-grid-3">
            {VALUES.map((value, index) => (
              <SectionReveal key={value.title} delay={index * 80} className="card" style={{ padding: '28px 24px' }}>
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 44,
                    height: 44,
                    background: 'var(--gold-glow)',
                    border: '1px solid var(--gold-border)',
                    color: 'var(--gold)',
                    marginBottom: 16,
                  }}
                >
                  <IconShield size={20} />
                </span>
                <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>{value.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>{value.desc}</p>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      <section id="why-us" className="section" style={{ background: 'var(--bg-primary)' }}>
        <div className="container">
          <SectionReveal>
            <span className="section-label">Why Sentinel</span>
            <h2 className="section-title" style={{ marginBottom: 48 }}>Four planning pillars</h2>
          </SectionReveal>

          <div className="page-grid-2">
            {content.proofPillars.map((pillar, index) => (
              <SectionReveal
                key={pillar.id}
                delay={index * 80}
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', padding: '36px 28px' }}
              >
                <h3 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>{pillar.title}</h3>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 20 }}>
                  {pillar.label}
                </p>
                <ul className="page-check-list">
                  {pillar.points.map((point) => (
                    <li key={point} className="page-check-item">
                      <span>
                        <IconCheck size={11} />
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-sm" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <SectionReveal>
            <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 16 }}>Need a planning-first security partner?</h2>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 28 }}>
              Use the full brief form to move from scope questions to an actual request.
            </p>
            <Link href="/contact" className="btn btn-primary">
              Request consultation
              <IconArrowRight size={15} />
            </Link>
          </SectionReveal>
        </div>
      </section>
    </>
  );
}
