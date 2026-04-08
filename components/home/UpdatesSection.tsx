import SectionReveal from '@/components/ui/SectionReveal';
import styles from './UpdatesSection.module.css';
import type { AchievementUpdateItem } from '@/lib/admin-api';

function formatUpdateDate(item: AchievementUpdateItem) {
  if (item.dateValue) {
    const [year, month, day] = item.dateValue.split('-').map(Number);
    if (year && month && day) {
      return new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(new Date(year, month - 1, day));
    }
  }

  return item.dateLabel;
}

function hasVisibleContent(item: AchievementUpdateItem) {
  return Boolean(
    item.imageUrl.trim() &&
    item.title.trim()
  );
}

export default function UpdatesSection({ items }: { items: AchievementUpdateItem[] }) {
  const visibleItems = items.filter(hasVisibleContent);

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <section id="updates" className={`section ${styles.section}`} aria-labelledby="updates-heading">
      <div className="container">
        <SectionReveal className={styles.header}>
          <span className="section-label">Achievements & Updates</span>
          <h2 id="updates-heading" className="section-title">
            What We Have
            <br />
            Been Building
          </h2>
          <p className="section-body">
            A visual stream of recent achievements, operational improvements, and field-ready updates
            published directly from the admin panel.
          </p>
        </SectionReveal>

        <div className={styles.grid} role="list">
          {visibleItems.map((item, index) => {
            const renderedDate = formatUpdateDate(item);

            return (
              <SectionReveal
                key={item.id}
                delay={index * 80}
                className={styles.card}
                as="article"
                role="listitem"
              >
                <div className={styles.media}>
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className={styles.image}
                    loading="lazy"
                  />
                </div>

                <div className={styles.copy}>
                  <div className={styles.metaRow}>
                    {item.tag ? <span className="badge badge-gold">{item.tag}</span> : <span />}
                    {renderedDate ? <span className={styles.date}>{renderedDate}</span> : null}
                  </div>

                  <h3 className={styles.title}>{item.title}</h3>
                  {item.description ? (
                    <p className={styles.description}>{item.description}</p>
                  ) : null}
                </div>
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
