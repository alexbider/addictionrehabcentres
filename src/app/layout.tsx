import type { Metadata, Viewport } from 'next';
import '@fontsource/jost/400.css';
import '@fontsource/jost/500.css';
import '@fontsource/jost/600.css';
import '@fontsource/jost/700.css';
import '@fontsource/figtree/400.css';
import '@fontsource/figtree/500.css';
import '@fontsource/figtree/600.css';
import './globals.css';
import './dc-pseudo.css';
import './responsive.css';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Addiction Rehab Centres Canada',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <noscript>
          <style>{'.sc-host.dc-pending{visibility:visible!important}'}</style>
        </noscript>
        <main id="dc-root">{children}</main>
      </body>
    </html>
  );
}
