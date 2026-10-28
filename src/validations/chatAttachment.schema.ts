import { z } from 'zod';
import { imageAttachmentSchema } from './comment.schema';

const maxBytes = 500_000;

export const chatAttachmentSchema = z.string().max(750_000).refine((value) => {
  if (value.startsWith('data:image/')) return imageAttachmentSchema.safeParse(value).success;
  const match = /^data:(application\/pdf|text\/plain);base64,([A-Za-z0-9+/]+={0,2})$/.exec(value);
  if (!match) return false;
  const bytes = Buffer.from(match[2], 'base64');
  if (!bytes.length || bytes.length > maxBytes) return false;
  if (match[1] === 'application/pdf') return bytes.subarray(0, 5).toString() === '%PDF-';
  try { return !bytes.includes(0) && new TextDecoder('utf-8', { fatal: true }).decode(bytes).length > 0; }
  catch { return false; }
}, 'Use a PNG, JPEG, GIF, WebP, PDF, or plain-text file up to 500 KB');

export const chatAttachmentNameSchema = z.string().trim().min(1).max(120)
  .regex(/^[^/\\\x00-\x1f]+$/, 'Invalid attachment name');

export function attachmentNameMatchesType(data: string, name: string): boolean {
  const mime = /^data:([^;]+);base64,/.exec(data)?.[1];
  const extensions: Record<string, string[]> = {
    'image/png': ['.png'], 'image/jpeg': ['.jpg', '.jpeg'], 'image/gif': ['.gif'],
    'image/webp': ['.webp'], 'application/pdf': ['.pdf'], 'text/plain': ['.txt'],
  };
  return !!mime && !!extensions[mime]?.some((extension) => name.toLowerCase().endsWith(extension));
}
