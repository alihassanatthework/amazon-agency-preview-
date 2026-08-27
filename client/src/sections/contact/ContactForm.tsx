import { useRef, useState } from 'react';
import { Reveal, RevealGroup } from '../../motion';
import { site } from '../../data/site';
import { AlertIcon, ArrowRight, Check } from '../../components/ui/Icon';
import {
  ASIN_OPTIONS,
  MARKET_OPTIONS,
  REVENUE_OPTIONS,
  SETUP_OPTIONS,
  emptyForm,
  validateAll,
  validateField,
  type Errors,
  type FormValues,
} from './formSchema';

type Status = 'idle' | 'submitting' | 'success' | 'error';

/**
 * C2 — Form and contact details. The core of the page.
 *
 * Two grouped steps within a single page, not a wizard. Validation runs on
 * blur rather than on keystroke, errors are announced through a live region,
 * focus moves to the first invalid field, and the confirmation replaces the
 * form in place with no navigation and no layout jump.
 */
export function ContactForm() {
  const [values, setValues] = useState<FormValues>(emptyForm);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormValues, boolean>>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  const formRef = useRef<HTMLFormElement>(null);
  const confirmRef = useRef<HTMLDivElement>(null);

  const set = <K extends keyof FormValues>(name: K, value: FormValues[K]) => {
    setValues((v) => ({ ...v, [name]: value }));
    // Clear an existing error as soon as the user acts on it, but never
    // introduce a new one mid-typing.
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }));
  };

  const blur = (name: keyof FormValues) => {
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors((e) => ({ ...e, [name]: validateField(name, values) }));
  };

  const fieldProps = (name: keyof FormValues) => ({
    id: name,
    name,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
    onBlur: () => blur(name),
  });

  const fieldClass = (name: keyof FormValues) =>
    [
      'field',
      errors[name] ? 'field--error' : '',
      touched[name] && !errors[name] ? 'field--valid' : '',
    ]
      .filter(Boolean)
      .join(' ');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'submitting') return; // duplicate-submit prevention

    const found = validateAll(values);
    setErrors(found);

    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      setStatus('error');
      setMessage(
        `${Object.keys(found).length} field${Object.keys(found).length > 1 ? 's need' : ' needs'} attention before this can be sent.`,
      );
      const el = formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`);
      el?.focus();
      return;
    }

    setStatus('submitting');
    setMessage('');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (data.fieldErrors) {
          setErrors(data.fieldErrors);
          const first = Object.keys(data.fieldErrors)[0];
          formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
        }
        setStatus('error');
        setMessage(
          data.message ??
            'We could not send that just now. Please try again, or email us and we will pick it up.',
        );
        return;
      }

      setStatus('success');
      // The confirmation is announced and receives focus.
      window.requestAnimationFrame(() => confirmRef.current?.focus());
    } catch {
      setStatus('error');
      setMessage(
        'We could not reach the server. Please try again, or email us and we will pick it up.',
      );
    }
  }

  /* --- Confirmation state — replaces the form in place -------------------- */
  if (status === 'success') {
    return (
      <div
        className="form-card form-card--confirm"
        ref={confirmRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
      >
        <span className="confirm__check" aria-hidden="true">
          <svg width="34" height="26" viewBox="0 0 34 26" fill="none">
            <path
              className="confirm__stroke"
              d="M2 13.5 12 23.5 32 2.5"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <h3 className="display-m">Request received.</h3>
        <p className="body">
          A named strategist is reviewing your account now. You will have a
          written audit back within {site.responseTime}, with no obligation
          attached to it.
        </p>
        <div className="confirm__links">
          <a className="link" href="#results">
            Read client case studies
            <ArrowRight />
          </a>
          <a className="link" href={`mailto:${site.email}`}>
            Email us directly
            <ArrowRight />
          </a>
        </div>
      </div>
    );
  }

  return (
    <Reveal className="form-card">
      <form ref={formRef} onSubmit={onSubmit} noValidate>
        {/* Errors are announced rather than only shown. */}
        <div className="visually-hidden" role="alert" aria-live="assertive">
          {status === 'error' ? message : ''}
        </div>

        <p className="caption form-card__required">
          Fields marked required must be completed.
        </p>

        {/* --- Group 1 ------------------------------------------------------ */}
        <fieldset className="form-group">
          <legend className="eyebrow form-group__legend">About you</legend>

          <RevealGroup className="form-grid" stagger={70}>
            <div className={fieldClass('firstName')}>
              <label className="field__label" htmlFor="firstName">
                First name <span className="field__req">(required)</span>
              </label>
              <div className="field__control">
                <input
                  className="input"
                  type="text"
                  autoComplete="given-name"
                  value={values.firstName}
                  onChange={(e) => set('firstName', e.target.value)}
                  {...fieldProps('firstName')}
                />
                <span className="field__check"><Check /></span>
              </div>
              <FieldError name="firstName" errors={errors} />
            </div>

            <div className={fieldClass('lastName')}>
              <label className="field__label" htmlFor="lastName">
                Last name <span className="field__req">(required)</span>
              </label>
              <div className="field__control">
                <input
                  className="input"
                  type="text"
                  autoComplete="family-name"
                  value={values.lastName}
                  onChange={(e) => set('lastName', e.target.value)}
                  {...fieldProps('lastName')}
                />
                <span className="field__check"><Check /></span>
              </div>
              <FieldError name="lastName" errors={errors} />
            </div>

            <div className={`${fieldClass('email')} form-grid__full`}>
              <label className="field__label" htmlFor="email">
                Work email <span className="field__req">(required)</span>
              </label>
              <div className="field__control">
                <input
                  className="input"
                  type="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={(e) => set('email', e.target.value)}
                  {...fieldProps('email')}
                />
                <span className="field__check"><Check /></span>
              </div>
              <FieldError name="email" errors={errors} />
            </div>

            <div className={fieldClass('company')}>
              <label className="field__label" htmlFor="company">
                Company <span className="field__req">(required)</span>
              </label>
              <div className="field__control">
                <input
                  className="input"
                  type="text"
                  autoComplete="organization"
                  value={values.company}
                  onChange={(e) => set('company', e.target.value)}
                  {...fieldProps('company')}
                />
                <span className="field__check"><Check /></span>
              </div>
              <FieldError name="company" errors={errors} />
            </div>

            <div className={fieldClass('phone')}>
              <label className="field__label" htmlFor="phone">
                Phone <span className="optional">(optional)</span>
              </label>
              <div className="field__control">
                <input
                  className="input"
                  type="tel"
                  autoComplete="tel"
                  value={values.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  {...fieldProps('phone')}
                />
              </div>
            </div>
          </RevealGroup>
        </fieldset>

        {/* --- Group 2 ------------------------------------------------------ */}
        <fieldset className="form-group">
          <legend className="eyebrow form-group__legend">About your Amazon account</legend>

          <RevealGroup className="form-grid" stagger={70}>
            <div className={`${fieldClass('brand')} form-grid__full`}>
              <label className="field__label" htmlFor="brand">
                Brand or storefront name <span className="field__req">(required)</span>
              </label>
              <div className="field__control">
                <input
                  className="input"
                  type="text"
                  value={values.brand}
                  onChange={(e) => set('brand', e.target.value)}
                  {...fieldProps('brand')}
                />
                <span className="field__check"><Check /></span>
              </div>
              <FieldError name="brand" errors={errors} />
            </div>

            <div className={fieldClass('revenue')}>
              <label className="field__label" htmlFor="revenue">
                Monthly Amazon revenue <span className="field__req">(required)</span>
              </label>
              <div className="field__control">
                <select
                  className="select"
                  value={values.revenue}
                  onChange={(e) => set('revenue', e.target.value)}
                  {...fieldProps('revenue')}
                >
                  <option value="">Select a range</option>
                  {REVENUE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <FieldError name="revenue" errors={errors} />
            </div>

            <div className={fieldClass('asinCount')}>
              <label className="field__label" htmlFor="asinCount">
                Approximate ASIN count <span className="field__req">(required)</span>
              </label>
              <div className="field__control">
                <select
                  className="select"
                  value={values.asinCount}
                  onChange={(e) => set('asinCount', e.target.value)}
                  {...fieldProps('asinCount')}
                >
                  <option value="">Select a range</option>
                  {ASIN_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <FieldError name="asinCount" errors={errors} />
            </div>

            <fieldset
              className={`${fieldClass('markets')} form-grid__full form-subgroup`}
              aria-describedby={errors.markets ? 'markets-error' : undefined}
            >
              <legend className="field__label">
                Which markets <span className="field__req">(required)</span>
              </legend>
              <div className="choice-row">
                {MARKET_OPTIONS.map((m) => (
                  <label className="choice" key={m}>
                    <input
                      type="checkbox"
                      name="markets"
                      value={m}
                      checked={values.markets.includes(m)}
                      onChange={(e) =>
                        set(
                          'markets',
                          e.target.checked
                            ? [...values.markets, m]
                            : values.markets.filter((x) => x !== m),
                        )
                      }
                      onBlur={() => blur('markets')}
                    />
                    <span>{m === 'other' ? 'Other' : m}</span>
                  </label>
                ))}
              </div>
              <FieldError name="markets" errors={errors} />
            </fieldset>

            <fieldset
              className={`${fieldClass('setup')} form-grid__full form-subgroup`}
              aria-describedby={errors.setup ? 'setup-error' : undefined}
            >
              <legend className="field__label">
                Current setup <span className="field__req">(required)</span>
              </legend>
              <div className="choice-row choice-row--wrap">
                {SETUP_OPTIONS.map((o) => (
                  <label className="choice" key={o.value}>
                    <input
                      type="radio"
                      name="setup"
                      value={o.value}
                      checked={values.setup === o.value}
                      onChange={() => set('setup', o.value)}
                      onBlur={() => blur('setup')}
                    />
                    <span>{o.label}</span>
                  </label>
                ))}
              </div>
              <FieldError name="setup" errors={errors} />
            </fieldset>

            <div className={`${fieldClass('goal')} form-grid__full`}>
              <label className="field__label" htmlFor="goal">
                What would you like to fix first? <span className="optional">(optional)</span>
              </label>
              <div className="field__control">
                <textarea
                  className="textarea"
                  rows={4}
                  value={values.goal}
                  onChange={(e) => set('goal', e.target.value)}
                  {...fieldProps('goal')}
                />
              </div>
            </div>

            <div className={`${fieldClass('consent')} form-grid__full`}>
              <label className="choice">
                <input
                  type="checkbox"
                  name="consent"
                  checked={values.consent}
                  onChange={(e) => set('consent', e.target.checked)}
                  onBlur={() => blur('consent')}
                  aria-invalid={errors.consent ? true : undefined}
                  aria-describedby={errors.consent ? 'consent-error' : undefined}
                />
                <span>
                  I agree to Northbeam storing my details to respond to this
                  request, as described in the <a className="link" href="#privacy">privacy policy</a>.
                </span>
              </label>
              <FieldError name="consent" errors={errors} />
            </div>
          </RevealGroup>
        </fieldset>

        {status === 'error' && message ? (
          <p className="form-card__alert">
            <AlertIcon />
            {message}
          </p>
        ) : null}

        <button
          className="btn btn--block form-card__submit"
          type="submit"
          disabled={status === 'submitting'}
        >
          {status === 'submitting' ? (
            <>
              <span className="spinner" aria-hidden="true" />
              <span className="visually-hidden">Sending your request</span>
              <span aria-hidden="true">Sending…</span>
            </>
          ) : (
            <>
              Request my free audit
              <ArrowRight />
            </>
          )}
        </button>

        <p className="caption form-card__note">
          We reply within {site.responseTime}. No commitment, and no sales
          sequence if you decide not to continue.
        </p>
      </form>
    </Reveal>
  );
}

function FieldError({ name, errors }: { name: keyof FormValues; errors: Errors }) {
  if (!errors[name]) return null;
  return (
    <p className="field__error" id={`${name}-error`}>
      <AlertIcon />
      {errors[name]}
    </p>
  );
}
