import { useId, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, ArrowRight, CheckCircle2, Clock, Info, Loader2, Mail, MapPin, Phone, RotateCcw } from 'lucide-react';
import { Seo } from '../components/Seo';
import { RevealText } from '../components/RevealText';
import { WhatsAppGlyph } from '../components/WhatsAppButton';
import { usePageMotion } from '../hooks/usePageMotion';
import { useSessionDraft } from '../hooks/useSessionDraft';
import { enquiryMode, enquiryWhatsappUrl, submitEnquiry, type EnquiryPayload } from '../services/enquiry';
import { isEmail, isPhone } from '../utils/validation';
import { whatsappLink, defaultWhatsappMessage } from '../utils/whatsapp';
import { site } from '../config/site';
import { artworkById } from '../data/artworks';
import '../styles/pages.css';

const enquiryTypes = ['Custom sketch or portrait', 'Wall mural', 'Folk art piece', 'Gift for an occasion', 'Something else'];

type Form = { name: string; email: string; phone: string; type: string; message: string };
const EMPTY: Form = { name: '', email: '', phone: '', type: '', message: '' };
type Errors = Partial<Record<keyof Form, string>>;

function validate(f: Form): Errors {
  const e: Errors = {};
  if (f.name.trim().length < 2) e.name = 'Please tell us your name.';
  if (!f.email.trim() && !f.phone.trim()) e.phone = 'Please add a phone / WhatsApp number or an email so we can reply.';
  if (f.email.trim() && !isEmail(f.email)) e.email = 'That email address doesn’t look right.';
  if (f.phone.trim() && !isPhone(f.phone)) e.phone = 'That number doesn’t look right. Include the country code, e.g. +91 98765 43210.';
  if (!f.type) e.type = 'Please choose what your enquiry is about.';
  if (f.message.trim().length < 10) e.message = 'Please write a short message (at least 10 characters).';
  return e;
}

