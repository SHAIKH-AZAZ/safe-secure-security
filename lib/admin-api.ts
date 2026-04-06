import fs from 'fs';
import path from 'path';
import clientPromise from './mongodb';

const SEED_PATH = path.join(process.cwd(), 'data', 'site-content.json');
const IS_READ_ONLY_DEPLOYMENT = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';

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

function readSeedContent(): SiteContent {
  const raw = fs.readFileSync(SEED_PATH, 'utf-8');
  return JSON.parse(raw) as SiteContent;
}

function writeSeedContent(data: SiteContent): void {
  const tmp = `${SEED_PATH}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tmp, SEED_PATH);
}

/**
 * Read site content from MongoDB with fallback to JSON file
 * Seeds from JSON file on first access if document doesn't exist
 */
export async function getSiteContent(): Promise<SiteContent> {
  // Try MongoDB first
  try {
    if (clientPromise) {
      const client = await clientPromise;
      const db = client.db();
      const collection = db.collection('siteContent');
      let doc = await collection.findOne({ _id: 'main' as any });

      if (!doc) {
        // Seed from JSON file on first access
        const content = readSeedContent();
        await collection.insertOne({ _id: 'main' as any, ...content });
        return content;
      }

      const { _id, ...content } = doc;
      return content as unknown as SiteContent;
    }
  } catch (error) {
    console.warn('MongoDB unavailable, falling back to JSON file:', (error as Error).message);
  }

  // Fallback: read from JSON file
  return readSeedContent();
}

/**
 * Update site content.
 * - Vercel/production: MongoDB is required (filesystem is read-only/ephemeral)
 * - Local/dev: falls back to JSON file when MongoDB is unavailable
 */
export async function updateSiteContent(data: SiteContent): Promise<void> {
  // Prefer MongoDB in all environments
  try {
    if (clientPromise) {
      const client = await clientPromise;
      const db = client.db();
      const collection = db.collection('siteContent');
      await collection.replaceOne(
        { _id: 'main' as any },
        { _id: 'main' as any, ...data },
        { upsert: true }
      );
      return;
    }
  } catch (error) {
    console.warn('MongoDB unavailable while saving content:', (error as Error).message);
  }

  // On Vercel/production, local filesystem writes are not reliable for content persistence.
  if (IS_READ_ONLY_DEPLOYMENT) {
    throw new Error('Database not configured for persistent content updates.');
  }

  // Local/dev fallback
  writeSeedContent(data);
}
