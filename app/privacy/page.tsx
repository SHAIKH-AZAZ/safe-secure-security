import type { Metadata } from 'next';
import { buildMetadata, SITE } from '@/lib/site';

export const metadata: Metadata = buildMetadata({
  title: 'Privacy Policy',
  description:
    'Placeholder privacy policy for Sentinel Security covering enquiry handling, confidentiality, and launch-stage data assumptions.',
  path: '/privacy',
});

export default function PrivacyPage() {
  return (
    <section className="page-hero" style={{ minHeight: '100vh' }}>
      <div className="container">
        <span className="section-label">Legal</span>
        <h1 className="page-title">Privacy Policy</h1>

        <div className="legal-stack">
          <p>
            <strong>Last updated:</strong> April 3, 2026
          </p>

          {[
            {
              heading: 'Information We Collect',
              text: 'Sentinel may collect contact details and assignment information you submit through enquiry forms, intake requests, or direct outreach channels.',
            },
            {
              heading: 'How Information Is Used',
              text: 'Submitted information is used to review the brief, prepare a response, and coordinate follow-up communication. Final data workflows should be verified before launch.',
            },
            {
              heading: 'Confidentiality',
              text: 'Sensitive requests should be treated as confidential. NDA language, retention periods, and any regulated handling requirements must be confirmed with counsel before publishing.',
            },
            {
              heading: 'Retention',
              text: 'This page currently presents placeholder policy language. Production retention rules, deletion windows, and storage systems should be documented before go-live.',
            },
            {
              heading: 'Contact',
              text: `For privacy-related questions, use ${SITE.email} or call ${SITE.phoneDisplay}.`,
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
