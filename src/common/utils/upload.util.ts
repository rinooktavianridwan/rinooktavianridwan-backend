import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';

const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);
const access = promisify(fs.access);

const BASE = path.join(process.cwd(), 'storages');
const FOLDERS = {
  profile: 'profile',
  project: 'project',
  tech: 'tech',
  contact: 'contact',
} as const;

async function ensureDir(dir: string) {
  try {
    await access(dir);
  } catch {
    await mkdir(dir, { recursive: true });
  }
}

/* exported type to reuse in services/controllers */
export interface LocalMulterFile {
  originalname: string;
  buffer: Buffer | Uint8Array;
  mimetype?: string;
  size?: number;
}

/* runtime guard in case you pass unknown */
export function isMulterFile(obj: unknown): obj is LocalMulterFile {
  if (!obj || typeof obj !== 'object') return false;
  const rec = obj as Record<string, unknown>;
  if (typeof rec.originalname !== 'string') return false;
  const buf = rec.buffer;
  if (!buf) return false;
  if (typeof Buffer !== 'undefined' && Buffer.isBuffer(buf)) return true;
  if (buf instanceof Uint8Array) return true;
  return false;
}

/**
 * Save uploaded file to storages/<folder> and return public path:
 *   /storages/<folder>/<filename>
 * - Accepts a LocalMulterFile (memoryStorage)
 * - Optional: you can check mimetype before calling
 */
export async function saveUploadedFile(
  folder: keyof typeof FOLDERS,
  file: LocalMulterFile,
): Promise<string> {
  if (!isMulterFile(file)) throw new Error('Invalid uploaded file');

  await ensureDir(BASE);
  const folderPath = path.join(BASE, FOLDERS[folder]);
  await ensureDir(folderPath);

  const originalname = file.originalname;
  const buffer = Buffer.isBuffer(file.buffer)
    ? file.buffer
    : Buffer.from(file.buffer);

  const ext = path.extname(originalname) || '.jpg';
  const filename = `${Date.now()}-${uuidv4()}${ext}`;
  const filePath = path.join(folderPath, filename);

  await writeFile(filePath, buffer);
  return `/storages/${FOLDERS[folder]}/${filename}`;
}

/** Delete previously uploaded file using public path returned by saveUploadedFile */
export async function deleteUploadedFile(publicPath?: string): Promise<void> {
  if (!publicPath || typeof publicPath !== 'string') return;
  const rel = publicPath.startsWith('/') ? publicPath.slice(1) : publicPath;
  const filePath = path.join(process.cwd(), rel);
  try {
    await unlink(filePath);
  } catch {
    // ignore if not exists
  }
}
