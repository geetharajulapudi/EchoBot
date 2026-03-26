# EchoBot
## Overview
EchoBot is a real-time, AI-powered chatbot that analyzes conversation history and generates context-aware responses. The project uses open-source or free LLM models (Hugging Face / OpenRouter) and keeps conversation history in memory for temporary context.

<img width="1896" height="934" alt="image" src="https://github.com/user-attachments/assets/65545441-7789-424e-a46a-38bfe9911765" />

## Features 
- Real-time conversation analysis
- Context-aware responses using the latest question + analyzed history
- Supports multiple free/open-source LLMs
- All conversation history is handled in memory
- Easily extendable to cloud APIs or local models

## Tech Stack
### Frontend
- React
- HTML & CSS
- Axios
### Backend
- Python
- FastAPI
- Hugging Face / Groq LLM Models
- LangGraph

## How It Works
1. User sends a message 
   - The message enters the system as the latest question.

2. History Analyzer
   - Summarizes or condenses previous conversation history in memory
   - Extracts relevant context for the main model

3. Main Model
  - Receives the analyzed history + latest question
  - Generates response using selected LLM model

4. Response
   - Bot returns the output to the user
   - History is updated in memory only (no DB)

## Future Enhancements
- Add persistent storage (database) for long-term conversation memory
- Multi-turn conversation memory management
- UI integration for web or mobile
