/** Every page type renders on its approved design view (the old per-type rollout flags and template fallbacks are gone). */

/** Blog posts that get the column fix for posts without a table of contents (the 3-column grid kept its 200px rail with no rail inside).
 *  23 posts share the cause; only these are fixed until the owner approves the rest (audit/08-source-issues.md §34). Use ['*'] to fix all. */
export const TOC_LAYOUT_FIX: string[] = ['am-i-an-addict'];

/** Ratings, review counts, prices, "Sponsored" / "Verified" labels, awards and similar values attached to REAL named centres are sample values taken from the design,
 *  not source data. true = show them so the pages match the design; false = they disappear and the layout stays intact. */
export const SHOW_SAMPLE_DATA = process.env.SHOW_SAMPLE_DATA === 'true'; // default false: no demo values in production (set SHOW_SAMPLE_DATA=true only to compare with the design)
