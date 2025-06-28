'use client';

import Image from 'next/image';
import Link from 'next/link';
import { TRAVEL_IMAGES } from '@/utils/imageUtils';

export default function Hero() {
  return (
    <div className="relative h-[80vh] min-h-[600px] w-full">
      <Image
        src={TRAVEL_IMAGES.hero}
        alt="Exotic travel destination"
        fill
        className="object-cover"
        priority
        quality={90}
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          Eksootilised reisid parimate hindadega
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl">
          Leia endale unistuste sihtkoht ja broneeri kohe!
        </p>
        <Link
          href="/pakkumised"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full 
                   transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Vaata pakkumisi
        </Link>
      </div>
    </div>
  );
}
