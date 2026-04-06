import Link from 'next/link';
import { IconClock, IconLocation, IconPhone, IconWhatsapp } from '@/components/icons';
import { SITE } from '@/lib/site';
import styles from './UtilityBar.module.css';

const utilityCities = 'Coverage across Gujarat';

export default function UtilityBar() {
  return (
    <div className={styles.bar} role="banner">
      <div className={`container ${styles.inner}`}>
        <div className={styles.left}>
          <span className={styles.item}>
            <IconClock size={13} />
            {SITE.emergencyLabel}
          </span>
          <span className={styles.divider} />
          <span className={styles.item}>
            <IconLocation size={13} />
            {utilityCities}
          </span>
          <span className={styles.emergencyBadge}>Emergency planning desk available</span>
        </div>

        <div className={styles.right}>
          <Link href={SITE.phoneHref} className={styles.callLink}>
            <IconPhone size={13} />
            {SITE.phoneDisplay}
          </Link>
          <Link
            href={SITE.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.whatsappLink}
          >
            <IconWhatsapp size={14} />
            WhatsApp
          </Link>
        </div>
      </div>
    </div>
  );
}
