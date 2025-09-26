import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import '../styles/chat-modern.css';

const ModernChat = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedModel, setSelectedModel] = useState('xAI: Grok 4 Fast');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('starter');
  const [showModelPopup, setShowModelPopup] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [userName, setUserName] = useState('You'); // Add user name state
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL;

  // AI Models Configuration
  const aiModels = {
    starter: [
      { 
        id: 'xAI: Grok 4 Fast', 
        name: 'Grok 4 Fast', 
        value: 'x-ai/grok-4-fast:free',
        description: 'Advanced AI model developed by xAI for complex reasoning tasks with exceptional speed',
        category: 'General Purpose'
      },
      { 
        id: 'NVIDIA: Nemotron Nano 9B V2', 
        name: 'Nemotron Nano 9B V2', 
        value: 'nvidia/nemotron-nano-9b-v2:free',
        description: 'Efficient model optimized for code generation and technical tasks with NVIDIA acceleration',
        category: 'Code & Technical'
      },
      { 
        id: 'DeepSeek: DeepSeek V3.1', 
        name: 'DeepSeek V3.1', 
        value: 'deepseek/deepseek-chat-v3.1:free',
        description: 'High-performance model for natural language understanding with enhanced contextual awareness',
        category: 'Natural Language'
      },
      { 
        id: 'OpenAI: gpt-oss-20b', 
        name: 'GPT-OSS 20B', 
        value: 'openai/gpt-oss-20b:free',
        description: 'Open-source variant of GPT with strong general capabilities and ethical alignment',
        category: 'General Purpose'
      }
    ],
    professional: [
      { 
        id: 'Google: Gemma 3n 2B', 
        name: 'Gemma 3n 2B', 
        value: 'google/gemma-3n-e2b-it:free',
        description: 'Lightweight yet powerful model optimized for instruction following and task execution',
        category: 'Instruction Following'
      },
      { 
        id: 'Meta: Llama 3.3 8B Instruct', 
        name: 'Llama 3.3 8B Instruct', 
        value: 'meta-llama/llama-3.3-8b-instruct:free',
        description: 'Industry-leading model for complex reasoning, dialogue, and creative content generation',
        category: 'Complex Reasoning'
      },
      { 
        id: 'Dolphin3.0 Mistral 24B', 
        name: 'Dolphin 3.0 Mistral 24B', 
        value: 'cognitivecomputations/dolphin3.0-mistral-24b:free',
        description: 'Specialized model for coding assistance, technical tasks, and system administration',
        category: 'Code & Technical'
      },
      { 
        id: 'MoonshotAI: Kimi Dev 72B', 
        name: 'Kimi Dev 72B', 
        value: 'moonshotai/kimi-dev-72b:free',
        description: 'Large-scale model with exceptional multilingual capabilities and deep contextual understanding',
        category: 'Multilingual'
      }
    ],
    enterprise: [
      { 
        id: 'Enterprise Exclusive Model 1', 
        name: 'Enterprise Pro Model', 
        value: 'enterprise/model-1',
        description: 'Exclusive model for enterprise users with advanced capabilities, enhanced security, and priority processing',
        category: 'Enterprise'
      },
      { 
        id: 'Enterprise Exclusive Model 2', 
        name: 'Enterprise Ultra Model', 
        value: 'enterprise/model-2',
        description: 'Premium model with specialized enterprise features, custom fine-tuning, and dedicated resources',
        category: 'Enterprise'
      }
    ]
  };

  // Get available models based on user role
  const getAvailableModels = () => {
    let models = [...aiModels.starter];
    if (userRole === 'professional' || userRole === 'enterprise') {
      models = [...models, ...aiModels.professional];
    }
    if (userRole === 'enterprise') {
      models = [...models, ...aiModels.enterprise];
    }
    return models;
  };

  const availableModels = getAvailableModels();

  // Initialize component
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserRole(token);
      fetchUserChats();
    }
  }, []);

  // Fetch chat messages when chat is selected
  useEffect(() => {
    if (selectedChat) {
      fetchChatMessages(selectedChat._id);
    }
  }, [selectedChat]);

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch user role and name
  const fetchUserRole = async (token) => {
    try {
      const response = await axios.get(`${API_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserRole(response.data.role || 'starter');
      // Set user name from profile or default to 'You'
      setUserName(response.data.name || response.data.username || 'You');
    } catch (error) {
      console.error('Error fetching user role:', error);
      setUserRole('starter');
      setUserName('You');
    }
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch user chats
  const fetchUserChats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/chat`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setChats(response.data);
      if (response.data.length > 0 && !selectedChat) {
        setSelectedChat(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
      setError('Failed to fetch conversations. Please try again later.');
    }
  };

  // Fetch chat messages
  const fetchChatMessages = async (chatId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/chat/${chatId}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to load messages. Please try again later.');
    }
  };

  // Create new chat
  const createNewChat = async (modelName) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post(`${API_URL}/api/chat`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setChats([response.data, ...chats]);
      setSelectedChat(response.data);
      setMessages([]);
      
      // Set the selected model if provided
      if (modelName) {
        setSelectedModel(modelName);
      }
      
      // Close the popup
      setShowModelPopup(false);
    } catch (error) {
      console.error('Error creating chat:', error);
      setError('Failed to create new conversation. Please try again.');
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || loading) return;
    
    try {
      setLoading(true);
      setError('');
      
      // Add user message to UI immediately
      const userMessage = {
        sender: { _id: localStorage.getItem('userId') },
        content: newMessage,
        model: selectedModel,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setNewMessage('');
      
      const token = localStorage.getItem('token');
      
      // Get the actual model value for the API call
      const modelObj = availableModels.find(m => m.id === selectedModel);
      const modelValue = modelObj ? modelObj.value : selectedModel;
      
      const response = await axios.post(`${API_URL}/api/chat/message`, {
        chatId: selectedChat._id,
        content: newMessage,
        model: modelValue
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Add AI response to messages
      setMessages(prev => [...prev, response.data]);
    } catch (error) {
      console.error('Error sending message:', error);
      setError(`Failed to send message: ${error.response?.data?.message || 'Please try again'}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle key press events
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Handle new chat creation
  const handleNewChatClick = () => {
    setShowModelPopup(true);
  };

  // Select model and create chat
  const selectModelAndCreateChat = (modelName) => {
    createNewChat(modelName);
  };

  // Check if model is restricted
  const isModelRestricted = (modelId) => {
    if (userRole === 'starter') {
      return aiModels.professional.some(m => m.id === modelId) || 
             aiModels.enterprise.some(m => m.id === modelId);
    }
    if (userRole === 'professional') {
      return aiModels.enterprise.some(m => m.id === modelId);
    }
    return false;
  };

  // Get model tag
  const getModelTag = (modelId) => {
    if (aiModels.professional.some(m => m.id === modelId)) {
      return 'professional';
    }
    if (aiModels.enterprise.some(m => m.id === modelId)) {
      return 'enterprise';
    }
    return null;
  };

  return (
    <div className="chat-container">
      {/* Model Selection Popup */}
      {showModelPopup && (
        <div className="model-popup-overlay">
          <div className="model-popup">
            <div className="model-popup-header">
              <h3>Select AI Model</h3>
              <button 
                className="close-popup" 
                onClick={() => setShowModelPopup(false)}
              >
                ×
              </button>
            </div>
            <div className="model-popup-content">
              <p>Choose an AI model to start your new conversation. Each model has unique strengths for different tasks.</p>
              <div className="model-options">
                {availableModels.map(model => (
                  <div 
                    key={model.id} 
                    className="model-option"
                    onClick={() => !isModelRestricted(model.id) && selectModelAndCreateChat(model.id)}
                  >
                    <h4>{model.name}</h4>
                    <p>{model.description}</p>
                    <div className="model-meta">
                      <span className="model-category">{model.category}</span>
                      {isModelRestricted(model.id) && (
                        <span className={`model-tag ${getModelTag(model.id)}`}>
                          {getModelTag(model.id).charAt(0).toUpperCase() + getModelTag(model.id).slice(1)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="chat-sidebar">
        <div className="chat-header">
          <h2>Conversations</h2>
          <button className="new-chat-btn" onClick={handleNewChatClick}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            New Chat
          </button>
        </div>
        
        <div className="chat-list">
          {chats.map(chat => (
            <div 
              key={chat._id} 
              className={`chat-item ${selectedChat?._id === chat._id ? 'active' : ''}`}
              onClick={() => setSelectedChat(chat)}
            >
              <div className="chat-item-content">
                <div className="chat-item-title">
                  {chat.title || 'Untitled Conversation'}
                </div>
                <div className="chat-item-preview">
                  {chat.messages?.length > 0 ? chat.messages[chat.messages.length - 1].content.substring(0, 40) + '...' : 'New conversation'}
                </div>
              </div>
              <div className="chat-item-date">
                {chat.updatedAt ? formatDate(chat.updatedAt) : 'Just now'}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="chat-main">
        {selectedChat ? (
          <>
            <div className="chat-messages">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`message ${message.sender?._id === localStorage.getItem('userId') ? 'user-message' : 'ai-message'}`}
                >
                  <div className="message-content">
                    <div className={`message-sender ${message.sender?._id === localStorage.getItem('userId') ? 'user' : 'ai'}`}>
                      {message.sender?._id === localStorage.getItem('userId') ? (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </svg>
                          {userName} {/* Use user's name instead of hardcoded "You" */}
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M12 16v-4"></path>
                            <path d="M12 8h.01"></path>
                          </svg>
                          AI Assistant {/* Always show "AI Assistant" for AI messages */}
                        </>
                      )}
                    </div>
                    <div className="message-text">
                      {message.sender?._id === localStorage.getItem('userId') ? (
                        // User messages - plain text
                        message.content
                      ) : (
                        // AI messages - with markdown support
                        <ReactMarkdown components={{
                          h1: ({node, ...props}) => <h1 className="markdown-h1" {...props} />,
                          h2: ({node, ...props}) => <h2 className="markdown-h2" {...props} />,
                          h3: ({node, ...props}) => <h3 className="markdown-h3" {...props} />,
                          p: ({node, ...props}) => <p className="markdown-p" {...props} />,
                          ul: ({node, ...props}) => <ul className="markdown-ul" {...props} />,
                          ol: ({node, ...props}) => <ol className="markdown-ol" {...props} />,
                          li: ({node, ...props}) => <li className="markdown-li" {...props} />,
                          code: ({node, ...props}) => <code className="markdown-code" {...props} />,
                          pre: ({node, ...props}) => <pre className="markdown-pre" {...props} />,
                          blockquote: ({node, ...props}) => <blockquote className="markdown-blockquote" {...props} />,
                          a: ({node, ...props}) => <a className="markdown-link" {...props} />,
                          strong: ({node, ...props}) => <strong className="markdown-strong" {...props} />,
                          em: ({node, ...props}) => <em className="markdown-em" {...props} />
                        }}>
                          {message.content}
                        </ReactMarkdown>
                      )}
                    </div>
                    <div className="message-meta">
                      <span className="message-model">{availableModels.find(m => m.value === message.model)?.name || 'AI Model'}</span>
                      <span className="message-time">{formatDate(message.timestamp)}</span>
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="message ai-message">
                  <div className="message-content">
                    <div className="message-sender ai">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12 16v-4"></path>
                        <path d="M12 8h.01"></path>
                      </svg>
                      AI Assistant
                    </div>
                    <div className="loading-indicator">
                      Thinking
                      <div className="loading-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="chat-input-area">
              <div className="model-selector">
                <div className="model-select-container">
                  <select 
                    value={selectedModel} 
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="model-select"
                  >
                    {availableModels.map(model => (
                      <option key={model.id} value={model.id}>
                        {model.name}
                        {isModelRestricted(model.id) && ` (${getModelTag(model.id)})`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="chat-input-container">
                <textarea
                  ref={textareaRef}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onCompositionStart={() => setIsComposing(true)}
                  onCompositionEnd={() => setIsComposing(false)}
                  placeholder="Message AI Assistant..."
                  className="chat-input"
                  disabled={loading}
                  rows="1"
                />
                <button 
                  className="send-button" 
                  onClick={sendMessage}
                  disabled={loading || !newMessage.trim()}
                >
                  {loading ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="2" x2="12" y2="6"></line>
                      <line x1="12" y1="18" x2="12" y2="22"></line>
                      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                      <line x1="2" y1="12" x2="6" y2="12"></line>
                      <line x1="18" y1="12" x2="22" y2="12"></line>
                      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  )}
                  {loading ? 'Sending...' : 'Send'}
                </button>
              </div>
              
              {userRole === 'starter' && (
                <div className="upgrade-notice">
                  <p>Upgrade to Professional or Enterprise plan to access more AI models and advanced features</p>
                  <a href="/pricing" className="btn btn-secondary">View Plans</a>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="no-chat-selected">
            <h3>Welcome to ZioraAi</h3>
            <p>Start a new conversation with one of our powerful AI models. Choose from a variety of specialized assistants designed for different tasks.</p>
            <button className="new-chat-btn" onClick={handleNewChatClick}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Start New Conversation
            </button>
          </div>
        )}
        
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default ModernChat;