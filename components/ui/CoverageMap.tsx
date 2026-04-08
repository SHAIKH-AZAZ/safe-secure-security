import { City } from '@/lib/types';
import styles from './CoverageMap.module.css';

const CONNECTIONS = [
  ['Jamnagar', 'Rajkot'],
  ['Rajkot', 'Ahmedabad'],
  ['Ahmedabad', 'Gandhinagar'],
  ['Ahmedabad', 'Vadodara'],
  ['Vadodara', 'Surat'],
  ['Rajkot', 'Junagadh'],
  ['Ahmedabad', 'Bhavnagar'],
] as const;

function cityByName(name: string, cities: City[]) {
  return cities.find((city) => city.name === name);
}

export default function CoverageMap({ cities }: { cities: City[] }) {
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Coverage Map</h2>
          <p className={styles.copy}>
            Gujarat-wide operating footprint for planning, dispatch, and client communication.
            Share the exact assignment location and we will scope deployment accordingly.
          </p>
        </div>

        <div className={styles.legend}>
          <span className={styles.legendDot} aria-hidden="true" />
          Gujarat coverage nodes
        </div>
      </div>

      <svg viewBox="0 0 780 430" className={styles.svg} role="img" aria-label="Coverage map with connected Gujarat service nodes">
        <rect x="0" y="0" width="780" height="430" rx="16" fill="rgba(13, 14, 16, 0.45)" />

        {CONNECTIONS.map(([fromName, toName]) => {
          const from = cityByName(fromName, cities);
          const to = cityByName(toName, cities);

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

        {cities.map((city) => (
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
