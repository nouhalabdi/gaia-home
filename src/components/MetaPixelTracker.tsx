
"use client";
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { initMetaPixel, trackEvent } from '@/lib/meta-pixel';

export default function MetaPixelTracker() {
  const pathname = usePathname();

  
  useEffect(() => {
    initMetaPixel();
  }, []);

  
  useEffect(() => {
    if (pathname) {
      trackEvent('PageView');
    }
  }, [pathname]);

  return null;
}
