import type { Metadata } from 'next';
import Link from 'next/link';
import { IconArrowRight, IconBuilding, IconCheck, IconPhone } from '@/components/icons';
import { buildMetadata, SITE } from '@/lib/site';
import SectionReveal from '@/components/ui/SectionReveal';

export const metadata: Metadata = buildMetadata({
  title: 'Corporate & Property Guarding',
  description:
    'Guarding plans for offices, estates, mixed-use properties, and managed sites that need calm front-of-house and controlled access.',
  path: '/corporate-property',
});

const SERVICES = [
  {
    name: 'Corporate Guarding',
    desc: 'Front-desk, lobby, and perimeter support for offices, headquarters, and managed corporate environments.',
  },
  {
    name: 'Estate & Residential Coverage',
    desc: 'Guarding posture for private residences, gated entries, and tenant-facing mixed-use properties.',
  },
  {
    name: 'Patrol & Control Support',
    desc: 'Patrol checks, CCTV support coordination, and access-control discipline for live sites.',
  },
];

const FEATURES = [
  'Written scope and post orders before the coverage window starts',
  'Visitor handling and front-of-house standards aligned to the property type',
  'Supervisor rhythm for shift handoff and issue escalation',
  'Optional patrol, CCTV review support, and access-control coordination',
  'Structured observations and incident logging where the brief requires it',
  'Coverage designed around permanence, discretion, and repeatability',
];

export default function CorporatePropertyPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <SectionReveal>
            <span className="section-label">Corporate & Property</span>
            <h1 className="page-title">
              Site guarding
              <br />
              designed for
              <br />
              <span style={{ color: 'var(--gold)' }}>premium environments.</span>
            </h1>
            <p className="page-description">
              Sentinel supports offices, residences, and managed properties that need controlled access,
              consistent front-of-house standards, and dependable coverage structure.
            </p>
            <div className="page-actions">
              <Link href="/contact" className="btn btn-primary">
                Request guarding plan
                <IconArrowRight size={15} />
              </Link>
              <Link href={SITE.phoneHref} className="btn btn-outline">
                <IconPhone size={15} />
                Speak to our team
              </Link>
            </div>
          </SectionReveal>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <SectionReveal>
            <span className="section-label">Service Lines</span>
            <h2 className="section-title" style={{ marginBottom: 40 }}>Property Security Capability</h2>
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
                  <IconBuilding size={20} />
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
              <span className="section-label">Service Inclusions</span>
              <h2 className="section-title" style={{ marginBottom: 32 }}>Coverage Framework</h2>
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
              <span className="section-label">Start a Site Brief</span>
              <h3 style={{ fontSize: 30, fontWeight: 800, marginBottom: 12, marginTop: 8 }}>Plan the guarding scope</h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 24 }}>
                Send the property type, staffing expectations, and shift model. Any launch copy about
                coverage performance or credentials should be verified before going live.
              </p>
              <Link href="/contact" className="btn btn-primary">
                Request site assessment
                <IconArrowRight size={15} />
              </Link>
            </SectionReveal>
          </div>
        </div>
      </section>
    </>
  );
}
