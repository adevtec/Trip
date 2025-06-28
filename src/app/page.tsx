import Hero from '@/components/Hero';
import SearchEngine from '@/components/SearchEngine';  // Now imports from /components/SearchEngine/index.tsx
import ContinentsSection from '@/components/ContinentsSection';
import PopularDestinations from '@/components/PopularDestinations';
import LastMinuteDeals from '@/components/LastMinuteDeals';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <div className="max-w-5xl mx-auto p-4">
        <SearchEngine />
      </div>
      <ContinentsSection />
      <PopularDestinations />
      <LastMinuteDeals />
    </main>
  );
}
