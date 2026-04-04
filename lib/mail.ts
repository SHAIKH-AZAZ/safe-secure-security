import {
  CONTACT_REQUIRED_FIELDS,
  EMERGENCY_REQUIRED_FIELDS,
  EMPTY_LEAD_FORM,
  mergeLeadForm,
  validateLeadForm,
} from '@/lib/forms';
import type { LeadFormErrors } from '@/lib/forms';
import type { LeadFormState } from '@/lib/types';

type LeadKind = 'contact' | 'emergency';

type LeadEmailPayload = {
  kind: LeadKind;
  form: LeadFormState;
};

const FIELD_LABELS: Partial<Record<keyof LeadFormState, string>> = {
  name: 'Name',
  phone: 'Phone',
  email: 'Email',
  service_type: 'Service type',
  client_segment: 'Client segment',
  city: 'City / district',
  site_or_event_location: 'Site or event location',
  date_or_start_date: 'Date or start date',
  shift_hours: 'Shift hours',
  number_of_personnel: 'Personnel count',
  male_or_female_staff: 'Staff preference',
  uniform_or_plain_clothes: 'Uniform / plain clothes',
  urgency_level: 'Urgency level',
  message: 'Brief or message',
  preferred_contact_method: 'Preferred contact method',
  duration: 'Duration',
  travel_required: 'Travel required',
  guest_count: 'Guest count',
  bouncers_required: 'Bouncers required',
  site_type: 'Site type',
  cctv_access: 'CCTV / access support',
};

function requiredFieldsFor(kind: LeadKind) {
  return kind === 'emergency' ? EMERGENCY_REQUIRED_FIELDS : CONTACT_REQUIRED_FIELDS;
}

export function validateLeadSubmission(kind: LeadKind, form: LeadFormState): LeadFormErrors {
  return validateLeadForm(form, requiredFieldsFor(kind));
}

export function normalizeLeadForm(value: unknown): LeadFormState {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return { ...EMPTY_LEAD_FORM };
  }

  return mergeLeadForm(EMPTY_LEAD_FORM, value as Record<string, string>);
}

function getEnv(name: string) {
  const value = process.env[name]?.trim();

  return value ? value : null;
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function buildLines(form: LeadFormState) {
  return (Object.entries(form) as Array<[keyof LeadFormState, string]>)
    .filter(([, value]) => value.trim())
    .map(([key, value]) => ({
      label: FIELD_LABELS[key] ?? key,
      value: value.trim(),
    }));
}

function buildTextBody(kind: LeadKind, form: LeadFormState) {
  const heading = kind === 'emergency' ? 'Emergency request' : 'Security plan request';
  const lines = buildLines(form)
    .map(({ label, value }) => `${label}: ${value}`)
    .join('\n');

  return `${heading}\n\n${lines}`;
}

function buildHtmlBody(kind: LeadKind, form: LeadFormState) {
  const heading = kind === 'emergency' ? 'Emergency request' : 'Security plan request';
  const rows = buildLines(form)
    .map(
      ({ label, value }) =>
        `<tr><td style="padding:8px 12px;border:1px solid #2a2d33;color:#d1c8ba;font-weight:600;">${escapeHtml(label)}</td><td style="padding:8px 12px;border:1px solid #2a2d33;color:#f0ebe0;">${escapeHtml(value)}</td></tr>`
    )
    .join('');

  return `
    <div style="background:#0d0e10;padding:24px;font-family:Arial,sans-serif;">
      <div style="max-width:720px;margin:0 auto;background:#141618;border:1px solid #2a2d33;padding:24px;">
        <h1 style="margin:0 0 16px;color:#f0ebe0;font-size:24px;">${escapeHtml(heading)}</h1>
        <table style="width:100%;border-collapse:collapse;">${rows}</table>
      </div>
    </div>
  `;
}

export async function sendLeadEmail({ kind, form }: LeadEmailPayload) {
  const apiKey = getEnv('RESEND_API_KEY');
  const from = getEnv('MAIL_FROM');
  const to = getEnv('MAIL_TO');

  if (!apiKey || !from || !to) {
    throw new Error('Mail service is not configured. Set RESEND_API_KEY, MAIL_FROM, and MAIL_TO.');
  }

  const subjectPrefix = kind === 'emergency' ? 'Emergency Request' : 'Security Plan Request';
  const location = form.city || form.site_or_event_location || 'Unknown location';
  const subject = `${subjectPrefix}: ${form.name || 'Unknown client'} - ${location}`;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      text: buildTextBody(kind, form),
      html: buildHtmlBody(kind, form),
      reply_to: form.email?.trim() || undefined,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend request failed: ${errorText}`);
  }

  return response.json();
}
