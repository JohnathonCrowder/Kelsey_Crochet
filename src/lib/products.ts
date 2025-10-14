// src/lib/products.ts
import { Product } from "../data/products";

/* =======================================================================
   Lightweight CSV + product mapping utilities shared by Shop & Product
   ======================================================================= */

/** Tiny, dependency-free CSV parser with quote escaping support. */
export function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let cur: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (ch === '"') {
      if (inQuotes && text[i + 1] === '"') {
        cell += '"'; // escaped quote
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (ch === "," && !inQuotes) {
      cur.push(cell);
      cell = "";
      continue;
    }

    if ((ch === "\n" || ch === "\r") && !inQuotes) {
      if (cell.length || cur.length) {
        cur.push(cell);
        rows.push(cur);
        cur = [];
        cell = "";
      }
      if (ch === "\r" && text[i + 1] === "\n") i++; // CRLF
      continue;
    }

    cell += ch;
  }

  if (cell.length || cur.length) {
    cur.push(cell);
    rows.push(cur);
  }

  return rows.filter((r) => r.length && r.some((c) => c.trim() !== ""));
}

/* ----------------------- small helpers ----------------------- */

const DEBUG =
  typeof window !== "undefined" &&
  new URLSearchParams(window.location.search).get("debug") === "1";

const toBool = (v?: string, def = false) => {
  const s = (v ?? "").trim().toLowerCase();
  if (!s) return def;
  return ["true", "1", "yes", "y", "✓", "checked"].includes(s);
};

const toBadges = (v?: string) =>
  (v ?? "")
    .split(/[|,]/)
    .map((s) => s.trim())
    .filter(Boolean);

const tryJsonArray = (v?: string) => {
  const s = (v ?? "").trim();
  if (!s) return undefined;
  try {
    const parsed = JSON.parse(s);
    return Array.isArray(parsed) ? parsed : undefined;
  } catch {
    if (DEBUG) console.warn("[products] JSON array parse failed:", v);
    return undefined;
  }
};

export function priceNumber(priceLabel: string) {
  const n = (priceLabel ?? "").replace(/[^0-9.]/g, "");
  return n ? Number(n) : undefined;
}

/* =======================================================================
   Folder gallery discovery
   - Put folders under /public so they’re served at the same URL path
     e.g. public/products/pink-dino/ -> /products/pink-dino/
   - Optional: add manifest.json = ["1.jpg","2.webp",...]
   - Otherwise we probe common names using HEAD/GET
   ======================================================================= */

const looksLikeFolder = (s?: string) =>
  !!s &&
  (s.startsWith("/") || s.startsWith("./") || s.startsWith("../")) &&
  s.endsWith("/");

/**
 * Discover image URLs inside a public folder.
 * @param folder e.g. "/products/pink-dino/"
 * @param options max files to probe, preferred extensions order
 */
export async function discoverFolderImages(
  folder: string,
  options?: { max?: number; prefer?: string[] }
): Promise<string[]> {
  const max = options?.max ?? 24;
  const exts = options?.prefer ?? ["webp", "jpg", "jpeg", "png", "gif"];

  // 1) Try manifest.json first
  try {
    const m = await fetch(`${folder}manifest.json`, { cache: "no-store" });
    if (m.ok) {
      const arr = (await m.json()) as string[];
      const urls = arr
        .map((name) => name.trim())
        .filter(Boolean)
        .map((name) => (name.startsWith("http") ? name : `${folder}${name}`));
      if (urls.length) return urls;
    }
  } catch {
    /* ignore */
  }

  // 2) Probe common sequences
  const candidates: string[] = [];
  for (let i = 1; i <= max; i++) {
    const d2 = String(i).padStart(2, "0");
    for (const ext of exts) {
      candidates.push(`${folder}${i}.${ext}`);
      candidates.push(`${folder}${d2}.${ext}`);
      candidates.push(`${folder}image-${i}.${ext}`);
      candidates.push(`${folder}photo-${i}.${ext}`);
    }
  }

  // Check a URL is really an image (not an HTML fallback)
  const isRealImage = (res: Response) => {
    const ct = res.headers.get("content-type") || "";
    return res.ok && ct.toLowerCase().startsWith("image/");
  };

  const found: string[] = [];
  let consecutiveMisses = 0;           // bail early if we keep missing
  const MISS_LIMIT = 12;               // tune as you like

  for (const url of Array.from(new Set(candidates))) {
    try {
      // Try HEAD first
      let r = await fetch(url, { method: "HEAD", cache: "no-store" });
      if (!isRealImage(r)) {
        // Fallback to GET, some servers don't support HEAD
        r = await fetch(url, { method: "GET", cache: "no-store" });
      }

      if (isRealImage(r)) {
        found.push(url);
        consecutiveMisses = 0;
      } else {
        consecutiveMisses++;
        if (consecutiveMisses >= MISS_LIMIT && found.length > 0) break;
      }
    } catch {
      consecutiveMisses++;
      if (consecutiveMisses >= MISS_LIMIT && found.length > 0) break;
    }
  }

  return found;
}

/* =======================================================================
   CSV -> Product mapping
   Supports:
   - single primary image ("image")
   - explicit gallery ("images" comma/pipe list OR "imagesJson" JSON array)
   - folder gallery: set "images" cell to a public folder path "/folder/"
     -> stored in product.imagesFolder, discovered on Product page
   ======================================================================= */

