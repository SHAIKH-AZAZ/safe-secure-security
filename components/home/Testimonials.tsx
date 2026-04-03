import { TESTIMONIALS } from '@/lib/constants';
import SectionReveal from '@/components/ui/SectionReveal';
import styles from './Testimonials.module.css';

export default function Testimonials() {
  return (
    <section id="testimonials" className={`section ${styles.section}`} aria-labelledby="testimonials-heading">
      <div className="container">
        <SectionReveal className={styles.header}>
          <span className="section-label">Client Testimonials</span>
          <h2 id="testimonials-heading" className="section-title">
            Trusted by Professionals<br />Who Cannot Afford Mistakes
          </h2>
          <p className="section-body">
            Illustrative placeholder references for staging only. Replace with verified client approval before launch.
          </p>
        </SectionReveal>

        <div className={styles.grid} role="list">
          {TESTIMONIALS.map((t, i) => (
            <SectionReveal
              key={t.id}
              delay={i * 100}
              className={styles.card}
              as="blockquote"
              role="listitem"
            >
              {/* Quote mark */}
              <span className={styles.quoteMark} aria-hidden="true">&ldquo;</span>

              <p className={styles.quote}>{t.quote}</p>

              <footer className={styles.footer}>
                <div className={styles.clientInfo}>
                  <cite className={styles.clientType}>{t.clientType}</cite>
                  <span className={styles.location}>{t.location}</span>
                </div>
                <div className={styles.outcome} aria-label="Measurable outcome">
                  {t.outcome}
                </div>
              </footer>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
