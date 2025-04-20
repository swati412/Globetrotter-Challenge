import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// Import the specific API functions we need
import { usersApi } from '../services/api'; 

// Helper functions for localStorage persistence
const loadUserState = () => {
  try {
    const serializedState = localStorage.getItem('userState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Error loading user state:', err);
    return undefined;
  }
};

const saveUserState = (state) => {
  try {
    const serializedState = JSON.stringify({
      username: state.username,
      score: state.score,
      isAuthenticated: state.isAuthenticated
    });
    localStorage.setItem('userState', serializedState);
  } catch (err) {
    console.error('Error saving user state:', err);
  }
};

// Async thunk for login/user creation
export const loginOrCreateUser = createAsyncThunk(
  'user/loginOrCreate',
  async (username, { rejectWithValue }) => {
    try {
      // Try to get the user first
      const user = await usersApi.getUser(username);
      return user; // Return existing user data
    } catch (error) {
      // Check if the error is specifically a "user not found" error (e.g., 404)
      // Adjust the status code check based on your actual API response
      if (error.response && error.response.status === 404) {
        try {
          // User not found, try to create a new user
          const newUser = await usersApi.createUser(username);
          return newUser; // Return newly created user data
        } catch (createError) {
          // Failed to create user
          return rejectWithValue(createError.response?.data?.detail || 'Failed to create user');
        }
      } else {
        // Other error during getUser (network issue, server error, etc.)
        return rejectWithValue(error.response?.data?.detail || 'Failed to fetch user');
      }
    }
  }
);

// Load initial state from localStorage if available
const savedState = loadUserState();
const initialState = savedState || {
  username: null,
  score: 0,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.username = null;
      state.score = 0;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      // Clear localStorage on logout
      localStorage.removeItem('userState');
    },
    clearError: (state) => {
       state.error = null;
     }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginOrCreateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isAuthenticated = false;
      })
      .addCase(loginOrCreateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.username = action.payload.username;
        state.score = action.payload.score; // Ensure your API returns score
        state.isAuthenticated = true;
        state.error = null;
        // Save to localStorage when successful login
        saveUserState(state);
      })
      .addCase(loginOrCreateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Error message from rejectWithValue
        state.isAuthenticated = false;
        state.username = null;
        state.score = 0;
      });
  },
});

export const { logout, clearError } = userSlice.actions;

export default userSlice.reducer; 