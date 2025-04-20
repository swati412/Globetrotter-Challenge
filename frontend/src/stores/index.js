import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import gameReducer from './gameSlice';
import challengeReducer from './challengeSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    game: gameReducer,
    challenge: challengeReducer,
  },
}); 