import React, { useState, useEffect, useRef } from "react";
import { Box, TextField, IconButton, Typography, Container } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import Message from "./Message";
import lionHead from "../assets/lion-body.png";

// Import Inter font for chat messages
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";

const ChatBox = ({ theme }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstMessage, setIsFirstMessage] = useState(true);
  
  const chatContainerRef = useRef(null);
  const textFieldRef = useRef(null);

  // Function to send message to the backend and handle streaming response
  const sendMessage = async (text) => {
    if (!text.trim()) return;

    // If it's the first message, add it without the initial bot message
    if (isFirstMessage) {
      setMessages([{ text, sender: "user" }]);
      setIsFirstMessage(false);
    } else {
      setMessages(prev => [...prev, { text, sender: "user" }]);
    }
    
    setInput("");
    setIsLoading(true);

    try {
      const botMessageId = Date.now();
      setMessages(prev => [...prev, { id: botMessageId, text: "", sender: "bot" }]);

      const query = encodeURIComponent(text);
      const eventSource = new EventSource(`http://localhost:5001/chat/stream?message=${query}`, {
        withCredentials: false
      });

      eventSource.onmessage = (event) => {
        const chunk = JSON.parse(event.data);
        
        setMessages(prevMessages => {
          const updatedMessages = prevMessages.map(msg => 
            msg.id === botMessageId 
              ? { ...msg, text: (msg.text || "") + chunk.text } 
              : msg
          );
          
          return updatedMessages;
        });
      };
      
      eventSource.onerror = () => {
        eventSource.close();
        setIsLoading(false);
      };
      
      eventSource.addEventListener('complete', () => {
        eventSource.close();
        setIsLoading(false);
      });
      
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
      setMessages(prev => [...prev, { 
        text: "Sorry, I'm having trouble connecting to the server. Please try again later.", 
        sender: "bot" 
      }]);
    }
  };

  // Focus input on mount
  useEffect(() => {
    if (textFieldRef.current) {
      textFieldRef.current.focus();
    }
  }, []);

  // Empty state component
  const EmptyState = () => (
    <Box 
      sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: '40px 20px',
        textAlign: 'center'
      }}
    >
      <Box
        sx={{
          width: { xs: 64, md: 80 },
          height: { xs: 64, md: 80 },
          borderRadius: '20px',
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
          boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
          padding: '12px',
        }}
      >
        <img 
          src={lionHead} 
          alt="NTU AI" 
          style={{ 
            width: '100%', 
            height: '100%',
            objectFit: 'contain'
          }} 
        />
      </Box>
      
      <Typography 
        variant="h4" 
        sx={{ 
          color: theme.palette.text.primary,
          fontWeight: 600,
          marginBottom: '12px',
          fontSize: { xs: '1.3rem', md: '1.8rem' }
        }}
      >
        How can I help you today?
      </Typography>
      
      <Typography 
        variant="body1" 
        sx={{ 
          color: theme.palette.text.secondary,
          maxWidth: '400px',
          fontSize: { xs: '0.9rem', md: '1rem' },
          lineHeight: 1.6
        }}
      >
        Ask me anything about NTU - from admissions and courses to campus life and resources.
      </Typography>
    </Box>
  );

  return (
    <Container 
      maxWidth="md" 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        padding: { xs: '16px 12px', md: '20px 24px' },
        maxHeight: '100%',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Messages Container */}
      <Box
        ref={chatContainerRef}
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
          marginBottom: { xs: "16px", md: "20px" },
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE and Edge
          "&::-webkit-scrollbar": {
            display: "none", // Chrome, Safari, Opera
          },
          display: "flex",
          flexDirection: "column",
          padding: { xs: "8px", md: "12px" },
        }}
      >
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {messages.map((msg, index) => (
              <Message 
                key={msg.id || index} 
                text={msg.text} 
                sender={msg.sender} 
                theme={theme}
              />
            ))}
          </>
        )}
      </Box>

      {/* Chat Input */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: '#1e293b',
          borderRadius: { xs: "18px", md: "20px" },
          border: '2px solid rgba(59, 130, 246, 0.2)',
          padding: { xs: "4px", md: "6px" },
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.2)',
          transition: 'all 0.2s ease-in-out',
          '&:focus-within': {
            borderColor: theme.palette.primary.main,
            boxShadow: `0 4px 24px rgba(59, 130, 246, 0.3)`,
          },
          height: { xs: '48px', md: '52px' },
          width: '100%',
          maxWidth: '100%',
          position: 'sticky',
          bottom: 0,
          zIndex: 10,
        }}
      >
        <TextField
          ref={textFieldRef}
          fullWidth
          variant="outlined"
          placeholder="Message ntu.ai..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && input.trim() && !isLoading) {
              e.preventDefault();
              sendMessage(input);
            }
          }}
          disabled={isLoading}
          multiline={false}
          sx={{
            '& .MuiOutlinedInput-root': {
              border: 'none',
              borderRadius: { xs: '14px', md: '16px' },
              backgroundColor: 'transparent',
              fontFamily: 'Inter, sans-serif',
              fontSize: { xs: '15px', md: '16px' },
              fontWeight: 400,
              height: { xs: '40px', md: '40px' },
              '& fieldset': {
                border: 'none',
              },
              '&:hover fieldset': {
                border: 'none',
              },
              '&.Mui-focused fieldset': {
                border: 'none',
              },
            },
            '& .MuiInputBase-input': {
              color: theme.palette.text.primary,
              padding: { xs: '10px 16px', md: '10px 18px' },
              lineHeight: '1.5',
              height: { xs: '20px', md: '20px' },
              '&::placeholder': {
                color: theme.palette.text.secondary,
                opacity: 0.7,
              }
            }
          }}
        />
        <IconButton 
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || isLoading}
          sx={{
            backgroundColor: input.trim() && !isLoading ? theme.palette.primary.main : 'transparent',
            color: input.trim() && !isLoading ? 'white' : theme.palette.text.secondary,
            width: { xs: 36, md: 40 },
            height: { xs: 36, md: 40 },
            marginLeft: { xs: '6px', md: '8px' },
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: input.trim() && !isLoading ? theme.palette.primary.dark : 'rgba(59, 130, 246, 0.1)',
              transform: input.trim() && !isLoading ? 'scale(1.05)' : 'none',
            },
            '&:disabled': {
              backgroundColor: 'transparent',
              color: theme.palette.text.secondary,
              opacity: 0.5,
            }
          }}
        >
          <SendIcon sx={{ fontSize: { xs: 18, md: 20 } }} />
        </IconButton>
      </Box>
    </Container>
  );
};

export default ChatBox;