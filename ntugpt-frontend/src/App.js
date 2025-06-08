import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, Box, Typography } from "@mui/material";
import ChatBox from "./components/ChatBox";
import lionBody from "./assets/lion-colour.png";

// Import Poppins font
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";

const App = () => {
  const theme = createTheme({
    typography: {
      fontFamily: "Poppins, sans-serif",
    },
    palette: {
      mode: "dark",
      background: {
        default: "#0a0a0f",
        paper: "#141420",
      },
      text: {
        primary: "#ffffff",
        secondary: "#9ca3af",
      },
      primary: {
        main: "#3b82f6",
        light: "#60a5fa",
        dark: "#2563eb",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#8b5cf6",
        light: "#a78bfa",
        dark: "#7c3aed",
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarWidth: "thin",
            scrollbarColor: "#374151 #1f2937",
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#1f2937",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#374151",
              borderRadius: "4px",
              "&:hover": {
                background: "#4b5563",
              }
            }
          }
        }
      }
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box 
        sx={{ 
          height: "100vh", 
          display: "flex", 
          flexDirection: "column",
          background: "linear-gradient(135deg, #0a0a0f 0%, #141420 50%, #1e1b4b 100%)",
          overflow: "hidden"
        }}
      >
        {/* Header */}
        <Box 
          sx={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            padding: { xs: "16px 20px", md: "20px 40px" },
            borderBottom: "1px solid rgba(59, 130, 246, 0.1)",
            backdropFilter: "blur(20px)",
            backgroundColor: "rgba(20, 20, 32, 0.8)",
            position: "sticky",
            top: 0,
            zIndex: 1000,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* Lion Body PNG */}
            <Box
              sx={{
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img 
                src={lionBody} 
                alt="NTU Lion" 
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
                color: "#ffffff",
                fontWeight: 700,
                fontSize: { xs: "1.5rem", md: "2rem" },
                background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "-0.02em",
              }}
            >
              ntu.ai
            </Typography>
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
          <ChatBox theme={theme} />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;