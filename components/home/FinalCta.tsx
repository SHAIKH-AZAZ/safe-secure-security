import Link from 'next/link';
import { IconPhone, IconArrowRight, IconAlert } from '@/components/icons';
import { SITE } from '@/lib/site';
import SectionReveal from '@/components/ui/SectionReveal';
import styles from './FinalCta.module.css';

export default function FinalCta() {
  return (
    <section className={styles.section} aria-labelledby="cta-heading">
      {/* Gold top accent */}
      <div className={styles.goldAccent} aria-hidden="true" />

      <div className="container">
        <SectionReveal className={styles.inner}>
          {/* Emergency route */}
          <div className={styles.route}>
            <div className={styles.routeIcon} aria-hidden="true">
              <IconAlert size={28} />
            </div>
            <div className={styles.routeContent}>
              <span className={styles.routeTag}>Emergency Requirement</span>
              <h3 id="cta-heading" className={styles.routeTitle}>Need Security Now?</h3>
              <p className={styles.routeDesc}>
                For urgent, same-day, or active-situation requirements — speak directly
                with our operations team.
              </p>
              <div className={styles.ctaGroup}>
                <Link href={SITE.phoneHref} className={`btn btn-primary ${styles.ctaBtn}`}>
                  <IconPhone size={16} />
                  Call Operations Line
                </Link>
                <Link href="/emergency" className={`btn btn-outline ${styles.ctaBtn}`}>
                  Emergency Request Form
                </Link>
              </div>
            </div>
          </div>

          <div className={styles.divider} aria-hidden="true">
            <span className={styles.dividerText}>OR</span>
          </div>

          {/* Planned route */}
          <div className={styles.route}>
            <div className={`${styles.routeIcon} ${styles.routeIconPlan}`} aria-hidden="true">
              <IconArrowRight size={28} />
            </div>
            <div className={styles.routeContent}>
              <span className={styles.routeTag}>Planned Requirement</span>
              <h3 className={styles.routeTitle}>Request a Security Plan</h3>
              <p className={styles.routeDesc}>
                For events, corporate contracts, personal protection, or ongoing
                site security — start with a consultation.
              </p>
              <div className={styles.ctaGroup}>
                <Link href="/contact" className={`btn btn-primary ${styles.ctaBtn}`}>
                  Request Quote
                  <IconArrowRight size={16} />
                </Link>
                <Link href="/faq" className={`btn btn-ghost ${styles.ctaBtn}`}>
                  Read FAQ First
                </Link>
              </div>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
