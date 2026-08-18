// Persistent in-memory cache to prevent re-fetching and ensure instant paint
const imageMemoryCache = new Map<string, HTMLImageElement>();

export const LOCAL_APP_IMAGES = [
  '/images/hero_futsal.webp',
  '/images/pack_metodologico.webp',
  '/images/sample_1.webp',
  '/images/sample_2.webp',
  '/images/sample_3.webp',
  '/images/sample_4.webp',
  '/images/bono_1.webp',
  '/images/bono_2.webp',
  '/images/bono_3.webp',
  '/images/bono_4.webp',
  '/images/bono_5.webp',
  '/images/bono_6.webp',
  '/images/bono_7.webp',
  '/images/bono_8.webp',
  '/images/bono_9.webp',
  '/images/bono_10.webp',
  '/images/ejercicios_adicionales_futsal_1783515557260.webp'
];

/**
 * Returns prioritized lists of local WebP application images
 */
export function getAllApplicationImages(): { priorityImages: string[]; secondaryImages: string[] } {
  const priorityImages: string[] = [
    '/images/hero_futsal.webp',
    '/images/pack_metodologico.webp',
    '/images/sample_1.webp',
    '/images/sample_2.webp',
    '/images/sample_3.webp',
    '/images/sample_4.webp',
  ];

  const secondaryImages: string[] = [
    '/images/bono_1.webp',
    '/images/bono_2.webp',
    '/images/bono_3.webp',
    '/images/bono_4.webp',
    '/images/bono_5.webp',
    '/images/bono_6.webp',
    '/images/bono_7.webp',
    '/images/bono_8.webp',
    '/images/bono_9.webp',
    '/images/bono_10.webp',
    '/images/ejercicios_adicionales_futsal_1783515557260.webp'
  ];

  return {
    priorityImages,
    secondaryImages
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

      if (img.complete) {
        onDone();
      }
    } catch (e) {
      resolve();
    }
  });
}

/**
 * Initializes ultra-fast non-blocking background preloading
 */
export function initSpeedOptimizer(): void {
  if (typeof window === 'undefined') return;

  try {
    const { priorityImages, secondaryImages } = getAllApplicationImages();

    // 1. Immediately preload critical visible assets
    priorityImages.forEach(src => {
      preloadImage(src);
    });

    // 2. Preload remaining local webp assets during idle browser cycles
    const loadSecondary = () => {
      secondaryImages.forEach(src => {
        preloadImage(src);
      });
    };

    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(loadSecondary, { timeout: 1000 });
    } else {
      setTimeout(loadSecondary, 200);
    }
  } catch (err) {
    // Fail gracefully
  }
}
