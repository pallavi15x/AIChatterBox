const express = require('express');
const router = express.Router();

/**
 * POST /api/chat
 * Body: { message: string, history: [{ role: 'user' | 'bot', text: string }] }
 */
router.post('/', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'A "message" string is required.' });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GROQ_API_KEY is not configured on the server.' });
    }

    // Format history for Groq (OpenAI format)
    const systemMessage = {
      role: 'system',
      content: 'You are AIChatterbox, a helpful AI companion. Keep your replies very short, concise, and direct. Limit answers to a maximum of 2 to 3 sentences. Do not generate long paragraphs.'
    };

    // Map history to OpenAI roles (bot -> assistant)
    const formattedMessages = [systemMessage];
    
    if (history && Array.isArray(history)) {
      history.forEach(item => {
        const role = (item.role === 'bot' || item.role === 'assistant') ? 'assistant' : 'user';
        const content = item.text || item.content || '';
        if (content) {
          formattedMessages.push({ role, content });
        }
      });
    } else {
      formattedMessages.push({ role: 'user', content: message });
    }

    // Call Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API Error Response:', errorText);
      return res.status(502).json({ error: 'Failed to fetch response from Groq API.' });
    }

    const data = await response.json();
    const botReply = data.choices && data.choices[0] && data.choices[0].message
      ? data.choices[0].message.content
      : 'Sorry, I could not process that request.';

    return res.json({ reply: botReply });
  } catch (err) {
    console.error('Error in /api/chat:', err);
    return res.status(500).json({ error: 'Something went wrong on the server.' });
  }
});

/**
 * POST /api/chat/image-prompt
 * Body: { prompt: string }
 * Uses Groq to extract a single keyword for image rendering.
 */
router.post('/image-prompt', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'A "prompt" string is required.' });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GROQ_API_KEY is not configured.' });
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: 'You are an image prompt parser. Analyze the user prompt and respond with EXACTLY one or two english nouns representing the main subject of the image. Respond with ONLY these words, lowercase, no punctuation, no formatting.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 10
      })
    });

    if (!response.ok) {
      return res.json({ keyword: 'abstract' });
    }

    const data = await response.json();
    let keyword = data.choices && data.choices[0] && data.choices[0].message
      ? data.choices[0].message.content.trim().toLowerCase()
      : 'abstract';

    // Sanitize keyword
    keyword = keyword.replace(/[^a-z0-9\s]/g, '');

    return res.json({ keyword });
  } catch (err) {
    console.error('Error in /api/chat/image-prompt:', err);
    return res.json({ keyword: 'abstract' });
  }
});

module.exports = router;
