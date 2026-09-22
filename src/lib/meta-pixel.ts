
import ReactPixel from 'react-facebook-pixel';

export const initMetaPixel = () => {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  if (!pixelId) {
    console.warn('Meta Pixel ID is not defined.');
    return;
  }
  
  
  ReactPixel.init(pixelId, undefined as any, {
    autoConfig: true,
    debug: false,
  } as any);
  
  ReactPixel.pageView();
};

export const trackEvent = (eventName: string, data?: object) => {
  if (typeof window !== 'undefined') {
  
    ReactPixel.track(eventName, data as any);
  }
};
