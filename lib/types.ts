export interface ServiceCluster {
  id: string;
  name: string;
  services: ServiceItem[];
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  tags: string[];
  href: string;
  icon: string;
}

export interface Industry {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  clientType: string;
  outcome: string;
  location: string;
}

export interface CaseStudy {
  id: string;
  clientType: string;
  problem: string;
  solution: string;
  result: string;
  tag: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface ProofPillar {
  id: string;
  title: string;
  label: string;
  points: string[];
}

export interface City {
  name: string;
  region: string;
  coverageLabel: string;
  x: number;
  y: number;
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export interface CmsEntry {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  body: string;
  status: 'draft' | 'published';
  createdAt: string;
}

export interface CmsEntryInput {
  title: string;
  slug?: string;
  category: string;
  summary: string;
  body: string;
  status?: 'draft' | 'published';
}

export interface LeadFormState {
  name: string;
  phone: string;
  email: string;
  service_type: string;
  client_segment: string;
  city: string;
  site_or_event_location: string;
  date_or_start_date: string;
  shift_hours: string;
  number_of_personnel: string;
  male_or_female_staff: string;
  uniform_or_plain_clothes: string;
  urgency_level: string;
  message: string;
  preferred_contact_method: string;
  duration: string;
  travel_required: string;
  guest_count: string;
  bouncers_required: string;
  site_type: string;
  cctv_access: string;
}
