# 🚀 AI Chargers

## 📌 Table of Contents
- [Introduction](#introduction)
- [Demo](#demo)
- [Inspiration](#inspiration)
- [What It Does](#what-it-does)
- [How We Built It](#how-we-built-it)
- [Challenges We Faced](#challenges-we-faced)
- [How to Run](#how-to-run)
- [Tech Stack](#tech-stack)
- [Team](#team)

---

## 🎯 Introduction
A brief overview of your project and its purpose. Mention which problem statement are your attempting to solve. Keep it concise and engaging.

## 🎥 Demo
🔗 [Live Demo](#) (if applicable)  
📹 [Video Demo](#) (if applicable)  
🖼️ Screenshots:

![Screenshot 1](link-to-image)

## 💡 Inspiration
What inspired you to create this project? Describe the problem you're solving.

## ⚙️ What It Does
1. It helps user to search the knowledge bases, Incidents and automations available (if any).
   - When the user searches with the ERROR message or any KBA number or Incident number, the application will search for the KBAs, Incidents and automations => Upon feeding this to LLM, it will propose the user with RCA, Troubleshooting Steps, relevant incidents / KBAs.
3. User can chat with chatbot about the issue he/she is facing and get the AI assistant in troubleshooting the issue.

## 🛠️ How We Built It
1. Setup FastAPI Foundation
2. Built Core API Structure
3. Implemented RAG Pipeline
   - Document loader for JSON knowledge base
   - Embedding generation with all-MiniLM-L6-v2
   - FAISS index creation and persistence
4. Integrated OpenAI
5. Added SQLite Storage
6. React UI Implementation
7. Initialized Project
8. Built Core Components
9. Implemented State Management
10. Added API Services
11. Styled Components

## 🚧 Challenges We Faced
1. Choosing the UI
   - Initially started the UI with Streamlit and faced challenges in integration combining both serach and chatbot options.
   - After trying multiple hours, fallbacked to React UI where we are able to integrate and approach the requirement easily.
3. Choosing the approach like syntacic based approach or semantic based approach.
   - Our Development started with syntacic based approach and we found that its not scable for larger data as it adds more time to load.
   - Upon researching, we found that we can use Custom RAG methodology to tackle this problem and able to implement the same.
5. Backend server issues when connecting with React UI
   - Faced CORS issues, which we fixed.
   - Context type issues when parsing from frontend to backend.
7. Choosing the Vector Database
   - Upon researching with semantic and RAG based approach, we researched and studied available vector DBs and found FIASS + SQLite is efficient and durable.

## 🏃 How to Run
1. Clone the repository  
   ```sh
   git clone [https://github.com/your-repo.git](https://github.com/ewfx/gaipl-ai-chargers.git)
   ```
2. Install dependencies  
   ```sh
   cd code
   npm install
   (for Python)
   cd code/server
   pip install -r requirements.txt 
   ```
3. Run the project  
   ```sh
   cd code
   npm start

   (For python backend)
   cd code/server
   python app.py
   ```

## 🏗️ Tech Stack
- 🔹 **Frontend**: React, Material-UI
- 🔹 **Backend**: FastAPI, Python
- 🔹 **Database**: SQLite, FAISS (Vector DB)
- 🔹 **AI/ML**: OpenAI API (GPT-4), Sentence Transformers
- 🔹 **Other**: RESTful API / JSON Data

## 👥 Team
- **Nrusimha Pavan Kumar Ganugapati** - [GitHub](#) | [LinkedIn](#)
- **Sundar Gade** - [GitHub](#) | [LinkedIn](#)
- **Abhishek Sinha** - [GitHub](#) | [LinkedIn](#)
- **Gangadher Kanakthala** - [GitHub](#) | [LinkedIn](#)
- **Pratheepa Infanta** - [GitHub](#) | [LinkedIn](#)

  
