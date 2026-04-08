import { ICON_MAP } from '@/components/icons';
import SectionReveal from '@/components/ui/SectionReveal';
import styles from './IndustriesSection.module.css';
import type { Industry } from '@/lib/admin-api';

export default function IndustriesSection({ industries }: { industries: Industry[] }) {
  return (
    <section id="industries" className={`section ${styles.section}`} aria-labelledby="industries-heading">
      <div className="container">
        <SectionReveal className={styles.header}>
          <span className="section-label">Industries We Serve</span>
          <h2 id="industries-heading" className="section-title">
            Security Experience<br />Across Every Sector
          </h2>
          <p className="section-body">
            We understand that security requirements vary by environment. Our teams are
            experienced operating across commercial, residential, hospitality, and public spaces.
          </p>
        </SectionReveal>

        <div className={styles.grid} role="list">
          {industries.map((industry, i) => {
            const IconComp = ICON_MAP[industry.icon] || ICON_MAP['shield'];
            return (
              <SectionReveal
                key={industry.id}
                delay={i * 60}
                className={styles.card}
                role="listitem"
              >
                <span className={styles.iconWrap} aria-hidden="true">
                  <IconComp size={22} />
                </span>
                <h3 className={styles.name}>{industry.name}</h3>
                <p className={styles.desc}>{industry.description}</p>
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
