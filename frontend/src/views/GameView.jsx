import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom'; // Add Link for Challenge button
import {
  setDestination,
  selectOption,
  updateScore,
  setGameOver,
  resetGame,
  resetFullGame,
  incrementCorrect,
  incrementIncorrect,
} from '../stores/gameSlice';
import { destinationsApi } from '../services/api';
import AnswerOptions from '../components/AnswerOptions';
import DestinationClue from '../components/DestinationClue';
import FeedbackMessage from '../components/FeedbackMessage';
import ChallengeModal from '../components/ChallengeModal';
import LoginPopup from '../components/LoginPopup';
import Timer from '../components/Timer';

const GameView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, username } = useSelector((state) => state.user);
  const { currentDestination, options, selectedOption, score, correctAnswers, incorrectAnswers, isGameOver, timeTaken, maxQuestionTime } = useSelector(
    (state) => state.game
  );

  console.log(timeTaken)
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(null);

  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [challengeId, setChallengeId] = useState(null);

  useEffect(() => {
    // Check for authentication and challenge context
    const searchParams = new URLSearchParams(location.search);
    const challenge = searchParams.get('challenge');
    
    if (challenge) {
      console.log('Challenge detected:', challenge);
      setChallengeId(challenge);
      
      // Check if we need to restore auth state from localStorage
      // This is a fallback in case the Redux store hasn't loaded the auth state yet
      if (!isAuthenticated) {
        try {
          const savedUserState = localStorage.getItem('userState');
          if (savedUserState) {
            const parsedState = JSON.parse(savedUserState);
            if (parsedState.isAuthenticated) {
              console.log('Restored auth state from localStorage:', parsedState.username);
              // We don't need to dispatch anything here, the userSlice should load this state itself
            }
          }
        } catch (err) {
          console.error('Error checking localStorage auth:', err);
        }
      }
    }
    
    // Load the first question
    loadNewDestination();
  }, [location.search, isAuthenticated]);

  // Add useEffect to log state for debugging
  useEffect(() => {
    if (challengeId) {
      console.log('Challenge game in progress, ID:', challengeId);
    }
  }, [challengeId, currentDestination]);

  const loadNewDestination = async () => {
    setLoading(true);
    setError(null);
    setFeedback(null); // Clear feedback when loading new question
    dispatch(resetGame()); // Reset game state but preserve scores
    try {
      const data = await destinationsApi.getRandomDestination();
      dispatch(setDestination(data));
      setQuestionStartTime(Date.now())
    } catch (error) {
      setError('Failed to load destination. Please try again.');
      console.error('Error loading destination:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeUp = () => {
    if(!selectOption){
      handleAnswer(null);
    }
  }
  console.log(timeTaken, "TIME")
  const handleAnswer = async (option) => {
    // Skip function for null option
    if (option === null) {
      loadNewDestination();
      return;
    }
    
    if (selectedOption || loading) return; // Prevent multiple answers or during load
    setLoading(true); // Indicate processing answer
    const elaspedTime = questionStartTime ? (Date.now() - questionStartTime) / 1000 : maxQuestionTime
    const timeTakenValue = Math.min(elaspedTime, maxQuestionTime);
    dispatch(selectOption(option));
    try {
      const timeLeft = Math.max(0, maxQuestionTime - timeTakenValue)
      const timePercentage = timeLeft / maxQuestionTime
      const result = await destinationsApi.submitAnswer({
        destinationId: currentDestination.id,
        selectedOption: option, 
        username,
        timeTaken: timeTakenValue
      });

      const timeBonus = result.correct ? Math.round(timePercentage * 20) : 0;
      const basePoints = result.correct ? 10 : 0;
      const totalPoints = basePoints + timeBonus;
      
      setFeedback({
        correct: result.correct,
        message: result.message || (result.correct ? 'Correct!' : 'Not quite...'),
        correctAnswer: result.correct_answer,
        funFact: result.fun_fact,
      });

      // Dispatch score and count updates
      if (result.correct) {
        debugger
        dispatch(updateScore(totalPoints));
        dispatch(incrementCorrect()); // Dispatch correct increment
      } else {
        dispatch(incrementIncorrect()); // Dispatch incorrect increment
      }

    } catch (error) {
      setError('Could not submit answer. Please try again.'); 
      console.error('Error checking answer:', error);
      setLoading(false); // Stop loading on error
    }
    // Set loading to false here as well, since the automatic load is removed
    setLoading(false); 
  };

  const handleOpenChallengeModal = () => {
    if (!isAuthenticated) {
      setShowLoginPopup(true);
    } else {
      setShowChallengeModal(true);
    }
  };

  const handleCloseChallengeModal = () => {
    setShowChallengeModal(false);
  };
  
  const handleLoginSuccess = () => {
    setShowLoginPopup(false);
    setShowChallengeModal(true);
  };

  // --- Render Logic --- 

  const renderLoading = () => (
    <div className="text-center p-10">
      <svg className="animate-spin h-10 w-10 mx-auto text-primary-500 mb-4" xmlns="http://www.w3.org/2000/svg"
        fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
        </path>
      </svg>
      <p className="text-gray-600">Loading your next destination...</p>
    </div>
  );

  const renderError = () => (
    <div className="text-center p-10 bg-red-50 rounded-lg border border-red-200">
      <div className="text-red-500 mb-3">
         <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
           <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
         </svg>
      </div>
      <h2 className="text-lg font-medium text-gray-900 mb-2">Something went wrong</h2>
      <p className="text-gray-600 mb-4">{error}</p>
      <button onClick={loadNewDestination} className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-md">
        Try Again
      </button>
    </div>
  );

  const renderGameOver = () => (
    <div className="text-center p-10">
      <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
      <p className="text-xl mb-4">Your final score: {score}</p>
      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
        <button
          onClick={() => {
            dispatch(resetFullGame()); // Reset everything for a fresh game
            loadNewDestination();
          }}
          className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-md"
        >
          Play Again
        </button>
        <button
          onClick={handleOpenChallengeModal}
          className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-md"
        >
          Challenge a Friend
        </button>
      </div>
    </div>
  );

  const renderGameQuestion = () => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 p-6">
      {<Timer onTimeUp={handleTimeUp}/>}
      {/* Destination clue component */}
      <DestinationClue clue={currentDestination.clues} /> 

      
      {/* Render answer options */}
      <AnswerOptions
        options={options}
        selectedOption={selectedOption}
        onSelect={handleAnswer}
        onChallenge={handleOpenChallengeModal}
      />
    </div>
  );

  const renderGameContent = () => (
    <>
      {!feedback ? (
        renderGameQuestion()
      ) : (
        <FeedbackMessage 
          feedback={feedback} 
          onNext={loadNewDestination}
          showChallengeButton={true}
          onChallenge={handleOpenChallengeModal}
        />
      )}

      {/* Login Popup */}
      <LoginPopup 
        isOpen={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
        onLoginSuccess={handleLoginSuccess}
        message="Sign in to challenge your friends!"
      />

      {/* Challenge Modal */}
      {showChallengeModal && (
        <ChallengeModal 
          isOpen={showChallengeModal}
          onClose={handleCloseChallengeModal}
        />
      )}
    </>
  );

  return (
    <div className="py-6 px-4 max-w-4xl mx-auto">
      {isGameOver ? renderGameOver() :
       error ? renderError() :
       loading && !currentDestination ? renderLoading() :
       currentDestination ? renderGameContent() :
       renderLoading() // Fallback loading if no state matches
      }
    </div>
  );
};

export default GameView;