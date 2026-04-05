import 'server-only';

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { CmsEntry, CmsEntryInput } from '@/lib/types';

const CMS_STORAGE_PATH = path.join(process.cwd(), 'data', 'cms-content.json');

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

async function ensureStorageFile() {
  await mkdir(path.dirname(CMS_STORAGE_PATH), { recursive: true });

  try {
    await readFile(CMS_STORAGE_PATH, 'utf8');
  } catch {
    await writeFile(CMS_STORAGE_PATH, '[]\n', 'utf8');
  }
}

export async function getCmsEntries(): Promise<CmsEntry[]> {
  await ensureStorageFile();

  const raw = await readFile(CMS_STORAGE_PATH, 'utf8');
  const parsed = JSON.parse(raw) as CmsEntry[];

  return parsed.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

function validateCmsEntry(input: CmsEntryInput) {
  const title = input.title.trim();
  const category = input.category.trim();
  const summary = input.summary.trim();
  const body = input.body.trim();
  const slug = slugify(input.slug?.trim() || title);
  const status: CmsEntry['status'] = input.status === 'published' ? 'published' : 'draft';

  if (!title) {
    throw new Error('Title is required.');
  }

  if (!category) {
    throw new Error('Category is required.');
  }

  if (!summary) {
    throw new Error('Summary is required.');
  }

  if (!body) {
    throw new Error('Body is required.');
  }

  if (!slug) {
    throw new Error('A valid slug could not be generated.');
  }

  return {
    title,
    category,
    summary,
    body,
    slug,
    status,
  };
}

export async function createCmsEntry(input: CmsEntryInput): Promise<CmsEntry> {
  const validated = validateCmsEntry(input);
  const entries = await getCmsEntries();

  if (entries.some((entry) => entry.slug === validated.slug)) {
    throw new Error('An entry with this slug already exists.');
  }

  const entry: CmsEntry = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...validated,
  };

  const nextEntries = [entry, ...entries];

  await writeFile(CMS_STORAGE_PATH, JSON.stringify(nextEntries, null, 2) + '\n', 'utf8');

  return entry;
}
