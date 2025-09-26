const express = require('express');
const router = express.Router();
const { createChat, getUserChats, sendMessage, getChatMessages } = require('../controllers/chatController');
const { auth, premiumAuth } = require('../middleware/auth');

// Create a new chat (protected)
router.post('/', auth, createChat);

// Get user chats (protected)
router.get('/', auth, getUserChats);

// Send message (protected)
router.post('/message', auth, sendMessage);

// Get chat messages (protected)
router.get('/:chatId/messages', auth, getChatMessages);

module.exports = router;