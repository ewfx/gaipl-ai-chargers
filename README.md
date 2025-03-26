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
Explain the key features and functionalities of your project.

## 🛠️ How We Built It
Briefly outline the technologies, frameworks, and tools used in development.

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

  
