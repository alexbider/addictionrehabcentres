import placeIds from '@/data/place-ids.json';

/**
 * Google reviews for a centre — REAL data only, from the Google Places API (New).
 *  - Needs env GOOGLE_PLACES_API_KEY and the centre's `place_id` (src/data/place-ids.json today; the centre_profiles table later).
 *  - Without a key or a place_id, getPlaceReviews() returns null and every rating chip, star count, "N Google reviews" text and review
 *    section stays hidden: nothing is shown, nothing is invented. Review schema is never emitted from this data unless it is real.
 *  - Cached for 24 h (Next fetch cache). Display requirements: show "Powered by Google", the author name with a link to their profile, the
 *    review text unaltered, and link back to the place on Google Maps.
 */
export type PlaceReview = { author: string; authorUri: string | null; rating: number; text: string; when: string; published: string | null };
export type PlaceReviews = { rating: number; count: number; mapsUri: string | null; writeReviewUri: string; reviews: PlaceReview[]; attribution: 'Powered by Google' };

export interface ReviewsProvider { get(placeId: string): Promise<PlaceReviews | null> }

export const placeIdFor = (route: string): string | null => (placeIds as Record<string, string>)[route] ?? null;

const googlePlaces: ReviewsProvider = {
  async get(placeId) {
    const key = process.env.GOOGLE_PLACES_API_KEY;
    if (!key) return null;
    try {
      const res = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
        headers: { 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': 'rating,userRatingCount,googleMapsUri,reviews' },
        next: { revalidate: 86400, tags: ['places:' + placeId] },
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) return null;
      const j = (await res.json()) as { rating?: number; userRatingCount?: number; googleMapsUri?: string; reviews?: { authorAttribution?: { displayName?: string; uri?: string }; rating?: number; text?: { text?: string }; originalText?: { text?: string }; relativePublishTimeDescription?: string; publishTime?: string }[] };
      if (typeof j.rating !== 'number' || !j.userRatingCount) return null;
      return {
        rating: j.rating,
        count: j.userRatingCount,
        mapsUri: j.googleMapsUri ?? null,
        writeReviewUri: 'https://search.google.com/local/writereview?placeid=' + encodeURIComponent(placeId),
        reviews: (j.reviews ?? []).slice(0, 5).flatMap((r) => { const text = r.originalText?.text ?? r.text?.text ?? ''; return text && typeof r.rating === 'number' ? [{ author: r.authorAttribution?.displayName ?? 'Google user', authorUri: r.authorAttribution?.uri ?? null, rating: r.rating, text, when: r.relativePublishTimeDescription ?? '', published: r.publishTime ?? null }] : []; }),
        attribution: 'Powered by Google',
      };
    } catch { return null; }
  },
};

/** Swap this for another provider (e.g. data stored by an admin import) without touching the pages. */
let provider: ReviewsProvider = googlePlaces;
export const setReviewsProvider = (p: ReviewsProvider) => { provider = p; };

export async function getPlaceReviews(placeId: string | null | undefined): Promise<PlaceReviews | null> {
  if (!placeId) return null;
  return provider.get(placeId);
}
