import fs from 'fs';
import path from 'path';
import clientPromise from './mongodb';
import { normalizeSiteContent } from './site-content';
import type { SiteContent } from './site-content';

const SEED_PATH = path.join(process.cwd(), 'data', 'site-content.json');
const IS_READ_ONLY_DEPLOYMENT = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
export type {
  AchievementUpdateItem,
  CaseStudy,
  City,
  FaqItem,
  HeroContent,
  ImageShowcaseItem,
  Industry,
  NavLink,
  ProcessStep,
  ProofPillar,
  ServiceCluster,
  ServiceItem,
  SiteContent,
  SiteMetadata,
  Testimonial,
} from './site-content';

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
      return normalizeSiteContent(content);
    }
  } catch (error) {
    console.warn('MongoDB unavailable, falling back to JSON file:', (error as Error).message);
  }

  // Fallback: read from JSON file
  return normalizeSiteContent(readSeedContent());
}

/**
 * Update site content.
 * - Vercel/production: MongoDB is required (filesystem is read-only/ephemeral)
 * - Local/dev: falls back to JSON file when MongoDB is unavailable
 */
export async function updateSiteContent(data: SiteContent): Promise<void> {
  const normalized = normalizeSiteContent(data);

  // Prefer MongoDB in all environments
  try {
    if (clientPromise) {
      const client = await clientPromise;
      const db = client.db();
      const collection = db.collection('siteContent');
      await collection.replaceOne(
        { _id: 'main' as any },
        { _id: 'main' as any, ...normalized },
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
  writeSeedContent(normalized);
}
