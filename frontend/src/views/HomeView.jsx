import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { clearError } from '../stores/userSlice';
import LoginPopup from '../components/LoginPopup';

const HomeView = () => {
  const { isAuthenticated, username, score } = useSelector((state) => state.user);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [afterLoginAction, setAfterLoginAction] = useState(null);
  const dispatch = useDispatch();

  const openLoginPopup = (nextAction = null) => {
    dispatch(clearError()); // Clear any previous errors
    setAfterLoginAction(nextAction);
    setIsLoginOpen(true);
  };
  
  const handleLoginSuccess = () => {
    setIsLoginOpen(false);
    if (afterLoginAction === 'challenge') {
      // Navigate to challenge page after successful login
      window.location.href = '/challenge';
    }
  };

  return (
    <div className="min-h-[calc(100vh-theme(spacing.16))] flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-700 mb-4">
          Welcome to Globetrotter Challenge
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Test your knowledge of famous places around the world in this fun travel guessing game!
        </p>

        {isAuthenticated ? (
          <div>
            <p className="text-xl mb-2">Welcome back, <span className="font-semibold text-primary-600">{username}</span>!</p>
            <p className="text-lg text-gray-700 mb-6">Your current score: <span className="font-bold text-accent-600">{score}</span></p>
            <div className="flex flex-row justify-center gap-5 mt-8">
              <Link
                to="/game"
                className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-4 px-8 rounded-md text-xl min-w-[200px] flex items-center justify-center transition-colors"
              >
                Start Playing
              </Link>
              <Link
                to="/challenge"
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-4 px-8 rounded-md text-xl min-w-[200px] flex items-center justify-center transition-colors"
              >
                Challenge a Friend
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-lg text-gray-600 mb-6">Sign in to track your progress and challenge your friends!</p>
            <div className="flex flex-row justify-center gap-5 mt-8">
              <button
                onClick={() => openLoginPopup()}
                className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-4 px-8 rounded-md text-xl min-w-[200px] flex items-center justify-center transition-colors"
              >
                Sign In / Create Profile
              </button>
              <div className="flex flex-col gap-3">
                <Link
                  to="/game"
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-4 px-8 rounded-md text-xl min-w-[200px] flex items-center justify-center transition-colors"
                >
                  Play as Guest
                </Link>
                <button
                  onClick={() => openLoginPopup('challenge')}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-6 rounded-md text-lg flex items-center justify-center transition-colors"
                >
                  Challenge a Friend
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Login Popup */}
      <LoginPopup 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        onLoginSuccess={handleLoginSuccess}
        message={afterLoginAction === 'challenge' ? "Sign in to challenge your friends!" : undefined}
      />
    </div>
  );
};

export default HomeView; 