import type { Metadata } from 'next';
import HomePage from '@/components/HomePage';
import { getPageByRoute } from '@/lib/content';
import { JsonLd, pageMetadata } from '@/lib/metadata';

export function generateMetadata(): Metadata {
  const page = getPageByRoute('/');
  return page ? pageMetadata(page) : {};
}

export default function Page() {
  const page = getPageByRoute('/')!;
  return (
    <>
      <JsonLd page={page} />
      <HomePage page={page} />
    </>
  );
}
