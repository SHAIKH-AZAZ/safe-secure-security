'use client';

import { useState, useEffect } from 'react';
import styles from './admin.module.css';
import { normalizeSiteContent } from '@/lib/site-content';
import type {
  SiteContent,
  ServiceCluster,
  ServiceItem,
  FaqItem,
  Testimonial,
  ImageShowcaseItem,
  AchievementUpdateItem,
  Industry,
  CaseStudy,
  ProofPillar,
  ProcessStep,
} from '@/lib/admin-api';

type TabId = 'general' | 'hero' | 'images' | 'updates' | 'services' | 'faq' | 'testimonials' | 'other';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error';
}

const MAX_SOURCE_IMAGE_BYTES = 20 * 1024 * 1024; // 20MB accepted in browser before compression
const MAX_FUNCTION_UPLOAD_BYTES = 4 * 1024 * 1024; // Vercel function-safe target
const MAX_CLIENT_IMAGE_DIMENSION = 2400;
const CLIENT_COMPRESSIBLE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

function createEmptyShowcaseItem() {
  return {
    id: `showcase-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    imageUrl: '',
    quote: '',
    name: '',
    role: '',
  } as ImageShowcaseItem;
}

function createEmptyAchievementUpdate() {
  return {
    id: `update-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    imageUrl: '',
    tag: '',
    dateValue: '',
    dateLabel: '',
    title: '',
    description: '',
  } as AchievementUpdateItem;
}

function parseDateValue(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return '';

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  const slashMatch = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (slashMatch) {
    const [, day, month, year] = slashMatch;
    return `${year}-${month}-${day}`;
  }

  return '';
}

function formatDateLabel(dateValue: string): string {
  const parsed = parseDateValue(dateValue);
  if (!parsed) return '';

  const [year, month, day] = parsed.split('-').map(Number);
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(year, month - 1, day));
}

function normalizeContentResponse(value: unknown): SiteContent {
  const content = normalizeSiteContent(value);
  const achievementUpdates = content.achievementUpdates.map((item) => ({
        ...item,
        dateValue: item.dateValue || parseDateValue(item.dateLabel || ''),
      }));
  return {
    ...content,
    achievementUpdates,
  };
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Failed to process image.'));
        return;
      }
      resolve(blob);
    }, type, quality);
  });
}

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Invalid image file.'));
    };
    image.src = objectUrl;
  });
}

async function prepareImageForUpload(file: File): Promise<File> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files are supported.');
  }

  if (file.size > MAX_SOURCE_IMAGE_BYTES) {
    throw new Error('Selected file is too large. Maximum source size is 20MB.');
  }

  // GIF is kept as-is to preserve animation frames.
  if (!CLIENT_COMPRESSIBLE_TYPES.has(file.type)) {
    if (file.size > MAX_FUNCTION_UPLOAD_BYTES) {
      throw new Error('This file cannot be compressed enough for server upload. Please choose a file under 4MB.');
    }
    return file;
  }

  const image = await loadImageFromFile(file);
  const initialScale = Math.min(
    1,
    MAX_CLIENT_IMAGE_DIMENSION / Math.max(image.naturalWidth, image.naturalHeight)
  );
  const baseWidth = Math.max(1, Math.round(image.naturalWidth * initialScale));
  const baseHeight = Math.max(1, Math.round(image.naturalHeight * initialScale));
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Unable to initialize image processing.');
  }

  let quality = 0.86;
  let scale = 1;
  let bestBlob: Blob | null = null;

  for (let attempt = 0; attempt < 8; attempt += 1) {
    canvas.width = Math.max(1, Math.round(baseWidth * scale));
    canvas.height = Math.max(1, Math.round(baseHeight * scale));
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    const blob = await canvasToBlob(canvas, 'image/webp', quality);
    bestBlob = blob;

    if (blob.size <= MAX_FUNCTION_UPLOAD_BYTES) {
      break;
    }

    if (quality > 0.58) {
      quality -= 0.08;
    } else {
      scale *= 0.85;
    }
  }

  if (!bestBlob || bestBlob.size > MAX_FUNCTION_UPLOAD_BYTES) {
    throw new Error('Could not compress this image below 4MB. Please choose a smaller image.');
  }

  const baseName = file.name.replace(/\.[^/.]+$/, '').trim().replace(/\s+/g, '-').toLowerCase() || 'image';
  return new File([bestBlob], `${baseName}.webp`, { type: 'image/webp' });
}

