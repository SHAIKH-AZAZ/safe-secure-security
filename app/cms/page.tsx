import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import CmsContentManager from '@/components/cms/CmsContentManager';
import { COOKIE_NAME, verifySessionCookie } from '@/lib/admin-auth';
import { getCmsEntries } from '@/lib/cms';
import { buildMetadata } from '@/lib/site';

export const metadata: Metadata = buildMetadata({
  title: 'CMS',
  description: 'Internal content route for adding and reviewing website copy entries.',
  path: '/cms',
});

export default async function CmsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token || !(await verifySessionCookie(token))) {
    redirect('/admin/login');
  }

  const entries = await getCmsEntries();

  return <CmsContentManager initialEntries={entries} />;
}
