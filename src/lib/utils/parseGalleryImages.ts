export type GalleryLabel = 'before' | 'prep' | 'after';
export type GalleryImage = {
  src: string;
  alt: string;
  label: GalleryLabel;
};

const ORDER: Record<GalleryLabel, number> = {
  before: 0,
  prep: 1,
  after: 2
};

// Matches: -before12., -prep2., -after., etc. Number is optional; defaults to 0 if missing
const PARTS_RE = /-(before|prep|after)(\d*)\.(?:jpg|jpeg|png|webp)$/i;

// Organize images by job and parse them properly
export function organizeImagesByJob(modules: Record<string, string>): Record<string, GalleryImage[]> {
  // First, group the raw modules by job
  const jobModules: Record<string, Record<string, string>> = {};
  
  Object.entries(modules).forEach(([path, url]) => {
    const match = path.match(/\/gallery\/(job[^\/]+)\//);
    if (match) {
      const jobName = match[1];
      if (!jobModules[jobName]) {
        jobModules[jobName] = {};
      }
      jobModules[jobName][path] = url;
    }
  });
  
  // Then parse each job's images using parseGalleryImages
  const jobImages: Record<string, GalleryImage[]> = {};
  Object.entries(jobModules).forEach(([jobName, jobModuleSet]) => {
    jobImages[jobName] = parseGalleryImages(jobModuleSet);
  });
  
  return jobImages;
}

function parseGalleryImages(modules: Record<string, string>): GalleryImage[] {
  const items: (GalleryImage & { __order: number; __path: string; __idx: number })[] = [];

  for (const [path, url] of Object.entries(modules)) {
    const m = path.match(PARTS_RE);
    if (!m) continue; // only include renamed files with labels

    const label = m[1].toLowerCase() as GalleryLabel;
    const idxStr = m[2] ?? '';
    const number = idxStr ? parseInt(idxStr, 10) || 0 : 0;

    items.push({
      src: url,
      alt: `${label} photo ${number || 1}`,
      label,
      __order: ORDER[label],
      __path: path,
      __idx: number
    });
  }

  items.sort((a, b) => {
    if (a.__order !== b.__order) return a.__order - b.__order;
    if (a.__idx !== b.__idx) return a.__idx - b.__idx;
    return a.__path.localeCompare(b.__path, undefined, { numeric: true });
  });

  // Strip private sort fields
  return items.map(({ src, alt, label }) => ({ src, alt, label }));
}
