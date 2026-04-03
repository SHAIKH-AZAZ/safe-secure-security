'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ComponentType, FormEvent } from 'react';
import { useState } from 'react';
import {
  APPEARANCE_OPTIONS,
  BOUNCER_OPTIONS,
  buildLeadQuery,
  CITY_OPTIONS,
  CONTACT_METHOD_OPTIONS,
  CCTV_OPTIONS,
  DURATION_OPTIONS,
  EMPTY_LEAD_FORM,
  GUEST_COUNT_OPTIONS,
  HERO_TAB_FIELDS,
  PERSONNEL_OPTIONS,
  SHIFT_OPTIONS,
  SITE_TYPE_OPTIONS,
  STAFF_GENDER_OPTIONS,
  TRAVEL_OPTIONS,
  validateLeadForm,
} from '@/lib/forms';
import type { LeadFormErrors, LeadFormKey } from '@/lib/forms';
import type { LeadFormState } from '@/lib/types';
import { SITE } from '@/lib/site';
import {
  IconArrowRight,
  IconBuilding,
  IconCrowd,
  IconPhone,
  IconShield,
} from '@/components/icons';
import styles from './HeroSection.module.css';

type TabId = 'person' | 'event' | 'site';

const TAB_CONFIG: Record<
  TabId,
  {
    label: string;
    icon: ComponentType<{ size?: number; className?: string }>;
    summary: string;
    serviceType: LeadFormState['service_type'];
    clientSegment: LeadFormState['client_segment'];
  }
> = {
  person: {
    label: 'Protect a Person',
    icon: IconShield,
    summary: 'Executive and family-office protection with discreet travel support.',
    serviceType: 'Executive protection',
    clientSegment: 'Private principal or family office',
  },
  event: {
    label: 'Secure an Event',
    icon: IconCrowd,
    summary: 'Guest-facing teams for launches, venues, summits, and private gatherings.',
    serviceType: 'Event and venue security',
    clientSegment: 'Event producer or venue team',
  },
  site: {
    label: 'Guard a Site',
    icon: IconBuilding,
    summary: 'Guarding, patrol, and control support for offices, estates, and managed properties.',
    serviceType: 'Corporate and property guarding',
    clientSegment: 'Corporate operations or facilities',
  },
};

const STATS = [
  { value: '24/7', label: 'Operations Desk' },
  { value: 'Multi-Metro', label: 'Coverage Planning' },
  { value: 'Brief-Led', label: 'Deployment Model' },
] as const;

const INITIAL_FORM: LeadFormState = {
  ...EMPTY_LEAD_FORM,
  service_type: TAB_CONFIG.person.serviceType,
  client_segment: TAB_CONFIG.person.clientSegment,
  preferred_contact_method: CONTACT_METHOD_OPTIONS[0],
  urgency_level: 'Planned requirement',
};

function FieldError({ field, errors }: { field: LeadFormKey; errors: LeadFormErrors }) {
  if (!errors[field]) {
    return null;
  }

  return <span className="field-error">{errors[field]}</span>;
}

