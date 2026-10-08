import type { Metadata } from 'next';
import { Root } from '@/views/Home';
import { getPage } from '@/lib/content';
import { JsonLd, pageMetadata } from '@/lib/metadata';
import { homeData } from '@/lib/home';

// Approved Home design; title, description, canonical, Open Graph and JSON-LD are the source home page's.
export function generateMetadata(): Metadata {
  const page = getPage('home');
  return page ? pageMetadata(page) : {};
}

export default function Page() {
  const page = getPage('home');
  return (
    <>
      {page ? <JsonLd page={page} /> : null}
      <Root data={homeData()} />
    </>
  );
}
