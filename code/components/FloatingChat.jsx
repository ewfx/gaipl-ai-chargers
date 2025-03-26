import React, { useState, useEffect, useRef } from 'react';
import { getChatResponse } from '../services/api';
import { IconButton, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';

function FloatingChat({ chatHistory, setChatHistory, onClose }) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      const userMessage = { role: 'user', content: input };
      const updatedHistory = [...chatHistory, userMessage];
      setChatHistory(updatedHistory);
      setInput('');
      setIsLoading(true);
      
      try {
        const response = await getChatResponse(input, updatedHistory);
        setChatHistory([...updatedHistory, { 
          role: 'assistant', 
          content: response.response 
        }]);
      } catch (error) {
        console.error('Chat error:', error);
        setChatHistory([...updatedHistory, { 
          role: 'assistant', 
          content: 'Sorry, I encountered an error. Please try again.' 
        }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="floating-chat">
      <div className="chat-header">
        <h3>AI Chatbot</h3>
        <IconButton onClick={onClose} style={{ color: 'white' }} size="small">
          <CloseIcon />
        </IconButton>
      </div>
      
      <div className="chat-messages">
        {chatHistory.map((message, index) => (
          <div 
            key={index} 
            className={`message ${message.role === 'user' ? 'user' : 'assistant'}`}
          >
            {message.content}
          </div>
        ))}
        {isLoading && (
          <div className="message assistant">
            <CircularProgress size={20} style={{ color: '#7f8c8d' }} />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="chat-input-container">
        <input
          type="text"
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question..."
          disabled={isLoading}
          required
        />
        <IconButton 
          type="submit" 
          color="primary"
          disabled={isLoading || !input.trim()}
        >
          <SendIcon />
        </IconButton>
      </form>
    </div>
  );
}

export default FloatingChat;