export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

/** Accepts international formats: 7–15 digits once spaces, dashes, brackets and + are removed. */
export const isPhone = (v: string) => {
  const digits = v.replace(/[\s\-().+]/g, '');
  return /^\d{7,15}$/.test(digits);
};

export const MAX_UPLOAD_MB = 10;
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];

export function validateImage(file: File): string | null {
  const typeOk = ACCEPTED_IMAGE_TYPES.includes(file.type) || /\.(jpe?g|png|webp|heic|heif)$/i.test(file.name);
  if (!typeOk) return 'Please choose a photo (JPG, PNG, WEBP or HEIC).';
  if (file.size > MAX_UPLOAD_MB * 1024 * 1024) return `That photo is larger than ${MAX_UPLOAD_MB} MB. Please choose a smaller one.`;
  return null;
}

export const formatBytes = (bytes: number) =>
  bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
