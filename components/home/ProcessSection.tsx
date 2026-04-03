import { PROCESS_STEPS } from '@/lib/constants';
import SectionReveal from '@/components/ui/SectionReveal';
import styles from './ProcessSection.module.css';

export default function ProcessSection() {
  return (
    <section id="process" className={`section ${styles.section}`} aria-labelledby="process-heading">
      <div className="container">
        <SectionReveal className={styles.header}>
          <span className="section-label">How It Works</span>
          <h2 id="process-heading" className="section-title">
            Our Deployment Process
          </h2>
          <p className="section-body">
            Every engagement follows a structured five-step process —
            so you always know what happens next.
          </p>
        </SectionReveal>

        <div className={styles.steps} role="list" aria-label="Process steps">
          {PROCESS_STEPS.map((step, i) => (
            <SectionReveal
              key={step.number}
              delay={i * 80}
              className={styles.step}
              role="listitem"
            >
              {/* Connector line */}
              {i < PROCESS_STEPS.length - 1 && (
                <div className={styles.connector} aria-hidden="true" />
              )}

              <div className={styles.numberBadge} aria-label={`Step ${step.number}`}>
                {step.number}
              </div>

              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.description}</p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
