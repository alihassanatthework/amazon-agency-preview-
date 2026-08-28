/**
 * The twelve testimonial responses, verbatim from the consent form.
 * Every respondent answered "Yes" to using their name, company name and logo
 * linked to their Amazon store — the single most valuable asset in the archive.
 * Quotes are trimmed for length per §9.11 but never altered in meaning.
 */
export interface Testimonial {
  quote: string;
  author: string;
  company: string;
  slug: string | null;      // client slug, where a logo exists
  featured: boolean;
  service: string | null;
}

export const testimonials: Testimonial[] = [
  { author: 'Bob Lifsey', company: 'Power Steering Resources', slug: null, featured: true, service: 'sales-growth',
    quote: 'Amazon FBA Gross Revenue has increased 40%+. Successful Brand Registry.' },
  { author: 'Robert Ferreira', company: 'Seller Investigators', slug: null, featured: true, service: 'advertising',
    quote: 'Blake and his team was able to bring my marketing spend way down and still generate substantial orders. I stopped wasting 10’s of thousands of dollars a month in ineffective ad spend. You are not a number to them but rather a partner in success.' },
  { author: 'Dena Kinghorn', company: 'Natures Energy', slug: null, featured: true, service: null,
    quote: 'We started sales on Amazon 8 years ago. We were never very successful and used several different marketing teams. Blazon has been amazing. We immediately saw new sales and they are growing by the week!' },
  { author: 'Rod Stuart', company: 'BlenditUp', slug: 'blenditup', featured: true, service: 'listing-optimization',
    quote: 'In just our second month of working with them, we saw a significant boost in our sales. They were able to identify areas where we could improve our listings and optimize our product pages to increase visibility and drive more sales.' },
  { author: 'Emily Saunders', company: 'Raise Them Well', slug: 'raise-them-well', featured: true, service: 'account-management',
    quote: 'Blake and his team have helped us to focus on our brand and growing our business by taking over the management and day to day challenges related to our Amazon account. They are truly experts! I really enjoy working with individuals and not an "agency".' },
  { author: 'Lori Hayes', company: 'Health As It Ought To Be', slug: 'health-as-it-ought-to-be', featured: false, service: 'account-management',
    quote: 'Blake always knows what to do! Amazon is such a mystery and is always changing but all I have to do is let Blake know something is going on and then it gets fixed.' },
  { author: 'Amin Shahbaz', company: 'Rebel Rebel Personal Care', slug: null, featured: false, service: 'account-management',
    quote: 'BLAZON was incredible in taking over the day to day obstacles that often come up on Amazon which can be a real distraction pulling away resources and attention from our core competencies.' },
  { author: 'Cheston Davis', company: 'Pyro Putty', slug: 'pyro-putty', featured: false, service: 'operations-compliance',
    quote: 'Blake and team are able to offer quick problem solving when things go south on listings with their direct access to Amazon support individuals. This single handedly is a game changer.' },
  { author: 'Duran Anderson', company: 'RV Bug Stop', slug: 'rv-bug-stop', featured: false, service: 'operations-compliance',
    quote: 'Amazon had taken me off of their site because the name had the word bug in it and they assumed my product was a pesticide. I tried to get back on but had no luck. That’s when I contacted BLAZON and they were able to get me back on very quickly. After setting me up with Prime my sales jumped very soon after.' },
  { author: 'Darren Jones', company: 'Alpine Products', slug: 'alpine-products', featured: false, service: null,
    quote: 'We have consistently grown our sales year over year and Blazon has been at the foundation of our business. Managing Amazon needs has been a big challenge and Blazon has been proactive in resolving the issues as they arise.' },
  { author: 'Tami', company: 'Halftee', slug: 'halftee', featured: false, service: null,
    quote: 'The constant changes and updates to the ever fluid Amazon world. Just the ever growing knowledge about what is new and upcoming and first choice in new opportunities.' },
  { author: 'Andrew Millecam', company: 'AHM Investments', slug: 'ahm-investments', featured: false, service: null,
    quote: 'The team at Blazon is professional and friendly. Even with all the troubles and loops that Amazon has put us through we have been able to keep a great relationship and work towards our end goal. Highly recommended.' },
];
