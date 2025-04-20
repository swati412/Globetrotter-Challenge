import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { TrophyIcon } from '@heroicons/react/24/outline';
import LoginPopup from '../components/LoginPopup';
import { challengesApi, usersApi } from '../services/api';

const ChallengeAcceptView = () => {
  const { challengeId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, username } = useSelector(state => state.user);
  
  const [challenge, setChallenge] = useState(null);
  const [challenger, setChallenger] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  
  useEffect(() => {
    const fetchChallengeDetails = async () => {
      if (!challengeId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Use the challengesApi instead of direct fetch
        const data = await challengesApi.getChallenge(challengeId);
        setChallenge(data);
        
        // Fetch challenger details using usersApi
        if (data.creator_id) {
          try {
            const userData = await usersApi.getUser(data.creator_username);
            setChallenger(userData);
          } catch (userErr) {
            console.error('Error fetching challenger details:', userErr);
            // Continue even if we can't get challenger details
          }
        }
      } catch (err) {
        console.error('Error fetching challenge:', err);
        setError(err.response?.data?.detail || 'Failed to load challenge');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchChallengeDetails();
  }, [challengeId]);
  
  // Check if user just went through authentication flow
  useEffect(() => {
    // If auth state changes to authenticated, we may have just logged in
    if (isAuthenticated && username) {
      console.log('User is authenticated as:', username);
      
      // Check if we previously started a challenge acceptance flow
      const pendingAccept = localStorage.getItem('pendingChallengeAccept');
      
      if (pendingAccept === challengeId) {
        console.log('Resuming pending challenge acceptance');
        localStorage.removeItem('pendingChallengeAccept');
        
        // Small delay to let things settle
        setTimeout(() => {
          acceptChallengeWithUsername(username);
        }, 100);
      }
    }
  }, [isAuthenticated, username, challengeId]);
  
  const handleAcceptChallenge = async () => {
    if (!isAuthenticated) {
      // Store that we're trying to accept this challenge
      localStorage.setItem('pendingChallengeAccept', challengeId);
      setShowLoginPopup(true);
      return;
    }
    
    await acceptChallengeWithUsername(username);
  };
  
  // Separate function to accept challenge with explicit username
  const acceptChallengeWithUsername = async (userNameToUse) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log(`Accepting challenge ${challengeId} for user ${userNameToUse}`);
      
      // Call the API to accept the challenge with the provided username
      const acceptedChallenge = await challengesApi.acceptChallenge(challengeId, userNameToUse);
      console.log("Challenge accepted successfully:", acceptedChallenge);
      
      // Navigate to the game with challenge context
      // Using window.location.href for a full page reload to ensure clean state
      window.location.href = `/game?challenge=${challengeId}`;
    } catch (error) {
      console.error('Error accepting challenge:', error);
      let errorMessage = 'Failed to accept challenge';
      
      // Get detailed error message if available
      if (error.response) {
        errorMessage = error.response.data?.detail || 
                      `Server error: ${error.response.status}`;
        console.error('Server response:', error.response);
      }
      
      setError(errorMessage);
      setIsLoading(false);
    }
  };
  
  const handleLoginSuccess = (loggedInUsername) => {
    setShowLoginPopup(false);
    
    // Show loading state immediately after successful login
    setIsLoading(true);
    
    console.log(`Login successful with username: ${loggedInUsername}`);
    
    // Directly accept the challenge with the username from login
    // Don't wait for Redux state to update
    acceptChallengeWithUsername(loggedInUsername);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mb-4"></div>
        <p className="text-gray-600">Loading challenge...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Challenge Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-6 rounded-md"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-4">
      {showLoginPopup && (
        <LoginPopup 
          isOpen={showLoginPopup}
          onClose={() => setShowLoginPopup(false)}
          onLoginSuccess={handleLoginSuccess}
          message="Sign in to accept this challenge!"
        />
      )}
      
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
        <div className="bg-primary-600 p-6 text-white text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
              <TrophyIcon className="h-12 w-12 text-yellow-300" />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2">You've Been Challenged!</h1>
          <p className="text-blue-100">
            {challenger ? challenger.username : 'Someone'} has challenged you to a Globetrotter game!
          </p>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-gray-500 font-medium">Challenger</h3>
                <p className="text-lg font-bold">{challenger ? challenger.username : 'Unknown Player'}</p>
              </div>
              
              {challenger && challenger.score && (
                <div className="text-right">
                  <h3 className="text-gray-500 font-medium">Their Score</h3>
                  <p className="text-lg font-bold">{challenger.score}</p>
                </div>
              )}
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-center">
              <p className="text-yellow-800">
                Think you can beat {challenger ? 'their' : 'the challenger\'s'} score? Accept the challenge and find out!
              </p>
            </div>
          </div>
          
          <button
            onClick={handleAcceptChallenge}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-4 rounded-md mb-4"
          >
            Accept Challenge
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-md"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChallengeAcceptView; 