'use client';

import { useEffect } from 'react';

export default function NovatoursTerms() {
    useEffect(() => {
        // Ava link uues tabis/aknas
        window.open('https://drive.google.com/file/d/1nfctWHNe24WacmK0EhasJreaUmZT5Mgi/view', '_blank');
        // Pole vaja enam routerit, kuna me ei suuna kasutajat ära
    }, []);

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 mt-20">
            <div className="bg-white rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold mb-12 text-center">Novatours'i reisitingimused</h1>
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Novatoursi reisitingimused avanevad uues aknas.</p>
                    <a 
                        href="https://drive.google.com/file/d/1nfctWHNe24WacmK0EhasJreaUmZT5Mgi/view"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                    >
                        Kliki siia tingimuste avamiseks
                    </a>
                </div>
            </div>
        </div>
    );
} 