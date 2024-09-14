// pages/index.js
"use client"
import { useState } from 'react';
import Head from 'next/head';
import { TextField, Button, Box, Typography } from '@mui/material';
import axios from 'axios';

// Simulated API request function
async function handleChat(message) {
  // Replace with your actual API key and endpoint if needed
  const API_URL = 'https://api.openai.com/v1/chat/completions';
  const API_KEY = 'YOUR_OPENAI_API_KEY'; // Replace with your OpenAI API key

  try {
    const response = await axios.post(
      API_URL,
      {
        model: 'gpt-3.5-turbo', // Use GPT-4 if you have access
        messages: [{ role: 'user', content: message }],
        max_tokens: 100,
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return { response: response.data.choices[0].message.content };
  } catch (error) {
    console.error('Error fetching OpenAI response:', error);
    return { response: 'Error fetching response' };
  }
}

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');

  const sendMessage = async () => {
    if (!userMessage) return;

    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setUserMessage('');

    try {
      const data = await handleChat(userMessage);
      setMessages([...newMessages, { role: 'assistant', content: data.response }]);
    } catch (error) {
      setMessages([...newMessages, { role: 'assistant', content: 'Error fetching response' }]);
    }
  };

  return (
    <div>
      <Head>
        <title>Maargi Customer Support</title>
      </Head>
      <main>
        <h1>Welcome to Maargi Customer Support</h1>
        <Box sx={{ maxWidth: 600, margin: 'auto', padding: 2, borderRadius: '8px', boxShadow: 3 }}>
          <Typography variant="h5" mb={2}>
            Maargi Customer Support
          </Typography>
          <Box sx={{ height: 300, overflowY: 'auto', padding: 1, marginBottom: 2, border: '1px solid #ccc', borderRadius: '8px' }}>
            {messages.map((msg, index) => (
              <Box key={index} sx={{ marginBottom: '10px' }}>
                <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong> {msg.content}
              </Box>
            ))}
          </Box>
          <TextField
            fullWidth
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            label="Type your message"
            variant="outlined"
          />
          <Button onClick={sendMessage} variant="contained" color="primary" sx={{ marginTop: '10px' }}>
            Send
          </Button>
        </Box>
      </main>
    </div>
  );
}
