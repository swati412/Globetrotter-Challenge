import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './stores';
import AppHeader from './components/AppHeader';
import HomeView from './views/HomeView';
import GameView from './views/GameView';
import ChallengeView from './views/ChallengeView';
import ChallengeAcceptView from './views/ChallengeAcceptView';
import LoginView from './views/LoginView';

function App() { 
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gradient-to-b from-gray-100 to-primary-50">
          <AppHeader />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomeView />} />
              <Route path="/login" element={<LoginView />} />
              <Route path="/game" element={<GameView />} />
              <Route path="/game/:challengeId" element={<GameView />} />
              <Route path="/challenge" element={<ChallengeView />} />
              <Route path="/challenge/:challengeId" element={<ChallengeView />} />
              <Route path="/challenge/accept/:challengeId" element={<ChallengeAcceptView />} />
            </Routes>
          </main>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
