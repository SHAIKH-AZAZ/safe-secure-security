import siteContentSeed from '@/data/site-content.json';

// Service Item within a Service Cluster
export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  tags: string[];
  href: string;
  icon: string;
}

// Service Cluster containing related services
export interface ServiceCluster {
  id: string;
  name: string;
  services: ServiceItem[];
}

// Industry sector
export interface Industry {
  id: string;
  name: string;
  icon: string;
  description: string;
}

// Client testimonial
export interface Testimonial {
  id: string;
  quote: string;
  clientType: string;
  outcome: string;
  location: string;
}

// Case study / portfolio item
export interface CaseStudy {
  id: string;
  clientType: string;
  problem: string;
  solution: string;
  result: string;
  tag: string;
}

// FAQ item
export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

// Proof pillar (Why Us section)
export interface ProofPillar {
  id: string;
  title: string;
  label: string;
  points: string[];
}

// Process step
export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

// City for coverage map
export interface City {
  name: string;
  region: string;
  coverageLabel: string;
  x: number;
  y: number;
}

// Navigation link
export interface NavLink {
  label: string;
  href: string;
}

// Hero section content
export interface HeroContent {
  headline: string;
  subheadline: string;
  ctaPrimary: string;
  ctaSecondary: string;
  backgroundImage: string;
}

// Home page image showcase item
export interface ImageShowcaseItem {
  id: string;
  imageUrl: string;
  quote: string;
  name: string;
  role: string;
}

// Achievement / update item for homepage news-style cards
export interface AchievementUpdateItem {
  id: string;
  imageUrl: string;
  tag: string;
  dateValue?: string;
  dateLabel: string;
  title: string;
  description: string;
}

// Site metadata
export interface SiteMetadata {
  name: string;
  description: string;
  phoneDisplay: string;
  email: string;
}

// Complete site content structure
export interface SiteContent {
  hero: HeroContent;
  imageShowcase: ImageShowcaseItem[];
  achievementUpdates: AchievementUpdateItem[];
  serviceClusters: ServiceCluster[];
  industries: Industry[];
  testimonials: Testimonial[];
  caseStudies: CaseStudy[];
  faqItems: FaqItem[];
  proofPillars: ProofPillar[];
  processSteps: ProcessStep[];
  cities: City[];
  navLinks: NavLink[];
  trustStripItems: string[];
  site: SiteMetadata;
}

const SITE_CONTENT_DEFAULTS = siteContentSeed as SiteContent;

function cloneSiteContentDefaults(): SiteContent {
  return structuredClone(SITE_CONTENT_DEFAULTS);
}

function normalizeArray<T>(value: unknown, fallback: T[]): T[] {
  return Array.isArray(value) ? (value as T[]) : fallback;
}

export function normalizeSiteContent(value: unknown): SiteContent {
  const defaults = cloneSiteContentDefaults();
  const content =
    value && typeof value === 'object' && !Array.isArray(value)
      ? (value as Partial<SiteContent>)
      : {};

  return {
    hero: {
      ...defaults.hero,
      ...(content.hero ?? {}),
    },
    imageShowcase: normalizeArray(content.imageShowcase, defaults.imageShowcase),
    achievementUpdates: normalizeArray(content.achievementUpdates, defaults.achievementUpdates),
    serviceClusters: normalizeArray(content.serviceClusters, defaults.serviceClusters),
    industries: normalizeArray(content.industries, defaults.industries),
    testimonials: normalizeArray(content.testimonials, defaults.testimonials),
    caseStudies: normalizeArray(content.caseStudies, defaults.caseStudies),
    faqItems: normalizeArray(content.faqItems, defaults.faqItems),
    proofPillars: normalizeArray(content.proofPillars, defaults.proofPillars),
    processSteps: normalizeArray(content.processSteps, defaults.processSteps),
    cities: normalizeArray(content.cities, defaults.cities),
    navLinks: normalizeArray(content.navLinks, defaults.navLinks),
    trustStripItems: normalizeArray(content.trustStripItems, defaults.trustStripItems),
    site: {
      ...defaults.site,
      ...(content.site ?? {}),
    },
  };
}
