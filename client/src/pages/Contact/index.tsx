import { useRef, useState } from 'react';
import { Counter, Reveal, RevealGroup } from '../../motion';
import { Section, Container } from '../../components/layout/Section';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { CtaSection } from '../../components/common/CtaSection';
import { FaqAccordion } from '../../components/common/FaqAccordion';
import { Seo } from '../../components/common/Seo';
import { AlertIcon, ArrowRight, Check, Phone } from '../../components/ui/Icon';
import { site } from '../../data/site';
import { postContact } from '../../services/api';

const INQUIRY = [
  ['audit', 'I want an audit'],
  ['not-selling', 'I’m not selling on Amazon yet'],
  ['account-issue', 'I have an account issue'],
  ['pricing', 'Pricing question'],
  ['other', 'Something else'],
];

type Errors = Partial<Record<string, string>>;

/** §11.1 — the form is the page; the phone number is a conversion asset. */
export default function Contact() {
  const [values, setValues] = useState({
    name: '', email: '', company: '', phone: '', inquiryType: '', message: '', consent: false, website: '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [banner, setBanner] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const confirmRef = useRef<HTMLDivElement>(null);
  const startedAt = useRef(Date.now());

  const set = (k: string, v: string | boolean) => {
    setValues((s) => ({ ...s, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validateField = (k: string, v = values): string | undefined => {
    switch (k) {
      case 'name': return v.name.trim() ? undefined : 'Enter your name';
      case 'email':
        if (!v.email.trim()) return 'Enter your work email address';
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim()) ? undefined : 'Enter a valid work email address';
      case 'message':
        if (v.message.trim().length < 10) return 'Tell us a little more — at least a sentence.';
        return undefined;
      case 'consent': return v.consent ? undefined : 'Please accept the privacy policy to continue';
      default: return undefined;
    }
  };

  // Validation runs on blur, never on keystroke, so nobody is corrected mid-typing.
  const blur = (k: string) => setErrors((e) => ({ ...e, [k]: validateField(k) }));

  const cls = (k: string) => `field${errors[k] ? ' field--error' : ''}`;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === 'sending') return;

    const found: Errors = {};
    for (const k of ['name', 'email', 'message', 'consent']) {
      const m = validateField(k);
      if (m) found[k] = m;
    }
    setErrors(found);
    if (Object.keys(found).length) {
      setStatus('error');
      setBanner(`${Object.keys(found).length} field${Object.keys(found).length > 1 ? 's need' : ' needs'} attention before this can be sent.`);
      formRef.current?.querySelector<HTMLElement>(`[name="${Object.keys(found)[0]}"]`)?.focus();
      return;
    }

    setStatus('sending'); setBanner('');
    try {
      const res = await postContact({ ...values, elapsedMs: Date.now() - startedAt.current });
      if (!res.ok) {
        setStatus('error');
        setBanner(res.message ?? 'We could not send that just now. Please try again, or call us.');
        if (res.fieldErrors) setErrors(res.fieldErrors);
        return;
      }
      setStatus('sent');
      requestAnimationFrame(() => confirmRef.current?.focus());
    } catch {
      setStatus('error');
      setBanner('We could not reach the server. Please try again, or call us — the number is on the right.');
    }
  }

  return (
    <>
      <Seo
        route="/contact" title="Contact BLAZON — talk to someone who knows Amazon"
        description={`Call ${site.phone} or send a message. A real person replies, and the phone is answered.`}
      />

      <section className="page-hero page-hero--compact" data-surface="obsidian">
        <div className="ember-gradient page-hero__ember" aria-hidden="true" />
        <Container className="page-hero__inner">
          <Reveal><p className="eyebrow">Contact</p></Reveal>
          <Reveal delay={80}><h1 className="display-l page-hero__title">Talk to someone who knows Amazon.</h1></Reveal>
          <Reveal delay={140}>
            <p className="body-l page-hero__lead">
              A real person replies, and the phone is answered. If you would rather
              just call, the number is below — most of our clients started that way.
            </p>
          </Reveal>
        </Container>
      </section>

      <Section surface="obsidian" className="contact">
        <Container>
          <div className="contact__grid">
            <div className="contact__form-col">
              {status === 'sent' ? (
                <div className="form-card form-card--confirm card" ref={confirmRef} tabIndex={-1} role="status" aria-live="polite">
                  <span className="confirm__check" aria-hidden="true"><Check size={26} /></span>
                  <h2 className="display-m">Message received.</h2>
                  <p className="body">
                    {site.founder} or one of the account managers will reply personally.
                    If it is urgent, call <a className="link link--inline" href={site.phoneHref}>{site.phone}</a> —
                    somebody picks up.
                  </p>
                </div>
              ) : (
                <Reveal className="form-card card">
                  <form ref={formRef} onSubmit={onSubmit} noValidate>
                    <div className="visually-hidden" role="alert" aria-live="assertive">
                      {status === 'error' ? banner : ''}
                    </div>

                    {/* Honeypot — hidden from people, tempting to bots. */}
                    <div className="visually-hidden" aria-hidden="true">
                      <label htmlFor="website">Website</label>
                      <input id="website" name="website" tabIndex={-1} autoComplete="off"
                             value={values.website} onChange={(e) => set('website', e.target.value)} />
                    </div>

                    <RevealGroup className="form-grid" stagger={70}>
                      <div className={cls('name')}>
                        <label className="field__label" htmlFor="name">Name <span className="field__req">(required)</span></label>
                        <input className="input" id="name" name="name" value={values.name}
                               onChange={(e) => set('name', e.target.value)} onBlur={() => blur('name')}
                               aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-err' : undefined} />
                        {errors.name && <p className="field__error" id="name-err"><AlertIcon />{errors.name}</p>}
                      </div>

                      <div className={cls('email')}>
                        <label className="field__label" htmlFor="email">Work email <span className="field__req">(required)</span></label>
                        <input className="input" id="email" name="email" type="email" value={values.email}
                               onChange={(e) => set('email', e.target.value)} onBlur={() => blur('email')}
                               aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-err' : undefined} />
                        {errors.email && <p className="field__error" id="email-err"><AlertIcon />{errors.email}</p>}
                      </div>

                      <div className="field">
                        <label className="field__label" htmlFor="company">Company</label>
                        <input className="input" id="company" name="company" value={values.company}
                               onChange={(e) => set('company', e.target.value)} />
                      </div>

                      <div className="field">
                        <label className="field__label" htmlFor="phone">Phone <span className="optional">(optional)</span></label>
                        <input className="input" id="phone" name="phone" type="tel" value={values.phone}
                               onChange={(e) => set('phone', e.target.value)} />
                      </div>

                      <div className="field form-grid__full">
                        <label className="field__label" htmlFor="inquiryType">What’s going on?</label>
                        <select className="select" id="inquiryType" name="inquiryType" value={values.inquiryType}
                                onChange={(e) => set('inquiryType', e.target.value)}>
                          <option value="">Select one</option>
                          {INQUIRY.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                        </select>
                      </div>

                      <div className={`${cls('message')} form-grid__full`}>
                        <label className="field__label" htmlFor="message">Message <span className="field__req">(required)</span></label>
                        <textarea className="textarea" id="message" name="message" rows={5} value={values.message}
                                  onChange={(e) => set('message', e.target.value)} onBlur={() => blur('message')}
                                  aria-invalid={!!errors.message} aria-describedby={errors.message ? 'msg-err' : undefined} />
                        {errors.message && <p className="field__error" id="msg-err"><AlertIcon />{errors.message}</p>}
                      </div>

                      <div className={`${cls('consent')} form-grid__full`}>
                        <label className="choice">
                          <input type="checkbox" name="consent" checked={values.consent}
                                 onChange={(e) => set('consent', e.target.checked)} onBlur={() => blur('consent')} />
                          <span>I agree to BLAZON storing my details to respond to this enquiry, as described in the{' '}
                            <a className="link link--inline" href="/privacy">privacy policy</a>.</span>
                        </label>
                        {errors.consent && <p className="field__error"><AlertIcon />{errors.consent}</p>}
                      </div>
                    </RevealGroup>

                    {status === 'error' && banner && (
                      <p className="form-alert"><AlertIcon />{banner}</p>
                    )}

                    <button className="btn btn--block form-submit" type="submit" disabled={status === 'sending'}>
                      {status === 'sending'
                        ? <><span className="btn__spinner" aria-hidden="true" /><span>Sending…</span></>
                        : <>Send message<ArrowRight /></>}
                    </button>
                    <p className="caption form-note">We reply within one business day.</p>
                  </form>
                </Reveal>
              )}
            </div>

            <Reveal className="contact__side" delay={160}>
              <div className="contact__side-inner">
                <h2 className="heading-s">Or reach us directly</h2>
                <a className="contact__phone" href={site.phoneHref}><Phone />{site.phone}</a>
                <p className="caption">{site.hours}</p>
                <dl className="contact__list">
                  <div>
                    <dt className="caption">Email</dt>
                    <dd><a className="link" href={`mailto:${site.email}`}>{site.email}</a></dd>
                  </div>
                  <div>
                    <dt className="caption">Who replies</dt>
                    <dd className="body-s">
                      {site.founder} or the account manager who would run your
                      account — not a shared support queue.
                    </dd>
                  </div>
                </dl>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section surface="carbon" size="compact">
        <Container>
          <RevealGroup className="stats__row" stagger={90}>
            {[{ to: 80, suffix: '+', label: 'brands managed' },
              { to: 8, suffix: '+', label: 'years in business' },
              { to: 9, suffix: '', label: 'specialists' }].map((m) => (
              <div className="stats__cell" key={m.label}>
                <p className="numeral stats__value"><Counter to={m.to} suffix={m.suffix} affixClassName="stats__unit" /></p>
                <p className="caption stats__label">{m.label}</p>
              </div>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      <Section surface="bone">
        <Container>
          <SectionHeader eyebrow="Questions" headline={['Before you send it.']} />
          <FaqAccordion items={[
            { q: 'Is the audit really free?', a: 'Yes, and there is no obligation attached to it. It takes about 60 minutes of our time and you get the findings either way.' },
            { q: 'How fast do you reply?', a: 'Within one business day, usually the same day. If you call during Mountain Time business hours somebody answers.' },
            { q: 'What access do you need?', a: 'Nothing to start. The first pass runs on public data plus what you tell us. If you want figures verified against your own reporting we will ask for read-only Seller Central access at that point.' },
            { q: 'What does it cost if we proceed?', a: 'Between $750 and $3,500 a month depending on catalogue size, plus 5% of growth above your baseline. Full detail is on the pricing page.' },
          ]} />
        </Container>
      </Section>

      <CtaSection />
    </>
  );
}
