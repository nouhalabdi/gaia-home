

export const initMetaPixel = async () => {
  if (typeof window === 'undefined') return;

  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  if (!pixelId) {
    console.warn('Meta Pixel ID is not defined.');
    return;
  }

  const ReactPixel = (await import('react-facebook-pixel')).default;

  ReactPixel.init(pixelId, {} as any, {
    autoConfig: true,
    debug: false,
  } as any);

  ReactPixel.pageView();
};

export const trackEvent = async (eventName: string, data?: object) => {
  if (typeof window === 'undefined') return;

  const ReactPixel = (await import('react-facebook-pixel')).default;
  ReactPixel.track(eventName, data as any);
};
