import type { Metadata } from 'next';
import Link from 'next/link';
import { IconArrowRight } from '@/components/icons';
import { buildMetadata, SITE } from '@/lib/site';
import SectionReveal from '@/components/ui/SectionReveal';

export const metadata: Metadata = buildMetadata({
  title: 'Careers',
  description:
    'Career page placeholder for Sentinel Security covering supervisory, event, and guarding roles.',
  path: '/careers',
});

const ROLES = [
  {
    title: 'Close Protection Officer',
    location: 'Multi-city',
    type: 'Full-time',
    requirement: 'Background in protective operations, client-facing discretion, and schedule flexibility.',
  },
  {
    title: 'Event Security Supervisor',
    location: 'Hospitality markets',
    type: 'Contract / seasonal',
    requirement: 'Floor ownership, team briefing discipline, and premium guest-environment awareness.',
  },
  {
    title: 'Corporate Site Guard',
    location: 'Managed properties',
    type: 'Full-time',
    requirement: 'Professional front-of-house standards, post-order discipline, and incident logging.',
  },
  {
    title: 'Patrol and Access Support',
    location: 'Regional rotation',
    type: 'Full-time',
    requirement: 'Reliable shift coverage, controlled escalation judgment, and access-control awareness.',
  },
];

export default function CareersPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <SectionReveal>
            <span className="section-label">Join the Team</span>
            <h1 className="page-title">
              Careers at
              <br />
              <span style={{ color: 'var(--gold)' }}>{SITE.name}</span>
            </h1>
            <p className="page-description">
              This route is structured as a careers landing page placeholder. Final hiring claims,
              requirements, and jurisdiction-specific language should be verified before launch.
            </p>
          </SectionReveal>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <SectionReveal>
            <span className="section-label">Open Positions</span>
            <h2 className="section-title" style={{ marginBottom: 40 }}>Current role placeholders</h2>
          </SectionReveal>

          <div className="page-stack">
            {ROLES.map((role, index) => (
              <SectionReveal
                key={role.title}
                delay={index * 60}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-card)',
                  padding: '24px 28px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 24,
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>{role.title}</h3>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
                    <span className="badge badge-subtle">{role.location}</span>
                    <span className="badge badge-gold">{role.type}</span>
                  </div>
                  <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>{role.requirement}</p>
                </div>

                <Link href="/contact" className="btn btn-outline">
                  Apply via contact form
                  <IconArrowRight size={13} />
                </Link>
              </SectionReveal>
            ))}
          </div>

          <SectionReveal
            delay={180}
            style={{
              marginTop: 40,
              background: 'var(--bg-card)',
              border: '1px solid var(--border-card)',
              padding: '32px',
              textAlign: 'center',
            }}
          >
            <h3 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>General recruitment inbox</h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20 }}>
              Placeholder role content is active on this page. Verify hiring details and funnel design before launch.
            </p>
            <a href={`mailto:${SITE.careersEmail}`} className="btn btn-outline">
              {SITE.careersEmail}
            </a>
          </SectionReveal>
        </div>
      </section>
    </>
  );
}
