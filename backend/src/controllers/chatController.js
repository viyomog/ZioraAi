const Chat = require('../models/Chat');
const User = require('../models/User');

// Use built-in fetch for Node.js 18+
const fetch = globalThis.fetch || require('node-fetch').default;

// Create a new chat
const createChat = async (req, res) => {
  try {
    const { participants } = req.body;
    
    // If no participants provided, create chat with just the current user
    const chatParticipants = participants && participants.length > 0 
      ? [...new Set([req.user.id, ...participants])] 
      : [req.user.id];

    // Check if participants exist (only for additional participants)
    if (participants && participants.length > 0) {
      const users = await User.find({ _id: { $in: participants } });
      if (users.length !== participants.length) {
        return res.status(400).json({ message: 'One or more participants not found' });
      }
    }

    const chat = new Chat({
      participants: chatParticipants
    });

    const savedChat = await chat.save();
    
    // Populate participants
    await savedChat.populate('participants', 'name username email role');
    
    res.status(201).json(savedChat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user chats
const getUserChats = async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user.id })
      .populate('participants', 'name username email role')
      .populate('messages.sender', 'name username email role')
      .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Send message to OpenRouter API
const sendToOpenRouter = async (messages, model) => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenRouter API key not configured');
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:5173', // For localhost development
      'X-Title': 'ZioraAi'
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
      stream: false
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

// Send message
const sendMessage = async (req, res) => {
  try {
    const { chatId, content, model } = req.body;
    
    // Validate input
    if (!content || !model) {
      return res.status(400).json({ message: 'Content and model are required' });
    }

    // Find chat and check if user is participant
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    if (!chat.participants.includes(req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if user has access to the model
    const user = await User.findById(req.user.id);
    const freeModels = [
      'x-ai/grok-4-fast:free',
      'nvidia/nemotron-nano-9b-v2:free',
      'deepseek/deepseek-chat-v3.1:free',
      'openai/gpt-oss-20b:free'
    ];

    const premiumModels = [
      'google/gemma-3n-e2b-it:free',
      'meta-llama/llama-3.3-8b-instruct:free',
      'cognitivecomputations/dolphin3.0-mistral-24b:free',
      'moonshotai/kimi-dev-72b:free'
    ];

    // If model is premium, check user role
    if (premiumModels.includes(model) && user.role !== 'professional' && user.role !== 'enterprise') {
      return res.status(403).json({ 
        message: 'Access denied. Professional or Enterprise subscription required for this model.' 
      });
    }

    // Format messages for OpenRouter
    const openRouterMessages = [
      { role: "user", content: content }
    ];

    // Add previous messages as context (limit to last 5 messages for context)
    const recentMessages = chat.messages.slice(-5);
    for (const msg of recentMessages) {
      if (msg.sender === 'ai') {
        openRouterMessages.unshift(
          { role: "assistant", content: msg.content }
        );
      } else {
        openRouterMessages.unshift(
          { role: "user", content: msg.content }
        );
      }
    }

    // Get response from OpenRouter
    const aiResponse = await sendToOpenRouter(openRouterMessages, model);

    // Add user message to chat
    const userMessage = {
      sender: req.user.id, // User ID for user messages
      content,
      model,
      timestamp: new Date()
    };

    // Add AI response to chat
    const aiMessageObj = {
      sender: 'ai', // String identifier for AI messages
      content: aiResponse,
      model,
      timestamp: new Date()
    };

    chat.messages.push(userMessage);
    chat.messages.push(aiMessageObj);
    chat.updatedAt = Date.now();
    
    const updatedChat = await chat.save();
    
    // Populate sender info for user messages only
    await updatedChat.populate({
      path: 'messages.sender',
      select: 'name username email role',
      match: { _id: { $ne: 'ai' } } // Only populate for non-AI messages
    });
    
    // Return both user message and AI response
    const userMessageWithSender = {
      sender: { _id: req.user.id },
      content,
      model,
      timestamp: userMessage.timestamp
    };
    
    const aiMessageWithSender = {
      sender: { _id: 'ai' },
      content: aiResponse,
      model,
      timestamp: aiMessageObj.timestamp
    };
    
    // Update chat title if it's the first message
    let chatTitle = chat.title;
    if (chatTitle === 'New Conversation' || chat.messages.length === 0) {
      chatTitle = content.substring(0, 30) + (content.length > 30 ? '...' : '');
      chat.title = chatTitle;
      await chat.save();
    }
    
    res.json({
      userMessage: userMessageWithSender,
      aiResponse: aiMessageWithSender,
      chatTitle: chatTitle
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Failed to get response from AI model', error: error.message });
  }
};

// Get chat messages
const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    
    // Find chat and check if user is participant
    const chat = await Chat.findById(chatId)
      .populate('participants', 'name username email role')
      .populate({
        path: 'messages.sender',
        select: 'name username email role',
        match: { _id: { $ne: 'ai' } } // Only populate for non-AI messages
      });
      
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    if (!chat.participants.some(participant => participant._id.toString() === req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(chat.messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createChat,
  getUserChats,
  sendMessage,
  getChatMessages
};