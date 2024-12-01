import React, { useEffect, useState } from 'react';
import apiClient from '../services/api';

const RecommendationPage = () => {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await apiClient.get('/recommendations');
        setRecommendations(response.data);
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
      }
    };
    fetchRecommendations();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Recommendations</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((item: any, index) => (
          <div key={index} className="bg-white p-4 shadow rounded">
            <h2 className="text-xl font-semibold">{item.title}</h2>
            <p>{item.summary}</p>
            <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
              Read more
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationPage;
