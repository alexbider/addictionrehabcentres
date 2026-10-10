import Script from 'next/script';

/**
 * Production tracking, copied from the live WordPress site's page source (addictionrehabcenters.ca, checked 2026-10-11):
 *   GA4 G-8RYYPCC7ZJ · Meta pixel 829671655143836 (PageView) · Smartsupp chat key 1b60661a0d7961f780b319f806a6be8744d8e10c.
 * The old source has no custom call-tracking event, so "call_now" below is new: it fires on every tel: link click (GA4 event + Meta custom event).
 * IDs can be overridden with env vars; nothing loads outside a production build, and the scripts only start when the page is served from the
 * production host (the host check runs in the browser, so the pages stay fully static and the same build works on previews).
 * Scripts load after hydration (afterInteractive / lazyOnload), never in <head>, so LCP is unaffected.
 */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-8RYYPCC7ZJ';
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '829671655143836';
const SMARTSUPP_KEY = process.env.NEXT_PUBLIC_SMARTSUPP_KEY || '1b60661a0d7961f780b319f806a6be8744d8e10c';
const HOSTS = (process.env.NEXT_PUBLIC_ANALYTICS_HOSTS || 'addictionrehabcenters.ca,www.addictionrehabcenters.ca').split(',').map((h) => h.trim());

const guard = `if(${JSON.stringify(HOSTS)}.indexOf(location.hostname)<0)return;`;

export function Analytics() {
  if (process.env.NODE_ENV !== 'production') return null;
  return (
    <>
      <Script id="ga4" strategy="afterInteractive">{`(function(){${guard}
window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};
gtag('js',new Date());gtag('config',${JSON.stringify(GA_ID)});
var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+${JSON.stringify(GA_ID)};document.head.appendChild(s);
document.addEventListener('click',function(e){var a=e.target&&e.target.closest&&e.target.closest('a[href^="tel:"]');if(!a)return;
var n=a.getAttribute('href').slice(4);
if(window.gtag)gtag('event','call_now',{phone_number:n,link_text:(a.textContent||'').trim().slice(0,80),page_path:location.pathname,transport_type:'beacon'});
if(window.fbq)fbq('trackCustom','call_now',{phone_number:n,page_path:location.pathname});
},true);})();`}</Script>
      <Script id="meta-pixel" strategy="lazyOnload">{`(function(){${guard}
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init',${JSON.stringify(META_PIXEL_ID)});fbq('track','PageView');})();`}</Script>
      <Script id="smartsupp" strategy="lazyOnload">{`(function(){${guard}
var _smartsupp=window._smartsupp=window._smartsupp||{};_smartsupp.key=${JSON.stringify(SMARTSUPP_KEY)};_smartsupp.cookieDomain=location.hostname.replace(/^www\\./,'');
window.smartsupp||(function(d){var s,c,o=window.smartsupp=function(){o._.push(arguments)};o._=[];s=d.getElementsByTagName('script')[0];c=d.createElement('script');c.type='text/javascript';c.charset='utf-8';c.async=true;c.src='https://www.smartsuppchat.com/loader.js';s.parentNode.insertBefore(c,s)})(document);})();`}</Script>
    </>
  );
}
