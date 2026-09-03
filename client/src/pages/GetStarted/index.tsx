import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Reveal } from '../../motion';
import { Section, Container } from '../../components/layout/Section';
import { Seo } from '../../components/common/Seo';
import { Card } from '../../components/common/Card';
import { AlertIcon, ArrowRight, Check } from '../../components/ui/Icon';
import { site } from '../../data/site';
import { postLead } from '../../services/api';

/**
 * §11.2 — the primary conversion. Step 1 branches on "Are you already selling
 * on Amazon?", routing to BLAZON's two existing offers: the Free Basic Audit
 * for brands already selling, and the Free Store Start-up Training Session for
 * brands that are not. This is BLAZON's own segmentation, not an invented flow.
 */
type Selling = 'already_selling' | 'not_yet_selling' | '';

const REVENUE = ['Under $10k', '$10k–$50k', '$50k–$250k', '$250k–$1M', '$1M+'];
// Aligned to the pricing tiers so the answer maps straight onto a quote.
const SKUS = ['1–5', '10–25', '26–100', '101–250', '251–500', '500+'];
const MARKETS = ['US', 'CA', 'UK', 'EU', 'Other'];
const PLATFORMS = [['seller_central', 'Seller Central'], ['vendor_central', 'Vendor Central'],
                   ['both', 'Both'], ['none', 'Not yet selling']];
const STAGE = ['No Amazon account yet', 'Account created, nothing listed', 'Selling elsewhere online'];

const DRAFT_KEY = 'blazon:get-started';

const AUDIT_VALUE = [
  'A review of your listings, titles, imagery and A+ content',
  'An advertising and contribution-margin assessment',
  'Account health, IPI and any live policy issues',
  'The programs your account is eligible for and isn’t using',
];
/** The "Five Keys" verbatim from the email campaign. */
const TRAINING_VALUE = [
  'Understanding the marketplace',
  'Strategic planning',
  'Listing optimisation',
  'Day-to-day operations',
  'Building a competitive advantage',
];

