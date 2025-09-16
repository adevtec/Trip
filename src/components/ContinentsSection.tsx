'use client';

import Image from 'next/image';
import Link from 'next/link';
import { continents } from '@/data/mock';

export default function ContinentsSection() {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Avasta maailma</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {continents.map((continent) => (
            <Link
              key={continent.slug}
              href={`/continent/${continent.id}`}
              className="group relative overflow-hidden rounded-lg aspect-square shadow-md
                       transition-transform duration-300 transform hover:scale-105"
            >
              <Image
                src={continent.image}
                alt={continent.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="text-xl font-semibold text-center">{continent.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
