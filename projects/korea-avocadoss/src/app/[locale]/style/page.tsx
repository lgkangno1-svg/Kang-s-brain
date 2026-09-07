import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { StyleConsultation } from '@/features/looks/style-consultation';
import { localizedAlternates } from '@/lib/seo/localized-metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'My Korea Look — Personalized Styling & Palace Photo Guidebook ($12 USD)',
    description: 'Find your perfect Hanbok style for Gyeongbokgung and Seoul palaces. 3 complete curated looks, Korean rental shop request cards, and custom palace photo routes.',
    alternates: localizedAlternates(locale, '/style'),
  };
}

export default async function StylePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <StyleConsultation />
    </main>
  );
}