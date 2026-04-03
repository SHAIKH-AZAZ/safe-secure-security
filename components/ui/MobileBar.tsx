import Link from 'next/link';
import { IconPhone, IconShield, IconWhatsapp } from '@/components/icons';
import { SITE } from '@/lib/site';
import styles from './MobileBar.module.css';

export default function MobileBar() {
  return (
    <div className={styles.bar} role="navigation" aria-label="Mobile quick actions">
      <Link href={SITE.phoneHref} className={styles.action} aria-label={`Call ${SITE.name}`}>
        <IconPhone size={18} />
        <span>Call</span>
      </Link>

      <Link
        href={SITE.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.action} ${styles.whatsapp}`}
        aria-label="Open WhatsApp intake"
      >
        <IconWhatsapp size={18} />
        <span>WhatsApp</span>
      </Link>

      <Link href="/contact" className={`${styles.action} ${styles.quote}`} aria-label="Request a quote">
        <IconShield size={18} />
        <span>Get Quote</span>
      </Link>
    </div>
  );
}
