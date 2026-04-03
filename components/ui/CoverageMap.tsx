import { CITIES } from '@/lib/constants';
import styles from './CoverageMap.module.css';

const CONNECTIONS = [
  ['Ahmedabad', 'Mumbai'],
  ['Mumbai', 'Pune'],
  ['Mumbai', 'Delhi NCR'],
  ['Delhi NCR', 'Hyderabad'],
  ['Hyderabad', 'Bengaluru'],
  ['Bengaluru', 'Chennai'],
] as const;

function cityByName(name: string) {
  return CITIES.find((city) => city.name === name);
}

export default function CoverageMap() {
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Coverage Map</h2>
          <p className={styles.copy}>
            Placeholder launch footprint shown for layout and messaging purposes only.
            Confirm cities, dispatch model, and operating jurisdiction before launch.
          </p>
        </div>

        <div className={styles.legend}>
          <span className={styles.legendDot} aria-hidden="true" />
          Planned coverage nodes
        </div>
      </div>

      <svg viewBox="0 0 780 430" className={styles.svg} role="img" aria-label="Coverage map with connected metro nodes">
        <rect x="0" y="0" width="780" height="430" rx="16" fill="rgba(13, 14, 16, 0.45)" />

        {CONNECTIONS.map(([fromName, toName]) => {
          const from = cityByName(fromName);
          const to = cityByName(toName);

          if (!from || !to) {
            return null;
          }

          return (
            <line
              key={`${from.name}-${to.name}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              className={styles.connection}
            />
          );
        })}

        {CITIES.map((city) => (
          <g key={city.name} transform={`translate(${city.x}, ${city.y})`}>
            <circle r="14" className={styles.nodeRing} />
            <circle r="4" className={styles.nodeCore} />
            <text x="18" y="-2" className={styles.label}>
              {city.name}
            </text>
            <text x="18" y="13" className={styles.subLabel}>
              {city.coverageLabel}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
