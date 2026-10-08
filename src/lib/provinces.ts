// "Drug Rehab Centres By Provinces" block that the source shows on every page (labels and order as on the source;
// Yukon's source link is /rehab/yukon-drug-rehab-treatments/, which the source itself 301s to the URL below).
export const provinceNav = {
  heading: 'Drug Rehab Centres By Provinces',
  links: [
    ['Alberta Rehabs', '/alberta-rehabs/'],
    ['British Columbia Rehabs', '/british-columbia-rehabs/'],
    ['Ontario Rehabs', '/ontario-rehabs/'],
    ['Manitoba Rehabs', '/manitoba-rehabs/'],
    ['New Brunswick Rehabs', '/new-brunswick-rehabs/'],
    ['Newfoundland and Labrador Rehabs', '/newfoundland-and-labrador-rehabs/'],
    ['Northwest Territories Rehabs', '/northwest-territories-rehabs/'],
    ['Nova Scotia Rehabs', '/nova-scotia-rehabs/'],
    ['Prince Edward Island Rehabs', '/prince-edward-island-rehabs/'],
    ['Saskatchewan Rehabs', '/saskatchewan-rehabs/'],
    ['Nunavut Rehabs', '/nunavut-drug-rehab-centers/'],
    ['Quebec Rehabs', '/drug-alcohol-rehabs-in-quebec/'],
    ['Yukon Rehabs', '/yukon-drug-rehab-treatments/'],
  ] as [string, string][],
};

/** Listing category label (as on the source centre pages) → province page. */
export const categoryRoute: Record<string, string> = {
  'British Columbia Rehabs': '/british-columbia-rehabs/', 'Ontario Rehabs': '/ontario-rehabs/', 'Nova Scotia Rehabs': '/nova-scotia-rehabs/', 'Alberta Rehabs': '/alberta-rehabs/',
  'New Brunswick Rehabs': '/new-brunswick-rehabs/', 'Manitoba Rehabs': '/manitoba-rehabs/', 'Newfoundland and Labrador Rehabs': '/newfoundland-and-labrador-rehabs/',
  'Quebec Rehabs': '/drug-alcohol-rehabs-in-quebec/', 'Saskatchewan Rehabs': '/saskatchewan-drug-rehab-treatment/', 'Northwest Territories Rehabs': '/northwest-territories-rehabs/',
};

/** Province links for the "Drug Rehab Centres By Provinces" blocks: a province whose page does not exist is shown as plain text (no link). */
export function provinceNavItems(exists: (h: string) => boolean, current?: string): { label: string; href: string | null }[] {
  return provinceNav.links.filter(([, h]) => h !== current).map(([label, h]) => ({ label, href: exists(h) ? h : null }));
}
