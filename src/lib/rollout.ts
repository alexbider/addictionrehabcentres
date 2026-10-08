/** Which page types are rendered on the approved design views (switched on batch by batch; the rest still use the old components). */
export const ROLLOUT = {
  blogPosts: true,   // BlogPost view, all 186 posts
  drug: false,       // Drug view: 24 drug pages + 5 text-only provinces
  treatment: false,  // Intervention view: 33 treatment / support pages
  cityArchives: false, // Province listing design: 59 city archives under /listing-location/
  alcohol: false,    // Alcohol view
  document: false,   // Document view: about, FAQ, legal pages
};
