🏛️ AP Tourism Agentic RAG Application

An intelligent tourism assistant for Andhra Pradesh powered by Agentic Retrieval-Augmented Generation (RAG), Multi-Agent Systems, Conversational Memory, Context Resolution, Location Awareness, Redis Caching, and Large Language Models (LLMs).
The application delivers accurate, personalized, and context-aware tourism recommendations through a scalable AI architecture.

📌 Problem Statement

Tourists often face difficulties in finding reliable, personalized, and context-aware information regarding:

Tourist destinations
Travel planning
Accommodation suggestions
Local attractions
Cultural experiences
Transportation guidance

Traditional chatbots provide generic responses, lack memory, fail to understand follow-up questions, and cannot retrieve information effectively from structured knowledge sources.

This project addresses these limitations by combining:

Retrieval-Augmented Generation (RAG)
Multi-Agent Architecture
Conversational Memory
Context Resolution
Location Extraction
Intelligent Caching

🚀 Key Features

🔍 Agentic RAG System
-Vector-based semantic retrieval
-Context-aware response generation
-Knowledge-grounded answers
🤖 Multi-Agent Architecture
-Specialized agents for different tasks
-Dynamic agent routing
-Improved reasoning capabilities
🧠 Conversational Memory
-User preference tracking
-Session memory management
-Personalized interactions
💬 Multi-Chat Support
-Multiple independent conversations
-Separate chat histories
-Context preservation
⚡ Redis Caching
-Faster response times
-Reduced LLM API usage
-Improved scalability
📖 Chat History Management
-Persistent conversation storage
-Retrieval of previous chats
🔄 Context Resolution

Understands follow-up queries:

User

Tell me about Araku Valley.

User

How far is it from Vizag?

Resolved Query:

How far is Araku Valley from Vizag?

📍 Location Extraction
-Tourist destination identification
-Location-aware recommendations
-Geographic entity extraction
🗄️ PostgreSQL Integration
-Structured tourism data storage
-Efficient querying
-Scalable data management


🏗️ System Architecture
User
 │
 ▼
Frontend (React + Vite)
 │
 ▼
Backend (Flask)
 │
 ▼
Context Resolution Engine
 │
 ▼
Agent Router
 ├── Tourism Agent
 ├── Recommendation Agent
 ├── Memory Agent
 ├── Location Agent
 └── Retrieval Agent
 │
 ▼
Memory Layer
 │
 ▼
Redis Cache
 │
 ▼
PostgreSQL Database
 │
 ▼
Vector Database
 │
 ▼
Groq LLM
 │
 ▼
Response Generation
