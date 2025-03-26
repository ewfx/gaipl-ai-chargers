import React, { useState } from 'react';
import './App.css';
import Search from './components/Search';
import FloatingChat from './components/FloatingChat';

function App() {
  const [chatVisible, setChatVisible] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Gen AI Integrated Support Platform</h1>
        <p className="subtitle">AI- Chargers Hackathon</p>
      </header>
      <main>
        <Search />
        <button 
          className={`chat-toggle-btn ${chatVisible ? 'active' : ''}`}
          onClick={() => setChatVisible(!chatVisible)}
        >
          {chatVisible ? 'Close Chat' : '💬 Chat with AI'}
        </button>
        {chatVisible && (
          <FloatingChat 
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            onClose={() => setChatVisible(false)}
          />
        )}
      </main>
    </div>
  );
}

export default App;