# 🏛️ AP Tourism Agentic RAG Application

> An Intelligent Multi-Agent Tourism Assistant for Andhra Pradesh powered by Agentic RAG, Conversational Memory, Context Resolution, Redis Caching, and Large Language Models.

---

## 📖 Overview

The AP Tourism Agentic RAG Application is an AI-powered tourism assistant designed to provide accurate, context-aware, and personalized tourism information about Andhra Pradesh.

The system combines:

- 🔍 Retrieval-Augmented Generation (RAG)
- 🤖 Multi-Agent Architecture
- 🧠 Conversational Memory
- 📍 Location Extraction
- 🔄 Context Resolution
- ⚡ Redis Caching
- 🗄️ PostgreSQL Storage
- 🚀 Groq LLM Integration

to deliver intelligent and scalable tourism assistance.

---

## 🎯 Problem Statement

Traditional tourism chatbots often:

- Provide generic responses
- Lack conversational memory
- Fail to understand follow-up questions
- Cannot personalize recommendations
- Do not retrieve information from domain-specific knowledge bases

This project solves these challenges by integrating Agentic RAG with memory, context understanding, intelligent routing, and structured data retrieval.

---

## ✨ Features

### 🔍 Retrieval-Augmented Generation (RAG)

- Semantic search using vector embeddings
- Context-grounded responses
- Domain-specific tourism knowledge retrieval

### 🤖 Multi-Agent System

- Tourism Agent
- Recommendation Agent
- Memory Agent
- Location Agent
- Retrieval Agent

### 🧠 Conversational Memory

- User preference tracking
- Session memory
- Personalized recommendations

### 💬 Multi-Chat Support

- Multiple independent conversations
- Persistent chat history

### ⚡ Redis Caching

- Faster response generation
- Reduced LLM calls
- Improved scalability

### 🔄 Context Resolution

Example:

User:
> Tell me about Araku Valley

User:
> How far is it from Vizag?

Resolved Query:
> How far is Araku Valley from Vizag?

### 📍 Location Extraction

- Destination identification
- Location-aware recommendations
- Geographic entity extraction

### 🗄️ PostgreSQL Integration

- Structured tourism dataset storage
- Fast querying
- Scalable architecture

---

## 🏗️ System Architecture

```text
User
 │
 ▼
Frontend (React + Vite)
 │
 ▼
Flask Backend
 │
 ▼
Context Resolver
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
Redis Cache
 │
 ▼
PostgreSQL
 │
 ▼
Vector Database
 │
 ▼
Groq LLM
 │
 ▼
Response Generator
```

---

## 📂 Project Structure

```text
AP-Tourism-Agentic-RAG
│
├── Frontend
│   ├── src
│   ├── public
│   ├── package.json
│   └── vite.config.js
│
├── Backend
│   ├── agents
│   ├── api
│   ├── config
│   ├── data
│   ├── outputs
│   ├── prompts
│   ├── schemas
│   ├── services
│   ├── tools
│   ├── build_vectordb.py
│   ├── main.py
│   └── requirements.txt
│
└── README.md
```

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- JavaScript
- CSS

### Backend

- Python
- Flask

### AI & LLM

- Agentic RAG
- Groq LLM
- Embeddings
- Prompt Engineering

### Database & Storage

- PostgreSQL
- Redis
- Vector Database

### DevOps

- Docker
- Git
- GitHub
- AWS ECS

---

# 🚀 Getting Started

## 1️⃣ Clone Repository

```bash
git clone https://github.com/<your-username>/AP-Tourism-Agentic-RAG.git

cd AP-Tourism-Agentic-RAG
```

---

## 2️⃣ Frontend Setup

```bash
cd Frontend

npm install

npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## 3️⃣ Backend Setup

### Create Virtual Environment

```bash
cd Backend

python -m venv env
```

### Activate Environment

Windows:

```bash
env\Scripts\activate
```

Linux/macOS:

```bash
source env/bin/activate
```

### Install Requirements

```bash
pip install -r requirements.txt
```

---

## 4️⃣ Configure Environment Variables

Create `.env`

```env
GROQ_API_KEY=your_groq_api_key

POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=ap_tourism
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password

REDIS_HOST=localhost
REDIS_PORT=6379
```

---

## 5️⃣ PostgreSQL Setup

Create Database:

```sql
CREATE DATABASE ap_tourism;
```

Load tourism datasets into PostgreSQL tables.

---

## 6️⃣ Redis Setup

Start Redis:

```bash
redis-server
```

Verify:

```bash
redis-cli ping
```

Output:

```text
PONG
```

---

## 7️⃣ Build Vector Database

Generate embeddings and build the vector store:

```bash
python build_vectordb.py
```

---

## 8️⃣ Run Backend

```bash
python main.py
```

Backend:

```text
http://localhost:5000
```

---

## 🔄 Application Workflow

```text
User Query
    │
    ▼
Context Resolution
    │
    ▼
Location Extraction
    │
    ▼
Memory Retrieval
    │
    ▼
Agent Selection
    │
    ▼
Vector Search
    │
    ▼
Groq LLM
    │
    ▼
Redis Cache
    │
    ▼
Response Generation
    │
    ▼
Frontend Response
```

## 🔮 Future Enhancements

- Hybrid Search (BM25 + Vector Search)
- Travel Itinerary Planning Agent
- Hotel Recommendation Agent
- Weather Integration
- Voice Assistant
- Multilingual Support
- Real-Time Event Recommendations

---

## 👨‍💻 Author

### P. Adarsh Varma

B.Tech Computer Science and Engineering  
Sri Manakula Vinayagar Engineering College

**AI Systems • Agentic RAG • Data Engineering • Machine Learning • Cloud Computing**

---

⭐ If you found this project useful, consider giving it a star.
