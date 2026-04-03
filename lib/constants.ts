import type {
  CaseStudy,
  City,
  FaqItem,
  Industry,
  ProcessStep,
  ProofPillar,
  ServiceCluster,
  Testimonial,
} from './types';

export const SERVICE_CLUSTERS: ServiceCluster[] = [
  {
    id: 'personal-protection',
    name: 'Personal Protection',
    services: [
      {
        id: 'executive-protection',
        name: 'Executive Protection',
        description:
          'Discreet close-protection teams for founders, executives, public figures, and family principals.',
        tags: ['Advance planning', 'Plain clothes', 'Travel support'],
        href: '/executive-protection',
        icon: 'shield',
      },
      {
        id: 'family-office-security',
        name: 'Family Office Security',
        description:
          'Protective details shaped around privacy, residential routines, and stakeholder travel.',
        tags: ['Residential interface', 'Low-profile teams', 'NDA-ready'],
        href: '/executive-protection',
        icon: 'star-shield',
      },
      {
        id: 'travel-escort',
        name: 'Travel Escort',
        description:
          'Airport coordination, route management, and multi-stop coverage for time-sensitive itineraries.',
        tags: ['Route planning', 'Airport liaison', 'Multi-city'],
        href: '/executive-protection',
        icon: 'route',
      },
    ],
  },
  {
    id: 'event-venue',
    name: 'Event & Venue',
    services: [
      {
        id: 'private-events',
        name: 'Private Event Security',
        description:
          'Guest-facing teams for galas, leadership summits, luxury launches, and invite-only gatherings.',
        tags: ['Guest screening', 'VIP arrival lanes', 'Supervisor-led'],
        href: '/event-venue-security',
        icon: 'crowd',
      },
      {
        id: 'door-supervision',
        name: 'Venue & Door Supervision',
        description:
          'Controlled entry, queue management, and de-escalation support for premium venues and nightlife.',
        tags: ['Door staff', 'Conflict management', 'Queue control'],
        href: '/event-venue-security',
        icon: 'door',
      },
      {
        id: 'screening-operations',
        name: 'Access & Screening',
        description:
          'Credential checks, guest-list validation, bag screening, and perimeter monitoring.',
        tags: ['Credentialing', 'Entry points', 'Flow management'],
        href: '/event-venue-security',
        icon: 'scan',
      },
    ],
  },
  {
    id: 'corporate-property',
    name: 'Corporate & Property',
    services: [
      {
        id: 'corporate-guarding',
        name: 'Corporate Guarding',
        description:
          'Front-of-house and perimeter coverage for offices, headquarters, and high-traffic commercial sites.',
        tags: ['Reception coverage', 'Visitor control', 'Incident logs'],
        href: '/corporate-property',
        icon: 'building',
      },
      {
        id: 'estate-security',
        name: 'Estate & Residential Security',
        description:
          'Guarding plans for private residences, gated communities, and luxury mixed-use properties.',
        tags: ['Residential protocols', 'Visitor vetting', 'Overnight cover'],
        href: '/corporate-property',
        icon: 'home-shield',
      },
      {
        id: 'control-room-support',
        name: 'Patrol & Control Support',
        description:
          'Mobile patrol, CCTV review support, and access-control coordination for managed environments.',
        tags: ['Patrol checks', 'CCTV support', 'Access control'],
        href: '/corporate-property',
        icon: 'camera',
      },
    ],
  },
];

export const INDUSTRIES: Industry[] = [
  {
    id: 'executive-offices',
    name: 'Executive Offices',
    icon: 'office',
    description: 'Security presence for leadership floors, receptions, and executive movement.',
  },
  {
    id: 'luxury-hospitality',
    name: 'Luxury Hospitality',
    icon: 'nightclub',
    description: 'Guest-focused protection for hotels, private clubs, and nightlife venues.',
  },
  {
    id: 'private-events',
    name: 'Private Events',
    icon: 'ring',
    description: 'Discrete event teams for social calendars, donor gatherings, and launch events.',
  },
  {
    id: 'estates',
    name: 'Private Estates',
    icon: 'gate',
    description: 'Layered gate, visitor, and perimeter coverage for residential properties.',
  },
  {
    id: 'retail',
    name: 'Flagship Retail',
    icon: 'store',
    description: 'Loss-prevention visibility and customer-safe screening for premium storefronts.',
  },
  {
    id: 'industrial',
    name: 'Industrial Sites',
    icon: 'warehouse',
    description: 'Perimeter checks, shift handoff discipline, and access management for critical sites.',
  },
  {
    id: 'media',
    name: 'Talent & Media',
    icon: 'camera-media',
    description: 'Protection support for talent movement, media days, and public appearances.',
  },
  {
    id: 'public-programs',
    name: 'Public-Facing Programs',
    icon: 'podium',
    description: 'Crowd management and principal movement for civic and brand-facing events.',
  },
];