const sideArt = artworkById('gond-tree-of-life');

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const uid = useId();
  const [form, setForm, clear] = useSessionDraft<Form>('gs-contact-draft', EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'handoff'>('idle');
  const [submitError, setSubmitError] = useState('');
  usePageMotion(ref);

  const payload: EnquiryPayload = {
    kind: 'contact',
    fields: [
      { label: 'Enquiry', name: 'type', value: form.type },
      { label: 'Name', name: 'name', value: form.name },
      { label: 'Phone / WhatsApp', name: 'phone', value: form.phone },
      { label: 'Email', name: 'email', value: form.email },
      { label: 'Message', name: 'message', value: form.message },
    ],
  };

  const update = (k: keyof Form) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, [k]: value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const check = (): boolean => {
    const e = validate(form);
    setErrors(e);
    const first = Object.keys(e)[0];
    if (first) document.getElementById(`${uid}-${first}`)?.focus();
    return !first;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!check() || enquiryMode !== 'api') return;
    setStatus('sending');
    setSubmitError('');
    const res = await submitEnquiry(payload);
    if (res.status === 'sent') {
      setStatus('sent');
      clear();
    } else {
      setStatus('idle');
      setSubmitError(res.message);
    }
  };

  const fp = (k: keyof Form) => ({
    id: `${uid}-${k}`,
    'aria-invalid': errors[k] ? true : undefined,
    'aria-describedby': errors[k] ? `${uid}-${k}-err` : undefined,
  });
  const err = (k: keyof Form) =>
    errors[k] ? (
      <p className="field-error" id={`${uid}-${k}-err`}>
        <AlertCircle size={15} aria-hidden /> {errors[k]}
      </p>
    ) : null;

  return (
    <div ref={ref} data-motion-scope>
      <Seo
        title="Contact"
        description="Have a sketch in mind? Contact GURUKUL Sketch on WhatsApp, by email or through the enquiry form to talk about your custom artwork."
      />
      <section className="contact-hero">
        <div className="container">
          <p className="eyebrow" data-reveal>Contact</p>
          <RevealText as="h1" lines={['Have a Sketch in Mind?', '*Let’s Talk.*']} className="h1 contact-title" />
          <p className="lead" data-reveal>
            Questions about styles, sizes or a wall you would like painted? Send a message, or reach us directly on
            WhatsApp.
          </p>
        </div>
      </section>

      <section className="section contact-body" aria-label="Contact form and details">
        <div className="container contact-grid">
          <div className="contact-form-wrap" data-reveal>
            <AnimatePresence mode="wait">
              {status === 'sent' || status === 'handoff' ? (
                <motion.div key="done" className="enq-final" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role="status">
                  {status === 'sent' ? (
                    <>
                      <CheckCircle2 size={44} className="enq-final-icon" aria-hidden />
                      <h2 className="h3">Thank you, your message has been received.</h2>
                      <p className="muted">We will reply using the contact details you shared.</p>
                    </>
                  ) : (
                    <>
                      <span className="enq-final-wa" aria-hidden><WhatsAppGlyph /></span>
                      <h2 className="h3">Finish in WhatsApp</h2>
                      <p className="muted">
                        WhatsApp should have opened with your message. <strong>Nothing has been sent yet:</strong> press send there to reach us.
                      </p>
                      <a className="btn btn--whatsapp" href={enquiryWhatsappUrl(payload)} target="_blank" rel="noopener noreferrer">
                        <WhatsAppGlyph /> Open WhatsApp again
                      </a>
                    </>
                  )}
                  <button type="button" className="text-link" onClick={() => { if (status === 'sent') clear(); setStatus('idle'); }}>
                    <RotateCcw size={14} aria-hidden /> {status === 'sent' ? 'Send another message' : 'Back to the form'}
                  </button>
                </motion.div>
              ) : (
                <motion.form key="form" className="contact-form" onSubmit={onSubmit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <h2 className="h3">Send us a message</h2>
                  <div className="enq-row">
                    <div className="field">
                      <label className="field-label" htmlFor={`${uid}-name`}>Your name</label>
                      <input className="input" {...fp('name')} value={form.name} onChange={update('name')} autoComplete="name" />
                      {err('name')}
                    </div>
                    <div className="field">
                      <label className="field-label" htmlFor={`${uid}-type`}>Enquiry type</label>
                      <select className="input" {...fp('type')} value={form.type} onChange={update('type')}>
                        <option value="">Choose one…</option>
                        {enquiryTypes.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      {err('type')}
                    </div>
                  </div>
                  <div className="enq-row">
                    <div className="field">
                      <label className="field-label" htmlFor={`${uid}-phone`}>Phone / WhatsApp</label>
                      <input className="input" type="tel" inputMode="tel" {...fp('phone')} value={form.phone} onChange={update('phone')} autoComplete="tel" placeholder="+91 98765 43210" />
                      {err('phone')}
                    </div>
                    <div className="field">
                      <label className="field-label" htmlFor={`${uid}-email`}>Email</label>
                      <input className="input" type="email" inputMode="email" {...fp('email')} value={form.email} onChange={update('email')} autoComplete="email" />
                      {err('email')}
                    </div>
                  </div>
                  <p className="field-hint">Phone or email is needed so we can reply; both is best.</p>
                  <div className="field">
                    <label className="field-label" htmlFor={`${uid}-message`}>Message</label>
                    <textarea className="input" {...fp('message')} value={form.message} onChange={update('message')} maxLength={2000} placeholder="Tell us what you have in mind…" />
                    {err('message')}
                  </div>

                  {enquiryMode === 'whatsapp' && (
                    <p className="notice">
                      <Info size={16} aria-hidden />
                      <span>Online sending isn’t switched on yet, so your message will open in WhatsApp for you to send.</span>
                    </p>
                  )}
                  {submitError && (
                    <p className="enq-submit-error" role="alert">
                      <AlertCircle size={16} aria-hidden /> {submitError}
                    </p>
                  )}

                  <div className="contact-actions">
                    {enquiryMode === 'api' ? (
                      <button type="submit" className="btn" disabled={status === 'sending'}>
                        {status === 'sending' ? (
                          <><Loader2 size={16} className="spin" aria-hidden /> Sending…</>
                        ) : (
                          <>Send message <ArrowRight size={16} className="btn-icon" aria-hidden /></>
                        )}
                      </button>
                    ) : (
                      <a
                        className="btn btn--whatsapp"
                        href={enquiryWhatsappUrl(payload)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          if (!check()) {
                            e.preventDefault();
                            return;
                          }
                          setStatus('handoff');
                        }}
                      >
                        <WhatsAppGlyph /> Send via WhatsApp
                      </a>
                    )}
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          <aside className="contact-side" data-reveal>
            <div className="contact-art media" data-clip>
              <div className="clip-inner">
                <img src={sideArt.thumbnail} alt={sideArt.alt} width={sideArt.width} height={sideArt.height} loading="lazy" />
              </div>
            </div>
            <div className="contact-cards">
              <a className="contact-card contact-card--wa" href={whatsappLink(defaultWhatsappMessage)} target="_blank" rel="noopener noreferrer">
                <span className="contact-card-icon"><WhatsAppGlyph /></span>
                <span>
                  <span className="contact-card-title">Chat on WhatsApp</span>
                  <span className="contact-card-sub">The quickest way to share photos</span>
                </span>
              </a>
              <a className="contact-card" href={`mailto:${site.contact.email}?subject=${encodeURIComponent('Custom sketch enquiry')}`}>
                <span className="contact-card-icon"><Mail size={20} aria-hidden /></span>
                <span>
                  <span className="contact-card-title">Email us</span>
                  <span className="contact-card-sub">{site.contact.email}</span>
                </span>
              </a>
            </div>
            <ul className="contact-details">
              <li>
                <Phone size={17} aria-hidden />
                {site.contact.phoneHref ? <a href={`tel:${site.contact.phoneHref}`}>{site.contact.phoneDisplay}</a> : <span>{site.contact.phoneDisplay}</span>}
              </li>
              <li><MapPin size={17} aria-hidden /><span>{site.contact.address}</span></li>
              <li><Clock size={17} aria-hidden /><span>{site.contact.responseNote}</span></li>
            </ul>
          </aside>
        </div>
      </section>
    </div>
  );
}
