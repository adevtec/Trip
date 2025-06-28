import { JSX } from 'react';
import Link from 'next/link';

interface TravelOperator {
  name: string;
  slug: string;
  logo?: string;
}

const travelOperators: TravelOperator[] = [
  { name: 'TEZ tour', slug: 'tez-tour' },
  { name: 'Join Up', slug: 'join-up' },
  { name: 'Itaka', slug: 'itaka' },
  { name: 'Anex', slug: 'anex' },
  { name: 'Novatours', slug: 'novatours' },
  { name: 'Coral Travel', slug: 'coral-travel' },
];

export default function TravelTermsPage(): JSX.Element {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Reisitingimused</h1>
        
        <div className="grid gap-6">
          {travelOperators.map((operator) => (
            <Link 
              key={operator.slug}
              href={`/reisitingimused/${operator.slug}`}
              className="block p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {operator.name}
                </h2>
                <svg 
                  className="w-6 h-6 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 5l7 7-7 7" 
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        <p className="mt-8 text-gray-600 text-sm">
          * Palun tutvuge hoolikalt valitud reisikorraldaja reisitingimustega enne reisi broneerimist.
        </p>
      </div>
    </div>
  );
}
