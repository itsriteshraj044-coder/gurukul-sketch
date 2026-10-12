import { useEffect, useId, useMemo, useRef, useState, type ChangeEvent, type DragEvent, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  ImagePlus,
  Info,
  Loader2,
  Pencil,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import { sketchStyles, finishOptions } from '../data/sketchStyles';
import { useSessionDraft } from '../hooks/useSessionDraft';
import { enquiryMode, enquiryWhatsappUrl, formatEnquiryText, submitEnquiry, type EnquiryPayload } from '../services/enquiry';
import { formatBytes, isEmail, isPhone, validateImage, MAX_UPLOAD_MB } from '../utils/validation';
import { WhatsAppGlyph } from './WhatsAppButton';
import { ease } from '../utils/motion';

type Draft = {
  style: string;
  people: string;
  finish: string;
  occasion: string;
  name: string;
  email: string;
  phone: string;
  details: string;
  step: number;
};

const EMPTY: Draft = { style: '', people: '1', finish: '', occasion: '', name: '', email: '', phone: '', details: '', step: 0 };

const STEPS = [
  { title: 'Select artwork', hint: 'Style, people and finish' },
  { title: 'Your request', hint: 'Who you are, what you need' },
  { title: 'Reference photo', hint: 'Optional, but helpful' },
  { title: 'Review & send', hint: 'Check everything once' },
] as const;

type Errors = Partial<Record<keyof Draft | 'file', string>>;
type Phase = 'editing' | 'submitting' | 'sent' | 'handoff';

function validateStep(step: number, d: Draft): Errors {
  const e: Errors = {};
  if (step === 0) {
    if (!d.style) e.style = 'Please choose the kind of artwork you would like.';
    if (!d.finish) e.finish = 'Please choose a finish, or “Not sure yet”.';
  }
  if (step === 1) {
    if (d.name.trim().length < 2) e.name = 'Please tell us your name.';
    if (!d.phone.trim()) e.phone = 'Please add a phone or WhatsApp number so we can reach you.';
    else if (!isPhone(d.phone)) e.phone = 'That number doesn’t look right. Include the country code, e.g. +91 98765 43210.';
    if (d.email.trim() && !isEmail(d.email)) e.email = 'That email address doesn’t look right.';
  }
  return e;
}

/**
 * Four-step custom sketch consultation. Submission goes through
 * services/enquiry.ts: a real POST when an endpoint is configured, otherwise
 * an explicit WhatsApp hand-off. Success is only shown after a 2xx response.
 */
export function EnquiryForm({ preset }: { preset?: { style: string; nonce: number } }) {
  const uid = useId();
  const [draft, setDraft, clearDraft] = useSessionDraft<Draft>('gs-enquiry-draft', EMPTY);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [phase, setPhase] = useState<Phase>('editing');
  const [submitError, setSubmitError] = useState('');
  const [copied, setCopied] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [direction, setDirection] = useState(1);
  const panelRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const step = draft.step;
  const selectedStyle = sketchStyles.find((s) => s.id === draft.style);

  // A style picked from the cards above the form.
  useEffect(() => {
    if (!preset?.style) return;
    setDraft((d) => ({ ...d, style: preset.style, step: 0 }));
    setErrors({});
    setPhase('editing');
  }, [preset?.style, preset?.nonce, setDraft]);

  // Object URL for the preview, revoked when replaced or unmounted.
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const update = (key: keyof Draft) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.value;
    setDraft((d) => ({ ...d, [key]: value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const goTo = (next: number, keepErrors: Errors = {}) => {
    setDirection(next > step ? 1 : -1);
    setDraft((d) => ({ ...d, step: next }));
    setErrors(keepErrors);
    window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>('[data-step-focus]')?.focus({ preventScroll: true });
    }, 420);
  };

  const next = () => {
    const e = validateStep(step, draft);
    setErrors(e);
    if (Object.keys(e).length) {
      window.setTimeout(() => summaryRef.current?.focus(), 30);
      return;
    }
    goTo(Math.min(step + 1, STEPS.length - 1));
  };

  const pickFile = (f: File | undefined | null) => {
    if (!f) return;
    const problem = validateImage(f);
    if (problem) {
      setErrors((er) => ({ ...er, file: problem }));
      return;
    }
    setErrors((er) => ({ ...er, file: undefined }));
    setFile(f);
  };

  const removeFile = () => {
    setFile(null);
    if (fileInput.current) fileInput.current.value = '';
  };

  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragOver(false);
    pickFile(e.dataTransfer.files?.[0]);
  };

  const payload: EnquiryPayload = useMemo(
    () => ({
      kind: 'custom-sketch',
      file,
      fields: [
        { label: 'Artwork', name: 'style', value: selectedStyle?.title ?? draft.style },
        ...(selectedStyle?.asksPeopleCount ? [{ label: 'Number of people', name: 'people', value: draft.people }] : []),
        { label: 'Finish', name: 'finish', value: draft.finish },
        { label: 'Occasion', name: 'occasion', value: draft.occasion },
        { label: 'Name', name: 'name', value: draft.name },
        { label: 'Phone / WhatsApp', name: 'phone', value: draft.phone },
        { label: 'Email', name: 'email', value: draft.email },
        { label: 'Details', name: 'details', value: draft.details },
      ],
    }),
    [draft, file, selectedStyle],
  );

  const allErrors = (): Errors => ({ ...validateStep(0, draft), ...validateStep(1, draft) });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (step !== 3 || phase === 'submitting') return;
    const problems = allErrors();
    if (Object.keys(problems).length) {
      goTo(problems.style || problems.finish ? 0 : 1, problems);
      return;
    }
    if (enquiryMode !== 'api') return; // WhatsApp mode uses the link below instead
    setPhase('submitting');
    setSubmitError('');
    const result = await submitEnquiry(payload);
    if (result.status === 'sent') {
      setPhase('sent');
      clearDraft();
      removeFile();
    } else {
      setPhase('editing');
      setSubmitError(result.message);
    }
  };

  const copyDetails = async () => {
    try {
      await navigator.clipboard.writeText(formatEnquiryText(payload));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  const restart = () => {
    clearDraft();
    removeFile();
    setErrors({});
    setPhase('editing');
    setSubmitError('');
  };

  const errorList = Object.entries(errors).filter(([, v]) => v) as [string, string][];
  const fieldProps = (key: keyof Draft) => ({
    id: `${uid}-${key}`,
    'aria-invalid': errors[key] ? true : undefined,
    'aria-describedby': errors[key] ? `${uid}-${key}-err` : undefined,
  });
  const fieldError = (k: keyof Draft | 'file') =>
    errors[k] ? (
      <p className="field-error" id={`${uid}-${k}-err`}>
        <AlertCircle size={15} aria-hidden /> {errors[k]}
      </p>
    ) : null;

  /* ---------- Final states ---------- */
  if (phase === 'sent') {
    return (
      <motion.div className="enq-final" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} role="status">
        <CheckCircle2 size={44} className="enq-final-icon" aria-hidden />
        <h3 className="h3">Thank you, your enquiry has been received.</h3>
        <p className="muted">We will be in touch using the contact details you shared to talk through your artwork.</p>
        <button type="button" className="btn btn--ghost" onClick={restart}>
          <RotateCcw size={16} aria-hidden /> Start another enquiry
        </button>
      </motion.div>
    );
  }

  if (phase === 'handoff') {
    return (
      <motion.div className="enq-final" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} role="status">
        <span className="enq-final-wa" aria-hidden><WhatsAppGlyph /></span>
        <h3 className="h3">Almost there: finish in WhatsApp</h3>
        <p className="muted">
          WhatsApp should have opened with your details filled in. <strong>Nothing has been sent yet:</strong> press send
          in WhatsApp to share your enquiry{file ? ', and attach your reference photo in the chat' : ''}.
        </p>
        <div className="btn-row">
          <a className="btn btn--whatsapp" href={enquiryWhatsappUrl(payload)} target="_blank" rel="noopener noreferrer">
            <WhatsAppGlyph /> Open WhatsApp again
          </a>
          <button type="button" className="btn btn--ghost" onClick={copyDetails}>
            {copied ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />} {copied ? 'Copied' : 'Copy details'}
          </button>
        </div>
        <div className="enq-final-links">
          <button type="button" className="text-link" onClick={() => setPhase('editing')}>
            <Pencil size={14} aria-hidden /> Back to my details
          </button>
          <button type="button" className="text-link" onClick={restart}>
            <RotateCcw size={14} aria-hidden /> Start a new enquiry
          </button>
        </div>
      </motion.div>
    );
  }

  /* ---------- Steps ---------- */
  return (
    <form className="enq" onSubmit={onSubmit} noValidate aria-labelledby={`${uid}-title`}>
      <aside className="enq-side">
        <h3 className="enq-side-title" id={`${uid}-title`}>Your sketch consultation</h3>
        <ol className="enq-steps">
          {STEPS.map((s, i) => (
            <li key={s.title} className={`enq-step ${i === step ? 'is-current' : ''} ${i < step ? 'is-done' : ''}`} aria-current={i === step ? 'step' : undefined}>
              <span className="enq-step-dot">{i < step ? <Check size={14} aria-hidden /> : i + 1}</span>
              <span>
                <span className="enq-step-title">{s.title}</span>
                <span className="enq-step-hint">{s.hint}</span>
              </span>
            </li>
          ))}
        </ol>
        <div className="enq-progress" aria-hidden>
          <motion.span animate={{ scaleX: (step + 1) / STEPS.length }} transition={{ duration: 0.6, ease: ease.out }} />
        </div>
        {selectedStyle && (
          <div className="enq-chosen">
            {selectedStyle.image ? (
              <img src={selectedStyle.image} alt="" width={120} height={150} loading="lazy" />
            ) : (
              <span className="enq-chosen-tile" aria-hidden style={{ background: selectedStyle.accent }}>
                {selectedStyle.title.charAt(0)}
              </span>
            )}
            <div>
              <span className="tag" style={{ color: selectedStyle.accent }}>
                <span className="tag-dot" /> Chosen
              </span>
              <p>{selectedStyle.title}</p>
            </div>
          </div>
        )}
      </aside>

      <div className="enq-main" ref={panelRef}>
        <p className="sr-only" aria-live="polite">
          Step {step + 1} of {STEPS.length}: {STEPS[step].title}
        </p>

        {errorList.length > 0 && (
          <div className="enq-errors" role="alert" tabIndex={-1} ref={summaryRef}>
            <AlertCircle size={18} aria-hidden />
            <div>
              <strong>Please check {errorList.length === 1 ? 'one thing' : `${errorList.length} things`}:</strong>
              <ul>
                {errorList.map(([k, v]) => (
                  <li key={k}>
                    <a href={`#${uid}-${k}`}>{v}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={step}
            className="enq-panel"
            custom={direction}
            variants={{
              enter: (d: number) => ({ opacity: 0, x: d * 36 }),
              center: { opacity: 1, x: 0 },
              exit: (d: number) => ({ opacity: 0, x: d * -36 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: ease.out }}
          >
            {step === 0 && (
              <>
                <h4 className="enq-h" tabIndex={-1} data-step-focus>What would you like us to create?</h4>
                <fieldset className="enq-fieldset">
                  <legend className="field-label">Sketch category</legend>
                  <div className="style-options" id={`${uid}-style`}>
                    {sketchStyles.map((s) => (
                      <label key={s.id} className={`style-option ${draft.style === s.id ? 'is-checked' : ''}`} style={{ ['--accent' as string]: s.accent }}>
                        <input
                          type="radio"
                          name="style"
                          value={s.id}
                          checked={draft.style === s.id}
                          onChange={update('style')}
                          aria-describedby={errors.style ? `${uid}-style-err` : undefined}
                        />
                        <span className="style-option-mark" aria-hidden />
                        <span className="style-option-title">{s.title}</span>
                      </label>
                    ))}
                  </div>
                  {fieldError('style')}
                </fieldset>

                <div className="enq-row">
                  {selectedStyle?.asksPeopleCount && (
                    <div className="field">
                      <label className="field-label" htmlFor={`${uid}-people`}>Number of people</label>
                      <select className="input" {...fieldProps('people')} value={draft.people} onChange={update('people')}>
                        {['1', '2', '3', '4', '5', '6', '7', '8', 'More than 8'].map((n) => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="field">
                    <label className="field-label" htmlFor={`${uid}-occasion`}>
                      Occasion <span className="opt">(optional)</span>
                    </label>
                    <input className="input" {...fieldProps('occasion')} value={draft.occasion} onChange={update('occasion')} placeholder="e.g. anniversary, birthday, new home" />
                  </div>
                </div>

                <fieldset className="enq-fieldset">
                  <legend className="field-label">Preferred style</legend>
                  <div className="pill-options" id={`${uid}-finish`}>
                    {finishOptions.map((f) => (
                      <label key={f} className={`pill-option ${draft.finish === f ? 'is-checked' : ''}`}>
                        <input
                          type="radio"
                          name="finish"
                          value={f}
                          checked={draft.finish === f}
                          onChange={update('finish')}
                          aria-describedby={errors.finish ? `${uid}-finish-err` : undefined}
                        />
                        {f}
                      </label>
                    ))}
                  </div>
                  {fieldError('finish')}
                </fieldset>
              </>
            )}

            {step === 1 && (
              <>
                <h4 className="enq-h" tabIndex={-1} data-step-focus>Tell us about your request</h4>
                <div className="enq-row">
                  <div className="field">
                    <label className="field-label" htmlFor={`${uid}-name`}>Your name</label>
                    <input className="input" {...fieldProps('name')} value={draft.name} onChange={update('name')} autoComplete="name" required />
                    {fieldError('name')}
                  </div>
                  <div className="field">
                    <label className="field-label" htmlFor={`${uid}-phone`}>Phone / WhatsApp</label>
                    <input className="input" type="tel" inputMode="tel" {...fieldProps('phone')} value={draft.phone} onChange={update('phone')} autoComplete="tel" placeholder="+91 98765 43210" required />
                    {fieldError('phone')}
                  </div>
                </div>
                <div className="field">
                  <label className="field-label" htmlFor={`${uid}-email`}>
                    Email <span className="opt">(optional)</span>
                  </label>
                  <input className="input" type="email" inputMode="email" {...fieldProps('email')} value={draft.email} onChange={update('email')} autoComplete="email" />
                  {fieldError('email')}
                </div>
                <div className="field">
                  <label className="field-label" htmlFor={`${uid}-details`}>
                    Additional requirements <span className="opt">(optional)</span>
                  </label>
                  <textarea
                    className="input"
                    {...fieldProps('details')}
                    value={draft.details}
                    onChange={update('details')}
                    maxLength={1500}
                    placeholder="Size, where it will hang, a date you have in mind, details to include or leave out…"
                  />
                  <span className="field-hint">{draft.details.length} / 1500</span>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h4 className="enq-h" tabIndex={-1} data-step-focus>Add a reference photo</h4>
                <p className="muted enq-p">
                  A clear, well-lit photo helps the most. You can also skip this and share photos later.
                </p>
                <input
                  ref={fileInput}
                  id={`${uid}-file`}
                  className="sr-only file-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => pickFile(e.target.files?.[0])}
                  aria-describedby={errors.file ? `${uid}-file-err` : undefined}
                />
                {!file ? (
                  <label
                    className={`dropzone ${dragOver ? 'is-over' : ''}`}
                    htmlFor={`${uid}-file`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={onDrop}
                  >
                    <ImagePlus size={30} aria-hidden />
                    <span className="dropzone-title">Choose a photo or drop it here</span>
                    <span className="field-hint">JPG, PNG, WEBP or HEIC · up to {MAX_UPLOAD_MB} MB</span>
                  </label>
                ) : (
                  <div className="file-card">
                    {preview && <img src={preview} alt="Preview of your selected reference photo" />}
                    <div className="file-card-meta">
                      <p className="file-card-name">{file.name}</p>
                      <p className="field-hint">{formatBytes(file.size)}</p>
                      <div className="btn-row">
                        <button type="button" className="btn btn--ghost btn--small" onClick={() => fileInput.current?.click()}>
                          <ImagePlus size={15} aria-hidden /> Replace
                        </button>
                        <button type="button" className="btn btn--ghost btn--small" onClick={removeFile}>
                          <Trash2 size={15} aria-hidden /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {fieldError('file')}
                <p className="enq-privacy">
                  <Info size={14} aria-hidden />
                  {enquiryMode === 'api'
                    ? 'Your photo is sent only with your enquiry and used only to create your artwork.'
                    : 'Your photo stays on your device. You will attach it yourself in WhatsApp.'}
                </p>
              </>
            )}

            {step === 3 && (
              <>
                <h4 className="enq-h" tabIndex={-1} data-step-focus>Review your enquiry</h4>
                <dl className="review">
                  <div className="review-group">
                    <div className="review-head">
                      <span>Artwork</span>
                      <button type="button" className="text-link" onClick={() => goTo(0)}>
                        <Pencil size={13} aria-hidden /> Edit
                      </button>
                    </div>
                    <dt>Category</dt><dd>{selectedStyle?.title ?? '—'}</dd>
                    {selectedStyle?.asksPeopleCount && (<><dt>People</dt><dd>{draft.people}</dd></>)}
                    <dt>Style</dt><dd>{draft.finish || '—'}</dd>
                    <dt>Occasion</dt><dd>{draft.occasion || '—'}</dd>
                  </div>
                  <div className="review-group">
                    <div className="review-head">
                      <span>Your details</span>
                      <button type="button" className="text-link" onClick={() => goTo(1)}>
                        <Pencil size={13} aria-hidden /> Edit
                      </button>
                    </div>
                    <dt>Name</dt><dd>{draft.name || '—'}</dd>
                    <dt>Phone</dt><dd>{draft.phone || '—'}</dd>
                    <dt>Email</dt><dd>{draft.email || '—'}</dd>
                    <dt>Requirements</dt><dd className="review-long">{draft.details || '—'}</dd>
                  </div>
                  <div className="review-group">
                    <div className="review-head">
                      <span>Reference photo</span>
                      <button type="button" className="text-link" onClick={() => goTo(2)}>
                        <Pencil size={13} aria-hidden /> Edit
                      </button>
                    </div>
                    <dt>File</dt><dd>{file ? `${file.name} (${formatBytes(file.size)})` : 'None added'}</dd>
                  </div>
                </dl>

                {enquiryMode === 'whatsapp' && (
                  <p className="notice">
                    <Info size={16} aria-hidden />
                    <span>
                      Online sending isn’t switched on for this site yet, so your enquiry will open in WhatsApp,
                      ready for you to send. Nothing is shared until you press send there.
                    </span>
                  </p>
                )}
                {submitError && (
                  <p className="enq-submit-error" role="alert">
                    <AlertCircle size={16} aria-hidden /> {submitError}
                  </p>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="enq-nav">
          {step > 0 ? (
            <button type="button" className="btn btn--ghost" onClick={() => goTo(step - 1)}>
              <ArrowLeft size={16} aria-hidden /> Back
            </button>
          ) : (
            <span />
          )}
          {step < 3 && (
            <button type="button" className="btn" onClick={next}>
              {step === 2 && !file ? 'Skip for now' : 'Continue'} <ArrowRight size={16} className="btn-icon" aria-hidden />
            </button>
          )}
          {step === 3 && enquiryMode === 'api' && (
            <motion.button type="submit" className="btn" disabled={phase === 'submitting'} whileTap={{ scale: 0.97 }}>
              {phase === 'submitting' ? (
                <>
                  <Loader2 size={16} className="spin" aria-hidden /> Sending…
                </>
              ) : (
                <>
                  Send enquiry <ArrowRight size={16} className="btn-icon" aria-hidden />
                </>
              )}
            </motion.button>
          )}
          {step === 3 && enquiryMode === 'whatsapp' && (
            <a
              className="btn btn--whatsapp"
              href={enquiryWhatsappUrl(payload)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                const problems = allErrors();
                if (Object.keys(problems).length) {
                  e.preventDefault();
                  goTo(problems.style || problems.finish ? 0 : 1, problems);
                  return;
                }
                setPhase('handoff');
              }}
            >
              <WhatsAppGlyph /> Send via WhatsApp
            </a>
          )}
        </div>
      </div>
    </form>
  );
}
