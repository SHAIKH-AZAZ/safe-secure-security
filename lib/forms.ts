import type { LeadFormState } from './types';

export type LeadFormKey = keyof LeadFormState;
export type LeadFormErrors = Partial<Record<LeadFormKey, string>>;

export const EMPTY_LEAD_FORM: LeadFormState = {
  name: '',
  phone: '',
  email: '',
  service_type: '',
  client_segment: '',
  city: '',
  site_or_event_location: '',
  date_or_start_date: '',
  shift_hours: '',
  number_of_personnel: '',
  male_or_female_staff: '',
  uniform_or_plain_clothes: '',
  urgency_level: '',
  message: '',
  preferred_contact_method: '',
  duration: '',
  travel_required: '',
  guest_count: '',
  bouncers_required: '',
  site_type: '',
  cctv_access: '',
};

export const CITY_OPTIONS = [
  'Ahmedabad',
  'Anand',
  'Amreli',
  'Aravalli',
  'Banaskantha',
  'Bharuch',
  'Bhavnagar',
  'Botad',
  'Chhota Udaipur',
  'Dahod',
  'Dang',
  'Devbhoomi Dwarka',
  'Gandhinagar',
  'Gir Somnath',
  'Jamnagar',
  'Junagadh',
  'Kheda',
  'Kutch',
  'Mahisagar',
  'Mehsana',
  'Morbi',
  'Narmada',
  'Navsari',
  'Panchmahal',
  'Patan',
  'Porbandar',
  'Rajkot',
  'Sabarkantha',
  'Surat',
  'Surendranagar',
  'Tapi',
  'Vadodara',
  'Valsad',
  'Other location in Gujarat',
  'Out of State, Near Gujarat',
] as const;

export const URGENCY_OPTIONS = [
  'Planned requirement',
  'Priority quote within 24 hours',
  'Emergency or same-day deployment',
] as const;

export const CONTACT_METHOD_OPTIONS = ['Phone call', 'SMS', 'Email', 'WhatsApp'] as const;

export const SERVICE_OPTIONS = [
  'Executive protection',
  'Event and venue security',
  'Corporate and property guarding',
  'Residential estate security',
  'Mobile patrol and CCTV support',
  'Security consulting and assessment',
] as const;

export const CLIENT_SEGMENT_OPTIONS = [
  'Private principal or family office',
  'Corporate operations or facilities',
  'Event producer or venue team',
  'Property manager or developer',
  'Hospitality or lifestyle brand',
] as const;

export const PERSONNEL_OPTIONS = [
  '1-2 personnel',
  '3-5 personnel',
  '6-10 personnel',
  '11+ personnel',
] as const;

export const SHIFT_OPTIONS = [
  'Single shift under 8 hours',
  '8-12 hour shift',
  '24/7 coverage',
  'Multi-day rotation',
] as const;

export const STAFF_GENDER_OPTIONS = [
  'No preference',
  'Male personnel',
  'Female personnel',
  'Mixed team',
] as const;

export const APPEARANCE_OPTIONS = [
  'Plain clothes',
  'Uniformed',
  'Either, based on assessment',
] as const;

export const TRAVEL_OPTIONS = [
  'Single location only',
  'Multi-stop within one city',
  'Inter-city travel required',
  'Air travel support required',
] as const;

export const DURATION_OPTIONS = [
  'Same day',
  '2-3 days',
  '4-7 days',
  'Ongoing coverage',
] as const;

export const GUEST_COUNT_OPTIONS = [
  'Under 100 guests',
  '100-300 guests',
  '300-750 guests',
  '750+ guests',
] as const;

export const BOUNCER_OPTIONS = [
  'No door team needed',
  'Door team requested',
  'Door team and queue control',
] as const;

export const SITE_TYPE_OPTIONS = [
  'Corporate office',
  'Residential estate',
  'Warehouse or industrial site',
  'Retail showroom',
  'Construction or temporary site',
] as const;

export const CCTV_OPTIONS = [
  'Guarding only',
  'Guarding plus CCTV monitoring',
  'Guarding plus access control',
  'Integrated site support',
] as const;

export const HERO_TAB_FIELDS = {
  person: ['name', 'phone', 'city', 'date_or_start_date', 'duration', 'uniform_or_plain_clothes'] as LeadFormKey[],
  event: ['name', 'phone', 'city', 'site_or_event_location', 'date_or_start_date', 'guest_count'] as LeadFormKey[],
  site: ['name', 'phone', 'city', 'site_type', 'number_of_personnel', 'shift_hours', 'date_or_start_date'] as LeadFormKey[],
} as const;

export const CONTACT_REQUIRED_FIELDS: LeadFormKey[] = [
  'name',
  'phone',
  'service_type',
  'client_segment',
  'city',
  'urgency_level',
  'preferred_contact_method',
];

export const EMERGENCY_REQUIRED_FIELDS: LeadFormKey[] = [
  'name',
  'phone',
  'city',
  'service_type',
  'message',
  'preferred_contact_method',
];

const PHONE_PATTERN = /^[0-9+()\-\s]{7,}$/;

export function validateLeadForm(
  form: LeadFormState,
  requiredFields: LeadFormKey[]
): LeadFormErrors {
  const errors: LeadFormErrors = {};

  requiredFields.forEach((field) => {
    if (!form[field].trim()) {
      errors[field] = 'This field is required.';
    }
  });

  if (form.phone && !PHONE_PATTERN.test(form.phone)) {
    errors.phone = 'Enter a valid phone number.';
  }

  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Enter a valid email address.';
  }

  return errors;
}

export function buildLeadQuery(form: Partial<LeadFormState>): string {
  const params = new URLSearchParams();

  Object.entries(form).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });

  return params.toString();
}

export function mergeLeadForm(
  base: LeadFormState,
  values: Partial<Record<string, string>>
): LeadFormState {
  const next = { ...base };

  Object.entries(values).forEach(([key, value]) => {
    if (key in next && typeof value === 'string') {
      next[key as LeadFormKey] = value;
    }
  });

  return next;
}
