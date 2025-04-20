import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// Import the async thunk and potentially the clearError action
import { loginOrCreateUser, clearError } from '../stores/userSlice'; 

const LoginView = () => {
  const [usernameInput, setUsernameInput] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Use loading and error state from Redux store
  const { loading, error: reduxError } = useSelector((state) => state.user);
  // Local error for immediate validation
  const [validationError, setValidationError] = useState(null);

  // Clear Redux error when component mounts or unmounts
  useEffect(() => {
    dispatch(clearError());
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setValidationError(null); // Clear local validation error
    if (!usernameInput.trim()) {
      setValidationError('Username cannot be empty.');
      return;
    }
    
    try {
      // Dispatch the thunk and wait for it to complete
      // .unwrap() will return the fulfilled value or throw the rejected value
      await dispatch(loginOrCreateUser(usernameInput)).unwrap();
      
      // If unwrap() doesn't throw, login was successful
      navigate('/'); // Redirect to home page after successful login/creation

    } catch (rejectedValue) {
      // Error handled by extraReducers, but caught here by unwrap
      // The error message is already in reduxError state, 
      // no need to set local state unless you want specific component handling
      console.error('Login/Create failed:', rejectedValue); 
    }
    // Loading state is handled by Redux now
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-theme(spacing.32))]">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-primary-700">Sign In or Create Account</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              className={`input ${validationError || reduxError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
              placeholder="Enter your desired username"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              disabled={loading} // Disable input while Redux state is loading
            />
          </div>

          {/* Display validation error first, then Redux error */}
          {(validationError || reduxError) && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {validationError || reduxError}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="w-full btn btn-primary disabled:opacity-50"
              disabled={loading} // Disable button while Redux state is loading
            >
              {loading ? (
                <span className="flex items-center justify-center">
                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                   </svg>
                  Processing...
                </span>
              ) : (
                'Continue'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginView; 