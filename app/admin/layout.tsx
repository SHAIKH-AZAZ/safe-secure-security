import type { Metadata } from 'next';
import { Barlow_Condensed, Inter } from 'next/font/google';
import '../globals.css';
import styles from './admin.module.css';
import { AdminSidebar } from './components/AdminSidebar';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Admin Dashboard | Safe & Security Service',
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${barlowCondensed.variable}`}>
      <body className={styles.adminLayout}>
        <AdminSidebar />
        <main className={styles.mainContent}>{children}</main>
      </body>
    </html>
  );
}