export default function GetStarted() {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState({
    sellingStatus: '' as Selling,
    brandName: '', storeUrl: '', website: '', productCategory: '',
    marketplaces: [] as string[], monthlyRevenueBand: '', skuCountBand: '',
    platform: '', stage: '', primaryGoal: '', message: '', platformIssues: '',
    firstName: '', lastName: '', email: '', phone: '', consent: false,
    hp: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [banner, setBanner] = useState('');
  const liveRef = useRef<HTMLDivElement>(null);
  const startedAt = useRef(Date.now());

  // A refresh should not lose progress.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      if (raw) setValues((v) => ({ ...v, ...JSON.parse(raw) }));
    } catch { /* a private window can throw — proceed with an empty form */ }
  }, []);
  useEffect(() => {
    try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify(values)); } catch { /* ignore */ }
  }, [values]);

  const set = (k: string, v: unknown) => {
    setValues((s) => ({ ...s, [k]: v }));
    setErrors((e) => ({ ...e, [k]: '' }));
  };

  const selling = values.sellingStatus === 'already_selling';
  const steps = selling
    ? ['Selling status', 'Your business', 'Your account', 'Goals & concerns', 'You']
    : ['Selling status', 'Your business', 'Where you are', 'Goals & concerns', 'You'];
  const total = values.sellingStatus ? steps.length : 5;

  function validateStep(): Record<string, string> {
    const e: Record<string, string> = {};
    const label = steps[step];
    if (label === 'Selling status' && !values.sellingStatus) e.sellingStatus = 'Choose one to continue';
    if (label === 'Your business' && !values.brandName.trim()) e.brandName = 'Enter your brand name';
    if (label === 'Your account') {
      if (!values.monthlyRevenueBand) e.monthlyRevenueBand = 'Select a revenue band';
      if (!values.skuCountBand) e.skuCountBand = 'Select an approximate SKU count';
      if (!values.platform) e.platform = 'Select your current setup';
    }
    if (label === 'Where you are' && !values.stage) e.stage = 'Select where you are';
    if (label === 'You') {
      if (!values.firstName.trim()) e.firstName = 'Enter your first name';
      if (!values.lastName.trim()) e.lastName = 'Enter your last name';
      if (!values.email.trim()) e.email = 'Enter your work email address';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) e.email = 'Enter a valid work email address';
      if (!values.consent) e.consent = 'Please accept the privacy policy to continue';
    }
    return e;
  }

  function next() {
    const e = validateStep();
    setErrors(e);
    if (Object.keys(e).length) {
      document.querySelector<HTMLElement>(`[name="${Object.keys(e)[0]}"]`)?.focus();
      return;
    }
    if (step < steps.length - 1) { setStep(step + 1); return; }
    void submit();
  }

  async function submit() {
    if (status === 'sending') return;
    setStatus('sending'); setBanner('');
    try {
      const res = await postLead({ ...values, elapsedMs: Date.now() - startedAt.current });
      if (!res.ok) {
        setStatus('error');
        setBanner(res.message ?? 'We could not send that just now.');
        if (res.fieldErrors) setErrors(res.fieldErrors);
        return;
      }
      setStatus('done');
      try { sessionStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
      requestAnimationFrame(() => liveRef.current?.focus());
    } catch {
      // Never a blank screen: the data is retained and the phone is offered.
      setStatus('error');
      setBanner('We could not reach the server. Your answers are saved — try again, or call us and we will take the details over the phone.');
    }
  }

  const err = (k: string) => errors[k]
    ? <p className="field__error"><AlertIcon />{errors[k]}</p> : null;
  const cls = (k: string) => `field${errors[k] ? ' field--error' : ''}`;

  if (status === 'done') {
    return (
      <>
        <Seo route="/get-started" title="Request received — BLAZON" noindex />
        <Section surface="obsidian" size="emphasis" className="wizard">
          <div className="ember-gradient wizard__ember" aria-hidden="true" />
          <Container>
            <div className="wizard__confirm form-card"  ref={liveRef} tabIndex={-1} role="status" aria-live="polite">
              <span className="confirm__check" aria-hidden="true"><Check size={26} /></span>
              <h1 className="display-m">You’re booked in.</h1>
              <p className="body">
                {selling
                  ? `We’ll review your account and come back within one business day to arrange the 60-minute audit. ${site.founder} or the account manager who would run your account will be on the call.`
                  : `We’ll be in touch within one business day to arrange your 60-minute start-up training session.`}
              </p>
              <p className="body">
                If you would rather just talk now, call{' '}
                <a className="link link--inline" href={site.phoneHref}>{site.phone}</a>.
              </p>
              <div className="wizard__confirm-links">
                <Link className="link" to="/results">See client results<ArrowRight /></Link>
                <Link className="link" to="/pricing">See pricing<ArrowRight /></Link>
              </div>
            </div>
          </Container>
        </Section>
      </>
    );
  }

  return (
    <>
      <Seo
        route="/get-started" title="Get a free Amazon audit — BLAZON"
        description="A free 60-minute review of your listings, advertising, account health and catalogue. No commitment."
      />
      <Section surface="obsidian" className="wizard">
        <div className="ember-gradient wizard__ember" aria-hidden="true" />
        <Container>
          <div className="wizard__grid">
            <div className="wizard__main">
              <Reveal>
                <p className="eyebrow">Free audit</p>
                <h1 className="display-m wizard__title">
                  {values.sellingStatus === 'not_yet_selling'
                    ? 'Let’s get you started on Amazon.'
                    : 'Find out what your account is leaving on the table.'}
                </h1>
                <p className="body-s wizard__lede">
                  Tell us about you: your business, your goals, your concerns, and any
                  issues with Amazon &amp; Walmart.
                </p>
              </Reveal>

              <div className="wizard__progress" aria-hidden="true">
                <span className="wizard__progress-fill" style={{ transform: `scaleX(${(step + 1) / total})` }} />
              </div>
              <p className="caption wizard__step-label" aria-live="polite">
                Step {step + 1} of {total} · {steps[step]}
              </p>

              <div className="wizard__panel form-card"  key={step}>
                {steps[step] === 'Selling status' && (
                  <fieldset className={cls('sellingStatus')}>
                    <legend className="field__label">Are you already selling on Amazon?</legend>
                    <div className="wizard__choices">
                      {[['already_selling', 'Yes — we’re selling on Amazon now'],
                        ['not_yet_selling', 'Not yet — we want to start']].map(([v, l]) => (
                        <label className={`wizard__big-choice${values.sellingStatus === v ? ' is-selected' : ''}`} key={v}>
                          <input type="radio" name="sellingStatus" value={v}
                                 checked={values.sellingStatus === v}
                                 onChange={() => set('sellingStatus', v)} />
                          <span>{l}</span>
                        </label>
                      ))}
                    </div>
                    {err('sellingStatus')}
                  </fieldset>
                )}

                {steps[step] === 'Your business' && (
                  <div className="form-grid">
                    <div className={`${cls('brandName')} form-grid__full`}>
                      <label className="field__label" htmlFor="brandName">Brand name <span className="field__req">(required)</span></label>
                      <input className="input" id="brandName" name="brandName" value={values.brandName}
                             onChange={(e) => set('brandName', e.target.value)} />
                      {err('brandName')}
                    </div>
                    <div className="field form-grid__full">
                      <label className="field__label" htmlFor="storeUrl">
                        {selling ? 'Storefront or website URL' : 'Website'}
                      </label>
                      <input className="input" id="storeUrl" name="storeUrl" value={values.storeUrl}
                             onChange={(e) => set('storeUrl', e.target.value)} placeholder="https://" />
                    </div>
                    {selling ? (
                      <fieldset className="field form-grid__full">
                        <legend className="field__label">Which markets</legend>
                        <div className="choice-row">
                          {MARKETS.map((m) => (
                            <label className="choice" key={m}>
                              <input type="checkbox" checked={values.marketplaces.includes(m)}
                                     onChange={(e) => set('marketplaces', e.target.checked
                                       ? [...values.marketplaces, m]
                                       : values.marketplaces.filter((x) => x !== m))} />
                              <span>{m}</span>
                            </label>
                          ))}
                        </div>
                      </fieldset>
                    ) : (
                      <div className="field form-grid__full">
                        <label className="field__label" htmlFor="productCategory">Product category</label>
                        <input className="input" id="productCategory" name="productCategory"
                               value={values.productCategory} onChange={(e) => set('productCategory', e.target.value)} />
                      </div>
                    )}
                  </div>
                )}

                {steps[step] === 'Your account' && (
                  <div className="form-grid">
                    <div className={cls('monthlyRevenueBand')}>
                      <label className="field__label" htmlFor="monthlyRevenueBand">Monthly Amazon revenue</label>
                      <select className="select" id="monthlyRevenueBand" name="monthlyRevenueBand"
                              value={values.monthlyRevenueBand} onChange={(e) => set('monthlyRevenueBand', e.target.value)}>
                        <option value="">Select a range</option>
                        {REVENUE.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                      {err('monthlyRevenueBand')}
                    </div>
                    <div className={cls('skuCountBand')}>
                      <label className="field__label" htmlFor="skuCountBand">Approximate SKU count</label>
                      <select className="select" id="skuCountBand" name="skuCountBand"
                              value={values.skuCountBand} onChange={(e) => set('skuCountBand', e.target.value)}>
                        <option value="">Select a range</option>
                        {SKUS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {err('skuCountBand')}
                    </div>
                    <fieldset className={`${cls('platform')} form-grid__full`}>
                      <legend className="field__label">Current setup</legend>
                      <div className="choice-row choice-row--wrap">
                        {PLATFORMS.map(([v, l]) => (
                          <label className="choice" key={v}>
                            <input type="radio" name="platform" value={v} checked={values.platform === v}
                                   onChange={() => set('platform', v)} />
                            <span>{l}</span>
                          </label>
                        ))}
                      </div>
                      {err('platform')}
                    </fieldset>
                  </div>
                )}

                {steps[step] === 'Where you are' && (
                  <fieldset className={cls('stage')}>
                    <legend className="field__label">Where are you right now?</legend>
                    <div className="wizard__choices">
                      {STAGE.map((s) => (
                        <label className={`wizard__big-choice${values.stage === s ? ' is-selected' : ''}`} key={s}>
                          <input type="radio" name="stage" value={s} checked={values.stage === s}
                                 onChange={() => set('stage', s)} />
                          <span>{s}</span>
                        </label>
                      ))}
                    </div>
                    {err('stage')}
                  </fieldset>
                )}

                {steps[step] === 'Goals & concerns' && (
                  <div className="form-grid">
                    <div className="field form-grid__full">
                      <label className="field__label" htmlFor="primaryGoal">Goals</label>
                      <input className="input" id="primaryGoal" name="primaryGoal" value={values.primaryGoal}
                             onChange={(e) => set('primaryGoal', e.target.value)}
                             placeholder="e.g. grow revenue without growing ad spend" />
                    </div>
                    <div className="field form-grid__full">
                      <label className="field__label" htmlFor="message">Concerns</label>
                      <textarea className="textarea" id="message" name="message" rows={3} value={values.message}
                                onChange={(e) => set('message', e.target.value)}
                                placeholder="What would you like to fix first?" />
                    </div>
                    <div className="field form-grid__full">
                      <label className="field__label" htmlFor="platformIssues">Issues with Amazon &amp; Walmart</label>
                      <textarea className="textarea" id="platformIssues" name="platformIssues" rows={3}
                                value={values.platformIssues} onChange={(e) => set('platformIssues', e.target.value)} />
                    </div>
                  </div>
                )}

                {steps[step] === 'You' && (
                  <div className="form-grid">
                    <div className={cls('firstName')}>
                      <label className="field__label" htmlFor="firstName">First name <span className="field__req">(required)</span></label>
                      <input className="input" id="firstName" name="firstName" value={values.firstName}
                             onChange={(e) => set('firstName', e.target.value)} autoComplete="given-name" />
                      {err('firstName')}
                    </div>
                    <div className={cls('lastName')}>
                      <label className="field__label" htmlFor="lastName">Last name <span className="field__req">(required)</span></label>
                      <input className="input" id="lastName" name="lastName" value={values.lastName}
                             onChange={(e) => set('lastName', e.target.value)} autoComplete="family-name" />
                      {err('lastName')}
                    </div>
                    <div className={`${cls('email')} form-grid__full`}>
                      <label className="field__label" htmlFor="email">Work email <span className="field__req">(required)</span></label>
                      <input className="input" id="email" name="email" type="email" value={values.email}
                             onChange={(e) => set('email', e.target.value)} autoComplete="email" />
                      {err('email')}
                    </div>
                    <div className="field form-grid__full">
                      <label className="field__label" htmlFor="phone">Phone <span className="optional">(optional)</span></label>
                      <input className="input" id="phone" name="phone" type="tel" value={values.phone}
                             onChange={(e) => set('phone', e.target.value)} autoComplete="tel" />
                    </div>
                    <div className={`${cls('consent')} form-grid__full`}>
                      <label className="choice">
                        <input type="checkbox" name="consent" checked={values.consent}
                               onChange={(e) => set('consent', e.target.checked)} />
                        <span>I agree to BLAZON storing my details to respond to this request, as described in the{' '}
                          <a className="link link--inline" href="/privacy">privacy policy</a>.</span>
                      </label>
                      {err('consent')}
                    </div>
                    <div className="visually-hidden" aria-hidden="true">
                      <label htmlFor="hp">Company website</label>
                      <input id="hp" name="hp" tabIndex={-1} autoComplete="off"
                             value={values.hp} onChange={(e) => set('hp', e.target.value)} />
                    </div>
                  </div>
                )}

                {status === 'error' && banner && <p className="form-alert"><AlertIcon />{banner}</p>}

                <div className="wizard__nav">
                  {step > 0 && (
                    <button className="btn btn--secondary" type="button" onClick={() => setStep(step - 1)}>Back</button>
                  )}
                  <button className="btn" type="button" onClick={next} disabled={status === 'sending'}>
                    {status === 'sending'
                      ? <><span className="btn__spinner" aria-hidden="true" /><span>Sending…</span></>
                      : step === steps.length - 1
                        ? <>Request my free {selling ? 'audit' : 'session'}<ArrowRight /></>
                        : <>Continue<ArrowRight /></>}
                  </button>
                </div>
              </div>
            </div>

            <aside className="wizard__value">
              <Card as="div" interactive className="wizard__value-inner">
                <p className="eyebrow">
                  {values.sellingStatus === 'not_yet_selling' ? 'Your free session covers' : 'Your free audit covers'}
                </p>
                <ul className="checklist">
                  {(values.sellingStatus === 'not_yet_selling' ? TRAINING_VALUE : AUDIT_VALUE).map((v) => (
                    <li key={v}><span className="body-s">{v}</span></li>
                  ))}
                </ul>
                <p className="caption wizard__value-note">
                  60 minutes · no commitment · you keep the findings either way
                </p>
                <p className="caption">
                  Prefer to talk? <a className="link link--inline" href={site.phoneHref}>{site.phone}</a>
                </p>
              </Card>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
