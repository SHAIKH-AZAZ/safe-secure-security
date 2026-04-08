'use client';

import Link from 'next/link';
import type { FormEvent } from 'react';
import { useState } from 'react';
import {
  CITY_OPTIONS,
  CONTACT_METHOD_OPTIONS,
  EMERGENCY_REQUIRED_FIELDS,
  EMPTY_LEAD_FORM,
  type LeadFormKey,
  validateLeadForm,
} from '@/lib/forms';
import type { LeadFormErrors } from '@/lib/forms';
import type { LeadFormState } from '@/lib/types';
import { SITE } from '@/lib/site';
import {
  IconAlert,
  IconArrowRight,
  IconCheck,
  IconPhone,
} from '@/components/icons';
import SectionReveal from '@/components/ui/SectionReveal';
import styles from './LeadPages.module.css';

const INITIAL_FORM: LeadFormState = {
  ...EMPTY_LEAD_FORM,
  urgency_level: 'Emergency or same-day deployment',
  preferred_contact_method: CONTACT_METHOD_OPTIONS[0],
};

function FieldError({ field, errors }: { field: LeadFormKey; errors: LeadFormErrors }) {
  if (!errors[field]) {
    return null;
  }

  return <span className="field-error">{errors[field]}</span>;
}

export default function EmergencyPageClient() {
  const [form, setForm] = useState<LeadFormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<LeadFormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitWarning, setSubmitWarning] = useState<string | null>(null);

  const updateField = (field: LeadFormKey, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitError(null);
    setSubmitWarning(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateLeadForm(form, EMERGENCY_REQUIRED_FIELDS);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    setSubmitWarning(null);

    try {
      const response = await fetch('/api/emergency', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const result = (await response.json()) as { error?: string; warning?: string };

      if (!response.ok) {
        throw new Error(result.error || 'Unable to send the emergency request right now.');
      }

      if (result.warning) {
        setSubmitWarning(result.warning);
      }
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to send the emergency request right now.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className={`${styles.hero} ${styles.heroAlert}`}>
        <div className="container">
          <SectionReveal>
            <div className={`${styles.heroTag} ${styles.heroTagAlert}`}>
              <IconAlert size={13} />
              Emergency deployment route
            </div>
            <h1 className={`${styles.heroTitle} ${styles.heroTitleAlert}`}>
              Need security
              <br />
              <span>right now?</span>
            </h1>
            <p className={styles.heroDescription}>
              Use this shorter form for same-day or active requirements. For immediate assistance,
              call the operations desk while the request is being reviewed.
            </p>
            <div className={styles.heroActions}>
              <Link href={SITE.phoneHref} className="btn btn-primary">
                <IconPhone size={16} />
                Call Operations
              </Link>
            </div>
          </SectionReveal>
        </div>
      </section>

      <section className={`section ${styles.section}`}>
        <div className="container">
          <div className={styles.layout}>
            <SectionReveal>
              {submitted ? (
                <div className={styles.successCard}>
                  <div className={styles.successBadge}>
                    <IconCheck size={24} />
                  </div>
                  <h2>Emergency brief recorded</h2>
                  <p>
                    {submitWarning
                      ? submitWarning
                      : 'Your emergency brief has been sent to the monitored inbox so the operations team can triage it immediately.'}
                  </p>
                  <Link href="/" className="btn btn-outline">
                    Return to home
                  </Link>
                </div>
              ) : (
                <div className={styles.formCard}>
                  <div className={styles.sectionHeading}>
                    <h2>Short emergency brief</h2>
                    <p>
                      Keep it simple: who needs help, where, what type of coverage, and how the team
                      should contact you right now.
                    </p>
                  </div>

                  <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.grid}>
                      <div className="field-group">
                        <label className="field-label" htmlFor="emergency-name">Your Name</label>
                        <input
                          id="emergency-name"
                          className="field-input"
                          value={form.name}
                          onChange={(event) => updateField('name', event.target.value)}
                          aria-invalid={errors.name ? 'true' : 'false'}
                          placeholder="Full name"
                        />
                        <FieldError field="name" errors={errors} />
                      </div>

                      <div className="field-group">
                        <label className="field-label" htmlFor="emergency-phone">Phone</label>
                        <input
                          id="emergency-phone"
                          className="field-input"
                          type="tel"
                          value={form.phone}
                          onChange={(event) => updateField('phone', event.target.value)}
                          aria-invalid={errors.phone ? 'true' : 'false'}
                          placeholder={SITE.phoneDisplay}
                        />
                        <FieldError field="phone" errors={errors} />
                      </div>

                      <div className="field-group">
                        <label className="field-label" htmlFor="emergency-city">City</label>
                        <select
                          id="emergency-city"
                          className="field-input"
                          value={form.city}
                          onChange={(event) => updateField('city', event.target.value)}
                          aria-invalid={errors.city ? 'true' : 'false'}
                        >
                          <option value="">Select city or district in Gujarat</option>
                          {CITY_OPTIONS.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                        <FieldError field="city" errors={errors} />
                      </div>

                      <div className="field-group">
                        <label className="field-label" htmlFor="emergency-service">What do you need?</label>
                        <select
                          id="emergency-service"
                          className="field-input"
                          value={form.service_type}
                          onChange={(event) => updateField('service_type', event.target.value)}
                          aria-invalid={errors.service_type ? 'true' : 'false'}
                        >
                          <option value="">Select requirement</option>
                          <option value="VIP security">VIP security</option>
                          <option value="Celebrity guard services">Celebrity guard services</option>
                          <option value="Executive protection">Executive protection</option>
                          <option value="Licensed gunman support">Licensed gunman support</option>
                          <option value="Event and venue security">Event or venue support</option>
                          <option value="Corporate and property guarding">Urgent site guarding</option>
                          <option value="Security consulting and assessment">Immediate security assessment</option>
                        </select>
                        <FieldError field="service_type" errors={errors} />
                      </div>

                      <div className={`field-group ${styles.wide}`}>
                        <label className="field-label" htmlFor="emergency-location">Location Details</label>
                        <input
                          id="emergency-location"
                          className="field-input"
                          value={form.site_or_event_location}
                          onChange={(event) => updateField('site_or_event_location', event.target.value)}
                          placeholder="Venue, address, or meeting point"
                        />
                      </div>

                      <div className="field-group">
                        <label className="field-label" htmlFor="emergency-method">Best Contact Method</label>
                        <select
                          id="emergency-method"
                          className="field-input"
                          value={form.preferred_contact_method}
                          onChange={(event) => updateField('preferred_contact_method', event.target.value)}
                          aria-invalid={errors.preferred_contact_method ? 'true' : 'false'}
                        >
                          {CONTACT_METHOD_OPTIONS.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                        <FieldError field="preferred_contact_method" errors={errors} />
                      </div>

                      <div className="field-group">
                        <label className="field-label" htmlFor="emergency-date">Need By</label>
                        <input
                          id="emergency-date"
                          className="field-input"
                          type="date"
                          value={form.date_or_start_date}
                          onChange={(event) => updateField('date_or_start_date', event.target.value)}
                        />
                      </div>
                    </div>

                    <div className="field-group">
                      <label className="field-label" htmlFor="emergency-message">Brief Description</label>
                      <textarea
                        id="emergency-message"
                        className="field-input"
                        rows={4}
                        value={form.message}
                        onChange={(event) => updateField('message', event.target.value)}
                        aria-invalid={errors.message ? 'true' : 'false'}
                        placeholder="Describe what is happening and what support is required."
                      />
                      <FieldError field="message" errors={errors} />
                    </div>

                    <div className={styles.alertCallout}>
                      <IconAlert size={14} />
                      Emergency requests are emailed directly to the operations inbox
                    </div>

                    {submitError ? <p className={styles.errorText}>{submitError}</p> : null}

                    <button type="submit" className={`btn btn-primary ${styles.submit}`} disabled={submitting}>
                      {submitting ? 'Sending Emergency Request...' : 'Send Emergency Request'}
                      <IconArrowRight size={16} />
                    </button>
                  </form>
                </div>
              )}
            </SectionReveal>

            <SectionReveal delay={100} className={styles.sidebar}>
              <div className={`${styles.panel} ${styles.alertPanel}`}>
                <h3>Immediate path</h3>
                <p>
                  If the situation is time-sensitive, call the operations desk first. Use the form as a
                  second path so the basic brief is logged and triaged.
                </p>
                <div className={styles.heroActions}>
                  <Link href={SITE.phoneHref} className="btn btn-outline">
                    <IconPhone size={15} />
                    {SITE.phoneDisplay}
                  </Link>
                </div>
              </div>

              <div className={styles.panel}>
                <h3>What to include</h3>
                <div className={styles.expectationList}>
                  {[
                    'Exact location or nearest workable meeting point.',
                    'Whether the need is for a principal, event, or fixed site.',
                    'How quickly support is needed and who will answer the callback.',
                  ].map((item) => (
                    <p key={item} className={styles.expectationItem}>{item}</p>
                  ))}
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>
    </>
  );
}
