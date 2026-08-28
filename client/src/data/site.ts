/** Verified company facts — blueprint §2.1, from BLAZON's own sales deck. */
export const site = {
  name: 'BLAZON',
  domain: 'blazonpros.com',
  phone: '801-822-9732',
  phoneHref: 'tel:+18018229732',
  email: 'blakegale@blazonpros.com',
  hours: 'Monday to Friday, 9am–5pm Mountain Time',
  founder: 'Blake Gale',
  mission:
    'At BLAZON, our mission is to exceed client expectations by immersing ourselves in their business, gaining a deep understanding of their needs, and delivering tailored strategies for maximizing growth on Amazon.',
  disclaimer: 'Not affiliated with or endorsed by Amazon.com, Inc.',
} as const;

export const serviceNav = [
  { slug: 'account-management',    title: 'Account Management & Strategy', icon: 'settings' },
  { slug: 'listing-optimization',  title: 'Listing & Optimization',        icon: 'brand-image' },
  { slug: 'advertising',           title: 'Advertising & Marketing',       icon: 'marketing' },
  { slug: 'sales-growth',          title: 'Sales Optimization & Growth',   icon: 'increase' },
  { slug: 'operations-compliance', title: 'Operations & Compliance',       icon: 'rudder' },
  { slug: 'analytics',             title: 'Data Analytics & Reporting',    icon: 'bar-chart' },
  { slug: 'international',         title: 'International Expansion',       icon: 'network' },
] as const;

export const aboutNav = [
  { to: '/about',   label: 'About BLAZON' },
  { to: '/team',    label: 'Our Team' },
  { to: '/contact', label: 'Contact' },
] as const;