export default function HeroSection() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>('person');
  const [form, setForm] = useState<LeadFormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<LeadFormErrors>({});

  const activeConfig = TAB_CONFIG[activeTab];

  const updateField = (field: LeadFormKey, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const selectTab = (tab: TabId) => {
    const config = TAB_CONFIG[tab];

    setActiveTab(tab);
    setErrors({});
    setForm((current) => ({
      ...current,
      service_type: config.serviceType,
      client_segment: config.clientSegment,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: LeadFormState = {
      ...form,
      service_type: activeConfig.serviceType,
      client_segment: activeConfig.clientSegment,
    };

    const nextErrors = validateLeadForm(payload, HERO_TAB_FIELDS[activeTab]);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    router.push(`/contact?${buildLeadQuery(payload)}`);
  };

  return (
    <section className={styles.hero} aria-labelledby="hero-headline">
      <div className={styles.bgGrid} aria-hidden="true" />
      <div className={styles.bgGlow} aria-hidden="true" />

      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <div className={styles.eyebrow}>
            <IconShield size={14} className={styles.eyebrowIcon} />
            <span>Premium multi-service security consultancy</span>
          </div>

          <h1 id="hero-headline" className={styles.headline}>
            Tactical calm
            <br />
            for complex
            <br />
            <span className={styles.accentLine}>security moments.</span>
          </h1>

          <p className={styles.subheadline}>
            Sentinel Security supports executives, events, and high-value properties with
            brief-led planning, discreet teams, and measured response across key Indian metros.
          </p>

          <div className={styles.ctaGroup}>
            <Link href="/contact" className={`btn btn-primary ${styles.ctaPrimary}`}>
              Request Security Plan
              <IconArrowRight size={16} />
            </Link>
            <Link href={SITE.phoneHref} className={`btn btn-outline ${styles.ctaSecondary}`}>
              <IconPhone size={15} />
              Call Now
            </Link>
          </div>

          <div className={styles.stats} role="list" aria-label="Key operating facts">
            {STATS.map((stat) => (
              <div key={stat.label} className={styles.statItem} role="listitem">
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.wizardWrapper}>
          <form className={styles.wizard} onSubmit={handleSubmit} aria-label="Security inquiry wizard">
            <div className={styles.wizardHeader}>
              <div className={styles.wizardTitle}>
                <IconShield size={16} className={styles.wizardIcon} />
                Request a Security Plan
              </div>
              <p className={styles.wizardSub}>
                Start with the scenario that fits your brief. We will carry the details into the full quote form.
              </p>
            </div>

            <div className={styles.tabs} role="tablist" aria-label="Security requirement type">
              {(Object.keys(TAB_CONFIG) as TabId[]).map((tab) => {
                const config = TAB_CONFIG[tab];
                const TabIcon = config.icon;

                return (
                  <button
                    key={tab}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === tab}
                    aria-controls={`form-panel-${tab}`}
                    id={`tab-${tab}`}
                    className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
                    onClick={() => selectTab(tab)}
                  >
                    <span className={styles.tabIcon} aria-hidden="true">
                      <TabIcon size={14} />
                    </span>
                    <span>{config.label}</span>
                  </button>
                );
              })}
            </div>

            <div
              id={`form-panel-${activeTab}`}
              role="tabpanel"
              aria-labelledby={`tab-${activeTab}`}
              className={styles.formPanel}
            >
              <p className={styles.formIntro}>{activeConfig.summary}</p>

              <div className={styles.formGrid}>
                <div className={`field-group ${styles.span2}`}>
                  <label className="field-label" htmlFor={`${activeTab}-name`}>Your Name</label>
                  <input
                    id={`${activeTab}-name`}
                    className="field-input"
                    type="text"
                    value={form.name}
                    onChange={(event) => updateField('name', event.target.value)}
                    aria-invalid={errors.name ? 'true' : 'false'}
                    placeholder="Full name"
                  />
                  <FieldError field="name" errors={errors} />
                </div>

                <div className="field-group">
                  <label className="field-label" htmlFor={`${activeTab}-phone`}>Phone</label>
                  <input
                    id={`${activeTab}-phone`}
                    className="field-input"
                    type="tel"
                    value={form.phone}
                    onChange={(event) => updateField('phone', event.target.value)}
                    aria-invalid={errors.phone ? 'true' : 'false'}
                    placeholder={SITE.phoneDisplay}
                  />
                  <FieldError field="phone" errors={errors} />
                </div>

                {activeTab !== 'site' && (
                  <div className="field-group">
                    <label className="field-label" htmlFor={`${activeTab}-city`}>City</label>
                    <select
                      id={`${activeTab}-city`}
                      className="field-input"
                      value={form.city}
                      onChange={(event) => updateField('city', event.target.value)}
                      aria-invalid={errors.city ? 'true' : 'false'}
                    >
                      <option value="">Select metro area</option>
                      {CITY_OPTIONS.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                    <FieldError field="city" errors={errors} />
                  </div>
                )}

                {activeTab === 'person' && (
                  <>
                    <div className="field-group">
                      <label className="field-label" htmlFor="person-date">Start Date</label>
                      <input
                        id="person-date"
                        className="field-input"
                        type="date"
                        value={form.date_or_start_date}
                        onChange={(event) => updateField('date_or_start_date', event.target.value)}
                        aria-invalid={errors.date_or_start_date ? 'true' : 'false'}
                      />
                      <FieldError field="date_or_start_date" errors={errors} />
                    </div>

                    <div className="field-group">
                      <label className="field-label" htmlFor="person-duration">Duration</label>
                      <select
                        id="person-duration"
                        className="field-input"
                        value={form.duration}
                        onChange={(event) => updateField('duration', event.target.value)}
                        aria-invalid={errors.duration ? 'true' : 'false'}
                      >
                        <option value="">Select duration</option>
                        {DURATION_OPTIONS.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                      <FieldError field="duration" errors={errors} />
                    </div>

                    <div className="field-group">
                      <label className="field-label" htmlFor="person-appearance">Appearance</label>
                      <select
                        id="person-appearance"
                        className="field-input"
                        value={form.uniform_or_plain_clothes}
                        onChange={(event) => updateField('uniform_or_plain_clothes', event.target.value)}
                        aria-invalid={errors.uniform_or_plain_clothes ? 'true' : 'false'}
                      >
                        <option value="">Select appearance</option>
                        {APPEARANCE_OPTIONS.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                      <FieldError field="uniform_or_plain_clothes" errors={errors} />
                    </div>

                    <div className="field-group">
                      <label className="field-label" htmlFor="person-travel">Travel Required</label>
                      <select
                        id="person-travel"
                        className="field-input"
                        value={form.travel_required}
                        onChange={(event) => updateField('travel_required', event.target.value)}
                      >
                        <option value="">Select travel pattern</option>
                        {TRAVEL_OPTIONS.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                {activeTab === 'event' && (
                  <>
                    <div className={`field-group ${styles.span2}`}>
                      <label className="field-label" htmlFor="event-location">Venue / Location</label>
                      <input
                        id="event-location"
                        className="field-input"
                        type="text"
                        value={form.site_or_event_location}
                        onChange={(event) => updateField('site_or_event_location', event.target.value)}
                        aria-invalid={errors.site_or_event_location ? 'true' : 'false'}
                        placeholder="Venue name or address"
                      />
                      <FieldError field="site_or_event_location" errors={errors} />
                    </div>

                    <div className="field-group">
                      <label className="field-label" htmlFor="event-guests">Guest Count</label>
                      <select
                        id="event-guests"
                        className="field-input"
                        value={form.guest_count}
                        onChange={(event) => updateField('guest_count', event.target.value)}
                        aria-invalid={errors.guest_count ? 'true' : 'false'}
                      >
                        <option value="">Select guest count</option>
                        {GUEST_COUNT_OPTIONS.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                      <FieldError field="guest_count" errors={errors} />
                    </div>

                    <div className="field-group">
                      <label className="field-label" htmlFor="event-date">Event Date</label>
                      <input
                        id="event-date"
                        className="field-input"
                        type="date"
                        value={form.date_or_start_date}
                        onChange={(event) => updateField('date_or_start_date', event.target.value)}
                        aria-invalid={errors.date_or_start_date ? 'true' : 'false'}
                      />
                      <FieldError field="date_or_start_date" errors={errors} />
                    </div>

                    <div className="field-group">
                      <label className="field-label" htmlFor="event-staff-gender">Staff Mix</label>
                      <select
                        id="event-staff-gender"
                        className="field-input"
                        value={form.male_or_female_staff}
                        onChange={(event) => updateField('male_or_female_staff', event.target.value)}
                      >
                        <option value="">Select preference</option>
                        {STAFF_GENDER_OPTIONS.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>

                    <div className="field-group">
                      <label className="field-label" htmlFor="event-bouncers">Door Team</label>
                      <select
                        id="event-bouncers"
                        className="field-input"
                        value={form.bouncers_required}
                        onChange={(event) => updateField('bouncers_required', event.target.value)}
                      >
                        <option value="">Select door-team need</option>
                        {BOUNCER_OPTIONS.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                {activeTab === 'site' && (
                  <>
                    <div className="field-group">
                      <label className="field-label" htmlFor="site-city">City</label>
                      <select
                        id="site-city"
                        className="field-input"
                        value={form.city}
                        onChange={(event) => updateField('city', event.target.value)}
                        aria-invalid={errors.city ? 'true' : 'false'}
                      >
                        <option value="">Select metro area</option>
                        {CITY_OPTIONS.map((city) => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                      <FieldError field="city" errors={errors} />
                    </div>

                    <div className="field-group">
                      <label className="field-label" htmlFor="site-type">Site Type</label>
                      <select
                        id="site-type"
                        className="field-input"
                        value={form.site_type}
                        onChange={(event) => updateField('site_type', event.target.value)}
                        aria-invalid={errors.site_type ? 'true' : 'false'}
                      >
                        <option value="">Select site type</option>
                        {SITE_TYPE_OPTIONS.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                      <FieldError field="site_type" errors={errors} />
                    </div>

                    <div className="field-group">
                      <label className="field-label" htmlFor="site-shifts">Shift Pattern</label>
                      <select
                        id="site-shifts"
                        className="field-input"
                        value={form.shift_hours}
                        onChange={(event) => updateField('shift_hours', event.target.value)}
                        aria-invalid={errors.shift_hours ? 'true' : 'false'}
                      >
                        <option value="">Select shift pattern</option>
                        {SHIFT_OPTIONS.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                      <FieldError field="shift_hours" errors={errors} />
                    </div>

                    <div className="field-group">
                      <label className="field-label" htmlFor="site-personnel">Guard Count</label>
                      <select
                        id="site-personnel"
                        className="field-input"
                        value={form.number_of_personnel}
                        onChange={(event) => updateField('number_of_personnel', event.target.value)}
                        aria-invalid={errors.number_of_personnel ? 'true' : 'false'}
                      >
                        <option value="">Select guard count</option>
                        {PERSONNEL_OPTIONS.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                      <FieldError field="number_of_personnel" errors={errors} />
                    </div>

                    <div className="field-group">
                      <label className="field-label" htmlFor="site-cctv">CCTV / Access</label>
                      <select
                        id="site-cctv"
                        className="field-input"
                        value={form.cctv_access}
                        onChange={(event) => updateField('cctv_access', event.target.value)}
                      >
                        <option value="">Select support need</option>
                        {CCTV_OPTIONS.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>

                    <div className="field-group">
                      <label className="field-label" htmlFor="site-date">Start Date</label>
                      <input
                        id="site-date"
                        className="field-input"
                        type="date"
                        value={form.date_or_start_date}
                        onChange={(event) => updateField('date_or_start_date', event.target.value)}
                        aria-invalid={errors.date_or_start_date ? 'true' : 'false'}
                      />
                      <FieldError field="date_or_start_date" errors={errors} />
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className={styles.wizardFooter}>
              <div className={styles.footerInfo}>
                <label className="field-label" htmlFor="hero-contact-method">Preferred Contact</label>
                <select
                  id="hero-contact-method"
                  className="field-input"
                  value={form.preferred_contact_method}
                  onChange={(event) => updateField('preferred_contact_method', event.target.value)}
                >
                  {CONTACT_METHOD_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <button type="submit" className={`btn btn-primary ${styles.submitBtn}`}>
                Continue to Full Quote
                <IconArrowRight size={15} />
              </button>
            </div>

            <div className={styles.urgencyBadge}>
              <span className={styles.urgencyDot} aria-hidden="true" />
              Inquiry carries into the full form
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
