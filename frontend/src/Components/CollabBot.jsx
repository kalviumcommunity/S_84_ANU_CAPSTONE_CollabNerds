import React, { useState, useEffect, useRef } from 'react';
import '../Styles/CollabBot.css';

const CollabBot = ({ onClose }) => {
  const [messages, setMessages] = useState([{ from: 'bot', text: "Hi! I'm CollabBot. How can I help you today?" }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { from: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:6767/api/langchain/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input }),
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to get response');
      }

      const botReply = { from: 'bot', text: data.answer };
      setMessages(prev => [...prev, botReply]);
    } catch (error) {
      setError(error.message || 'Error reaching the AI service');
      setMessages(prev => [...prev, { 
        from: 'bot', 
        text: 'Sorry, I encountered an error. Please try again later.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isLoading) sendMessage();
  };

  return (
    <div className="collabbot-container">
      <div className="collabbot-header">
        <span>🤖 CollabBot</span>
        <button onClick={onClose}>✖</button>
      </div>

      <div className="collabbot-chat">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.from}`}>
            {msg.text}
          </div>
        ))}
        {isLoading && (
          <div className="message bot loading">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        <div ref={chatEndRef}></div>
      </div>

      <div className="collabbot-input">
        <input
          type="text"
          placeholder="Ask me anything about your project..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <button 
          onClick={sendMessage} 
          disabled={isLoading || !input.trim()}
        >
          {isLoading ? '⌛' : '➤'}
        </button>
      </div>
    </div>
  );
};

export default CollabBot;
