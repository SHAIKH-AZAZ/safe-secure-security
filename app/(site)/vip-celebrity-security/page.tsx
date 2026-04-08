import type { Metadata } from 'next';
import Link from 'next/link';
import {
  IconArrowRight,
  IconCheck,
  IconCrowd,
  IconPhone,
  IconRoute,
  IconShield,
  IconStarShield,
} from '@/components/icons';
import SectionReveal from '@/components/ui/SectionReveal';
import { buildMetadata, SITE } from '@/lib/site';

export const metadata: Metadata = buildMetadata({
  title: 'VIP & Celebrity Security',
  description:
    'VIP security, celebrity guard services, arrival management, and licensed armed support discussions for high-attention assignments across Gujarat.',
  path: '/vip-celebrity-security',
});

const SERVICES = [
  {
    name: 'VIP Security Escort',
    desc: 'Protection for dignitaries, VIP guests, wedding principals, and business leaders who need polished arrival control and disciplined movement support.',
    icon: IconStarShield,
  },
  {
    name: 'Celebrity Guard Services',
    desc: 'Low-profile protection for actors, performers, influencers, athletes, and public personalities across shoots, appearances, and live-event movement.',
    icon: IconCrowd,
  },
  {
    name: 'Arrival, Backstage & Route Control',
    desc: 'Support for airport pickups, hotel interfaces, backstage hold areas, red-carpet arrivals, and secure entry-exit choreography.',
    icon: IconRoute,
  },
  {
    name: 'Licensed Gunman Support',
    desc: 'Discussed case-by-case for eligible assignments that require a stronger deterrence posture and can be staffed in line with licensing and local law.',
    icon: IconShield,
  },
];

const FEATURES = [
  'Advance recce for routes, residences, hotels, venues, and holding areas',
  'Coordination with managers, personal assistants, planners, or talent teams',
  'Plain-clothes, suited, or uniformed posture based on the assignment brief',
  'Crowd-buffer awareness for public appearances, launches, and celebrity movement',
  'Arrival and departure choreography that protects access without slowing the schedule',
  'Compliance-first review whenever armed or gunman support is requested',
];

export default function VipCelebritySecurityPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <SectionReveal>
            <span className="section-label">VIP & Celebrity Protection</span>
            <h1 className="page-title">
              Security for
              <br />
              high-visibility people
              <br />
              <span style={{ color: 'var(--gold)' }}>and high-attention moments.</span>
            </h1>
            <p className="page-description">
              Sentinel scopes VIP security, celebrity guards, and movement-control support around
              profile, schedule, crowd pressure, and the level of visibility the brief can tolerate.
            </p>
            <div className="page-actions">
              <Link href="/contact" className="btn btn-primary">
                Request VIP security plan
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
            <h2 className="section-title" style={{ marginBottom: 40 }}>High-Visibility Coverage</h2>
          </SectionReveal>

          <div className="page-grid-4">
            {SERVICES.map((service, index) => {
              const IconComp = service.icon;

              return (
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
                    <IconComp size={20} />
                  </span>
                  <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>{service.name}</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>{service.desc}</p>
                </SectionReveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-primary)' }}>
        <div className="container">
          <div className="page-grid-2">
            <SectionReveal>
              <span className="section-label">Assignment Planning</span>
              <h2 className="section-title" style={{ marginBottom: 32 }}>What we scope before deployment</h2>
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
              <h3 style={{ fontSize: 30, fontWeight: 800, marginBottom: 12, marginTop: 8 }}>Share the brief privately</h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 24 }}>
                Send the route, venue list, expected crowd pressure, and required visibility level.
                If licensed armed or gunman support is being requested, we will confirm the legal and
                assignment requirements before recommending a staffing plan.
              </p>
              <Link href="/contact" className="btn btn-primary">
                Start confidential planning
                <IconArrowRight size={15} />
              </Link>
            </SectionReveal>
          </div>
        </div>
      </section>
    </>
  );
}
