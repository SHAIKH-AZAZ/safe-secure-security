import type { Metadata } from 'next';
import Link from 'next/link';
import { IconArrowRight, IconCheck, IconPhone, IconShield } from '@/components/icons';
import { buildMetadata, SITE } from '@/lib/site';
import SectionReveal from '@/components/ui/SectionReveal';

export const metadata: Metadata = buildMetadata({
  title: 'Executive Protection',
  description:
    'Discreet protection planning for principals, executives, VIP guests, family-office stakeholders, and privacy-sensitive travel schedules.',
  path: '/executive-protection',
});

const SERVICES = [
  {
    name: 'Principal Protection',
    desc: 'Low-profile coverage for executives, founders, and principals whose schedule or profile requires an added layer of control.',
  },
  {
    name: 'Travel Escort',
    desc: 'Advance route planning, airport interface, and movement support for multi-stop itineraries.',
  },
  {
    name: 'Family Office Support',
    desc: 'Protection planning that balances household privacy, residential routines, and stakeholder movement.',
  },
];

const FEATURES = [
  'Brief-led protective planning before the schedule starts moving',
  'Plain-clothes posture where visibility needs to stay low',
  'Advance checks around routes, arrivals, and site interfaces',
  'Travel support for airport transitions and hotel coordination',
  'Single point of contact for changes, updates, and handoffs',
  'NDA-ready process for privacy-sensitive assignments',
];

export default function ExecutiveProtectionPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <SectionReveal>
            <span className="section-label">Personal Protection</span>
            <h1 className="page-title">
              Executive
              <br />
              protection with
              <br />
              <span style={{ color: 'var(--gold)' }}>a discreet operating model.</span>
            </h1>
            <p className="page-description">
              Sentinel builds close-protection plans around executive schedules, VIP movement,
              locations, sensitivities, and the amount of visible security the brief can tolerate.
            </p>
            <div className="page-actions">
              <Link href="/contact" className="btn btn-primary">
                Request protection plan
                <IconArrowRight size={15} />
              </Link>
              <Link href={SITE.phoneHref} className="btn btn-outline">
                <IconPhone size={15} />
                Call directly
              </Link>
            </div>
          </SectionReveal>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <SectionReveal>
            <span className="section-label">Service Lines</span>
            <h2 className="section-title" style={{ marginBottom: 40 }}>Protection Capability</h2>
          </SectionReveal>

          <div className="page-grid-3">
            {SERVICES.map((service, index) => (
              <SectionReveal key={service.name} delay={index * 80} className="card" style={{ padding: '28px 24px' }}>
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
                <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>{service.name}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>{service.desc}</p>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-primary)' }}>
        <div className="container">
          <div className="page-grid-2">
            <SectionReveal>
              <span className="section-label">What We Plan For</span>
              <h2 className="section-title" style={{ marginBottom: 32 }}>Standard Planning Areas</h2>
              <ul className="page-check-list">
                {FEATURES.map((feature) => (
                  <li key={feature} className="page-check-item">
                    <span>
                      <IconCheck size={11} />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </SectionReveal>

            <SectionReveal
              delay={100}
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', padding: '36px 32px' }}
            >
              <span className="section-label">Confidential Intake</span>
              <h3 style={{ fontSize: 30, fontWeight: 800, marginBottom: 12, marginTop: 8 }}>Speak with the team</h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 24 }}>
                Use the full quote form for travel schedules, principal movement, and private-site
                protection planning. Any scenario copy shown on the site is illustrative until verified.
              </p>
              <Link href="/contact" className="btn btn-primary">
                Start consultation
                <IconArrowRight size={15} />
              </Link>
            </SectionReveal>
          </div>
        </div>
      </section>
    </>
  );
}
