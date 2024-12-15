import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  timeout: 5000,
});

export const fetchNewsByCategory = async (category: string) => {
  const response = await apiClient.get(`/news?category=${category}`);
  return response.data;
};

export default apiClient;
