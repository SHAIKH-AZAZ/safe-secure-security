import type { ComponentType } from 'react';

type IconProps = {
  size?: number;
  className?: string;
};

export function IconShield({ size = 20, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.35C16.5 22.15 20 17.25 20 12V6L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconStarShield({ size = 20, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.35C16.5 22.15 20 17.25 20 12V6L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M12 7l1.09 2.26L15.5 9.5l-1.75 1.69.41 2.31L12 12.25l-2.17 1.25.41-2.31L8.5 9.5l2.41-.24L12 7z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

export function IconRoute({ size = 20, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M3 17h3a2 2 0 0 0 2-2V9a2 2 0 0 1 2-2h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="18" cy="7" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="3" cy="17" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M15 7h3M15 10l3-3-3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconCrowd({ size = 20, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="9" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="15" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 20v-2a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconDoor({ size = 20, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="2" width="12" height="20" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="13" cy="12" r="1" fill="currentColor" />
      <path d="M15 2h4a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1h-4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function IconScan({ size = 20, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M4 7V5a2 2 0 0 1 2-2h2M4 17v2a2 2 0 0 0 2 2h2M20 7V5a2 2 0 0 0-2-2h-2M20 17v2a2 2 0 0 1-2 2h-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconBuilding({ size = 20, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 9h18M9 9v12M15 9v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="6" y="13" width="2" height="2" fill="currentColor" opacity=".6" />
      <rect x="12" y="13" width="2" height="2" fill="currentColor" opacity=".6" />
      <rect x="16" y="13" width="2" height="2" fill="currentColor" opacity=".6" />
    </svg>
  );
}

export function IconHomeShield({ size = 20, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M12 8.5L9 10v3c0 2.5 1.5 4.5 3 5 1.5-.5 3-2.5 3-5v-3l-3-1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

export function IconCamera({ size = 20, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="2" y="7" width="15" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M17 10l5-3v10l-5-3V10z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="9.5" cy="12" r="2" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function IconPhone({ size = 20, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.24 1.02l-2.21 2.2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconWhatsapp({ size = 20, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M20.52 3.48A11.93 11.93 0 0 0 12.01 0C5.38 0 .01 5.37.01 12c0 2.12.55 4.18 1.6 6L0 24l6.16-1.6A11.94 11.94 0 0 0 12 23.99C18.63 24 24 18.63 24 12c0-3.19-1.24-6.19-3.48-8.52z" fill="#25D366" opacity=".15" />
      <path d="M12 2.4c-5.3 0-9.6 4.3-9.6 9.6 0 1.9.55 3.7 1.56 5.2L2.4 21.6l4.5-1.52A9.55 9.55 0 0 0 12 21.6c5.3 0 9.6-4.3 9.6-9.6S17.3 2.4 12 2.4zm4.76 12.93c-.2.54-1.16 1.06-1.6 1.11-.44.06-.85.22-2.86-.6-2.44-.97-4-3.44-4.1-3.6-.12-.15-.96-1.28-.96-2.44 0-1.16.61-1.73.82-1.97.2-.23.45-.29.6-.29h.43c.14 0 .32-.05.5.38l.72 1.86c.06.14.1.3.02.46l-.32.46-.48.52c-.14.14-.3.3-.12.58.18.28.8 1.32 1.72 2.14 1.18 1.05 2.18 1.38 2.48 1.54.3.16.48.13.65-.08l.47-.57c.17-.22.33-.18.56-.1l1.8.85c.21.1.36.15.41.23.06.46-.14 1-.67 1.52z" fill="currentColor" />
    </svg>
  );
}

export function IconClock({ size = 20, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconCheck({ size = 20, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconChevronDown({ size = 16, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconChevronRight({ size = 16, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconArrowRight({ size = 16, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconMenu({ size = 22, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconClose({ size = 22, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconLocation({ size = 16, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" fill="currentColor" opacity=".7" />
    </svg>
  );
}

export function IconEmail({ size = 20, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 8l10 7 10-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconAlert({ size = 20, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M12 9v4M12 17h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconUsers({ size = 20, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 20v-2a6 6 0 0 1 12 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75M21 20v-2a4 4 0 0 0-3-3.85" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconProcess({ size = 20, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M9 3H5a2 2 0 0 0-2 2v4M9 3h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconGlobe({ size = 20, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 12h20M12 3c-2.5 3-4 5.7-4 9s1.5 6 4 9M12 3c2.5 3 4 5.7 4 9s-1.5 6-4 9" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function IconNightclub({ size = 20, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M9 18V6l12-3v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="18" cy="15" r="3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export const ICON_MAP: Record<string, ComponentType<IconProps>> = {
  shield: IconShield,
  'star-shield': IconStarShield,
  route: IconRoute,
  crowd: IconCrowd,
  door: IconDoor,
  scan: IconScan,
  building: IconBuilding,
  'home-shield': IconHomeShield,
  camera: IconCamera,
  nightclub: IconNightclub,
  ring: IconShield,
  office: IconBuilding,
  warehouse: IconHomeShield,
  gate: IconShield,
  'camera-media': IconCamera,
  store: IconBuilding,
  podium: IconCrowd,
};
