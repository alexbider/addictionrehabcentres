/** Which page types are rendered on the approved design views (switched on batch by batch; the rest still use the old components). */
export const ROLLOUT = {
  blogPosts: true,   // BlogPost view, all 186 posts
  drug: true,        // Drug view: 24 drug pages + 5 text-only provinces
  treatment: true,   // Intervention view: 33 treatment / support pages
  cityArchives: true, // Province listing design: 59 city archives under /listing-location/
  alcohol: true,     // Alcohol view
  document: true,    // Document view: about, FAQ, legal pages
};

/** Blog posts that get the column fix for posts without a table of contents (the 3-column grid kept its 200px rail with no rail inside).
 *  23 posts share the cause; only these are fixed until the owner approves the rest (audit/08-source-issues.md §34). Use ['*'] to fix all. */
export const TOC_LAYOUT_FIX: string[] = ['am-i-an-addict'];
