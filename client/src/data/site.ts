/**
 * Content strings are placeholders showing structure, length and tone —
 * final copy replaces them without changing the structure.
 */

export const site = {
  name: 'Northbeam',
  tagline: 'Amazon growth partner',
  email: 'hello@northbeam.co',
  newBusinessEmail: 'newbusiness@northbeam.co',
  phone: '+1 (312) 555 0148',
  hours: 'Mon–Fri, 9am–6pm CT',
  address: ['811 W Fulton Market, Suite 400', 'Chicago, IL 60607'],
  responseTime: 'five working days',
} as const;

export const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Solutions', to: '/#solutions' },
  { label: 'Results', to: '/#results' },
  { label: 'About', to: '/#about' },
  { label: 'Contact', to: '/contact' },
] as const;

export const socials = [
  { label: 'LinkedIn', href: '#linkedin', path: 'M4.5 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM1.75 6h2.5v8h-2.5V6Zm4.5 0h2.4v1.1a2.6 2.6 0 0 1 2.3-1.25c1.8 0 3.05 1.1 3.05 3.4V14h-2.5V9.6c0-1.1-.4-1.75-1.35-1.75-.8 0-1.25.55-1.45 1.1-.07.2-.09.47-.09.74V14h-2.5s.03-7.2 0-8Z' },
  { label: 'X', href: '#x', path: 'M11.7 1.5h2.3l-5 5.7 5.9 7.3h-4.6L6.7 9.8l-4 4.7H.4l5.4-6.1L.2 1.5h4.7l3.2 4.3 3.6-4.3Zm-.8 11.6h1.3L4.6 2.8H3.2l7.7 10.3Z' },
  { label: 'Instagram', href: '#instagram', path: 'M8 1.4c2.15 0 2.4.01 3.25.05.78.03 1.2.16 1.49.27.37.15.64.32.92.6.28.28.45.55.6.92.11.29.24.71.27 1.49.04.85.05 1.1.05 3.25s-.01 2.4-.05 3.25c-.03.78-.16 1.2-.27 1.49a2.5 2.5 0 0 1-.6.92c-.28.28-.55.45-.92.6-.29.11-.71.24-1.49.27-.85.04-1.1.05-3.25.05s-2.4-.01-3.25-.05c-.78-.03-1.2-.16-1.49-.27a2.5 2.5 0 0 1-.92-.6 2.5 2.5 0 0 1-.6-.92c-.11-.29-.24-.71-.27-1.49C1.41 10.4 1.4 10.15 1.4 8s.01-2.4.05-3.25c.03-.78.16-1.2.27-1.49.15-.37.32-.64.6-.92.28-.28.55-.45.92-.6.29-.11.71-.24 1.49-.27C5.6 1.41 5.85 1.4 8 1.4Zm0 3.22a3.38 3.38 0 1 0 0 6.76 3.38 3.38 0 0 0 0-6.76Zm0 5.57a2.19 2.19 0 1 1 0-4.38 2.19 2.19 0 0 1 0 4.38Zm4.31-5.7a.79.79 0 1 1-1.58 0 .79.79 0 0 1 1.58 0Z' },
  { label: 'YouTube', href: '#youtube', path: 'M15.2 4.8a1.9 1.9 0 0 0-1.34-1.35C12.67 3.13 8 3.13 8 3.13s-4.67 0-5.86.32A1.9 1.9 0 0 0 .8 4.8C.48 6 .48 8 .48 8s0 2 .32 3.2a1.9 1.9 0 0 0 1.34 1.35c1.19.32 5.86.32 5.86.32s4.67 0 5.86-.32a1.9 1.9 0 0 0 1.34-1.35C15.52 10 15.52 8 15.52 8s0-2-.32-3.2ZM6.53 10.28V5.72L10.4 8l-3.87 2.28Z' },
  { label: 'Podcast', href: '#podcast', path: 'M8 1.2a2.3 2.3 0 0 0-2.3 2.3v4a2.3 2.3 0 1 0 4.6 0v-4A2.3 2.3 0 0 0 8 1.2Zm4.4 6.1a.7.7 0 0 0-1.4 0 3 3 0 0 1-6 0 .7.7 0 0 0-1.4 0 4.4 4.4 0 0 0 3.7 4.34v1.66H6.1a.7.7 0 1 0 0 1.4h3.8a.7.7 0 1 0 0-1.4H8.7v-1.66a4.4 4.4 0 0 0 3.7-4.34Z' },
  { label: 'Newsletter', href: '#newsletter', path: 'M1.5 3.5h13v9h-13v-9Zm1.3 1.3v.35L8 8.4l5.2-3.25V4.8H2.8Zm10.4 1.9L8 9.95 2.8 6.7v4.5h10.4V6.7Z' },
] as const;

export const footerColumns = [
  {
    heading: 'Solutions',
    links: [
      { label: 'Advertising', to: '/#solutions' },
      { label: 'Account management', to: '/#solutions' },
      { label: 'Listing and catalogue', to: '/#solutions' },
      { label: 'Setup and onboarding', to: '/#solutions' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', to: '/#about' },
      { label: 'Results', to: '/#results' },
      { label: 'Contact', to: '/contact' },
    ],
  },
] as const;
