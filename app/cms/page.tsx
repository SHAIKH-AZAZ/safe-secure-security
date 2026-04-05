import type { Metadata } from 'next';
import CmsContentManager from '@/components/cms/CmsContentManager';
import { getCmsEntries } from '@/lib/cms';
import { buildMetadata } from '@/lib/site';

export const metadata: Metadata = buildMetadata({
  title: 'CMS',
  description: 'Internal content route for adding and reviewing website copy entries.',
  path: '/cms',
});

export default async function CmsPage() {
  const entries = await getCmsEntries();

  return <CmsContentManager initialEntries={entries} />;
}
