import type { Metadata } from 'next';
import { buildMetadata, SITE } from '@/lib/site';

export const metadata: Metadata = buildMetadata({
  title: 'Terms of Service',
  description:
    'Placeholder terms of service for Sentinel Security covering proposal scope, contracts, payment, and launch-stage legal verification.',
  path: '/terms',
});

export default function TermsPage() {
  return (
    <section className="page-hero" style={{ minHeight: '100vh' }}>
      <div className="container">
        <span className="section-label">Legal</span>
        <h1 className="page-title">Terms of Service</h1>

        <div className="legal-stack">
          <p>
            <strong>Last updated:</strong> April 3, 2026
          </p>

          {[
            {
              heading: 'Engagement Basis',
              text: 'Security services should be delivered under a written scope, proposal, or contract. Final commercial language must be reviewed before launch.',
            },
            {
              heading: 'Quotations',
              text: 'Quotations are shaped by staffing model, location, scheduling, travel, and complexity. Any fixed commercial claims on the website should be verified before publication.',
            },
            {
              heading: 'Payment',
              text: 'Production payment terms, deposit expectations, and cancellation policies should be set in the signed engagement documentation.',
            },
            {
              heading: 'Liability and Compliance',
              text: 'Insurance, liability allocation, jurisdiction, and licensing language are placeholders until confirmed with legal and operational stakeholders.',
            },
            {
              heading: 'Contact',
              text: `For contractual questions, contact ${SITE.email} or call ${SITE.phoneDisplay}.`,
            },
          ].map((item) => (
            <div key={item.heading}>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{item.heading}</h2>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
