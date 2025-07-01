import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Profile from './pages/Profile';
import CreateProfile from './pages/CreateProfile';
import Competitions from './pages/Competitions';
import CompetitionDetail from './pages/CompetitionDetail';
import CreateCompetition from './pages/CreateCompetition';
import Media from './pages/Media';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/create-profile" element={<CreateProfile />} />
              <Route path="/competitions" element={<Competitions />} />
              <Route path="/competition/:id" element={<CompetitionDetail />} />
              <Route path="/create-competition" element={<CreateCompetition />} />
              <Route path="/media" element={<Media />} />
            </Routes>
          </Layout>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;