import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import NewsPage from './pages/NewsPage';
import RecommendationPage from './pages/RecommendationPage';
import Header from './components/Header';
import Footer from './components/Footer';

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/recommendations" element={<RecommendationPage />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
