import type { Metadata } from 'next';
import { Root } from '@/views/Auth';

export const metadata: Metadata = { title: 'Create an account', robots: { index: false, follow: false } };

export default function Page() {
  return <Root initialMode="signup" />;
}
