import React from 'react';
import { useSelector } from 'react-redux';
import { LightBulbIcon } from '@heroicons/react/24/outline';

const FeedbackMessage = ({ feedback, onNext, showChallengeButton, onChallenge }) => {
  const { correct, message, correctAnswer, funFact } = feedback;
  const { isAuthenticated } = useSelector((state) => state.user);

  // Set colors and emojis based on correct/incorrect
  const bgColor = correct ? 'bg-teal-500' : 'bg-red-500';
  const emoji = correct ? '🎉' : '😔';

  return (
    <div className="mt-6">
      {/* Top colored feedback section - full width with no borders */}
      <div className={`${bgColor} p-8 text-center text-white rounded-t-xl`}>
        <div className="mb-4">
          <span className="text-4xl">{emoji}</span>
        </div>
        <h3 className="text-3xl font-semibold mb-3">{message}</h3>
        {!correct && correctAnswer && (
          <p className="text-white text-xl">
            The correct answer is <span className="font-bold">{correctAnswer.city}, {correctAnswer.country}</span>
          </p>
        )}
        {correct && correctAnswer && (
          <p className="text-white text-xl">
            You guessed it! <span className="font-bold">{correctAnswer.city}, {correctAnswer.country}</span>
          </p>
        )}
      </div>

      {/* Container for Fun Fact and buttons */}
      <div className="bg-white rounded-b-xl border border-gray-200 border-t-0 shadow-lg">
        {/* Fun Fact section */}
        {funFact && (
          <div className="p-8 border-b border-gray-100">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-yellow-50 rounded-full p-3 mr-5">
                <span className="text-3xl">💡</span>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">Fun Fact</h4>
                <p className="text-gray-700 text-lg">{funFact}</p>
              </div>
            </div>
          </div>
        )}

        {/* Buttons section */}
        <div className="p-6 flex flex-row justify-center gap-4">
          <button 
            onClick={onNext} 
            className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-md font-medium text-lg transition-colors"
          >
            Next
          </button>
          {showChallengeButton && isAuthenticated && (
            <button 
              onClick={onChallenge}
              className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-md font-medium text-lg transition-colors"
            >
              Challenge a Friend
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackMessage; 