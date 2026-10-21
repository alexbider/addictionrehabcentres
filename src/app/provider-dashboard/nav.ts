/** Links shown above the full page editor (/provider-dashboard/<centre>/). */
export const NAV = (current: string) => [
  { href: '/provider-dashboard/', label: 'Dashboard', current: current === 'overview' },
  { href: '/provider-dashboard/?view=leads', label: 'Leads', current: current === 'leads' },
  { href: '/provider-dashboard/?view=profile', label: 'Listing', current: current === 'edit' },
  { href: '/provider-dashboard/?view=billing', label: 'Billing', current: current === 'billing' },
];
