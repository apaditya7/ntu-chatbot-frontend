import React, { forwardRef } from "react";
import { Box, Typography } from "@mui/material";
import lionHead from "../assets/lion-body.png";

const Message = forwardRef(({ text, sender, theme }, ref) => {
  const isUser = sender === "user";

  return (
    <Box
      ref={ref}
      sx={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: "16px",
        alignItems: "flex-start",
        width: "100%",
      }}
    >
      {/* Avatar for bot messages */}
      {!isUser && (
        <Box
          sx={{
            width: { xs: 28, md: 32 },
            height: { xs: 28, md: 32 },
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: { xs: "8px", md: "12px" },
            flexShrink: 0,
            marginTop: "4px",
            boxShadow: "0 2px 8px rgba(59, 130, 246, 0.2)",
            padding: "4px",
          }}
        >
          <img 
            src={lionHead} 
            alt="AI" 
            style={{ 
              width: '100%', 
              height: '100%',
              objectFit: 'contain'
            }} 
          />
        </Box>
      )}

      <Box
        sx={{
          maxWidth: { xs: "calc(100% - 40px)", sm: "75%", md: "70%" },
          display: "flex",
          flexDirection: "column",
          alignItems: isUser ? "flex-end" : "flex-start",
          width: "100%",
        }}
      >
        <Box
          sx={{
            backgroundColor: isUser
              ? theme.palette.primary.main
              : "#1e293b",
            color: isUser 
              ? "white" 
              : theme.palette.text.primary,
            borderRadius: { xs: "16px", md: "18px" },
            padding: { xs: "12px 16px", md: "14px 18px" },
            fontSize: { xs: "14px", md: "15px" },
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
            textAlign: "left",
            wordBreak: "break-word",
            lineHeight: "1.6",
            border: !isUser ? "1px solid rgba(59, 130, 246, 0.1)" : "none",
            boxShadow: isUser
              ? "0 2px 12px rgba(59, 130, 246, 0.25)"
              : "0 2px 8px rgba(0, 0, 0, 0.1)",
            position: "relative",
            minHeight: { xs: "20px", md: "24px" },
            width: "fit-content",
            maxWidth: "100%",
            // Gradient border for bot messages
            ...(!isUser && {
              background: `linear-gradient(#1e293b, #1e293b) padding-box, 
                          linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20) border-box`,
              border: '1px solid transparent',
            }),
          }}
        >
          <Typography
            component="div"
            sx={{
              margin: 0,
              padding: 0,
              whiteSpace: "pre-wrap",
              fontSize: "inherit",
              lineHeight: "inherit",
              color: "inherit",
              fontFamily: "inherit",
              fontWeight: "inherit",
              // Handle empty messages during streaming
              minHeight: text ? "auto" : "1em",
              opacity: text ? 1 : 0.7,
            }}
          >
            {text || (isUser ? "" : "...")}
          </Typography>
        </Box>
      </Box>

      {/* Spacer for user messages to maintain layout consistency */}
      {isUser && (
        <Box sx={{ width: { xs: 32, md: 44 }, flexShrink: 0 }} />
      )}
    </Box>
  );
});

Message.displayName = "Message";

export default Message;