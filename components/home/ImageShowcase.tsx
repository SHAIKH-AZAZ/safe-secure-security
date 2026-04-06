import SectionReveal from '@/components/ui/SectionReveal';
import styles from './ImageShowcase.module.css';
import type { ImageShowcaseItem } from '@/lib/admin-api';

export default function ImageShowcase({ items }: { items: ImageShowcaseItem[] }) {
  const visibleItems = items.filter((item) => {
    return Boolean(
      item.imageUrl.trim() &&
      (item.quote.trim() || item.name.trim() || item.role.trim())
    );
  });

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <section id="image-showcase" className={`section ${styles.section}`} aria-labelledby="image-showcase-heading">
      <div className="container">
        <SectionReveal className={styles.header}>
          <span className="section-label">Field Team</span>
          <h2 id="image-showcase-heading" className="section-title">
            Personnel in Action
          </h2>
          <p className="section-body">
            A visual showcase of team presence with short client-facing impressions from real deployment contexts.
          </p>
        </SectionReveal>

        <div className={styles.grid} role="list">
          {visibleItems.map((item, index) => (
            <SectionReveal key={item.id} delay={index * 70} className={styles.card} as="article" role="listitem">
              <div className={styles.media}>
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={`${item.name} - ${item.role}`}
                    className={styles.image}
                    loading="lazy"
                  />
                ) : (
                  <div className={styles.imagePlaceholder}>Upload personnel image from admin</div>
                )}
              </div>

              <div className={styles.copy}>
                <p className={styles.quote}>"{item.quote}"</p>
                <p className={styles.identity}>{item.name}</p>
                <p className={styles.role}>{item.role}</p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
