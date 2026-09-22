"use client";
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function MetaPixelTracker() {
  const pathname = usePathname();

  
  useEffect(() => {
    import('@/lib/meta-pixel').then(({ initMetaPixel }) => {
      initMetaPixel();
    });
  }, []);

  
  useEffect(() => {
    if (pathname) {
      import('@/lib/meta-pixel').then(({ trackEvent }) => {
        trackEvent('PageView');
      });
    }
  }, [pathname]);

  return null;
}
