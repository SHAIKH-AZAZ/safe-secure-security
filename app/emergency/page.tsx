import type { Metadata } from 'next';
import EmergencyPageClient from '@/components/contact/EmergencyPageClient';
import { buildMetadata } from '@/lib/site';

export const metadata: Metadata = buildMetadata({
  title: 'Emergency Security Request',
  description:
    'Use the short emergency request form for same-day security deployment needs and urgent call-back triage.',
  path: '/emergency',
});

export default function EmergencyPage() {
  return <EmergencyPageClient />;
}
