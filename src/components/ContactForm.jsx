import { useEffect, useId, useRef, useState } from 'react';

const ENDPOINT = 'https://api.web3forms.com/submit';
const ACCESS_KEY = (import.meta.env.VITE_WEB3FORMS_KEY ?? '').trim();
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const FIELD_ORDER = ['name', 'email', 'message'];
const MIN_MESSAGE = 10;
const MAX_MESSAGE = 2000;
const COOLDOWN_MS = 30000;

const EMPTY = { name: '', email: '', message: '' };

const STATUS_TEXT = {
  idle: '',
  sending: 'transmitting message…',
  success: 'delivered. I will reply at the address you left.',
  error: 'transmission failed — try again in a moment.'
};

function validate(values) {
  const errors = {};

  if (values.name.trim().length < 2) {
    errors.name = 'at least 2 characters';
  }

  if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'a valid email address';
  }

  const message = values.message.trim();
  if (message.length < MIN_MESSAGE) {
    errors.message = `at least ${MIN_MESSAGE} characters`;
  } else if (message.length > MAX_MESSAGE) {
    errors.message = `under ${MAX_MESSAGE} characters`;
  }

  return errors;
}

export default function ContactForm({ email }) {
  const uid = useId();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [locked, setLocked] = useState(false);
  const [trap, setTrap] = useState('');
  const inputs = useRef({});
  const timerRef = useRef(null);

  const configured = ACCESS_KEY.length > 0;
  const sending = status === 'sending';

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const handleChange = (field) => (event) => {
    const { value } = event.target;
    setValues((current) => ({ ...current, [field]: value }));

    if (errors[field]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!configured || sending || locked) return;

    // A hidden field only a bot fills in: pretend it worked and send nothing.
    if (trap) {
      setValues(EMPTY);
      setStatus('success');
      return;
    }

    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus('idle');
      const firstInvalid = FIELD_ORDER.find((field) => nextErrors[field]);
      inputs.current[firstInvalid]?.focus();
      return;
    }

    setStatus('sending');

    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: `Portfolio contact — ${values.name.trim()}`,
          from_name: 'zeeshaan portfolio',
          replyto: values.email.trim(),
          name: values.name.trim(),
          email: values.email.trim(),
          message: values.message.trim(),
          botcheck: false
        })
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok || payload.success === false) {
        throw new Error(payload.message || 'request rejected');
      }

      setValues(EMPTY);
      setErrors({});
      setStatus('success');
      setLocked(true);
      timerRef.current = window.setTimeout(() => setLocked(false), COOLDOWN_MS);
    } catch {
      setStatus('error');
    }
  };

  const buttonLabel = sending ? 'sending…' : locked ? 'sent' : 'send message';

  const field = (name, label, extra = {}) => {
    const id = `${uid}-${name}`;
    const errorId = `${id}-error`;
    const error = errors[name];

    return (
      <div className={`form-field${error ? ' has-error' : ''}`}>
        <label className="form-label" htmlFor={id}>
          <span aria-hidden="true">&gt;</span> {label}
        </label>
        <input
          id={id}
          ref={(node) => {
            inputs.current[name] = node;
          }}
          className="form-input"
          name={name}
          type={extra.type ?? 'text'}
          autoComplete={extra.autoComplete}
          value={values[name]}
          onChange={handleChange(name)}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? errorId : undefined}
          disabled={sending}
        />
        {error ? (
          <p className="form-error" id={errorId}>
            {error}
          </p>
        ) : null}
      </div>
    );
  };

  return (
    <div className="contact-form-block">
      <p className="form-intro">
        <span aria-hidden="true">//</span> messages arrive straight in my inbox — no account needed.
      </p>

      {configured ? null : (
        <p className="form-notice">
          <span aria-hidden="true">[ config missing ]</span> the form endpoint is not set. Email{' '}
          <a href={`mailto:${email}`}>{email}</a> instead.
        </p>
      )}

      <form className="contact-form" onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          {field('name', 'name', { autoComplete: 'name' })}
          {field('email', 'email', { type: 'email', autoComplete: 'email' })}
        </div>

        <div className={`form-field${errors.message ? ' has-error' : ''}`}>
          <label className="form-label" htmlFor={`${uid}-message`}>
            <span aria-hidden="true">&gt;</span> message
          </label>
          <textarea
            id={`${uid}-message`}
            ref={(node) => {
              inputs.current.message = node;
            }}
            className="form-input form-textarea"
            name="message"
            rows={5}
            value={values.message}
            onChange={handleChange('message')}
            aria-invalid={errors.message ? 'true' : undefined}
            aria-describedby={errors.message ? `${uid}-message-error` : undefined}
            disabled={sending}
          />
          {errors.message ? (
            <p className="form-error" id={`${uid}-message-error`}>
              {errors.message}
            </p>
          ) : null}
        </div>

        <div className="form-trap" aria-hidden="true">
          <label htmlFor={`${uid}-company`}>company</label>
          <input
            id={`${uid}-company`}
            name="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={trap}
            onChange={(event) => setTrap(event.target.value)}
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="form-submit"
            disabled={!configured || sending || locked}
          >
            <span className="form-submit-prompt" aria-hidden="true">
              $
            </span>
            {buttonLabel}
          </button>

          <p className="form-status" role="status" aria-live="polite" data-state={status}>
            {STATUS_TEXT[status]}
          </p>
        </div>
      </form>
    </div>
  );
}