export async function loadProductsFromCsv(csvUrl: string): Promise<Product[]> {
  const res = await fetch(`${csvUrl}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`CSV fetch failed: ${res.status}`);
  let text = await res.text();

  // Strip UTF-8 BOM if present
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);

  const table = parseCSV(text);
  if (table.length < 2) return [];

  const rawHeaders = table[0];

  const normalize = (h: string) =>
    h.replace(/^\uFEFF/, "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");

  const headers = rawHeaders.map(normalize);

  // header index helper with aliases
  const H = (want: string, ...aliases: string[]) => {
    const keys = [want, ...aliases].map(normalize);
    for (const k of keys) {
      const idx = headers.indexOf(k);
      if (idx !== -1) return idx;
    }
    return -1;
  };

  // expected headers (flexible with aliases)
  let i = {
    id: H("id"),
    slug: H("slug"),
    title: H("title", "name"),
    priceLabel: H("pricelabel", "price", "priceusd"),
    image: H("image", "imageurl", "img"),
    images: H("images", "gallery"), // can be "url|url" OR folder "/path/"
    imagesJson: H("imagesjson"),
    description: H("description", "desc"),
    leadTime: H("leadtime"),
    shipNote: H("shipnote", "shippingnote"),
    badges: H("badges", "tags"),
    kind: H("kind", "type"),
    unique: H("unique"),
    soldOut: H("soldout"),
    active: H("active", "enabled"),
    paymentLink: H("paymentlink", "stripe", "buyurl"),
    variantsJson: H("variantsjson", "variants"),
    buttonText: H("buttontext", "cta"),
  };

  // If many headers failed to map, fall back to positional indexing (best-effort)
  const missingCount = Object.values(i).filter((x) => x === -1).length;
  if (missingCount >= 10 && rawHeaders.length >= 12) {
    const pos = (n: number) => (n < rawHeaders.length ? n : -1);
    i = {
      id: pos(0),
      slug: pos(1),
      title: pos(2),
      priceLabel: pos(3),
      image: pos(4),
      images: pos(5),
      imagesJson: pos(6),
      description: pos(7),
      leadTime: pos(8),
      shipNote: pos(9),
      badges: pos(10),
      kind: pos(11),
      unique: pos(12),
      soldOut: pos(13),
      active: pos(14),
      paymentLink: pos(15),
      variantsJson: pos(16),
      buttonText: pos(17),
    };
    if (DEBUG) console.warn("[products] Falling back to positional column mapping.");
  }

  if (DEBUG) {
    console.log("[products] raw headers:", rawHeaders);
    console.log("[products] normalized headers:", headers);
    console.log("[products] header index map:", i);
  }

  const mapped: Product[] = table.slice(1).map((row) => {
    const get = (idx: number) => (idx >= 0 && idx < row.length ? row[idx].trim() : "");

    // normalize kind
    const kindRaw = (get(i.kind) || "premade").toLowerCase();
    const kind: Product["kind"] = kindRaw === "preorder" ? "preorder" : "premade";

    // primary image
    const image = get(i.image) || "/shop/placeholder.jpg";

    // gallery fields
    const imagesCell = get(i.images);
    const imagesJson = tryJsonArray(get(i.imagesJson)) as string[] | undefined;

    let imagesFolder: string | undefined;
    let images: string[] | undefined;

    if (looksLikeFolder(imagesCell)) {
      imagesFolder = imagesCell; // discovery deferred to Product page
    } else if (imagesJson?.length) {
      images = imagesJson;
    } else if (imagesCell) {
      const listish = imagesCell
        .split(/[|,]/)
        .map((s) => s.trim())
        .filter(Boolean);
      images = listish.length ? listish : undefined;
    }

    const variants = tryJsonArray(get(i.variantsJson)) as Product["variants"] | undefined;

    const p: Product = {
      id: get(i.id),
      slug: get(i.slug) || undefined,
      title: get(i.title),
      priceLabel: get(i.priceLabel),
      image,
      images,
      imagesFolder, // << NEW: folder path if provided
      description: get(i.description) || undefined,
      leadTime: get(i.leadTime) || undefined,
      shipNote: get(i.shipNote) || undefined,
      badges: toBadges(get(i.badges)),
      active: toBool(get(i.active), true),
      kind,
      unique: toBool(get(i.unique), false),
      soldOut: toBool(get(i.soldOut), false),
      paymentLink: get(i.paymentLink) || undefined,
      variants,
      buttonText: get(i.buttonText) || undefined,
    };

    return p;
  });

  const valid = mapped.filter((p) => p.id && p.title && p.priceLabel);

  if (DEBUG) {
    console.log("[products] mapped:", mapped.length, "valid:", valid.length);
    if (!valid.length && mapped.length) {
      console.log("[products] sample row (mapped[0]):", mapped[0]);
      console.log("[products] sample raw row (table[1]):", table[1]);
    }
  }

  return valid.length ? valid : mapped;
}

/* =======================================================================
   Schema helpers + default CTA
   ======================================================================= */

export function availabilityForSchema(p: Product) {
  if (p.soldOut) return "https://schema.org/SoldOut";
  return p.kind === "premade"
    ? "https://schema.org/InStock"
    : "https://schema.org/PreOrder";
}

export const defaultCta = (p: Product) =>
  p.buttonText ?? (p.kind === "premade" ? "Buy Now" : "Preorder");
