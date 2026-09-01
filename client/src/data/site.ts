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
  { slug: 'account-setup',          title: 'Account Setup',          icon: 'settings' },
  { slug: 'listing-optimization',   title: 'Listing Optimization',   icon: 'brand-image' },
  { slug: 'account-health',         title: 'Account Health',         icon: 'rudder' },
  { slug: 'advertising-marketing',  title: 'Advertising & Marketing', icon: 'marketing' },
  { slug: 'value-adds',             title: 'Value Adds',             icon: 'increase' },
  { slug: 'team-trainings',         title: 'Team Trainings',         icon: 'network' },
] as const;

export const aboutNav = [
  { to: '/about',   label: 'About BLAZON' },
  { to: '/team',    label: 'Our Team' },
  { to: '/contact', label: 'Contact' },
] as const;
