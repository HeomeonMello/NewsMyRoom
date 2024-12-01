import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
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
       <Route path="/" element={<Navigate to="/login" />} /> {/* 기본 경로 리디렉션 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/recommendations" element={<RecommendationPage />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
