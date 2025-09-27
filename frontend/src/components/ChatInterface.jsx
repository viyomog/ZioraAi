import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import '../styles/chat-interface.css';

const ChatInterface = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedModel, setSelectedModel] = useState('xAI: Grok 4 Fast');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('starter');
  const [isComposing, setIsComposing] = useState(false);
  const [userName, setUserName] = useState('You');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
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
    // Always fetch chats on component mount, even without auth token
    fetchUserChats();
    
    // If we have an auth token, also fetch user role
    if (authToken) {
      fetchUserRole(authToken);
    }
  }, [authToken]);

  // Ensure we have a selected chat
  useEffect(() => {
    if (chats.length > 0 && !selectedChat) {
      setSelectedChat(chats[0]);
    }
  }, [chats, selectedChat]);

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

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [newMessage]);

  // Watch for token changes
  useEffect(() => {
    const handleStorageChange = () => {
      setAuthToken(localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Fetch user role and name
  const fetchUserRole = async (token) => {
    try {
      const response = await axios.get(`${API_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserRole(response.data.role || 'starter');
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
      // Always show sample chats as fallback
      const sampleChats = [
        { _id: '1', title: 'Welcome to ZioraAI', updatedAt: new Date() },
        { _id: '2', title: 'AI Model Capabilities', updatedAt: new Date(Date.now() - 86400000) },
        { _id: '3', title: 'Technical Assistance', updatedAt: new Date(Date.now() - 172800000) }
      ];
      
      if (!authToken) {
        // For demo purposes without auth
        setChats(sampleChats);
        if (sampleChats.length > 0 && !selectedChat) {
          setSelectedChat(sampleChats[0]);
        }
        return;
      }
      
      // Try to fetch from backend
      const response = await axios.get(`${API_URL}/api/chats`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      
      const fetchedChats = response.data.chats || [];
      
      // If we have real chats, use them; otherwise, use sample chats
      if (fetchedChats.length > 0) {
        setChats(fetchedChats);
        if (!selectedChat) {
          setSelectedChat(fetchedChats[0]);
        }
      } else {
        setChats(sampleChats);
        if (!selectedChat) {
          setSelectedChat(sampleChats[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
      // Fallback to sample chats on error
      const sampleChats = [
        { _id: '1', title: 'Welcome to ZioraAI', updatedAt: new Date() },
        { _id: '2', title: 'AI Model Capabilities', updatedAt: new Date(Date.now() - 86400000) },
        { _id: '3', title: 'Technical Assistance', updatedAt: new Date(Date.now() - 172800000) }
      ];
      setChats(sampleChats);
      if (sampleChats.length > 0 && !selectedChat) {
        setSelectedChat(sampleChats[0]);
      }
      // Only show error if it's not a network error (which might be expected in demo mode)
      if (authToken && error.response) {
        setError('Failed to fetch conversations. Please try again later.');
      }
    }
  };

  // Fetch chat messages
  const fetchChatMessages = async (chatId) => {
    try {
      if (!authToken) {
        // For demo purposes without auth
        const sampleMessages = [
          {
            sender: { _id: 'ai' },
            content: 'Hello! Welcome to ZioraAI. How can I assist you today?',
            model: 'x-ai/grok-4-fast:free',
            timestamp: new Date()
          }
        ];
        setMessages(sampleMessages);
        return;
      }
      
      // Try to fetch from backend
      const response = await axios.get(`${API_URL}/api/chats/${chatId}/messages`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Fallback to sample messages on error
      const sampleMessages = [
        {
          sender: { _id: 'ai' },
          content: 'Hello! Welcome to ZioraAI. How can I assist you today?',
          model: 'x-ai/grok-4-fast:free',
          timestamp: new Date()
        }
      ];
      setMessages(sampleMessages);
      // Only show error if it's not a network error (which might be expected in demo mode)
      if (authToken && error.response) {
        setError('Failed to load messages. Please try again later.');
      }
    }
  };

  // Create new chat
  const createNewChat = async () => {
    try {
      if (authToken) {
        try {
          const response = await axios.post(`${API_URL}/api/chats`, 
            { title: 'New Conversation' },
            { headers: { Authorization: `Bearer ${authToken}` } }
          );
          
          const newChat = response.data.chat;
          setChats([newChat, ...chats]);
          setSelectedChat(newChat);
          setMessages([]);
        } catch (error) {
          console.error('Error creating chat with backend:', error);
          // Fallback to local creation if backend fails
          const newChat = {
            _id: Date.now().toString(),
            title: 'New Conversation',
            updatedAt: new Date()
          };
          
          setChats([newChat, ...chats]);
          setSelectedChat(newChat);
          setMessages([]);
        }
      } else {
        // For demo purposes without auth
        const newChat = {
          _id: Date.now().toString(),
          title: 'New Conversation',
          updatedAt: new Date()
        };
        
        setChats([newChat, ...chats]);
        setSelectedChat(newChat);
        setMessages([]);
      }
      
      setIsSidebarOpen(false);
      setShowMenu(false);
    } catch (error) {
      console.error('Error creating chat:', error);
      setError(`Failed to create new conversation: ${error.response?.data?.message || 'Please try again'}`);
    }
  };

  // Select a chat
  const selectChat = async (chat) => {
    try {
      setSelectedChat(chat);
      setIsSidebarOpen(false);
      setShowMenu(false);
      
      // Fetch messages for the selected chat
      await fetchChatMessages(chat._id);
    } catch (error) {
      console.error('Error selecting chat:', error);
      setError('Failed to load conversation. Please try again.');
    }
  };

  // Handle key press events
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || loading) return;
    
    // If no chat is selected, create one first
    if (!selectedChat) {
      await createNewChat();
      // Wait a bit for state to update
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Double check we have a chat now
    if (!selectedChat) {
      setError('Please select or create a conversation first.');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Add user message to UI immediately
      const userMessage = {
        sender: { _id: localStorage.getItem('userId') || 'user' },
        content: newMessage,
        model: selectedModel,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      // Get the actual model value for the API call
      const selectedModelObj = availableModels.find(m => m.id === selectedModel);
      const modelValue = selectedModelObj ? selectedModelObj.value : selectedModel;
      
      if (authToken) {
        try {
          // Send message to backend
          const response = await axios.post(`${API_URL}/api/chats/message`, 
            { 
              chatId: selectedChat._id,
              content: newMessage,
              model: modelValue // Use the actual model value
            },
            { headers: { Authorization: `Bearer ${authToken}` } }
          );
          
          // Update with the saved message from backend
          const savedUserMessage = response.data.userMessage;
          const aiResponse = response.data.aiResponse;
          
          // Replace the temporary message with the saved one and add AI response
          setMessages(prev => [...prev.slice(0, -1), savedUserMessage, aiResponse]);
          setLoading(false);
        } catch (backendError) {
          console.error('Backend error sending message:', backendError);
          // Remove the temporary message
          setMessages(prev => prev.slice(0, -1));
          
          // Show error message
          setError(`Failed to get response from AI: ${backendError.response?.data?.message || backendError.message}`);
          setLoading(false);
        }
      } else {
        // For demo purposes, simulate API call to AI model
        try {
          // Extract the actual model identifier
          const modelIdentifier = modelValue.split(':')[0]; // Get everything before ':'
          
          // Simulate API call to AI model
          const aiResponse = await simulateAIResponse(newMessage, modelIdentifier);
          
          setTimeout(() => {
            const aiMessage = {
              sender: { _id: 'ai' },
              content: aiResponse,
              model: selectedModel,
              timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMessage]);
            setLoading(false);
          }, 1000);
        } catch (simError) {
          console.error('Simulation error:', simError);
          setTimeout(() => {
            const aiResponse = {
              sender: { _id: 'ai' },
              content: `This is a simulated response from the ${availableModels.find(m => m.id === selectedModel)?.name || 'AI model'}. In a real implementation, this would be the actual response from the AI model. Your message was: "${newMessage}"`,
              model: selectedModel,
              timestamp: new Date()
            };
            setMessages(prev => [...prev, aiResponse]);
            setLoading(false);
          }, 1000);
        }
      }
      
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      setError(`Failed to send message: ${error.response?.data?.message || 'Please try again'}`);
      setLoading(false);
      
      // Remove the unsent message from UI
      setMessages(prev => prev.slice(0, -1));
    }
  };

  // Simulate AI response based on model
  const simulateAIResponse = async (message, modelIdentifier) => {
    // This is a simulation - in a real app, this would be an API call to the AI service
    return new Promise((resolve) => {
      // Different responses based on model
      let response = "";
      
      switch(modelIdentifier) {
        case 'x-ai/grok-4-fast':
          response = `As Grok 4 Fast, I understand your question about "${message}". This advanced AI model developed by xAI excels at complex reasoning tasks with exceptional speed. How else can I assist you?`;
          break;
        case 'nvidia/nemotron-nano-9b-v2':
          response = `Nemotron Nano 9B V2 here! I'm optimized for code generation and technical tasks with NVIDIA acceleration. Your query about "${message}" is interesting from a technical perspective. Would you like me to help with any coding challenges?`;
          break;
        case 'deepseek/deepseek-chat-v3.1':
          response = `Hello! I'm DeepSeek V3.1, a high-performance model for natural language understanding. Regarding "${message}", I can provide detailed insights with enhanced contextual awareness. What specific aspects would you like to explore?`;
          break;
        case 'openai/gpt-oss-20b':
          response = `I'm GPT-OSS 20B, an open-source variant of GPT with strong general capabilities. About "${message}", I can offer balanced perspectives with ethical alignment. How can I further help with this topic?`;
          break;
        case 'google/gemma-3n-e2b-it':
          response = `Gemma 3n 2B at your service! I'm lightweight yet powerful, optimized for instruction following. Your message "${message}" is clear - I can help execute tasks efficiently. What would you like me to do?`;
          break;
        case 'meta-llama/llama-3.3-8b-instruct':
          response = `Llama 3.3 8B Instruct here - an industry-leading model for complex reasoning and dialogue. Regarding "${message}", I can provide comprehensive analysis and creative content. How can I assist further?`;
          break;
        case 'cognitivecomputations/dolphin3.0-mistral-24b':
          response = `Dolphin 3.0 Mistral 24B ready! I specialize in coding assistance and technical tasks. Your query about "${message}" has technical aspects I can help with. Do you need help with system administration or code?`;
          break;
        case 'moonshotai/kimi-dev-72b':
          response = `Kimi Dev 72B here with exceptional multilingual capabilities. Regarding "${message}", I can provide deep contextual understanding across languages. How else can I support your multilingual needs?`;
          break;
        default:
          response = `I'm an AI assistant powered by ${modelIdentifier || 'an advanced model'}. You asked about "${message}". I'm designed to help with a wide range of tasks. How can I assist you further?`;
      }
      
      resolve(response);
    });
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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

  // Clear error message
  const clearError = () => {
    setError('');
  };

  // Format chat title for display
  const formatChatTitle = (title) => {
    return title.length > 25 ? `${title.substring(0, 25)}...` : title;
  };

  // Format date for chat list
  const formatChatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="chat-interface-container">
      {/* Sidebar for conversations - hidden on mobile */}
      <div className={`chat-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Conversations</h2>
          <button className="new-chat-btn" onClick={createNewChat}>
            + New Chat
          </button>
        </div>
        <div className="chat-list">
          {chats.map((chat) => (
            <div 
              key={chat._id} 
              className={`chat-item ${selectedChat && selectedChat._id === chat._id ? 'active' : ''}`}
              onClick={() => selectChat(chat)}
            >
              <div className="chat-title">{formatChatTitle(chat.title)}</div>
              <div className="chat-date">{formatChatDate(chat.updatedAt)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-main-area">
        {/* Mobile Header */}
        <div className="mobile-header">
          <button 
            className="sidebar-toggle" 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            ☰
          </button>
          <h1>Ziora<span className="ai-gradient">Ai</span></h1>
          <button 
            className="menu-toggle" 
            onClick={() => setShowMenu(!showMenu)}
          >
            ⋮
          </button>
        </div>

        {/* Desktop Header */}
        <div className="desktop-header">
          <h1>Ziora<span className="ai-gradient">Ai</span></h1>
          <button 
            className="menu-toggle" 
            onClick={() => setShowMenu(!showMenu)}
          >
            Menu
          </button>
        </div>

        {/* Menu Dropdown - includes conversations on mobile */}
        {showMenu && (
          <div className="menu-dropdown">
            <button onClick={createNewChat}>New Chat</button>
            {/* Show conversations in menu on mobile */}
            <div className="mobile-conversations">
              <h3>Conversations</h3>
              {chats.map((chat) => (
                <button 
                  key={chat._id}
                  className={`menu-chat-item ${selectedChat && selectedChat._id === chat._id ? 'active' : ''}`}
                  onClick={() => selectChat(chat)}
                >
                  {formatChatTitle(chat.title)}
                </button>
              ))}
            </div>
            <button onClick={() => setShowMenu(false)}>Close Menu</button>
          </div>
        )}

        {/* Chat Messages Area */}
        <div className="chat-messages-area">
          {messages.length === 0 ? (
            <div className="welcome-message">
              <h2>Welcome to Ziora<span className="ai-gradient">Ai</span></h2>
              <p>Start a conversation with our advanced AI models. Select a model below and ask anything!</p>
              <div className="model-info">
                <h3>{availableModels.find(m => m.id === selectedModel)?.name || 'AI Model'}</h3>
                <p>{availableModels.find(m => m.id === selectedModel)?.description || 'Selected AI model'}</p>
              </div>
              <div className="welcome-features">
                <h3>Getting Started</h3>
                <ul>
                  <li>Select an AI model from the dropdown menu</li>
                  <li>Type your message in the input box below</li>
                  <li>Press Send or Enter to chat with the AI</li>
                  <li>Create new conversations with the + New Chat button</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="chat-messages">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`message ${message.sender._id === 'ai' ? 'ai-message' : 'user-message'}`}
                >
                  <div className="message-content">
                    <div className={`message-sender ${message.sender._id === 'ai' ? 'ai' : 'user'}`}>
                      {message.sender._id === 'ai' ? 'ZioraAI' : userName}
                    </div>
                    <div className="message-text">
                      <ReactMarkdown
                        components={{
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
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                    <div className="message-meta">
                      <div className="message-time">{formatDate(message.timestamp)}</div>
                      <div className="message-model">
                        {availableModels.find(m => m.value === message.model)?.name || 'AI Model'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="message ai-message">
                  <div className="message-content">
                    <div className="message-sender ai">ZioraAI</div>
                    <div className="message-text">
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
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Chat Input Area */}
        <div className="chat-input-area">
          <div className="model-selector">
            <div className="model-select-container">
              <select 
                className="model-select"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
              >
                {availableModels.map((model) => (
                  <option 
                    key={model.id} 
                    value={model.id}
                    disabled={isModelRestricted(model.id)}
                  >
                    {model.name}
                    {getModelTag(model.id) && ` (${getModelTag(model.id)})`}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="chat-input-container">
            <textarea
              ref={textareaRef}
              className="chat-input"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
              placeholder="Message ZioraAI..."
              rows="1"
            />
            <button 
              className="send-button"
              onClick={sendMessage}
            >
              <span className="send-button-text">Send</span>
              <span className="send-button-icon">↗</span>
            </button>
          </div>
          
          {userRole === 'starter' && (
            <div className="upgrade-notice">
              <p>Upgrade to Professional or Enterprise plans for access to advanced AI models and features.</p>
              <a href="/pricing" className="btn btn-secondary">View Plans</a>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message" onClick={clearError}>
          {error}
          <button className="close-error">×</button>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;