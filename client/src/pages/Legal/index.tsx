import { useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { Reveal } from '../../motion';
import { Section, Container } from '../../components/layout/Section';
import { PageHero } from '../../components/layout/PageHero';
import { Seo } from '../../components/common/Seo';
import { site } from '../../data/site';

/**
 * §22 Q-04 — privacy, cookie and website terms.
 *
 * Every factual statement below describes what this codebase actually does,
 * and was written by reading it rather than from a template:
 *
 *   collected  — the two form state objects, pages/Contact/index.tsx and
 *                pages/GetStarted/index.tsx
 *   stored     — server/src/db/repositories/lead.repo.js (leads, lead_events,
 *                contact_messages, consent_logs — the last three of those
 *                record ip_address, and leads also records user_agent)
 *   retention  — there is no scheduled deletion anywhere in server/, so
 *                "until you ask" is the literal behaviour, not a promise
 *   processors — Vercel (hosting), Resend (api/_lib/notify.ts), Google Fonts
 *                (index.html, which discloses visitor IPs to Google)
 *   cookies    — none set by this site; the audit form keeps a draft in
 *                sessionStorage under 'blazon:get-started'
 *
 * NEEDS CONFIRMATION BEFORE THIS IS RELIED ON COMMERCIALLY:
 *   · registered postal address — none exists anywhere in the project
 *   · whether a dedicated privacy@ alias should replace the founder's address
 *   · governing law / jurisdiction, deliberately not stated rather than guessed
 *   · review by counsel — this is an accurate description of system behaviour,
 *     which is not the same thing as legal advice
 */
const UPDATED = '27 October 2026';

interface Block { heading: string; body: ReactNode }
interface Doc { title: string; intro: ReactNode; blocks: Block[] }

const Mail = () => <a className="link link--inline" href={`mailto:${site.email}`}>{site.email}</a>;
const Tel = () => <a className="link link--inline" href={site.phoneHref}>{site.phone}</a>;

const CONTACT: Block = {
  heading: 'How to reach us about your data',
  body: (
    <>
      <p className="body">
        Email <Mail /> or call <Tel />. We answer data questions directly — there is no
        ticket queue. {site.hours}.
      </p>
      <p className="body">
        Ask us for a copy of what we hold about you, a correction, or deletion, and we
        will action it. If you ask us to delete your details we will do so and confirm.
      </p>
    </>
  ),
};

const PRIVACY: Doc = {
  title: 'Privacy policy',
  intro: (
    <p className="body-l">
      This policy explains what {site.name} collects through this website, why, who else
      sees it and how long we keep it. It covers this site only — if you become a client,
      the handling of your Amazon account data is governed by the agreement we sign.
    </p>
  ),
  blocks: [
    {
      heading: 'What we collect',
      body: (
        <>
          <p className="body">
            Only what you type into one of our two forms. We do not run analytics, we do
            not buy data about you, and we do not track you across other websites.
          </p>
          <p className="body"><strong>The contact form</strong> collects your name, work
            email, company, phone number, the nature of your enquiry and your message.</p>
          <p className="body"><strong>The free audit form</strong> collects your first and
            last name, work email, phone number, brand name, store URL, product category,
            which marketplaces you sell in, whether you already sell on Amazon, your
            monthly revenue band, your SKU count band, which Amazon platform you use, your
            primary goal and anything else you choose to tell us.</p>
          <p className="body">
            With either form we also record the time of submission, the page you submitted
            from, your IP address and your browser's user-agent string. Those last two are
            kept to evidence consent and to shut down automated abuse of the forms.
          </p>
          <p className="body">
            The revenue and SKU bands are commercially sensitive, so we will say plainly:
            they exist to size the engagement before we speak to you, and for no other
            purpose.
          </p>
        </>
      ),
    },
    {
      heading: 'Why we use it, and what we never do with it',
      body: (
        <>
          <p className="body">
            To reply to you, to prepare and deliver the free audit you asked for, and to
            keep a record of enquiries we have received.
          </p>
          <p className="body">
            We do not sell your details. We do not rent or share them for anyone else's
            marketing. We do not add you to a newsletter because you asked a question, and
            we do not build advertising profiles from what you submit.
          </p>
        </>
      ),
    },
    {
      heading: 'Who else processes it',
      body: (
        <>
          <p className="body">
            We keep this list short on purpose, and these are the only third parties
            involved in running this site:
          </p>
          <ul className="legal__list">
            <li><strong>Vercel</strong> — hosts the website and runs the code that receives
              your form submission. Their servers process the request and log the IP
              address it came from.</li>
            <li><strong>Resend</strong> — delivers your submission to us by email.</li>
            <li><strong>Google Fonts</strong> — serves the typeface this site is set in.
              Loading it discloses your IP address to Google. It is the one third-party
              request this site makes on every page.</li>
          </ul>
          <p className="body">
            Where we hand advertising above our managed ceiling to a specialist partner, we
            will tell you who they are and agree it with you first. That never happens from
            a website enquiry.
          </p>
        </>
      ),
    },
    {
      heading: 'How long we keep it',
      body: (
        <p className="body">
          We keep enquiry and audit-request records for as long as we may need them to
          answer you and to keep an account of our own business. We do not operate an
          automatic deletion schedule, so in practice your details stay with us until you
          ask us to remove them — which you can do at any time, and we will.
        </p>
      ),
    },
    {
      heading: 'Your choices',
      body: (
        <p className="body">
          You can ask what we hold, ask us to correct it, or ask us to delete it. You can
          withdraw your consent at any time; it does not affect anything we already did
          while it was given. Depending on where you live you may have further statutory
          rights, and we will honour those on request.
        </p>
      ),
    },
    CONTACT,
    {
      heading: 'Changes to this policy',
      body: (
        <p className="body">
          If we change how we handle your data we will update this page and move the date
          below. This version is current as of {UPDATED}.
        </p>
      ),
    },
  ],
};

const COOKIES: Doc = {
  title: 'Cookie policy',
  intro: (
    <p className="body-l">
      This site sets no advertising cookies, no analytics cookies and no third-party
      tracking cookies. There is no cookie banner because there is nothing to consent to.
    </p>
  ),
  blocks: [
    {
      heading: 'What this site stores on your device',
      body: (
        <>
          <p className="body">
            One thing, and only if you start the free audit form. As you move between its
            steps your answers are saved in your own browser's session storage so a
            refresh does not lose your progress. It is cleared when you submit, and it
            never leaves your device until you do.
          </p>
          <p className="body">
            Closing the tab discards it. You can also clear it yourself through your
            browser's site-data settings, with no effect on anything else.
          </p>
        </>
      ),
    },
    {
      heading: 'Third-party requests',
      body: (
        <p className="body">
          The typeface is served by Google Fonts, which means your browser requests it
          from Google and Google sees your IP address. No other third party is contacted
          while you browse this site — no analytics, no tag manager, no advertising
          pixels, no embedded video, no chat widget.
        </p>
      ),
    },
    CONTACT,
  ],
};

const TERMS: Doc = {
  title: 'Website terms',
  intro: (
    <p className="body-l">
      These terms cover your use of this website. They are not our client agreement — if
      you engage {site.name}, the work, fees and cancellation terms are set out in the
      written agreement we sign with you.
    </p>
  ),
  blocks: [
    {
      heading: 'The figures published here',
      body: (
        <>
          <p className="body">
            Results shown in our case studies are what happened for those clients, in
            their category, with their catalogue. They are evidence of our work, not a
            forecast of yours, and nothing on this site is a guarantee of a particular
            outcome.
          </p>
          <p className="body">
            Pricing shown here is our published rate card and is the basis of any quote,
            but the figures that bind us are the ones in your signed agreement.
          </p>
        </>
      ),
    },
    {
      heading: 'Content on this site',
      body: (
        <p className="body">
          The text, design and graphics here belong to {site.name}. Client names and logos
          are shown with the permission of the brands concerned and remain theirs.
          {' '}{site.disclaimer}
        </p>
      ),
    },
    {
      heading: 'Availability',
      body: (
        <p className="body">
          We keep this site up and accurate, but we do not promise it will be uninterrupted
          or error-free. If something here looks wrong, tell us and we will correct it.
        </p>
      ),
    },
    CONTACT,
  ],
};

const DOCS: Record<string, Doc> = {
  '/privacy': PRIVACY,
  '/cookies': COOKIES,
  '/terms': TERMS,
};

export default function Legal() {
  const { pathname } = useLocation();
  const doc = DOCS[pathname] ?? PRIVACY;

  return (
    <>
      <Seo
        route={pathname}
        title={`${doc.title} — ${site.name}`}
        description={`How ${site.name} handles information submitted through this website.`}
      />
      <PageHero eyebrow="Legal" headline={[doc.title]} />
      <Section surface="obsidian">
        <Container>
          <Reveal className="legal">
            {doc.intro}
            {doc.blocks.map((b) => (
              <section className="legal__block" key={b.heading}>
                <h2 className="heading-s legal__heading">{b.heading}</h2>
                {b.body}
              </section>
            ))}
            <p className="caption legal__updated">Last updated {UPDATED}.</p>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
