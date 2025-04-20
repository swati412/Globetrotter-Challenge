import React from 'react';

const DestinationClue = ({ clue }) => {
  // Simple check if clue is an array (for multiple clues) or string
  const clues = Array.isArray(clue) ? clue : [clue]; 

  return (
    <div className="p-6 bg-primary-50 rounded-2xl border border-primary-100 mb-6">
      <div className="flex items-center text-primary-600 mb-5">
        <span className="text-2xl mr-2 flex-shrink-0" role="img" aria-label="Globe">🌎</span>
        <h2 className="text-xl font-semibold">Where is this place?</h2>
      </div>
      
      <div className="space-y-4">
        {clues.map((c, index) => (
          <div key={index} className="bg-white rounded-lg p-4 border border-primary-100">
            <div className="flex items-start">
              <span className="text-primary-600 font-medium mr-3">Clue {index + 1}:</span>
              <p className="text-gray-700 flex-1 italic">{c}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DestinationClue; 