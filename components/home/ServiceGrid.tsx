import Link from 'next/link';
import { ICON_MAP, IconArrowRight } from '@/components/icons';
import SectionReveal from '@/components/ui/SectionReveal';
import styles from './ServiceGrid.module.css';
import type { ServiceCluster } from '@/lib/admin-api';

export default function ServiceGrid({ clusters }: { clusters: ServiceCluster[] }) {
  return (
    <section id="services" className={`section ${styles.section}`} aria-labelledby="services-heading">
      <div className="container">
        <SectionReveal className={styles.header}>
          <span className="section-label">What We Deliver</span>
          <h2 id="services-heading" className="section-title">
            Security Services Built<br />For Every Requirement
          </h2>
          <p className="section-body">
            From individual protection to large-scale corporate deployments —
            a structured capability across three specialist domains.
          </p>
        </SectionReveal>

        {clusters.map((cluster, ci) => (
          <SectionReveal key={cluster.id} delay={ci * 80} className={styles.cluster}>
            <div className={styles.clusterHeader}>
              <h3 className={styles.clusterName}>{cluster.name}</h3>
              <div className={styles.clusterLine} />
            </div>

            <div className={styles.grid} role="list">
              {cluster.services.map((svc, si) => {
                const IconComp = ICON_MAP[svc.icon] || ICON_MAP['shield'];
                return (
                  <SectionReveal
                    key={svc.id}
                    delay={ci * 80 + si * 80}
                    className={`card ${styles.card}`}
                    as="article"
                    role="listitem"
                  >
                    <div className={styles.cardTop}>
                      <span className={styles.iconBox} aria-hidden="true">
                        <IconComp size={20} />
                      </span>
                      <h4 className={styles.cardTitle}>{svc.name}</h4>
                    </div>

                    <p className={styles.cardDesc}>{svc.description}</p>

                    <div className={styles.tags} aria-label="Capability tags">
                      {svc.tags.map((tag) => (
                        <span key={tag} className="badge badge-subtle">{tag}</span>
                      ))}
                    </div>

                    <Link href={svc.href} className={styles.viewLink} aria-label={`View details for ${svc.name}`}>
                      View details
                      <IconArrowRight size={13} />
                    </Link>
                  </SectionReveal>
                );
              })}
            </div>
          </SectionReveal>
        ))}
      </div>
    </section>
  );
}
