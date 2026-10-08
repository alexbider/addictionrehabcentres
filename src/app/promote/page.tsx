import type { Metadata } from 'next';
import { Root } from '@/views/Promote';
import { getPageByRoute } from '@/lib/content';
import { promoteData } from '@/lib/promote';
import { JsonLd, pageMetadata } from '@/lib/metadata';

// Source /promote-your-centre/ (301 to here): exact source text and images inside the Promote design's sections.
export function generateMetadata(): Metadata {
  const page = getPageByRoute('/promote/');
  return page ? pageMetadata(page) : {};
}

export default function Page() {
  const page = getPageByRoute('/promote/');
  return (
    <>
      {page ? <JsonLd page={page} /> : null}
      <Root data={promoteData()} />
    </>
  );
}
