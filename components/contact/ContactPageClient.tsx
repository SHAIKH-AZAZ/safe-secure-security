'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import {
  APPEARANCE_OPTIONS,
  CITY_OPTIONS,
  CLIENT_SEGMENT_OPTIONS,
  CONTACT_REQUIRED_FIELDS,
  CONTACT_METHOD_OPTIONS,
  type LeadFormKey,
  mergeLeadForm,
  EMPTY_LEAD_FORM,
  PERSONNEL_OPTIONS,
  SERVICE_OPTIONS,
  SHIFT_OPTIONS,
  STAFF_GENDER_OPTIONS,
  URGENCY_OPTIONS,
  validateLeadForm,
} from '@/lib/forms';
import type { LeadFormErrors } from '@/lib/forms';
import type { LeadFormState } from '@/lib/types';
import { SITE } from '@/lib/site';
import {
  IconArrowRight,
  IconCheck,
  IconEmail,
  IconPhone,
  IconShield,
  IconWhatsapp,
} from '@/components/icons';
import SectionReveal from '@/components/ui/SectionReveal';
import styles from './LeadPages.module.css';

const INITIAL_FORM: LeadFormState = {
  ...EMPTY_LEAD_FORM,
  preferred_contact_method: CONTACT_METHOD_OPTIONS[0],
  urgency_level: URGENCY_OPTIONS[0],
};

function FieldError({ field, errors }: { field: LeadFormKey; errors: LeadFormErrors }) {
  if (!errors[field]) {
    return null;
  }

  return <span className="field-error">{errors[field]}</span>;
}

