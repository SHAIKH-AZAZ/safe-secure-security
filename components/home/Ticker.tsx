import styles from './Ticker.module.css';

const TICKER_ITEMS = [
  'Executive Close Protection',
  'VIP & Celebrity Security',
  'Event & Venue Security',
  'Crowd Management',
  'Residential Estate Guards',
  'Corporate Site Security',
  'Mobile Patrol Units',
  'CCTV Monitoring & Control',
  'Travel Escort Services',
  'Emergency Deployment',
  'Plain-Clothes Operatives',
  'NDA Protected Engagements',
] as const;

export default function Ticker() {
  // Duplicate for seamless loop
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className={styles.wrapper} aria-hidden="true">
      <div className={styles.track}>
        {items.map((item, i) => (
          <div key={i} className={styles.item}>
            <span className={styles.dot} />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
