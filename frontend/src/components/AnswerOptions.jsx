const AnswerOptions = ({ options, selectedOption, onSelect, onChallenge }) => {
  const letters = ['A', 'B', 'C', 'D'];

  const getOptionClass = (option) => {
    // Base classes for all options
    const base = 'p-4 rounded-lg text-left transition-colors flex items-center border hover:border-primary-200';
    
    if (selectedOption === null) {
      // Default: White background, light border
      return `${base} bg-white border-gray-200 hover:bg-primary-50`;
    } else if (selectedOption === option) {
      // Selected: Blue background, white text
      return `${base} bg-primary-100 border-primary-300 ring-2 ring-primary-300`;
    } else {
      // Disabled/Faded after selection
      return `${base} bg-gray-100 border-gray-200 text-gray-400 opacity-70`;
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-primary-600 mb-4">Select the correct destination</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.isArray(options) && options.map((option, index) => (
          <button
            key={option.city || JSON.stringify(option)} 
            onClick={() => onSelect(option)}
            disabled={selectedOption !== null}
            className={`${getOptionClass(option)} disabled:opacity-70 disabled:cursor-not-allowed`}
          >
            {/* Lettered circle */}
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-3 font-medium">
              {letters[index]}
            </span>
            <div className="text-left">
              <span className="font-semibold block text-gray-900">{option.city}</span>
              <span className="text-sm text-gray-500">{option.country}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Bottom action buttons */}
      <div className="flex justify-center gap-4 mt-8">
        <button 
          className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2.5 rounded-md font-medium transition-colors"
          onClick={() => onSelect(null)}
        >
          Skip Question
        </button>
        <button 
          className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2.5 rounded-md font-medium transition-colors"
          onClick={onChallenge}
        >
          Challenge a Friend
        </button>
      </div>
    </div>
  );
};

export default AnswerOptions; 