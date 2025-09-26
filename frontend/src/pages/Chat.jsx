import React from 'react';
import ModernChat from '../components/ModernChat';
import '../styles/chat-modern.css';

const Chat = () => {
  return (
    <div className="chat-page">
      <div className="container">
        <ModernChat />
      </div>
    </div>
  );
};

export default Chat;