'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { IconClose, IconMenu, IconPhone, IconShield } from '@/components/icons';
import { NAV_LINKS } from '@/lib/constants';
import { SITE } from '@/lib/site';
import styles from './Header.module.css';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <nav className={`container ${styles.nav}`} aria-label="Main navigation">
        <Link href="/" className={styles.logo} aria-label={`${SITE.name} home`}>
          <IconShield size={26} className={styles.logoIcon} />
          <span className={styles.logoText}>SENTINEL</span>
          <span className={styles.logoSub}>SECURITY</span>
        </Link>

        <ul className={styles.navLinks} role="list">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <Link href={link.href} className={styles.navLink}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className={styles.ctas}>
          <Link href={SITE.phoneHref} className={styles.callNow}>
            <IconPhone size={14} />
            Call Now
          </Link>
          <Link href="/contact" className={`btn btn-primary ${styles.ctaBtn}`}>
            Request Security Plan
          </Link>
        </div>

        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <IconClose size={22} /> : <IconMenu size={22} />}
        </button>
      </nav>

      {menuOpen && (
        <div className={styles.mobileMenu} aria-modal="true" role="dialog">
          <ul className={styles.mobileLinks} role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className={styles.mobileCtas}>
            <Link href="/contact" className="btn btn-primary" onClick={() => setMenuOpen(false)}>
              Request Security Plan
            </Link>
            <Link href="/emergency" className="btn btn-outline" onClick={() => setMenuOpen(false)}>
              Emergency Request
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
