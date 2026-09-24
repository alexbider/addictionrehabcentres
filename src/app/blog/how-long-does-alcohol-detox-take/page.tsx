import type { Metadata } from 'next';
import { Root } from '@/views/BlogPost';

export const metadata: Metadata = {
  title: { absolute: "How Long Does Alcohol Detox Take? A Day-by-Day Timeline | Addiction Rehab Centres Canada" },
  description: "Alcohol detox usually lasts 5–7 days. Learn what happens hour by hour, when withdrawal peaks, the warning signs of delirium tremens, and when medical detox is essential.",
  alternates: { canonical: "https://addictionrehabcenters.ca/blog/how-long-does-alcohol-detox-take/" },
  openGraph: { type: "article", title: "How Long Does Alcohol Detox Take? A Day-by-Day Timeline", description: "What happens in the first 72 hours, when withdrawal peaks, and when medical detox is non-negotiable.", publishedTime: "2026-08-28", modifiedTime: "2026-09-01" }
};

const jsonLd = "{\"@context\":\"https://schema.org\",\"@graph\":[{\"@type\":\"Article\",\"headline\":\"How Long Does Alcohol Detox Take? A Day-by-Day Timeline\",\"datePublished\":\"2026-08-28\",\"dateModified\":\"2026-09-01\",\"author\":{\"@type\":\"Person\",\"name\":\"Dr. Sarah Mitchell\",\"jobTitle\":\"Addiction Medicine Physician\"},\"reviewedBy\":{\"@type\":\"Person\",\"name\":\"Priya Nair, RN\"},\"publisher\":{\"@type\":\"Organization\",\"name\":\"Addiction Rehab Centres Canada\",\"logo\":{\"@type\":\"ImageObject\",\"url\":\"https://addictionrehabcenters.ca/assets/logo.png\"}},\"mainEntityOfPage\":\"https://addictionrehabcenters.ca/blog/how-long-does-alcohol-detox-take/\"},{\"@type\":\"BreadcrumbList\",\"itemListElement\":[{\"@type\":\"ListItem\",\"position\":1,\"name\":\"Home\",\"item\":\"https://addictionrehabcenters.ca/\"},{\"@type\":\"ListItem\",\"position\":2,\"name\":\"Blog\",\"item\":\"https://addictionrehabcenters.ca/blog/\"},{\"@type\":\"ListItem\",\"position\":3,\"name\":\"Alcohol\",\"item\":\"https://addictionrehabcenters.ca/blog/alcohol/\"},{\"@type\":\"ListItem\",\"position\":4,\"name\":\"How Long Does Alcohol Detox Take?\"}]},{\"@type\":\"FAQPage\",\"mainEntity\":[{\"@type\":\"Question\",\"name\":\"Can I detox from alcohol at home?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Only after a medical assessment. People with a history of seizures, heavy daily drinking, or other health conditions should detox under supervision.\"}},{\"@type\":\"Question\",\"name\":\"How long do alcohol cravings last after detox?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Physical withdrawal ends within about a week, but cravings and sleep disruption can persist for weeks to months (post-acute withdrawal).\"}},{\"@type\":\"Question\",\"name\":\"Is alcohol detox covered by provincial health plans?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Publicly funded withdrawal management beds exist in every province, though wait times vary. Private detox is paid out of pocket or through extended benefits.\"}}]}]}";

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <Root />
    </>
  );
}
