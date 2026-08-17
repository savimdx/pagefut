import { BONUSES, TESTIMONIALS, CREATOR_INFO } from '../data';

/**
 * Dynamically extract all image URLs currently declared in data.ts and constants.
 */
export function getAllApplicationImages(): string[] {
  const images = new Set<string>();

  // Hero & Offer featured banner image
  images.add("https://i.ibb.co/qLZGmjLK/Chat-GPT-Image-5-de-jul-de-2026-13-34-29.png");

  // Product Sample book pages
  const productSamples = [
    "https://i.postimg.cc/9XDrVs5y/Screenshot-20260705-195033-Adobe-Acrobat.jpg",
    "https://i.postimg.cc/wxn3BFgs/Screenshot-20260705-195044-Adobe-Acrobat.jpg",
    "https://i.postimg.cc/y62WNns3/Screenshot-20260705-195050-Adobe-Acrobat.jpg",
    "https://i.postimg.cc/Pf0NqKTL/Screenshot-20260705-195056-Adobe-Acrobat.jpg"
  ];
  productSamples.forEach(url => images.add(url));

  // Dynamically collect all Bonus images
  if (Array.isArray(BONUSES)) {
    BONUSES.forEach(b => {
      if (b.image && typeof b.image === 'string') {
        images.add(b.image);
      }
      if (b.fallbackImage && typeof b.fallbackImage === 'string') {
        images.add(b.fallbackImage);
      }
    });
  }

  // Dynamically collect Testimonial avatars
  if (Array.isArray(TESTIMONIALS)) {
    TESTIMONIALS.forEach(t => {
      if (t.avatarUrl && typeof t.avatarUrl === 'string' && t.avatarUrl.startsWith('http')) {
        images.add(t.avatarUrl);
      }
    });
  }

  // Creator Photo
  if (CREATOR_INFO && CREATOR_INFO.photoUrl && typeof CREATOR_INFO.photoUrl === 'string' && CREATOR_INFO.photoUrl.startsWith('http')) {
    images.add(CREATOR_INFO.photoUrl);
  }

  return Array.from(images);
}

/**
 * Preloads an image into browser cache
 */
export function preloadImage(src: string): void {
  if (!src || typeof window === 'undefined') return;
  try {
    const img = new Image();
    img.referrerPolicy = 'no-referrer';
    img.decoding = 'async';
    img.src = src;
  } catch (e) {
    // Silent fail
  }
}

/**
 * Initializes intelligent preloading in the background without blocking main thread
 */
export function initSpeedOptimizer() {
  if (typeof window === 'undefined') return;

  const allImages = getAllApplicationImages();

  // Run in idle callback so initial render is instantaneous
  const scheduleIdle = window.requestIdleCallback || ((cb: () => void) => setTimeout(cb, 200));

  scheduleIdle(() => {
    allImages.forEach(src => {
      preloadImage(src);
    });
  });
}
