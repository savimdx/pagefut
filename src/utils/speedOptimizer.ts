import heroFutsalImg from '../assets/images/hero_futsal.webp';
import packMetodologicoImg from '../assets/images/pack_metodologico.webp';
import sample1Img from '../assets/images/sample_1.webp';
import sample2Img from '../assets/images/sample_2.webp';
import sample3Img from '../assets/images/sample_3.webp';
import sample4Img from '../assets/images/sample_4.webp';
import bono1Img from '../assets/images/bono_1.webp';
import bono2Img from '../assets/images/bono_2.webp';
import bono3Img from '../assets/images/bono_3.webp';
import bono4Img from '../assets/images/bono_4.webp';
import bono5Img from '../assets/images/bono_5.webp';
import bono6Img from '../assets/images/bono_6.webp';
import bono7Img from '../assets/images/bono_7.webp';
import bono8Img from '../assets/images/bono_8.webp';
import bono9Img from '../assets/images/bono_9.webp';
import bono10Img from '../assets/images/bono_10.webp';
import { BONUSES, TESTIMONIALS, CREATOR_INFO } from '../data';

// Persistent in-memory cache to prevent re-fetching and ensure instant paint
const imageMemoryCache = new Map<string, HTMLImageElement>();

/**
 * Returns all local and remote images in the application sorted by priority
 */
export function getAllApplicationImages(): { priorityImages: string[]; secondaryImages: string[] } {
  // Critical top-of-page and high-visibility images
  const priorityImages: string[] = [
    heroFutsalImg,
    packMetodologicoImg,
    sample1Img,
    sample2Img,
    sample3Img,
    sample4Img,
  ];

  // Secondary images (bonuses, testimonials, fallbacks)
  const secondarySet = new Set<string>();

  const localBonuses = [
    bono1Img, bono2Img, bono3Img, bono4Img, bono5Img,
    bono6Img, bono7Img, bono8Img, bono9Img, bono10Img
  ];
  localBonuses.forEach(url => secondarySet.add(url));

  if (Array.isArray(BONUSES)) {
    BONUSES.forEach(b => {
      if (b.image && typeof b.image === 'string') secondarySet.add(b.image);
      if (b.fallbackImage && typeof b.fallbackImage === 'string') secondarySet.add(b.fallbackImage);
    });
  }

  if (Array.isArray(TESTIMONIALS)) {
    TESTIMONIALS.forEach(t => {
      if (t.avatarUrl && typeof t.avatarUrl === 'string' && t.avatarUrl.startsWith('http')) {
        secondarySet.add(t.avatarUrl);
      }
    });
  }

  if (CREATOR_INFO && CREATOR_INFO.photoUrl && typeof CREATOR_INFO.photoUrl === 'string' && CREATOR_INFO.photoUrl.startsWith('http')) {
    secondarySet.add(CREATOR_INFO.photoUrl);
  }

  return {
    priorityImages,
    secondaryImages: Array.from(secondarySet)
  };
}

/**
 * Preload and hardware-decode an image into browser memory
 */
export function preloadImage(src: string): Promise<void> {
  if (!src || typeof window === 'undefined') return Promise.resolve();
  
  if (imageMemoryCache.has(src)) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    try {
      const img = new Image();
      img.referrerPolicy = 'no-referrer';
      img.decoding = 'async';
      
      const onDone = () => {
        if ('decode' in img && typeof img.decode === 'function') {
          img.decode().then(() => resolve()).catch(() => resolve());
        } else {
          resolve();
        }
      };

      img.onload = onDone;
      img.onerror = () => resolve();
      img.src = src;
      imageMemoryCache.set(src, img);

      // In case image is already cached by browser
      if (img.complete) {
        onDone();
      }
    } catch (e) {
      resolve();
    }
  });
}

/**
 * Initializes ultra-fast instant preloading
 */
export function initSpeedOptimizer(): void {
  if (typeof window === 'undefined') return;

  try {
    const { priorityImages, secondaryImages } = getAllApplicationImages();

    // 1. Immediately fire high-priority images in parallel
    priorityImages.forEach(src => {
      preloadImage(src);
    });

    // 2. Concurrently load secondary images in batches
    const loadSecondary = () => {
      secondaryImages.forEach(src => {
        preloadImage(src);
      });
    };

    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(loadSecondary, { timeout: 800 });
    } else {
      setTimeout(loadSecondary, 50);
    }
  } catch (err) {
    // Fail gracefully
  }
}