// Fictional placeholder references for staging only. [Verify before launch]
export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'ops-director',
    quote:
      'Sentinel stepped into a sensitive leadership program with calm structure. Their team blended into the guest experience while keeping arrivals, credential checks, and executive movement tightly controlled.',
    clientType: 'Operations Director, Private Capital Firm',
    outcome: 'Illustrative result: seamless arrivals and controlled guest flow',
    location: 'Mumbai',
  },
  {
    id: 'chief-of-staff',
    quote:
      'We needed a low-profile team that understood discretion more than theatrics. Sentinel handled travel transitions, site checks, and family-facing coordination exactly the way we needed.',
    clientType: 'Chief of Staff, Family Office',
    outcome: 'Illustrative result: protected travel with low visible footprint',
    location: 'Delhi NCR',
  },
  {
    id: 'venue-producer',
    quote:
      'The value was not just staffing. It was the pace, the briefing discipline, and the confidence of having one supervisor who owned the floor from load-in to final guest exit.',
    clientType: 'Venue Producer, Luxury Hospitality Group',
    outcome: 'Illustrative result: orderly entry and escalation-ready supervision',
    location: 'Bengaluru',
  },
];

// Fictional placeholder scenarios for staging only. [Verify before launch]
export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'board-summit',
    clientType: 'Board Retreat for a Public Company',
    problem:
      'A confidential leadership retreat required private arrival handling, perimeter awareness, and a guest-facing security posture that would not disrupt the hospitality environment.',
    solution:
      'Sentinel proposed a supervisor-led team with credential screening, arrival timing control, private route management, and discrete coverage around executive breakouts.',
    result:
      'Illustrative result: protected executive movement and controlled guest access without a visible security overreach.',
    tag: 'Illustrative event deployment',
  },
  {
    id: 'principal-travel',
    clientType: 'Principal Travel for a Family Office',
    problem:
      'A principal required short-notice movement support between meetings, hotel transitions, and a public-facing dinner where low visibility mattered as much as responsiveness.',
    solution:
      'The plan combined advance route review, discreet close protection, hotel interface, and rapid handoff communication with the client office.',
    result:
      'Illustrative result: the itinerary remained on schedule with protective coverage tailored to privacy-sensitive moments.',
    tag: 'Illustrative executive protection',
  },
  {
    id: 'mixed-use-site',
    clientType: 'New Mixed-Use Residential Property',
    problem:
      'A newly occupied property needed front-desk structure, overnight patrol discipline, and visitor handling that felt premium rather than confrontational.',
    solution:
      'Sentinel framed a coverage plan around post orders, access rules, visitor escalation paths, and supervisor review rhythms for the launch phase.',
    result:
      'Illustrative result: a professional site-security baseline with clearer access control and tenant-facing consistency.',
    tag: 'Illustrative property guarding',
  },
];

export const FAQS: FaqItem[] = [
  {
    id: 'deployment-speed',
    question: 'How quickly can Sentinel deploy a team?',
    answer:
      'Planned assignments usually begin after a consultation, scope review, and security plan sign-off. For urgent briefs, our operations desk can advise on the fastest available deployment window by city and staffing type.',
  },
  {
    id: 'staff-mix',
    question: 'Do you provide both male and female security personnel?',
    answer:
      'Yes. Requests for male, female, or mixed teams can be accommodated based on assignment needs, client preference, and local availability.',
  },
  {
    id: 'plain-clothes',
    question: 'Can your teams work in plain clothes?',
    answer:
      'Yes. Plain-clothes coverage is common for executive protection, private events, hospitality environments, and other assignments where a discreet posture is preferred.',
  },
  {
    id: 'short-vs-long',
    question: 'Do you handle both one-day events and long-term guarding contracts?',
    answer:
      'We support both short-duration deployments and ongoing coverage. The service plan, supervisor structure, and reporting cadence are tailored to the assignment length.',
  },
  {
    id: 'coverage',
    question: 'Which cities do you currently cover?',
    answer:
      'Our placeholder launch footprint covers key Indian metros including Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Pune, and Ahmedabad. Final launch coverage should be verified before publishing.',
  },
  {
    id: 'pricing',
    question: 'How is pricing structured?',
    answer:
      'Pricing depends on staffing profile, coverage hours, travel, location complexity, and supervisory requirements. Sentinel provides written proposals after reviewing the actual brief.',
  },
  {
    id: 'documentation',
    question: 'What documentation supports an assignment?',
    answer:
      'Assignments are supported by written scope confirmation, staffing plans where required, and reporting or incident documentation appropriate to the deployment. Any specific licensing or compliance language should be verified before launch.',
  },
];

