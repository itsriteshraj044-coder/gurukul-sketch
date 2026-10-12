import { whatsappLink } from '../utils/whatsapp';

/**
 * Enquiry submission adapter.
 *
 * Two honest modes:
 *  - "api":      VITE_ENQUIRY_ENDPOINT is set. Enquiries are POSTed as
 *                multipart/form-data (including the optional reference photo).
 *                Success is only reported when the server answers 2xx.
 *  - "whatsapp": no endpoint configured. Nothing is sent from the website;
 *                the visitor is handed a pre-filled WhatsApp message and told
 *                to attach the photo themselves.
 *
 * The endpoint must be your own server / serverless function (or a form
 * service) that keeps credentials server-side. See README › Form submissions.
 */

export type EnquiryKind = 'custom-sketch' | 'contact';

export type EnquiryPayload = {
  kind: EnquiryKind;
  /** Ordered label → value pairs, used for both the API body and the WhatsApp message. */
  fields: { label: string; name: string; value: string }[];
  file?: File | null;
};

export type SubmitResult =
  | { status: 'sent' }
  | { status: 'error'; message: string };

const endpoint = (import.meta.env.VITE_ENQUIRY_ENDPOINT ?? '').trim();

export const enquiryMode: 'api' | 'whatsapp' = endpoint ? 'api' : 'whatsapp';

export function formatEnquiryText(payload: EnquiryPayload): string {
  const heading =
    payload.kind === 'custom-sketch' ? 'New custom sketch enquiry (GURUKUL Sketch website)' : 'New enquiry (GURUKUL Sketch website)';
  const lines = payload.fields.filter((f) => f.value.trim()).map((f) => `${f.label}: ${f.value.trim()}`);
  if (payload.file) lines.push(`Reference photo: ${payload.file.name} (I will attach it in this chat)`);
  return [heading, '', ...lines].join('\n');
}

export function enquiryWhatsappUrl(payload: EnquiryPayload): string {
  return whatsappLink(formatEnquiryText(payload));
}

export async function submitEnquiry(payload: EnquiryPayload): Promise<SubmitResult> {
  if (!endpoint) {
    return { status: 'error', message: 'Online submission is not configured. Please use WhatsApp instead.' };
  }

  const body = new FormData();
  body.append('kind', payload.kind);
  payload.fields.forEach((f) => body.append(f.name, f.value));
  if (payload.file) body.append('referencePhoto', payload.file, payload.file.name);

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 30000);

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      body,
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    if (!res.ok) {
      return { status: 'error', message: `The server could not accept the enquiry (error ${res.status}). Please try again or use WhatsApp.` };
    }
    return { status: 'sent' };
  } catch (err) {
    const aborted = err instanceof DOMException && err.name === 'AbortError';
    return {
      status: 'error',
      message: aborted
        ? 'The request took too long. Please check your connection and try again.'
        : 'We could not reach the server. Please check your connection, or send the details on WhatsApp.',
    };
  } finally {
    window.clearTimeout(timeout);
  }
}
