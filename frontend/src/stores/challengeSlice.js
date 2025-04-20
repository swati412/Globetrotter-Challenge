import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'; // Assuming axios is used for API calls

// Helper to get the base API URL (adjust if necessary)
const getApiUrl = () => import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Async Thunk for creating a challenge
export const createChallenge = createAsyncThunk(
  'challenge/create',
  async (friendUsername, { getState, rejectWithValue }) => {
    const { username } = getState().user; // Assuming user slice has username
    if (!username) return rejectWithValue('User not logged in');
    try {
      // TODO: Update API endpoint if needed
      const response = await axios.post(`${getApiUrl()}/challenges?creator_username=${username}&opponent_username=${friendUsername}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to create challenge');
    }
  }
);

// Async Thunk for accepting a challenge
export const acceptChallenge = createAsyncThunk(
  'challenge/accept',
  async (challengeId, { getState, rejectWithValue }) => {
    const { username } = getState().user; // Assuming user slice has username
    if (!username) return rejectWithValue('User not logged in');
    try {
       // TODO: Update API endpoint if needed
      const response = await axios.post(`${getApiUrl()}/challenges/${challengeId}/accept?username=${username}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to accept challenge');
    }
  }
);

// Async Thunk for fetching challenges (example - adjust as needed)
export const fetchChallenges = createAsyncThunk(
  'challenge/fetchAll',
  async (_, { getState, rejectWithValue }) => {
    const { username } = getState().user;
    if (!username) return rejectWithValue('User not logged in');
    try {
      // TODO: Update API endpoint if needed
      const response = await axios.get(`${getApiUrl()}/challenges/user/${username}`); 
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch challenges');
    }
  }
);

const initialState = {
  challenges: [], // Changed to store a list of challenges
  loading: false,
  error: null,
  // Keep other relevant state if needed
  // currentChallenge: null,
  // opponent: null,
  // isChallengeActive: false,
  // challengeScore: 0,
};

export const challengeSlice = createSlice({
  name: 'challenge',
  initialState,
  reducers: {
    // Removed old synchronous reducers, rely on thunks now
    // setChallenge: (state, action) => { ... },
    // updateChallengeScore: (state, action) => { ... },
    // endChallenge: (state) => { ... },
    clearError: (state) => {
       state.error = null;
     }
  },
  extraReducers: (builder) => {
    builder
      // Create Challenge
      .addCase(createChallenge.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createChallenge.fulfilled, (state, action) => {
        state.loading = false;
        state.challenges.push(action.payload); // Add the new challenge
      })
      .addCase(createChallenge.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Accept Challenge
      .addCase(acceptChallenge.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acceptChallenge.fulfilled, (state, action) => {
        state.loading = false;
        // Update the status of the accepted challenge
        const index = state.challenges.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.challenges[index] = action.payload;
        }
      })
      .addCase(acceptChallenge.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Challenges
      .addCase(fetchChallenges.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChallenges.fulfilled, (state, action) => {
        state.loading = false;
        state.challenges = action.payload; // Replace challenges with fetched ones
      })
      .addCase(fetchChallenges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export the clearError action if needed
export const { clearError } = challengeSlice.actions;

// No need to export synchronous actions that were removed
// export const { setChallenge, updateChallengeScore, endChallenge } = challengeSlice.actions;

export default challengeSlice.reducer; 