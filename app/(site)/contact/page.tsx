import type { Metadata } from 'next';
import { Suspense } from 'react';
import ContactPageClient from '@/components/contact/ContactPageClient';
import { buildMetadata } from '@/lib/site';

export const metadata: Metadata = buildMetadata({
  title: 'Request a Security Plan',
  description:
    'Use Sentinel Security’s full quote form for executive protection, event coverage, corporate guarding, and site-security planning.',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <Suspense fallback={null}>
      <ContactPageClient />
    </Suspense>
  );
}