export default function ContactPageClient() {
  const searchParams = useSearchParams();
  const [form, setForm] = useState<LeadFormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<LeadFormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [prefilled, setPrefilled] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (prefilled) {
      return;
    }

    const paramsObject = Object.fromEntries(searchParams.entries());

    if (Object.keys(paramsObject).length > 0) {
      setForm((current) => mergeLeadForm(current, paramsObject));
    }

    setPrefilled(true);
  }, [prefilled, searchParams]);

  const updateField = (field: LeadFormKey, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateLeadForm(form, CONTACT_REQUIRED_FIELDS);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error || 'Unable to submit the request right now.');
      }

      setSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to submit the request right now.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className={styles.hero}>
        <div className="container">
          <SectionReveal>
            <div className={styles.heroTag}>
              <IconShield size={13} />
              Security planning intake
            </div>
            <h1 className={styles.heroTitle}>
              Request a
              <br />
              <span>Security Plan</span>
            </h1>
            <p className={styles.heroDescription}>
              Every assignment starts with scope, timing, and operating context. Share the brief
              and Sentinel will turn it into a structured quote-ready request.
            </p>
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
                  <h2>Request captured</h2>
                  <p>
                    Your request has been sent to the operations inbox. The team can now review the
                    brief and follow up using your preferred contact method.
                  </p>
                  <Link href="/" className="btn btn-outline">
                    Return to home
                  </Link>
                </div>
              ) : (
                <div className={styles.formCard}>
                  <div className={styles.sectionHeading}>
                    <h2>Assignment Brief</h2>
                    <p>
                      Use the full form for scoped deployments, recurring guarding, or anything that
                      needs a written response from the team.
                    </p>
                  </div>

                  <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.grid}>
                      <div className="field-group">
                        <label className="field-label" htmlFor="contact-name">Full Name</label>
                        <input
                          id="contact-name"
                          className="field-input"
                          value={form.name}
                          onChange={(event) => updateField('name', event.target.value)}
                          aria-invalid={errors.name ? 'true' : 'false'}
                          placeholder="Your name"
                        />
                        <FieldError field="name" errors={errors} />
                      </div>

                      <div className="field-group">
                        <label className="field-label" htmlFor="contact-phone">Phone</label>
                        <input
                          id="contact-phone"
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
                        <label className="field-label" htmlFor="contact-email">Email</label>
                        <input
                          id="contact-email"
                          className="field-input"
                          type="email"
                          value={form.email}
                          onChange={(event) => updateField('email', event.target.value)}
                          aria-invalid={errors.email ? 'true' : 'false'}
                          placeholder="name@company.com"
                        />
                        <FieldError field="email" errors={errors} />
                      </div>

                      <div className="field-group">
                        <label className="field-label" htmlFor="contact-service">Service Type</label>
                        <select
                          id="contact-service"
                          className="field-input"
                          value={form.service_type}
                          onChange={(event) => updateField('service_type', event.target.value)}
                          aria-invalid={errors.service_type ? 'true' : 'false'}
                        >
                          <option value="">Select service type</option>
                          {SERVICE_OPTIONS.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                        <FieldError field="service_type" errors={errors} />
                      </div>

                      <div className="field-group">
                        <label className="field-label" htmlFor="contact-segment">Client Segment</label>
                        <select
                          id="contact-segment"
                          className="field-input"
                          value={form.client_segment}
                          onChange={(event) => updateField('client_segment', event.target.value)}
                          aria-invalid={errors.client_segment ? 'true' : 'false'}
                        >
                          <option value="">Select client segment</option>
                          {CLIENT_SEGMENT_OPTIONS.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                        <FieldError field="client_segment" errors={errors} />
                      </div>

                      <div className="field-group">
                        <label className="field-label" htmlFor="contact-city">City</label>
                        <select
                          id="contact-city"
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

                      <div className={`field-group ${styles.wide}`}>
                        <label className="field-label" htmlFor="contact-location">Site or Event Location</label>
                        <input
                          id="contact-location"
                          className="field-input"
                          value={form.site_or_event_location}
                          onChange={(event) => updateField('site_or_event_location', event.target.value)}
                          placeholder="Venue, property, or meeting location"
                        />
                      </div>

                      <div className="field-group">
                        <label className="field-label" htmlFor="contact-date">Date or Start Date</label>
                        <input
                          id="contact-date"
                          className="field-input"
                          type="date"
                          value={form.date_or_start_date}
                          onChange={(event) => updateField('date_or_start_date', event.target.value)}
                        />
                      </div>

                      <div className="field-group">
                        <label className="field-label" htmlFor="contact-shift-hours">Shift Hours</label>
                        <select
                          id="contact-shift-hours"
                          className="field-input"
                          value={form.shift_hours}
                          onChange={(event) => updateField('shift_hours', event.target.value)}
                        >
                          <option value="">Select shift profile</option>
                          {SHIFT_OPTIONS.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>

                      <div className="field-group">
                        <label className="field-label" htmlFor="contact-personnel">Personnel Count</label>
                        <select
                          id="contact-personnel"
                          className="field-input"
                          value={form.number_of_personnel}
                          onChange={(event) => updateField('number_of_personnel', event.target.value)}
                        >
                          <option value="">Select staffing level</option>
                          {PERSONNEL_OPTIONS.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>

                      <div className="field-group">
                        <label className="field-label" htmlFor="contact-gender">Staff Preference</label>
                        <select
                          id="contact-gender"
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
                        <label className="field-label" htmlFor="contact-appearance">Uniform / Plain Clothes</label>
                        <select
                          id="contact-appearance"
                          className="field-input"
                          value={form.uniform_or_plain_clothes}
                          onChange={(event) => updateField('uniform_or_plain_clothes', event.target.value)}
                        >
                          <option value="">Select posture</option>
                          {APPEARANCE_OPTIONS.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>

                      <div className="field-group">
                        <label className="field-label" htmlFor="contact-urgency">Urgency Level</label>
                        <select
                          id="contact-urgency"
                          className="field-input"
                          value={form.urgency_level}
                          onChange={(event) => updateField('urgency_level', event.target.value)}
                          aria-invalid={errors.urgency_level ? 'true' : 'false'}
                        >
                          {URGENCY_OPTIONS.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                        <FieldError field="urgency_level" errors={errors} />
                      </div>

                      <div className="field-group">
                        <label className="field-label" htmlFor="contact-method">Preferred Contact Method</label>
                        <select
                          id="contact-method"
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
                    </div>

                    <div className="field-group">
                      <label className="field-label" htmlFor="contact-message">Brief or Message</label>
                      <textarea
                        id="contact-message"
                        className="field-input"
                        rows={5}
                        value={form.message}
                        onChange={(event) => updateField('message', event.target.value)}
                        placeholder="Share the environment, timeline, stakeholders, and anything the team should know."
                      />
                    </div>

                    <p className={styles.helper}>
                      By submitting, you agree to the{' '}
                      <Link href="/privacy" style={{ color: 'var(--gold)' }}>
                        privacy policy
                      </Link>.
                    </p>

                    {submitError ? <p className={styles.errorText}>{submitError}</p> : null}

                    <button type="submit" className={`btn btn-primary ${styles.submit}`} disabled={submitting}>
                      {submitting ? 'Sending Request...' : 'Submit Security Request'}
                      <IconArrowRight size={16} />
                    </button>
                  </form>
                </div>
              )}
            </SectionReveal>

            <SectionReveal delay={100} className={styles.sidebar}>
              <div className={styles.panel}>
                <h3>Direct contact</h3>
                <div className={styles.contactList}>
                  <div style={{ marginBottom: '1rem' }}>
                    <h4 style={{ fontSize: '14px', marginBottom: '8px', color: 'var(--gold)' }}>Main Branch</h4>
                    {SITE.mainBranch.phones.map((phone) => (
                      <a key={phone} href={`tel:${phone.replace(/\\s+/g, '')}`} className={styles.contactItem}>
                        <IconPhone size={16} />
                        {phone}
                      </a>
                    ))}
                    <a href={SITE.whatsappUrl} target="_blank" rel="noopener noreferrer" className={styles.contactItem}>
                      <IconWhatsapp size={16} />
                      WhatsApp intake
                    </a>
                    <a href={`mailto:${SITE.email}`} className={styles.contactItem}>
                      <IconEmail size={16} />
                      {SITE.email}
                    </a>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '14px', marginBottom: '8px', color: 'var(--gold)' }}>Branch Office</h4>
                    {SITE.branchOffice.phones.map((phone) => (
                      <a key={phone} href={`tel:${phone.replace(/\\s+/g, '')}`} className={styles.contactItem}>
                        <IconPhone size={16} />
                        {phone}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.panel}>
                <h3>What to expect</h3>
                <div className={styles.expectationList}>
                  {[
                    'A structured review of the brief and operating environment.',
                    'A scoped proposal for staffing, posture, and response expectations.',
                    'A planning-first approach before any deployment language is finalized.',
                    'Launch content and legal wording should be verified before publishing.',
                  ].map((item) => (
                    <p key={item} className={styles.expectationItem}>{item}</p>
                  ))}
                </div>
              </div>

              <div className={`${styles.panel} ${styles.notePanel}`}>
                <h3>Need urgent help?</h3>
                <p>
                  Use the short emergency form for same-day requirements or call the operations desk
                  directly if the situation is active.
                </p>
                <div className={styles.heroActions}>
                  <Link href="/emergency" className="btn btn-outline">
                    Emergency short form
                  </Link>
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>
    </>
  );
}
