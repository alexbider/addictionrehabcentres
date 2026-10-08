import type { Metadata } from 'next';
import { Root } from '@/views/ClaimListing';
import { getPageByRoute } from '@/lib/content';
import { claimData } from '@/lib/claim';
import { JsonLd, pageMetadata } from '@/lib/metadata';

// Source /claim-your-listing/ (301 to here): exact source text and image.
export function generateMetadata(): Metadata {
  const page = getPageByRoute('/claim-listing/');
  return page ? pageMetadata(page) : {};
}

export default function Page() {
  const page = getPageByRoute('/claim-listing/');
  return (
    <>
      {page ? <JsonLd page={page} /> : null}
      <Root data={claimData()} />
    </>
  );
}
