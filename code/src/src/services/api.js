import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Search endpoint
export const searchData = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/api/search`, {
      params: { query }
    });
    return response.data;
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
};

// chat endpoint
export const getChatResponse = async (query, chatHistory = []) => {
  try {
    const response = await fetch('http://localhost:8000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        chat_history: chatHistory
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Chat request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting chat response:', error);
    throw error;
  }
};