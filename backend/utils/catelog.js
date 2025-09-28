import fs from 'node:fs/promises';
import path from 'node:path';

const DATA_JSON_PATH = process.env.DATA_JSON_PATH
  // common defaults; first one you’re likely using
  || path.resolve(process.cwd(), '../frontend/public/data.json')
  || path.resolve(process.cwd(), 'public/data.json');

let _cache = null;
let _byId = new Map();
let _bySlug = new Map();

export async function loadCatalog() {
  const raw = await fs.readFile(DATA_JSON_PATH, 'utf-8');
  const data = JSON.parse(raw);

  // normalize to array
  const list = Array.isArray(data) ? data : (data.products || []);
  _cache = list;

  _byId = new Map();
  _bySlug = new Map();

  for (const p of list) {
    if (!p) continue;
    // normalize keys
    const id = String(p.id ?? p._id ?? p.sku ?? p.slug);
    const slug = String(p.slug ?? id).toLowerCase();
    _byId.set(id, p);
    _bySlug.set(slug, p);
  }
  return _cache;
}

export function getAll() {
  if (!_cache) throw new Error('catalog not loaded');
  return _cache;
}

export function getById(id) {
  if (!_cache) throw new Error('catalog not loaded');
  return _byId.get(String(id));
}

export function getBySlug(slug) {
  if (!_cache) throw new Error('catalog not loaded');
  return _bySlug.get(String(slug).toLowerCase());
}

export function getManyByIds(ids = []) {
  if (!_cache) throw new Error('catalog not loaded');
  return ids
    .map(id => getById(id))
    .filter(Boolean);
}
