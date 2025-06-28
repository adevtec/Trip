'use client';

import { useEffect } from 'react';

export default function CoralTravelTerms() {
    useEffect(() => {
        // Ava link uues tabis/aknas
        window.open('https://b2ccdn.coraltravel.ee/content/Charter%20flights%20general%20terms%20and%20conditions_2024%20(2).pdf', '_blank');
    }, []);

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 mt-20">
            <div className="bg-white rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold mb-12 text-center">Coral Travel reisitingimused</h1>
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Coral Travel reisitingimused avanevad uues aknas.</p>
                    <a 
                        href="https://b2ccdn.coraltravel.ee/content/Charter%20flights%20general%20terms%20and%20conditions_2024%20(2).pdf"
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