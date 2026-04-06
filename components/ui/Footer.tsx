import Image from 'next/image';
import Link from 'next/link';
import {
  IconArrowRight,
  IconClock,
  IconEmail,
  IconLocation,
  IconPhone,
} from '@/components/icons';
import { City } from '@/lib/types';
import { SITE } from '@/lib/site';
import styles from './Footer.module.css';

const SERVICE_LINKS = [
  { label: 'Executive Protection', href: '/executive-protection' },
  { label: 'Event & Venue Security', href: '/event-venue-security' },
  { label: 'Corporate & Property Guarding', href: '/corporate-property' },
  { label: 'Emergency Desk', href: '/emergency' },
  { label: 'Coverage Map', href: '/coverage' },
  { label: 'Request Quote', href: '/contact' },
];

const COMPANY_LINKS = [
  { label: `About ${SITE.shortName}`, href: '/about' },
  { label: 'Why Choose Us', href: '/about#why-us' },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'Coverage Areas', href: '/coverage' },
  { label: 'Careers', href: '/careers' },
  { label: 'FAQ', href: '/faq' },
];

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
];

export default function Footer({ cities }: { cities: City[] }) {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.goldLine} />

      <div className={`container ${styles.grid}`}>
        <div className={styles.brandCol}>
          <Link href="/" className={styles.logo} aria-label={`${SITE.name} home`}>
            <Image
              src="/logo_back.png"
              alt={`${SITE.name} logo`}
              width={837}
              height={365}
              className={styles.logoImage}
            />
          </Link>

          <p className={styles.tagline}>{SITE.tagline}</p>

          <div className={styles.addressBlock}>
            <h4 className={styles.addressTitle}>Head Office </h4>
            <p className={styles.addressText}>{SITE.mainBranch.address}</p>
            <div className={styles.contactItems}>
              {SITE.mainBranch.phones.map((phone) => (
                <a key={phone} href={`tel:${phone.replace(/\\s+/g, '')}`} className={styles.contactItem}>
                  <IconPhone size={14} />
                  {phone}
                </a>
              ))}
              <a href={`mailto:${SITE.email}`} className={styles.contactItem}>
                <IconEmail size={14} />
                {SITE.email}
              </a>
            </div>
          </div>

          <div className={styles.addressBlock} style={{ marginTop: '0.5rem' }}>
            <h4 className={styles.addressTitle}>Branch Office</h4>
            <p className={styles.addressText}>{SITE.branchOffice.address}</p>
            <div className={styles.contactItems}>
              {SITE.branchOffice.phones.map((phone) => (
                <a key={phone} href={`tel:${phone.replace(/\\s+/g, '')}`} className={styles.contactItem}>
                  <IconPhone size={14} />
                  {phone}
                </a>
              ))}
            </div>
          </div>

          <div className={styles.responseBadge} style={{ marginTop: '0.5rem' }}>
            <IconClock size={12} />
            {SITE.emergencyLabel}
          </div>
        </div>

        <div>
          <h3 className={styles.colTitle}>Services</h3>
          <ul className={styles.linkList}>
            {SERVICE_LINKS.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className={styles.footerLink}>
                  <IconArrowRight size={12} />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className={styles.colTitle}>Company</h3>
          <ul className={styles.linkList}>
            {COMPANY_LINKS.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className={styles.footerLink}>
                  <IconArrowRight size={12} />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className={styles.colTitle}>Coverage Footprint</h3>
          <ul className={styles.cityList}>
            {cities.map((city) => (
              <li key={city.name} className={styles.cityItem}>
                <span className={styles.cityDot} />
                <span>{city.name}</span>
                <span className={styles.responseTime}>{city.coverageLabel}</span>
              </li>
            ))}
          </ul>
          <Link href="/coverage" className={styles.coverageLink}>
            View coverage map
          </Link>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <div className={`container ${styles.bottomInner}`}>
          <span className={styles.copyright}>© {year} {SITE.name}. All rights reserved.</span>

          <div className={styles.legalLinks}>
            {LEGAL_LINKS.map((link) => (
              <Link key={link.label} href={link.href} className={styles.legalLink}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className={styles.locationNote}>
            <IconLocation size={12} />
            Gujarat-wide coverage planning and deployment support.
          </div>
        </div>
      </div>
    </footer>
  );
}
