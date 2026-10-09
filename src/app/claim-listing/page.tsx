import type { Metadata } from 'next';
import { Root } from '@/views/ClaimListing';
import { getPageByRoute } from '@/lib/content';
import { claimCentres } from '@/lib/claim';
import { JsonLd, pageMetadata } from '@/lib/metadata';

// Source /claim-your-listing/ (301 to here). The page is the Claim design; its directory search lists every real published centre.
export function generateMetadata(): Metadata {
  const page = getPageByRoute('/claim-listing/');
  return page ? pageMetadata(page) : {};
}

export default function Page() {
  const page = getPageByRoute('/claim-listing/');
  return (
    <>
      {page ? <JsonLd page={page} /> : null}
      <Root centres={claimCentres()} />
    </>
  );
}
