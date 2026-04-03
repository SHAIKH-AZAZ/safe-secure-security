import type { Metadata } from 'next';
import Link from 'next/link';
import { IconArrowRight, IconCheck, IconCrowd, IconPhone } from '@/components/icons';
import { buildMetadata, SITE } from '@/lib/site';
import SectionReveal from '@/components/ui/SectionReveal';

export const metadata: Metadata = buildMetadata({
  title: 'Event & Venue Security',
  description:
    'Guest-facing event security, venue supervision, and access-control planning for private gatherings, launches, and hospitality environments.',
  path: '/event-venue-security',
});

const SERVICES = [
  {
    name: 'Private Event Teams',
    desc: 'Security coverage designed to support guest arrival flow, private access, and calm front-of-house presence.',
  },
  {
    name: 'Venue Supervision',
    desc: 'Door, queue, and floor oversight for hospitality and nightlife environments where escalation control matters.',
  },
  {
    name: 'Credential & Screening Support',
    desc: 'Entry checks, guest-list validation, bag screening, and layered perimeter awareness.',
  },
];

const FEATURES = [
  'Site walkthroughs and ingress-egress planning before the event opens',
  'Briefing structure for supervisors, entry teams, and VIP movement points',
  'Staffing posture that fits luxury, hospitality, and brand-facing settings',
  'Access control for invite-only, ticketed, or high-attention programs',
  'Escalation discipline that keeps the guest experience intact',
  'Post-event observations and reporting when the brief requires it',
];

export default function EventVenueSecurityPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <SectionReveal>
            <span className="section-label">Event & Venue</span>
            <h1 className="page-title">
              Event security
              <br />
              that protects the
              <br />
              <span style={{ color: 'var(--gold)' }}>guest experience.</span>
            </h1>
            <p className="page-description">
              Sentinel balances access control, visible presence, and escalation readiness so events
              feel orderly, premium, and properly supervised.
            </p>
            <div className="page-actions">
              <Link href="/contact" className="btn btn-primary">
                Get event security quote
                <IconArrowRight size={15} />
              </Link>
              <Link href={SITE.phoneHref} className="btn btn-outline">
                <IconPhone size={15} />
                Call operations
              </Link>
            </div>
          </SectionReveal>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <SectionReveal>
            <span className="section-label">Service Lines</span>
            <h2 className="section-title" style={{ marginBottom: 40 }}>Event Capability</h2>
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
                  <IconCrowd size={20} />
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
              <span className="section-label">Planning Scope</span>
              <h2 className="section-title" style={{ marginBottom: 32 }}>Common Coverage Areas</h2>
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
              <span className="section-label">Ready to Scope</span>
              <h3 style={{ fontSize: 30, fontWeight: 800, marginBottom: 12, marginTop: 8 }}>Plan your event brief</h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 24 }}>
                Share venue, guest profile, timing, and visibility expectations. Illustrative examples
                on the site should be verified before publishing final marketing claims.
              </p>
              <Link href="/contact" className="btn btn-primary">
                Submit event details
                <IconArrowRight size={15} />
              </Link>
            </SectionReveal>
          </div>
        </div>
      </section>
    </>
  );
}
