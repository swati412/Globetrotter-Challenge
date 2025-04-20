import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { logout, clearError } from '../stores/userSlice';
import LoginPopup from './LoginPopup';

const AppHeader = () => {
  const { username, score: userTotalScore, isAuthenticated } = useSelector((state) => state.user);
  const { score: gameScore, correctAnswers, incorrectAnswers } = useSelector((state) => state.game);
  const dispatch = useDispatch();
  const location = useLocation();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const isGameRoute = location.pathname.startsWith('/game');

  const handleLogout = () => {
    dispatch(logout());
  };

  const openLoginPopup = () => {
    dispatch(clearError()); // Clear any previous errors
    setIsLoginOpen(true);
  };

  const displayScore = isGameRoute ? gameScore : userTotalScore;

  return (
    <header className="bg-gradient-to-r from-primary-500 to-primary-600 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-1 flex justify-start items-center">
            <Link to="/" className="flex items-center text-white hover:opacity-90 transition-opacity">
              <span className="text-2xl mr-2" role="img" aria-label="Globe">🌎</span>
              <span className="text-xl font-bold">Globetrotter</span>
            </Link>
          </div>
          
          <div className="flex-shrink-0">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-5 py-2 flex items-center justify-center space-x-6">
              <div className="flex items-center" title="Score">
                <span className="text-xl mr-1.5" role="img" aria-label="Trophy">🏆</span>
                <span className="font-bold text-white text-sm sm:text-base">{isAuthenticated ? displayScore : '0'}</span>
              </div>
              <div className="flex items-center" title="Correct Answers">
                <span className="text-xl mr-1.5" role="img" aria-label="Correct">✅</span>
                <span className="font-bold text-white text-sm sm:text-base">{isAuthenticated ? correctAnswers : '0'}</span>
              </div>
              <div className="flex items-center" title="Incorrect Answers">
                <span className="text-xl mr-1.5" role="img" aria-label="Incorrect">❌</span>
                <span className="font-bold text-white text-sm sm:text-base">{isAuthenticated ? incorrectAnswers : '0'}</span>
              </div>
            </div>
          </div>

          <div className="flex-1 flex justify-end items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className="text-white font-medium mr-2 truncate max-w-[120px]" title={username}>{username}</span>
                <button 
                  onClick={handleLogout}
                  className="bg-white/10 hover:bg-white/20 rounded-full p-2 text-white transition-colors"
                  title="Sign out"
                >
                  <span className="text-lg" role="img" aria-label="Logout">🚪</span>
                </button>
              </div>
            ) : (
              <button
                onClick={openLoginPopup}
                className="bg-white text-primary-600 hover:bg-primary-50 px-6 py-2 rounded-md text-base font-medium transition-colors shadow-sm"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Login Popup */}
      <LoginPopup isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </header>
  );
};

export default AppHeader; 