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

export const metadata: Metadata = {
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
        <div id="dc-root">{children}</div>
      </body>
    </html>
  );
}
