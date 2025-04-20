import axios from 'axios';

// Use environment variable or default for flexibility, like Vue version
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Destinations API (matching Vue structure)
export const destinationsApi = {
  getRandomDestination: async () => {
    const response = await api.get('/destinations/random');
    return response.data;
  },
  // Renamed from checkAnswer for consistency, assuming compatible payload/endpoint
  submitAnswer: async (answerData) => {
    // Vue version expects: destinationId, answer, username
    // React was passing an object: { destinationId, selectedOption, username }
    // Backend AnswerRequest expects: { destination_id: str, answer: str, username: Optional[str] }
    const payload = {
      destination_id: answerData.destinationId, 
      // Send the city string as the answer, not the whole object
      answer: answerData.selectedOption?.city, // Use optional chaining just in case       
      username: answerData.username,
    };
    // Ensure we don't send null/undefined answer if city is missing
    if (!payload.answer) {
      console.error("Cannot submit answer: selected option city is missing.");
      // You might want to throw an error here or handle it differently
      throw new Error("Invalid answer option selected."); 
    }
    const response = await api.post('/destinations/answer', payload);
    return response.data;
  },
  // Kept from original React version
  getDifficultyLevels: async () => {
    const response = await api.get('/destinations/difficulty');
    return response.data;
  },
};

// Users API (adding missing functions from Vue version)
export const usersApi = {
  createUser: async (username, initialStats = null) => {
    const payload = { username };
    if (initialStats) {
      payload.initial_score = initialStats.score;
      payload.initial_correct_answers = initialStats.correctAnswers;
      payload.initial_total_attempts = initialStats.totalAttempts;
    }
    const response = await api.post('/users', payload);
    return response.data;
  },
  getUser: async (username) => {
    const response = await api.get(`/users/${username}`);
    return response.data;
  },
  // Kept from original React version
  updateUserScore: async (username, points, isCorrect) => {
    const response = await api.post('/users/score', {
      username,
      points,
      isCorrect,
    });
    return response.data;
  },
};

// Challenges API (adding missing functions from Vue version)
export const challengesApi = {
  // Note: The thunks in challengeSlice might handle these calls now,
  // but including them here for structural consistency if needed elsewhere.
  createChallenge: async (creatorUsername) => {
    // The backend only requires creator_username
    const response = await api.post(`/challenges?creator_username=${creatorUsername}`);
    return response.data;
  },
  getChallenge: async (challengeId) => {
    const response = await api.get(`/challenges/${challengeId}`);
    return response.data;
  },
  acceptChallenge: async (challengeId, username) => {
     // Adjust endpoint based on backend implementation
    const response = await api.post(`/challenges/${challengeId}/accept?username=${username}`);
    return response.data;
  },
  // Example fetchChallengesByUser (similar to thunk)
  fetchChallengesByUser: async (username) => {
    const response = await api.get(`/challenges/user/${username}`);
    return response.data;
  }
};

// Default export matching Vue structure
export default {
  destinations: destinationsApi,
  users: usersApi,
  challenges: challengesApi,
}; 