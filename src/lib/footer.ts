// Footer link columns — copied unchanged from the design (Drug.jsx footerCols). Links whose route does not exist yet are hidden by SiteFooter.
export type FooterCol = { title: string; links: { label: string; href: string }[] };
const L = (arr: string[]) =>
  arr.map((s) => {
    const [label, p] = s.split('|');
    return { label, href: '/' + p + '/' };
  });
export const footerCols: FooterCol[] = [
  {
    title: 'Types of Services',
    links: L([
      'Detox Centres in Canada|detox-centres-in-canada',
      'Drug Rehabilitation in Canada|drug-rehabilitation-in-canada',
      '12 Step Program for Drug Rehab & Alcohol Treatment|12-steps-programs',
      'Home Detox in Canada|home-detox-in-canada',
      'Long Term Drug Rehab Canada|long-term-drug-rehab-canada',
      'Medical Detox in Canada|medical-detox-in-canada',
      'Outpatient Drug Rehab Centers|outpatient-drug-rehab-centers',
      'Residential Drug Rehabs in Canada|residential-drug-rehabs-in-canada',
      'Short Term Drug Rehab in Canada|short-term-drug-rehab-in-canada',
      'Substance Abuse & Addiction|substance-abuse-addiction',
      '30 Days Treatment by Canadian Provinces|30-days-treatment-by-canadian-provinces',
    ]),
  },
  {
    title: 'Special Services',
    links: L([
      'Adolescent Drug Rehab|adolescent-drug-rehab-center',
      'Christian Faith-Based Rehabs in Canada|christian-faith-based-rehabs-in-canada',
      'Drug & Alcohol Assessments in Canada|drug-alcohol-assessments-in-canada',
      'Raam Clinic|raam-clinic',
      'Drugs and Alcohol Intervention|drugs-and-alcohol-intervention',
      'First Nation Drug & Alcohol Rehab|first-nation-drug-alcohol-rehabs',
      'Holistic Services in Canada|holistic-services-in-canada',
      'Men Only Drug Rehabs in Canada|men-only-drug-rehabs-in-canada',
      'Pregnant Women Services in Canada|pregnant-women-addiction-services-in-canada',
      'Women Only Rehab Centres in Canada|women-only-rehab-centers-in-canada',
    ]),
  },
  {
    title: 'Other Services',
    links: L([
      'AA Support Group|aa-support-group',
      'Drug Support Groups in Canada|drug-support-groups-in-canada',
      'DUI in Canada|dui-in-canada',
      'DUI Lawyers in Canada|dui-lawyers-in-canada',
      'Prevention & Education Programs|prevention-education-programs',
      'Shelter Services in Canada|shelter-services-in-canada',
    ]),
  },
];
