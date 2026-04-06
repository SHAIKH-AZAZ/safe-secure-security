import { IconCheck } from '@/components/icons';
import SectionReveal from '@/components/ui/SectionReveal';
import styles from './WhySentinel.module.css';
import type { ProofPillar } from '@/lib/admin-api';

export default function WhySentinel({ pillars }: { pillars: ProofPillar[] }) {
  return (
    <section id="why-us" className={`section ${styles.section}`} aria-labelledby="why-heading">
      <div className="container">
        <SectionReveal className={styles.header}>
          <span className="section-label">Why Sentinel</span>
          <h2 id="why-heading" className="section-title">
            Four Pillars of<br />Professional Security
          </h2>
          <p className="section-body">
            These are the commitments that separate a professional security deployment
            from a basic guarding arrangement.
          </p>
        </SectionReveal>

        <div className={styles.grid} role="list">
          {pillars.map((pillar, i) => (
            <SectionReveal
              key={pillar.id}
              delay={i * 100}
              className={styles.pillar}
              as="article"
              role="listitem"
            >
              <div className={styles.pillarNumber} aria-hidden="true">
                0{i + 1}
              </div>
              <div className={styles.pillarTop}>
                <h3 className={styles.pillarTitle}>{pillar.title}</h3>
                <span className={styles.pillarLabel}>{pillar.label}</span>
              </div>
              <ul className={styles.pointList} aria-label={`${pillar.title} commitments`}>
                {pillar.points.map((point) => (
                  <li key={point} className={styles.point}>
                    <span className={styles.checkIcon} aria-hidden="true">
                      <IconCheck size={11} />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
