import { CASE_STUDIES } from '@/lib/constants';
import SectionReveal from '@/components/ui/SectionReveal';
import styles from './CaseStudies.module.css';

export default function CaseStudies() {
  return (
    <section id="case-studies" className={`section ${styles.section}`} aria-labelledby="cs-heading">
      <div className="container">
        <SectionReveal className={styles.header}>
          <span className="section-label">Deployment Outcomes</span>
          <h2 id="cs-heading" className="section-title">
            Results, Not Slogans
          </h2>
          <p className="section-body">
            Security buyers trust outcomes. These are illustrative placeholder scenarios
            for launch staging and should be replaced with verified references.
          </p>
        </SectionReveal>

        <div className={styles.grid} role="list">
          {CASE_STUDIES.map((cs, i) => (
            <SectionReveal
              key={cs.id}
              delay={i * 100}
              className={styles.card}
              as="article"
              role="listitem"
              aria-labelledby={`cs-title-${cs.id}`}
            >
              <div className={styles.cardTop}>
                <span className="badge badge-gold">{cs.tag}</span>
                <span className={styles.clientType} id={`cs-title-${cs.id}`}>
                  {cs.clientType}
                </span>
              </div>

              <div className={styles.rows}>
                <div className={styles.row}>
                  <span className={styles.rowLabel}>Requirement</span>
                  <p className={styles.rowText}>{cs.problem}</p>
                </div>
                <div className={styles.row}>
                  <span className={styles.rowLabel}>Our Deployment</span>
                  <p className={styles.rowText}>{cs.solution}</p>
                </div>
                <div className={`${styles.row} ${styles.resultRow}`}>
                  <span className={styles.rowLabel}>Outcome</span>
                  <p className={styles.rowText}>{cs.result}</p>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
