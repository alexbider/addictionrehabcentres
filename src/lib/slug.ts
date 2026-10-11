/** A centre's id in the database and in dashboard URLs: its public path without slashes ("/search-listing/x/" becomes "search-listing__x"). */
export const routeToSlug = (route: string) => route.replace(/^\/|\/$/g, '').replace(/\//g, '__');
export const slugToRoute = (slug: string) => '/' + slug.replace(/__/g, '/') + '/';
export const SLUG_RE = /^[a-z0-9][a-z0-9_-]*$/;