export default function AdminContentEditorPage() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Fetch content on mount
  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/content');
      if (!res.ok) throw new Error('Failed to fetch content');
      const data = await res.json();
      setContent(normalizeContentResponse(data));
    } catch (err) {
      showToast('Failed to load content', 'error');
    } finally {
      setLoading(false);
    }
  };

  const saveContent = async () => {
    if (!content) return;
    try {
      setSaving(true);
      const normalizedForSave: SiteContent = {
        ...content,
        // Do not persist empty image cards created accidentally during editing.
        imageShowcase: content.imageShowcase.filter((item) => {
          return Boolean(
            item.imageUrl.trim() ||
            item.quote.trim() ||
            item.name.trim() ||
            item.role.trim()
          );
        }),
        achievementUpdates: content.achievementUpdates.filter((item) => {
          return Boolean(
            item.imageUrl.trim() ||
            item.tag.trim() ||
            (item.dateValue || '').trim() ||
            item.dateLabel.trim() ||
            item.title.trim() ||
            item.description.trim()
          );
        }),
      };
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(normalizedForSave),
      });
      if (!res.ok) throw new Error('Failed to save content');
      showToast('Changes saved successfully', 'success');
    } catch (err) {
      showToast('Failed to save changes', 'error');
    } finally {
      setSaving(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const updateSite = (updates: Partial<SiteContent['site']>) => {
    if (!content) return;
    setContent({ ...content, site: { ...content.site, ...updates } });
  };

  const updateHero = (updates: Partial<SiteContent['hero']>) => {
    if (!content) return;
    setContent({ ...content, hero: { ...content.hero, ...updates } });
  };

  const updateImageShowcaseItem = (index: number, updates: Partial<ImageShowcaseItem>) => {
    if (!content) return;
    const items = [...content.imageShowcase];
    items[index] = { ...items[index], ...updates };
    setContent({ ...content, imageShowcase: items });
  };

  const addImageShowcaseItem = (initial?: Partial<ImageShowcaseItem>) => {
    if (!content) return;
    const newItem = { ...createEmptyShowcaseItem(), ...initial };
    setContent({ ...content, imageShowcase: [...content.imageShowcase, newItem] });
    return newItem.id;
  };

  const removeImageShowcaseItem = (index: number) => {
    if (!content) return;
    const items = content.imageShowcase.filter((_, i) => i !== index);
    setContent({ ...content, imageShowcase: items });
  };

  const reorderImageShowcaseItems = (fromIndex: number, toIndex: number) => {
    if (!content) return;
    if (fromIndex < 0 || toIndex < 0) return;
    if (fromIndex >= content.imageShowcase.length || toIndex >= content.imageShowcase.length) return;
    if (fromIndex === toIndex) return;

    const items = [...content.imageShowcase];
    const [moved] = items.splice(fromIndex, 1);
    items.splice(toIndex, 0, moved);
    setContent({ ...content, imageShowcase: items });
  };

  const updateAchievementUpdate = (index: number, updates: Partial<AchievementUpdateItem>) => {
    if (!content) return;
    const items = [...content.achievementUpdates];
    items[index] = { ...items[index], ...updates };
    setContent({ ...content, achievementUpdates: items });
  };

  const addAchievementUpdate = (initial?: Partial<AchievementUpdateItem>) => {
    if (!content) return;
    const newItem = { ...createEmptyAchievementUpdate(), ...initial };
    setContent({ ...content, achievementUpdates: [...content.achievementUpdates, newItem] });
    return newItem.id;
  };

  const removeAchievementUpdate = (index: number) => {
    if (!content) return;
    const items = content.achievementUpdates.filter((_, i) => i !== index);
    setContent({ ...content, achievementUpdates: items });
  };

  const reorderAchievementUpdates = (fromIndex: number, toIndex: number) => {
    if (!content) return;
    if (fromIndex < 0 || toIndex < 0) return;
    if (fromIndex >= content.achievementUpdates.length || toIndex >= content.achievementUpdates.length) return;
    if (fromIndex === toIndex) return;

    const items = [...content.achievementUpdates];
    const [moved] = items.splice(fromIndex, 1);
    items.splice(toIndex, 0, moved);
    setContent({ ...content, achievementUpdates: items });
  };

  const updateServiceCluster = (index: number, updates: Partial<ServiceCluster>) => {
    if (!content) return;
    const clusters = [...content.serviceClusters];
    clusters[index] = { ...clusters[index], ...updates };
    setContent({ ...content, serviceClusters: clusters });
  };

  const updateService = (clusterIndex: number, serviceIndex: number, updates: Partial<ServiceItem>) => {
    if (!content) return;
    const clusters = [...content.serviceClusters];
    const services = [...clusters[clusterIndex].services];
    services[serviceIndex] = { ...services[serviceIndex], ...updates };
    clusters[clusterIndex] = { ...clusters[clusterIndex], services };
    setContent({ ...content, serviceClusters: clusters });
  };

  const updateFaq = (index: number, updates: Partial<FaqItem>) => {
    if (!content) return;
    const faqItems = [...content.faqItems];
    faqItems[index] = { ...faqItems[index], ...updates };
    setContent({ ...content, faqItems });
  };

  const addFaq = () => {
    if (!content) return;
    const newFaq: FaqItem = {
      id: `faq-${Date.now()}`,
      question: '',
      answer: '',
    };
    setContent({ ...content, faqItems: [...content.faqItems, newFaq] });
  };

  const removeFaq = (index: number) => {
    if (!content) return;
    const faqItems = content.faqItems.filter((_, i) => i !== index);
    setContent({ ...content, faqItems });
  };

  const updateTestimonial = (index: number, updates: Partial<Testimonial>) => {
    if (!content) return;
    const testimonials = [...content.testimonials];
    testimonials[index] = { ...testimonials[index], ...updates };
    setContent({ ...content, testimonials });
  };

  const addTestimonial = () => {
    if (!content) return;
    const newTestimonial: Testimonial = {
      id: `testimonial-${Date.now()}`,
      quote: '',
      clientType: '',
      outcome: '',
      location: '',
    };
    setContent({ ...content, testimonials: [...content.testimonials, newTestimonial] });
  };

  const removeTestimonial = (index: number) => {
    if (!content) return;
    const testimonials = content.testimonials.filter((_, i) => i !== index);
    setContent({ ...content, testimonials });
  };

  const updateIndustry = (index: number, updates: Partial<Industry>) => {
    if (!content) return;
    const industries = [...content.industries];
    industries[index] = { ...industries[index], ...updates };
    setContent({ ...content, industries });
  };

  const updateCaseStudy = (index: number, updates: Partial<CaseStudy>) => {
    if (!content) return;
    const caseStudies = [...content.caseStudies];
    caseStudies[index] = { ...caseStudies[index], ...updates };
    setContent({ ...content, caseStudies });
  };

  const updateProofPillar = (index: number, updates: Partial<ProofPillar>) => {
    if (!content) return;
    const proofPillars = [...content.proofPillars];
    proofPillars[index] = { ...proofPillars[index], ...updates };
    setContent({ ...content, proofPillars });
  };

  const updateProofPillarPoint = (pillarIndex: number, pointIndex: number, value: string) => {
    if (!content) return;
    const proofPillars = [...content.proofPillars];
    const points = [...proofPillars[pillarIndex].points];
    points[pointIndex] = value;
    proofPillars[pillarIndex] = { ...proofPillars[pillarIndex], points };
    setContent({ ...content, proofPillars });
  };

  const updateProcessStep = (index: number, updates: Partial<ProcessStep>) => {
    if (!content) return;
    const processSteps = [...content.processSteps];
    processSteps[index] = { ...processSteps[index], ...updates };
    setContent({ ...content, processSteps });
  };

  const uploadImageFile = async (file: File): Promise<string> => {
    const optimizedFile = await prepareImageForUpload(file);
    const formData = new FormData();
    formData.append('file', optimizedFile);

    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const result = (await res.json()) as { error?: string };
      throw new Error(result.error || 'Upload failed');
    }

    const data = (await res.json()) as { url: string };
    return data.url;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadImageFile(file);
      updateHero({ backgroundImage: url });
      showToast('Image uploaded successfully', 'success');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to upload image';
      showToast(message, 'error');
    }
  };

  const uploadShowcaseImage = async (file: File): Promise<string | null> => {
    try {
      const url = await uploadImageFile(file);
      showToast('Showcase image uploaded successfully', 'success');
      return url;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to upload showcase image';
      showToast(message, 'error');
      return null;
    }
  };

  const tabs: { id: TabId; label: string }[] = [
    { id: 'general', label: 'General' },
    { id: 'hero', label: 'Hero' },
    { id: 'images', label: 'Images' },
    { id: 'updates', label: 'Updates' },
    { id: 'services', label: 'Services' },
    { id: 'faq', label: 'FAQ' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'other', label: 'Other' },
  ];

  if (loading) {
    return (
      <div>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Content Editor</h1>
        </div>
        <div className={styles.card}>
          <p style={{ color: '#d1c8ba' }}>Loading content...</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Content Editor</h1>
        </div>
        <div className={styles.card}>
          <p style={{ color: '#f87171' }}>Failed to load content. Please refresh the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Content Editor</h1>
        <p className={styles.pageSubtitle}>Manage your website content</p>
      </div>

      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.card}>
        {activeTab === 'general' && (
          <GeneralTab content={content.site} updateSite={updateSite} />
        )}
        {activeTab === 'hero' && (
          <HeroTab
            hero={content.hero}
            updateHero={updateHero}
            onImageUpload={handleImageUpload}
          />
        )}
        {activeTab === 'images' && (
          <ImageShowcaseTab
            items={content.imageShowcase}
            updateItem={updateImageShowcaseItem}
            addItem={addImageShowcaseItem}
            removeItem={removeImageShowcaseItem}
            reorderItems={reorderImageShowcaseItems}
            uploadShowcaseImage={uploadShowcaseImage}
          />
        )}
        {activeTab === 'updates' && (
          <UpdatesTab
            items={content.achievementUpdates}
            updateItem={updateAchievementUpdate}
            addItem={addAchievementUpdate}
            removeItem={removeAchievementUpdate}
            reorderItems={reorderAchievementUpdates}
            uploadUpdateImage={uploadShowcaseImage}
          />
        )}
        {activeTab === 'services' && (
          <ServicesTab
            clusters={content.serviceClusters}
            updateCluster={updateServiceCluster}
            updateService={updateService}
          />
        )}
        {activeTab === 'faq' && (
          <FaqTab
            faqItems={content.faqItems}
            updateFaq={updateFaq}
            addFaq={addFaq}
            removeFaq={removeFaq}
          />
        )}
        {activeTab === 'testimonials' && (
          <TestimonialsTab
            testimonials={content.testimonials}
            updateTestimonial={updateTestimonial}
            addTestimonial={addTestimonial}
            removeTestimonial={removeTestimonial}
          />
        )}
        {activeTab === 'other' && (
          <OtherTab
            industries={content.industries}
            caseStudies={content.caseStudies}
            proofPillars={content.proofPillars}
            processSteps={content.processSteps}
            updateIndustry={updateIndustry}
            updateCaseStudy={updateCaseStudy}
            updateProofPillar={updateProofPillar}
            updateProofPillarPoint={updateProofPillarPoint}
            updateProcessStep={updateProcessStep}
          />
        )}

        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #2a2d33' }}>
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={saveContent}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${styles.toast} ${toast.type === 'success' ? styles.toastSuccess : styles.toastError}`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}

// Tab Components

function GeneralTab({
  content,
  updateSite,
}: {
  content: SiteContent['site'];
  updateSite: (updates: Partial<SiteContent['site']>) => void;
}) {
  return (
    <div>
      <h3 style={{ color: '#f0ebe0', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Site Information</h3>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Site Name</label>
        <input
          type="text"
          className={styles.formInput}
          value={content.name}
          onChange={(e) => updateSite({ name: e.target.value })}
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Description</label>
        <textarea
          className={`${styles.formInput} ${styles.formTextarea}`}
          value={content.description}
          onChange={(e) => updateSite({ description: e.target.value })}
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Phone</label>
        <input
          type="text"
          className={styles.formInput}
          value={content.phoneDisplay}
          onChange={(e) => updateSite({ phoneDisplay: e.target.value })}
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Email</label>
        <input
          type="email"
          className={styles.formInput}
          value={content.email}
          onChange={(e) => updateSite({ email: e.target.value })}
        />
      </div>
    </div>
  );
}

function HeroTab({
  hero,
  updateHero,
  onImageUpload,
}: {
  hero: SiteContent['hero'];
  updateHero: (updates: Partial<SiteContent['hero']>) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <h3 style={{ color: '#f0ebe0', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Hero Section</h3>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Headline</label>
        <input
          type="text"
          className={styles.formInput}
          value={hero.headline}
          onChange={(e) => updateHero({ headline: e.target.value })}
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Subheadline</label>
        <textarea
          className={`${styles.formInput} ${styles.formTextarea}`}
          value={hero.subheadline}
          onChange={(e) => updateHero({ subheadline: e.target.value })}
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>CTA Primary Text</label>
        <input
          type="text"
          className={styles.formInput}
          value={hero.ctaPrimary}
          onChange={(e) => updateHero({ ctaPrimary: e.target.value })}
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>CTA Secondary Text</label>
        <input
          type="text"
          className={styles.formInput}
          value={hero.ctaSecondary}
          onChange={(e) => updateHero({ ctaSecondary: e.target.value })}
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Background Image</label>
        <input
          type="text"
          className={styles.formInput}
          value={hero.backgroundImage}
          onChange={(e) => updateHero({ backgroundImage: e.target.value })}
          placeholder="/uploads/filename.jpg"
        />
        <input
          type="file"
          accept="image/*"
          onChange={onImageUpload}
          style={{ marginTop: '0.75rem', color: '#d1c8ba' }}
        />
        {hero.backgroundImage && (
          <div style={{ marginTop: '0.75rem' }}>
            <img
              src={hero.backgroundImage}
              alt="Hero background preview"
              style={{ maxWidth: '200px', maxHeight: '120px', borderRadius: '4px' }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function ImageShowcaseTab({
  items,
  updateItem,
  addItem,
  removeItem,
  reorderItems,
  uploadShowcaseImage,
}: {
  items: ImageShowcaseItem[];
  updateItem: (index: number, updates: Partial<ImageShowcaseItem>) => void;
  addItem: (initial?: Partial<ImageShowcaseItem>) => string | undefined;
  removeItem: (index: number) => void;
  reorderItems: (fromIndex: number, toIndex: number) => void;
  uploadShowcaseImage: (file: File) => Promise<string | null>;
}) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(items[0]?.id ?? null);
  const [uploadingExisting, setUploadingExisting] = useState(false);
  const [uploadingNew, setUploadingNew] = useState(false);
  const [newItemForm, setNewItemForm] = useState({
    imageUrl: '',
    quote: '',
    name: '',
    role: '',
  });

  const onDragStart = (index: number) => {
    setDragIndex(index);
  };

  const onDragEnter = (index: number) => {
    if (dragIndex === null || dragIndex === index) return;
    if (dragOverIndex === index) return;
    setDragOverIndex(index);
  };

  const onDrop = (index: number) => {
    if (dragIndex === null) return;
    reorderItems(dragIndex, index);
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const onDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  useEffect(() => {
    if (items.length === 0) {
      setSelectedId(null);
      return;
    }

    if (!selectedId || !items.some((item) => item.id === selectedId)) {
      setSelectedId(items[0].id);
    }
  }, [items, selectedId]);

  const selectedIndex = selectedId ? items.findIndex((item) => item.id === selectedId) : -1;
  const selectedItem = selectedIndex >= 0 ? items[selectedIndex] : null;

  const updateNewField = (field: 'imageUrl' | 'quote' | 'name' | 'role', value: string) => {
    setNewItemForm((current) => ({ ...current, [field]: value }));
  };

  const createNewCard = () => {
    const payload = {
      imageUrl: newItemForm.imageUrl.trim(),
      quote: newItemForm.quote.trim(),
      name: newItemForm.name.trim(),
      role: newItemForm.role.trim(),
    };

    if (!payload.imageUrl && !payload.quote && !payload.name && !payload.role) {
      return;
    }

    const createdId = addItem(payload);
    if (createdId) {
      setSelectedId(createdId);
    }

    setNewItemForm({
      imageUrl: '',
      quote: '',
      name: '',
      role: '',
    });
  };

  const uploadForExistingCard = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || selectedIndex < 0) return;

    setUploadingExisting(true);
    const url = await uploadShowcaseImage(file);
    if (url) {
      updateItem(selectedIndex, { imageUrl: url });
    }
    setUploadingExisting(false);
  };

  const uploadForNewCard = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingNew(true);
    const url = await uploadShowcaseImage(file);
    if (url) {
      updateNewField('imageUrl', url);
    }
    setUploadingNew(false);
  };

  const removeSelectedCard = () => {
    if (selectedIndex < 0) return;
    removeItem(selectedIndex);
  };

  const moveSelectedUp = () => {
    if (selectedIndex <= 0) return;
    reorderItems(selectedIndex, selectedIndex - 1);
  };

  const moveSelectedDown = () => {
    if (selectedIndex < 0 || selectedIndex >= items.length - 1) return;
    reorderItems(selectedIndex, selectedIndex + 1);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ color: '#f0ebe0', fontSize: '1.1rem' }}>Personnel Image Showcase</h3>
        <span className={styles.badgeSubtleCount}>{items.length} cards</span>
      </div>
      <p className={styles.reorderHint}>Existing uploaded images are shown as cards below. Drag cards to reorder.</p>

      <div className={styles.showcaseCardGrid}>
        {items.map((item, index) => (
          <article
            key={item.id}
            className={`${styles.showcaseItemCard} ${styles.sortableCard} ${
              dragIndex === index ? styles.sortableCardDragging : ''
            } ${dragOverIndex === index ? styles.sortableCardOver : ''} ${
              selectedId === item.id ? styles.showcaseItemCardSelected : ''
            }`}
            draggable
            onDragStart={() => onDragStart(index)}
            onDragEnter={() => onDragEnter(index)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => onDrop(index)}
            onDragEnd={onDragEnd}
          >
            <div className={styles.showcaseItemTop}>
              <span className={styles.dragHandle} title="Drag to reorder" aria-hidden="true">::</span>
              <span className={styles.showcaseOrder}>#{index + 1}</span>
            </div>
            <div className={styles.showcaseThumb}>
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={`${item.name || `Card ${index + 1}`} preview`}
                  className={styles.showcaseThumbImage}
                />
              ) : (
                <div className={styles.showcaseThumbPlaceholder}>No image</div>
              )}
            </div>
            <div className={styles.showcaseItemBody}>
              <p className={styles.showcaseName}>{item.name || 'Untitled'}</p>
              <p className={styles.showcaseRole}>{item.role || 'Role not set'}</p>
              <p className={styles.showcaseQuote}>{item.quote || 'No quote added yet.'}</p>
            </div>
            <div className={styles.showcaseActions}>
              <button
                className={`${styles.btn} ${styles.btnOutline} ${styles.btnSmall}`}
                onClick={() => setSelectedId(item.id)}
              >
                Edit
              </button>
              <button
                className={`${styles.btn} ${styles.btnDanger} ${styles.btnSmall}`}
                onClick={() => removeItem(index)}
              >
                Remove
              </button>
            </div>
          </article>
        ))}
      </div>

      {selectedItem ? (
        <div className={styles.showcaseEditorPanel}>
          <div className={styles.showcaseEditorHeader}>
            <h4 className={styles.showcaseEditorTitle}>Edit Selected Card</h4>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                className={`${styles.btn} ${styles.btnOutline} ${styles.btnSmall}`}
                onClick={moveSelectedUp}
                disabled={selectedIndex <= 0}
              >
                Move Up
              </button>
              <button
                className={`${styles.btn} ${styles.btnOutline} ${styles.btnSmall}`}
                onClick={moveSelectedDown}
                disabled={selectedIndex < 0 || selectedIndex >= items.length - 1}
              >
                Move Down
              </button>
              <button
                className={`${styles.btn} ${styles.btnDanger} ${styles.btnSmall}`}
                onClick={removeSelectedCard}
              >
                Remove
              </button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Image URL</label>
            <input
              type="text"
              className={styles.formInput}
              value={selectedItem.imageUrl}
              onChange={(e) => updateItem(selectedIndex, { imageUrl: e.target.value })}
              placeholder="/uploads/filename.jpg"
            />
            <input
              type="file"
              accept="image/*"
              onChange={uploadForExistingCard}
              style={{ marginTop: '0.75rem', color: '#d1c8ba' }}
              disabled={uploadingExisting}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Quote</label>
            <textarea
              className={`${styles.formInput} ${styles.formTextarea}`}
              value={selectedItem.quote}
              onChange={(e) => updateItem(selectedIndex, { quote: e.target.value })}
              placeholder="Short quote for this personnel card"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Name</label>
              <input
                type="text"
                className={styles.formInput}
                value={selectedItem.name}
                onChange={(e) => updateItem(selectedIndex, { name: e.target.value })}
                placeholder="Display name"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Role</label>
              <input
                type="text"
                className={styles.formInput}
                value={selectedItem.role}
                onChange={(e) => updateItem(selectedIndex, { role: e.target.value })}
                placeholder="Role or deployment type"
              />
            </div>
          </div>
        </div>
      ) : null}

      <div className={styles.showcaseNewForm}>
        <h4 className={styles.showcaseEditorTitle}>Upload New Image Card</h4>
        <p className={styles.reorderHint} style={{ marginBottom: '1rem' }}>
          This is a separate form for creating a new showcase card.
        </p>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>New Image URL</label>
          <input
            type="text"
            className={styles.formInput}
            value={newItemForm.imageUrl}
            onChange={(e) => updateNewField('imageUrl', e.target.value)}
            placeholder="/uploads/filename.jpg"
          />
          <input
            type="file"
            accept="image/*"
            onChange={uploadForNewCard}
            style={{ marginTop: '0.75rem', color: '#d1c8ba' }}
            disabled={uploadingNew}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Quote</label>
          <textarea
            className={`${styles.formInput} ${styles.formTextarea}`}
            value={newItemForm.quote}
            onChange={(e) => updateNewField('quote', e.target.value)}
            placeholder="Short quote for this personnel card"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Name</label>
            <input
              type="text"
              className={styles.formInput}
              value={newItemForm.name}
              onChange={(e) => updateNewField('name', e.target.value)}
              placeholder="Display name"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Role</label>
            <input
              type="text"
              className={styles.formInput}
              value={newItemForm.role}
              onChange={(e) => updateNewField('role', e.target.value)}
              placeholder="Role or deployment type"
            />
          </div>
        </div>

        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={createNewCard}>
          Create Showcase Card
        </button>
      </div>
    </div>
  );
}

function UpdatesTab({
  items,
  updateItem,
  addItem,
  removeItem,
  reorderItems,
  uploadUpdateImage,
}: {
  items: AchievementUpdateItem[];
  updateItem: (index: number, updates: Partial<AchievementUpdateItem>) => void;
  addItem: (initial?: Partial<AchievementUpdateItem>) => string | undefined;
  removeItem: (index: number) => void;
  reorderItems: (fromIndex: number, toIndex: number) => void;
  uploadUpdateImage: (file: File) => Promise<string | null>;
}) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(items[0]?.id ?? null);
  const [uploadingExisting, setUploadingExisting] = useState(false);
  const [uploadingNew, setUploadingNew] = useState(false);
  const [newItemForm, setNewItemForm] = useState({
    imageUrl: '',
    tag: '',
    dateValue: '',
    dateLabel: '',
    title: '',
    description: '',
  });

  const onDragStart = (index: number) => {
    setDragIndex(index);
  };

  const onDragEnter = (index: number) => {
    if (dragIndex === null || dragIndex === index) return;
    if (dragOverIndex === index) return;
    setDragOverIndex(index);
  };

  const onDrop = (index: number) => {
    if (dragIndex === null) return;
    reorderItems(dragIndex, index);
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const onDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  useEffect(() => {
    if (items.length === 0) {
      setSelectedId(null);
      return;
    }

    if (!selectedId || !items.some((item) => item.id === selectedId)) {
      setSelectedId(items[0].id);
    }
  }, [items, selectedId]);

  const selectedIndex = selectedId ? items.findIndex((item) => item.id === selectedId) : -1;
  const selectedItem = selectedIndex >= 0 ? items[selectedIndex] : null;

  const updateNewField = (
    field: 'imageUrl' | 'tag' | 'dateValue' | 'dateLabel' | 'title' | 'description',
    value: string
  ) => {
    setNewItemForm((current) => ({ ...current, [field]: value }));
  };

  const createNewCard = () => {
    const payload = {
      imageUrl: newItemForm.imageUrl.trim(),
      tag: newItemForm.tag.trim(),
      dateValue: newItemForm.dateValue.trim(),
      dateLabel: newItemForm.dateLabel.trim(),
      title: newItemForm.title.trim(),
      description: newItemForm.description.trim(),
    };

    if (!payload.imageUrl && !payload.tag && !payload.dateLabel && !payload.title && !payload.description) {
      return;
    }

    const createdId = addItem(payload);
    if (createdId) {
      setSelectedId(createdId);
    }

    setNewItemForm({
        imageUrl: '',
        tag: '',
        dateValue: '',
        dateLabel: '',
        title: '',
        description: '',
    });
  };

  const uploadForExistingCard = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || selectedIndex < 0) return;

    setUploadingExisting(true);
    const url = await uploadUpdateImage(file);
    if (url) {
      updateItem(selectedIndex, { imageUrl: url });
    }
    setUploadingExisting(false);
  };

  const uploadForNewCard = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingNew(true);
    const url = await uploadUpdateImage(file);
    if (url) {
      updateNewField('imageUrl', url);
    }
    setUploadingNew(false);
  };

  const removeSelectedCard = () => {
    if (selectedIndex < 0) return;
    removeItem(selectedIndex);
  };

  const moveSelectedUp = () => {
    if (selectedIndex <= 0) return;
    reorderItems(selectedIndex, selectedIndex - 1);
  };

  const moveSelectedDown = () => {
    if (selectedIndex < 0 || selectedIndex >= items.length - 1) return;
    reorderItems(selectedIndex, selectedIndex + 1);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ color: '#f0ebe0', fontSize: '1.1rem' }}>Achievements & Updates</h3>
        <span className={styles.badgeSubtleCount}>{items.length} cards</span>
      </div>
      <p className={styles.reorderHint}>
        Add homepage updates here. Each card can include a photo, label, date, title, and short description.
      </p>

      <div className={styles.showcaseCardGrid}>
        {items.map((item, index) => (
          <article
            key={item.id}
            className={`${styles.showcaseItemCard} ${styles.sortableCard} ${
              dragIndex === index ? styles.sortableCardDragging : ''
            } ${dragOverIndex === index ? styles.sortableCardOver : ''} ${
              selectedId === item.id ? styles.showcaseItemCardSelected : ''
            }`}
            draggable
            onDragStart={() => onDragStart(index)}
            onDragEnter={() => onDragEnter(index)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => onDrop(index)}
            onDragEnd={onDragEnd}
          >
            <div className={styles.showcaseItemTop}>
              <span className={styles.dragHandle} title="Drag to reorder" aria-hidden="true">::</span>
              <span className={styles.showcaseOrder}>#{index + 1}</span>
            </div>
            <div className={styles.showcaseThumb}>
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={`${item.title || `Update ${index + 1}`} preview`}
                  className={styles.showcaseThumbImage}
                />
              ) : (
                <div className={styles.showcaseThumbPlaceholder}>No image</div>
              )}
            </div>
            <div className={styles.showcaseItemBody}>
              <p className={styles.showcaseRole}>{item.tag || 'Update label not set'}</p>
              <p className={styles.showcaseName}>{item.title || 'Untitled update'}</p>
              <p className={styles.showcaseQuote}>{item.description || 'No description added yet.'}</p>
            </div>
            <div className={styles.showcaseActions}>
              <button
                className={`${styles.btn} ${styles.btnOutline} ${styles.btnSmall}`}
                onClick={() => setSelectedId(item.id)}
              >
                Edit
              </button>
              <button
                className={`${styles.btn} ${styles.btnDanger} ${styles.btnSmall}`}
                onClick={() => removeItem(index)}
              >
                Remove
              </button>
            </div>
          </article>
        ))}
      </div>

      {selectedItem ? (
        <div className={styles.showcaseEditorPanel}>
          <div className={styles.showcaseEditorHeader}>
            <h4 className={styles.showcaseEditorTitle}>Edit Selected Update</h4>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                className={`${styles.btn} ${styles.btnOutline} ${styles.btnSmall}`}
                onClick={moveSelectedUp}
                disabled={selectedIndex <= 0}
              >
                Move Up
              </button>
              <button
                className={`${styles.btn} ${styles.btnOutline} ${styles.btnSmall}`}
                onClick={moveSelectedDown}
                disabled={selectedIndex < 0 || selectedIndex >= items.length - 1}
              >
                Move Down
              </button>
              <button
                className={`${styles.btn} ${styles.btnDanger} ${styles.btnSmall}`}
                onClick={removeSelectedCard}
              >
                Remove
              </button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Image URL</label>
            <input
              type="text"
              className={styles.formInput}
              value={selectedItem.imageUrl}
              onChange={(e) => updateItem(selectedIndex, { imageUrl: e.target.value })}
              placeholder="/uploads/filename.jpg"
            />
            <input
              type="file"
              accept="image/*"
              onChange={uploadForExistingCard}
              style={{ marginTop: '0.75rem', color: '#d1c8ba' }}
              disabled={uploadingExisting}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Tag</label>
              <input
                type="text"
                className={styles.formInput}
                value={selectedItem.tag}
                onChange={(e) => updateItem(selectedIndex, { tag: e.target.value })}
                placeholder="Field Achievement"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Date</label>
              <input
                type="date"
                className={styles.formInput}
                value={selectedItem.dateValue || ''}
                onChange={(e) =>
                  updateItem(selectedIndex, {
                    dateValue: e.target.value,
                    dateLabel: formatDateLabel(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Title</label>
            <input
              type="text"
              className={styles.formInput}
              value={selectedItem.title}
              onChange={(e) => updateItem(selectedIndex, { title: e.target.value })}
              placeholder="Update title"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Description</label>
            <textarea
              className={`${styles.formInput} ${styles.formTextarea}`}
              value={selectedItem.description}
              onChange={(e) => updateItem(selectedIndex, { description: e.target.value })}
              placeholder="Short update description"
            />
          </div>
        </div>
      ) : null}

      <div className={styles.showcaseNewForm}>
        <h4 className={styles.showcaseEditorTitle}>Create New Update</h4>
        <p className={styles.reorderHint} style={{ marginBottom: '1rem' }}>
          Upload a photo first or paste an uploaded image URL, then add the card copy.
        </p>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>New Image URL</label>
          <input
            type="text"
            className={styles.formInput}
            value={newItemForm.imageUrl}
            onChange={(e) => updateNewField('imageUrl', e.target.value)}
            placeholder="/uploads/filename.jpg"
          />
          <input
            type="file"
            accept="image/*"
            onChange={uploadForNewCard}
            style={{ marginTop: '0.75rem', color: '#d1c8ba' }}
            disabled={uploadingNew}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Tag</label>
            <input
              type="text"
              className={styles.formInput}
              value={newItemForm.tag}
              onChange={(e) => updateNewField('tag', e.target.value)}
              placeholder="Operations Update"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Date</label>
              <input
                type="date"
                className={styles.formInput}
                value={newItemForm.dateValue || ''}
                onChange={(e) => {
                  updateNewField('dateValue', e.target.value);
                  updateNewField('dateLabel', formatDateLabel(e.target.value));
                }}
              />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Title</label>
          <input
            type="text"
            className={styles.formInput}
            value={newItemForm.title}
            onChange={(e) => updateNewField('title', e.target.value)}
            placeholder="New achievement title"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Description</label>
          <textarea
            className={`${styles.formInput} ${styles.formTextarea}`}
            value={newItemForm.description}
            onChange={(e) => updateNewField('description', e.target.value)}
            placeholder="Short update description"
          />
        </div>

        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={createNewCard}>
          Create Update Card
        </button>
      </div>
    </div>
  );
}

function ServicesTab({
  clusters,
  updateCluster,
  updateService,
}: {
  clusters: ServiceCluster[];
  updateCluster: (index: number, updates: Partial<ServiceCluster>) => void;
  updateService: (clusterIndex: number, serviceIndex: number, updates: Partial<ServiceItem>) => void;
}) {
  return (
    <div>
      <h3 style={{ color: '#f0ebe0', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Service Clusters</h3>
      {clusters.map((cluster, clusterIndex) => (
        <div
          key={cluster.id}
          style={{
            marginBottom: '2rem',
            padding: '1.5rem',
            background: '#141618',
            borderRadius: '6px',
            border: '1px solid #2a2d33',
          }}
        >
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Cluster Name</label>
            <input
              type="text"
              className={styles.formInput}
              value={cluster.name}
              onChange={(e) => updateCluster(clusterIndex, { name: e.target.value })}
            />
          </div>

          <h4 style={{ color: '#b8973a', marginTop: '1.5rem', marginBottom: '1rem', fontSize: '0.9rem' }}>
            Services in this cluster
          </h4>

          {cluster.services.map((service, serviceIndex) => (
            <div
              key={service.id}
              style={{
                marginBottom: '1.5rem',
                padding: '1rem',
                background: '#0d0e10',
                borderRadius: '4px',
              }}
            >
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Service Name</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={service.name}
                  onChange={(e) => updateService(clusterIndex, serviceIndex, { name: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Description</label>
                <textarea
                  className={`${styles.formInput} ${styles.formTextarea}`}
                  value={service.description}
                  onChange={(e) => updateService(clusterIndex, serviceIndex, { description: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Tags (comma-separated)</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={service.tags.join(', ')}
                  onChange={(e) =>
                    updateService(clusterIndex, serviceIndex, {
                      tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                    })
                  }
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Href</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={service.href}
                    onChange={(e) => updateService(clusterIndex, serviceIndex, { href: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Icon</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={service.icon}
                    onChange={(e) => updateService(clusterIndex, serviceIndex, { icon: e.target.value })}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function FaqTab({
  faqItems,
  updateFaq,
  addFaq,
  removeFaq,
}: {
  faqItems: FaqItem[];
  updateFaq: (index: number, updates: Partial<FaqItem>) => void;
  addFaq: () => void;
  removeFaq: (index: number) => void;
}) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ color: '#f0ebe0', fontSize: '1.1rem' }}>FAQ Items</h3>
        <button className={`${styles.btn} ${styles.btnOutline} ${styles.btnSmall}`} onClick={addFaq}>
          Add FAQ
        </button>
      </div>

      {faqItems.map((faq, index) => (
        <div
          key={faq.id}
          style={{
            marginBottom: '1.5rem',
            padding: '1.5rem',
            background: '#141618',
            borderRadius: '6px',
            border: '1px solid #2a2d33',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ color: '#8a9099', fontSize: '0.8rem' }}>#{index + 1}</span>
            <button
              className={`${styles.btn} ${styles.btnDanger} ${styles.btnSmall}`}
              onClick={() => removeFaq(index)}
            >
              Remove
            </button>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Question</label>
            <input
              type="text"
              className={styles.formInput}
              value={faq.question}
              onChange={(e) => updateFaq(index, { question: e.target.value })}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Answer</label>
            <textarea
              className={`${styles.formInput} ${styles.formTextarea}`}
              value={faq.answer}
              onChange={(e) => updateFaq(index, { answer: e.target.value })}
            />
          </div>
        </div>
      ))}

      {faqItems.length === 0 && (
        <p style={{ color: '#8a9099', textAlign: 'center', padding: '2rem' }}>No FAQ items yet. Click Add FAQ to create one.</p>
      )}
    </div>
  );
}

function TestimonialsTab({
  testimonials,
  updateTestimonial,
  addTestimonial,
  removeTestimonial,
}: {
  testimonials: Testimonial[];
  updateTestimonial: (index: number, updates: Partial<Testimonial>) => void;
  addTestimonial: () => void;
  removeTestimonial: (index: number) => void;
}) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ color: '#f0ebe0', fontSize: '1.1rem' }}>Testimonials</h3>
        <button className={`${styles.btn} ${styles.btnOutline} ${styles.btnSmall}`} onClick={addTestimonial}>
          Add Testimonial
        </button>
      </div>

      {testimonials.map((testimonial, index) => (
        <div
          key={testimonial.id}
          style={{
            marginBottom: '1.5rem',
            padding: '1.5rem',
            background: '#141618',
            borderRadius: '6px',
            border: '1px solid #2a2d33',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ color: '#8a9099', fontSize: '0.8rem' }}>#{index + 1}</span>
            <button
              className={`${styles.btn} ${styles.btnDanger} ${styles.btnSmall}`}
              onClick={() => removeTestimonial(index)}
            >
              Remove
            </button>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Quote</label>
            <textarea
              className={`${styles.formInput} ${styles.formTextarea}`}
              value={testimonial.quote}
              onChange={(e) => updateTestimonial(index, { quote: e.target.value })}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Client Type</label>
            <input
              type="text"
              className={styles.formInput}
              value={testimonial.clientType}
              onChange={(e) => updateTestimonial(index, { clientType: e.target.value })}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Outcome</label>
              <input
                type="text"
                className={styles.formInput}
                value={testimonial.outcome}
                onChange={(e) => updateTestimonial(index, { outcome: e.target.value })}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Location</label>
              <input
                type="text"
                className={styles.formInput}
                value={testimonial.location}
                onChange={(e) => updateTestimonial(index, { location: e.target.value })}
              />
            </div>
          </div>
        </div>
      ))}

      {testimonials.length === 0 && (
        <p style={{ color: '#8a9099', textAlign: 'center', padding: '2rem' }}>No testimonials yet. Click Add Testimonial to create one.</p>
      )}
    </div>
  );
}

function OtherTab({
  industries,
  caseStudies,
  proofPillars,
  processSteps,
  updateIndustry,
  updateCaseStudy,
  updateProofPillar,
  updateProofPillarPoint,
  updateProcessStep,
}: {
  industries: Industry[];
  caseStudies: CaseStudy[];
  proofPillars: ProofPillar[];
  processSteps: ProcessStep[];
  updateIndustry: (index: number, updates: Partial<Industry>) => void;
  updateCaseStudy: (index: number, updates: Partial<CaseStudy>) => void;
  updateProofPillar: (index: number, updates: Partial<ProofPillar>) => void;
  updateProofPillarPoint: (pillarIndex: number, pointIndex: number, value: string) => void;
  updateProcessStep: (index: number, updates: Partial<ProcessStep>) => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpanded(expanded === section ? null : section);
  };

  const sectionStyle = {
    marginBottom: '1rem',
    background: '#141618',
    borderRadius: '6px',
    border: '1px solid #2a2d33',
    overflow: 'hidden' as const,
  };

  const headerStyle = {
    padding: '1rem 1.5rem',
    background: 'none',
    border: 'none',
    color: '#f0ebe0',
    fontSize: '1rem',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left' as const,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const contentStyle = {
    padding: '1.5rem',
    borderTop: '1px solid #2a2d33',
  };

  return (
    <div>
      <h3 style={{ color: '#f0ebe0', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Other Content</h3>

      {/* Industries */}
      <div style={sectionStyle}>
        <button style={headerStyle} onClick={() => toggleSection('industries')}>
          <span>Industries ({industries.length})</span>
          <span>{expanded === 'industries' ? '−' : '+'}</span>
        </button>
        {expanded === 'industries' && (
          <div style={contentStyle}>
            {industries.map((industry, index) => (
              <div key={industry.id} style={{ marginBottom: '1.5rem', padding: '1rem', background: '#0d0e10', borderRadius: '4px' }}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Name</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={industry.name}
                    onChange={(e) => updateIndustry(index, { name: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Description</label>
                  <textarea
                    className={`${styles.formInput} ${styles.formTextarea}`}
                    value={industry.description}
                    onChange={(e) => updateIndustry(index, { description: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Icon</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={industry.icon}
                    onChange={(e) => updateIndustry(index, { icon: e.target.value })}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Case Studies */}
      <div style={sectionStyle}>
        <button style={headerStyle} onClick={() => toggleSection('caseStudies')}>
          <span>Case Studies ({caseStudies.length})</span>
          <span>{expanded === 'caseStudies' ? '−' : '+'}</span>
        </button>
        {expanded === 'caseStudies' && (
          <div style={contentStyle}>
            {caseStudies.map((caseStudy, index) => (
              <div key={caseStudy.id} style={{ marginBottom: '1.5rem', padding: '1rem', background: '#0d0e10', borderRadius: '4px' }}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Client Type</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={caseStudy.clientType}
                    onChange={(e) => updateCaseStudy(index, { clientType: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Problem</label>
                  <textarea
                    className={`${styles.formInput} ${styles.formTextarea}`}
                    value={caseStudy.problem}
                    onChange={(e) => updateCaseStudy(index, { problem: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Solution</label>
                  <textarea
                    className={`${styles.formInput} ${styles.formTextarea}`}
                    value={caseStudy.solution}
                    onChange={(e) => updateCaseStudy(index, { solution: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Result</label>
                  <textarea
                    className={`${styles.formInput} ${styles.formTextarea}`}
                    value={caseStudy.result}
                    onChange={(e) => updateCaseStudy(index, { result: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Tag</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={caseStudy.tag}
                    onChange={(e) => updateCaseStudy(index, { tag: e.target.value })}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Proof Pillars */}
      <div style={sectionStyle}>
        <button style={headerStyle} onClick={() => toggleSection('proofPillars')}>
          <span>Proof Pillars ({proofPillars.length})</span>
          <span>{expanded === 'proofPillars' ? '−' : '+'}</span>
        </button>
        {expanded === 'proofPillars' && (
          <div style={contentStyle}>
            {proofPillars.map((pillar, pillarIndex) => (
              <div key={pillar.id} style={{ marginBottom: '1.5rem', padding: '1rem', background: '#0d0e10', borderRadius: '4px' }}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Title</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={pillar.title}
                    onChange={(e) => updateProofPillar(pillarIndex, { title: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Label</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={pillar.label}
                    onChange={(e) => updateProofPillar(pillarIndex, { label: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Points</label>
                  {pillar.points.map((point, pointIndex) => (
                    <input
                      key={pointIndex}
                      type="text"
                      className={styles.formInput}
                      value={point}
                      onChange={(e) => updateProofPillarPoint(pillarIndex, pointIndex, e.target.value)}
                      style={{ marginBottom: '0.5rem' }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Process Steps */}
      <div style={sectionStyle}>
        <button style={headerStyle} onClick={() => toggleSection('processSteps')}>
          <span>Process Steps ({processSteps.length})</span>
          <span>{expanded === 'processSteps' ? '−' : '+'}</span>
        </button>
        {expanded === 'processSteps' && (
          <div style={contentStyle}>
            {processSteps.map((step, index) => (
              <div key={step.number} style={{ marginBottom: '1.5rem', padding: '1rem', background: '#0d0e10', borderRadius: '4px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '1rem' }}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Number</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      value={step.number}
                      onChange={(e) => updateProcessStep(index, { number: e.target.value })}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Title</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      value={step.title}
                      onChange={(e) => updateProcessStep(index, { title: e.target.value })}
                    />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Description</label>
                  <textarea
                    className={`${styles.formInput} ${styles.formTextarea}`}
                    value={step.description}
                    onChange={(e) => updateProcessStep(index, { description: e.target.value })}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
