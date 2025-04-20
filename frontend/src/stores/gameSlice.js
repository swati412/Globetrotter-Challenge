import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentDestination: null,
  options: [],
  selectedOption: null,
  score: 0,
  correctAnswers: 0,
  incorrectAnswers: 0,
  isGameOver: false,
  difficulty: 'medium',
  questionStartTime: null,
  timeTaken: null,
  maxQuestionTime: 30
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setDestination: (state, action) => {
      state.currentDestination = action.payload;
      state.options = action.payload.options;
      state.selectedOption = null;
      state.questionStartTime = Date.now();
      state.timeTaken = null;
    },
    selectOption: (state, action) => {
      state.selectedOption = action.payload;
      if(state.questionStartTime && action.payload !== null){
        state.timeTaken =(Date.now() - state.questionStartTime) / 1000
      }
    },
    updateScore: (state, action) => {
      state.score += action.payload;
    },
    incrementCorrect: (state) => {
      state.correctAnswers += 1;
    },
    incrementIncorrect: (state) => {
      state.incorrectAnswers += 1;
    },
    setGameOver: (state) => {
      state.isGameOver = true;
    },
    setDifficulty: (state, action) => {
      state.difficulty = action.payload;
    },
    resetTimer: (state, action) => {
      state.questionStartTime = Date.now();
      state.timeTaken = null;
    },
    resetGame: (state) => {
      // Keep score and answer counts, reset other state
      return {
        ...initialState,
        score: state.score,
        correctAnswers: state.correctAnswers,
        incorrectAnswers: state.incorrectAnswers
      };
    },
    resetFullGame: (state) => {
      // Reset everything including scores
      return initialState;
    }
  },
});

export const { 
  setDestination, 
  selectOption, 
  updateScore, 
  incrementCorrect,
  incrementIncorrect,
  setGameOver, 
  setDifficulty,
  resetGame,
  resetTimer,
  resetFullGame
} = gameSlice.actions;
export default gameSlice.reducer; 