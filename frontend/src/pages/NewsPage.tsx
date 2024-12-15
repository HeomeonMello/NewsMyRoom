import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

type NewsArticle = {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl: string;
};

const NewsPage: React.FC = () => {
  const { category } = useParams();
  const [articles, setArticles] = useState<NewsArticle[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`/api/news?category=${category}`);
        setArticles(response.data.articles);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNews();
  }, [category]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 capitalize">{category} News</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <div key={article.id} className="border p-4 rounded shadow">
            <img src={article.imageUrl} alt={article.title} className="w-full h-40 object-cover mb-4" />
            <h3 className="text-lg font-bold">{article.title}</h3>
            <p className="text-gray-600 mb-2">{article.description}</p>
            <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              Read more
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsPage;
