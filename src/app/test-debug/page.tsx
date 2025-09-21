'use client';

import AreaSelect from '@/components/SearchEngine/components/AreaSelect';
import { useState } from 'react';

export default function TestDebugPage() {
  console.log('🚨 TEST PAGE LOADED - Console works!');

  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [showAreaSelect, setShowAreaSelect] = useState(false);

  return (
    <div style={{ padding: '20px' }}>
      <h1>AreaSelect Debug Test</h1>

      <button
        onClick={() => {
          console.log('🚨 Opening AreaSelect with destinationId: 8');
          setShowAreaSelect(true);
        }}
        style={{ padding: '10px', background: 'orange', border: 'none', borderRadius: '5px' }}
      >
        Test AreaSelect (Turkey - ID: 8)
      </button>

      <div style={{ position: 'relative', marginTop: '20px', minHeight: '400px' }}>
        {showAreaSelect && (
          <AreaSelect
            selectedAreas={selectedAreas}
            onSelectAction={(areas) => {
              console.log('🎯 Areas selected:', areas);
              setSelectedAreas(areas);
            }}
            destinationId="8"
            onCloseAction={() => {
              console.log('🔒 AreaSelect closed');
              setShowAreaSelect(false);
            }}
          />
        )}
      </div>

      <div style={{ marginTop: '20px' }}>
        <strong>Selected areas:</strong> {selectedAreas.join(', ') || 'None'}
      </div>
    </div>
  );
}