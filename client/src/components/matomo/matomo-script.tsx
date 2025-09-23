import Script from "next/script";

export const MatomoScript = () => {
  if (process.env.NODE_ENV === "development") {
    return null;
  }

  if (!process.env.NEXT_PUBLIC_MATOMO_URL || !process.env.NEXT_PUBLIC_MATOMO_SITE_ID) {
    return null;
  }

  return (
    <Script
      id="matomo"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
              var _paq = window._paq = window._paq || [];
              _paq.push(['trackPageView']);
              _paq.push(['enableLinkTracking']);
              (function() {
                var u="${process.env.NEXT_PUBLIC_MATOMO_URL}/";
                _paq.push(['setTrackerUrl', u+'matomo.php']);
                _paq.push(['setSiteId', '${process.env.NEXT_PUBLIC_MATOMO_SITE_ID}']);
                var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
                g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
              })();
            `,
      }}
    />
  );
};
