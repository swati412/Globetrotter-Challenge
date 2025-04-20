import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ChallengeModal from '../components/ChallengeModal';
import LoginPopup from '../components/LoginPopup';

const ChallengeView = () => {
  const navigate = useNavigate();
  const { isAuthenticated, username, score } = useSelector(state => state.user);
  
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  
  // Automatically show challenge modal when the user visits this page
  useEffect(() => {
    if (isAuthenticated) {
      setShowChallengeModal(true);
    } else {
      setShowLoginPopup(true);
    }
  }, [isAuthenticated]);
  
  const handleLoginSuccess = () => {
    setShowLoginPopup(false);
    setShowChallengeModal(true);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-4">
      {!isAuthenticated && !showLoginPopup && (
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <span className="text-5xl text-primary-500 mx-auto mb-4 block" role="img" aria-label="Trophy">🏆</span>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Challenge Your Friends</h1>
          <p className="text-gray-600 mb-6">
            Sign in to create a challenge and compete with your friends!
          </p>
          <button
            onClick={() => setShowLoginPopup(true)}
            className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-6 rounded-md mb-4"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-800 font-medium"
          >
            Return Home
          </button>
        </div>
      )}
      
      {/* Challenge Modal */}
      <ChallengeModal 
        isOpen={showChallengeModal} 
        onClose={() => {
          setShowChallengeModal(false);
          navigate('/');
        }} 
      />
      
      {/* Login Popup */}
      <LoginPopup 
        isOpen={showLoginPopup} 
        onClose={() => {
          setShowLoginPopup(false);
          navigate('/');
        }}
        onLoginSuccess={handleLoginSuccess}
        message="Sign in to create a challenge!"
      />
    </div>
  );
};

export default ChallengeView; 