export const PROOF_PILLARS: ProofPillar[] = [
  {
    id: 'people',
    title: 'People',
    label: 'Screened, briefed, client-facing',
    points: [
      'Assignments staffed around the brief, not a generic roster',
      'Supervisors own the handoff between plan and field execution',
      'Visible professionalism in both uniformed and discreet environments',
      'Client-sensitive communication standards for premium settings',
    ],
  },
  {
    id: 'process',
    title: 'Process',
    label: 'Scoped, documented, accountable',
    points: [
      'Each engagement begins with consultation and scope alignment',
      'Operational details are translated into a practical deployment plan',
      'Escalation pathways are defined before the team is on the ground',
      'Post-assignment reporting is available when the brief requires it',
    ],
  },
  {
    id: 'coverage',
    title: 'Coverage',
    label: 'Metro-ready, travel-capable',
    points: [
      'Coverage plans built around key Indian metros and inter-city travel corridors',
      'Support for executive movement, venue operations, and fixed-site guarding',
      'Flexible staffing for day rates, events, or recurring site needs',
      'A single point of contact for planning and operational updates',
    ],
  },
  {
    id: 'compliance',
    title: 'Compliance',
    label: 'Contractual, discreet, launch-ready',
    points: [
      'Scope and service terms are documented before deployment',
      'Confidential assignments can include NDA workflows',
      'Operational language stays aligned with client-side compliance teams',
      'Any state or licensing references should be verified before launch',
    ],
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: '01',
    title: 'Consultation',
    description:
      'We start with the brief: environment, stakeholders, schedule, sensitivities, and what success looks like.',
  },
  {
    number: '02',
    title: 'Risk Assessment',
    description:
      'Sentinel reviews the site, movement plan, guest profile, and operational pressure points that could affect delivery.',
  },
  {
    number: '03',
    title: 'Security Plan',
    description:
      'You receive a scoped plan covering staffing posture, roles, escalation paths, and coverage assumptions.',
  },
  {
    number: '04',
    title: 'Deployment',
    description:
      'Supervisors brief the team, confirm positioning, and manage live communications through the assignment window.',
  },
  {
    number: '05',
    title: 'Reporting',
    description:
      'Where the brief requires it, Sentinel closes the loop with reporting, observations, and recommended next steps.',
  },
];

// Placeholder launch footprint for staging only. [Verify before launch]
export const CITIES: City[] = [
  { name: 'Ahmedabad', region: 'West', coverageLabel: 'Regional command point', x: 180, y: 170 },
  { name: 'Mumbai', region: 'West', coverageLabel: 'Core metro coverage', x: 210, y: 240 },
  { name: 'Pune', region: 'West', coverageLabel: 'Corporate and estate coverage', x: 250, y: 255 },
  { name: 'Delhi NCR', region: 'North', coverageLabel: 'Core metro coverage', x: 330, y: 90 },
  { name: 'Hyderabad', region: 'South Central', coverageLabel: 'Regional command point', x: 360, y: 250 },
  { name: 'Bengaluru', region: 'South', coverageLabel: 'Priority event coverage', x: 350, y: 320 },
  { name: 'Chennai', region: 'South', coverageLabel: 'Travel and executive coverage', x: 440, y: 315 },
];

export const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Industries', href: '#industries' },
  { label: 'Coverage', href: '/coverage' },
  { label: 'Why Us', href: '#why-us' },
  { label: 'Case Studies', href: '#case-studies' },
  { label: 'Contact', href: '/contact' },
] as const;

export const TRUST_ITEMS = [
  'Supervisor-led deployments',
  'Discreet client handling',
  '24/7 operations desk',
  'Multi-market coordination',
  'NDA-ready workflows',
  'Brief-first planning',
] as const;
