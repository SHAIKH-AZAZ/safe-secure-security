import { IconCheck } from '@/components/icons';
import SectionReveal from '@/components/ui/SectionReveal';
import styles from './TrustStrip.module.css';

export default function TrustStrip({ items }: { items: string[] }) {
  return (
    <SectionReveal className={styles.stripWrapper}>
      <div className={`container ${styles.strip}`} role="list" aria-label="Trust credentials">
        {items.map((item, i) => (
          <div key={i} className={styles.item} role="listitem">
            <span className={styles.iconWrap} aria-hidden="true">
              <IconCheck size={13} />
            </span>
            <span className={styles.label}>{item}</span>
          </div>
        ))}
      </div>
    </SectionReveal>
  );
}
