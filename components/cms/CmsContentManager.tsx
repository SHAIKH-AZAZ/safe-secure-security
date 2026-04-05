'use client';

import { useRef, useState, useTransition } from 'react';
import styles from '@/components/cms/CmsContentManager.module.css';
import type { CmsEntry } from '@/lib/types';

type SaveState =
  | { kind: 'idle'; message: string }
  | { kind: 'success'; message: string }
  | { kind: 'error'; message: string };

const initialState: SaveState = { kind: 'idle', message: '' };

export default function CmsContentManager({ initialEntries }: { initialEntries: CmsEntry[] }) {
  const [entries, setEntries] = useState(initialEntries);
  const [saveState, setSaveState] = useState<SaveState>(initialState);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      setSaveState(initialState);

      const payload = {
        title: String(formData.get('title') || ''),
        slug: String(formData.get('slug') || ''),
        category: String(formData.get('category') || ''),
        summary: String(formData.get('summary') || ''),
        body: String(formData.get('body') || ''),
        status: String(formData.get('status') || 'draft'),
      };

      const response = await fetch('/api/cms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as
        | { entry: CmsEntry }
        | { error: string };

      if (!response.ok || 'error' in result) {
        setSaveState({
          kind: 'error',
          message: 'error' in result ? result.error : 'Unable to save content.',
        });
        return;
      }

      setEntries((current) => [result.entry, ...current]);
      setSaveState({ kind: 'success', message: 'Content saved to the local CMS store.' });
      formRef.current?.reset();
    });
  }

  const statusClassName =
    saveState.kind === 'error'
      ? `${styles.status} ${styles.statusError}`
      : saveState.kind === 'success'
        ? `${styles.status} ${styles.statusSuccess}`
        : styles.status;

  return (
    <section className={styles.section}>
      <div className={`container ${styles.shell}`}>
        <div className={styles.hero}>
          <span className={styles.eyebrow}>CMS Route</span>
          <h1 className={styles.title}>Add and manage site content from one place.</h1>
          <p className={styles.lede}>
            This starter stores entries in a local JSON file so you can begin managing copy
            without editing route files by hand. It is a good internal workflow for development
            and can be upgraded later to a database-backed CMS.
          </p>
        </div>

        <div className={styles.grid}>
          <div className={styles.panel}>
            <h2 className={styles.panelTitle}>Create content</h2>
            <p className={styles.panelText}>
              Add a title, category, summary, and the full body. If you leave the slug empty, it
              will be generated from the title.
            </p>

            <form
              ref={formRef}
              className={styles.form}
              action={handleSubmit}
            >
              <div className={styles.field}>
                <label className={styles.label} htmlFor="title">
                  Title
                </label>
                <input id="title" name="title" className={styles.input} required />
              </div>

              <div className={styles.fieldGrid}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="category">
                    Category
                  </label>
                  <input id="category" name="category" className={styles.input} required />
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="status">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    className={styles.select}
                    defaultValue="draft"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="slug">
                  Slug
                </label>
                <input id="slug" name="slug" className={styles.input} placeholder="auto-from-title" />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="summary">
                  Summary
                </label>
                <textarea id="summary" name="summary" className={styles.textarea} required />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="body">
                  Body
                </label>
                <textarea id="body" name="body" className={styles.textarea} required />
              </div>

              <div className={styles.actions}>
                <button type="submit" className="btn btn-primary" disabled={isPending}>
                  {isPending ? 'Saving...' : 'Save Content'}
                </button>
                <p className={statusClassName} aria-live="polite">
                  {saveState.message || 'Entries are saved to data/cms-content.json.'}
                </p>
              </div>
            </form>
          </div>

          <div className={styles.panel}>
            <h2 className={styles.panelTitle}>Saved entries</h2>
            <p className={styles.panelText}>
              Recent content is listed here immediately after it is added.
            </p>

            <div className={styles.stack}>
              {entries.length === 0 ? (
                <p className={styles.empty}>No content has been added yet.</p>
              ) : (
                entries.map((entry) => (
                  <article key={entry.id} className={styles.entryCard}>
                    <div className={styles.entryMeta}>
                      <span className={entry.status === 'published' ? 'badge badge-green' : 'badge badge-subtle'}>
                        {entry.status}
                      </span>
                      <span className="badge badge-gold">{entry.category}</span>
                    </div>
                    <div>
                      <h3 className={styles.entryTitle}>{entry.title}</h3>
                      <p className={styles.entrySlug}>/{entry.slug}</p>
                    </div>
                    <p className={styles.entrySummary}>{entry.summary}</p>
                    <p className={styles.entryBody}>{entry.body}</p>
                  </article>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
