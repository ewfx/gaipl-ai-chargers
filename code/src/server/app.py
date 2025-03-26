from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
import os
from dotenv import load_dotenv
from typing import Dict, List
import sqlite3
import faiss
from sentence_transformers import SentenceTransformer
import numpy as np
import json

load_dotenv()

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Initialize Sentence Transformer model
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

# SQLite database setup
conn = sqlite3.connect('vector_db.sqlite', check_same_thread=False)
cursor = conn.cursor()
cursor.execute('''CREATE TABLE IF NOT EXISTS documents (
                    id INTEGER PRIMARY KEY,
                    text TEXT,
                    type TEXT,
                    source TEXT,
                    embedding BLOB
                )''')

# Initialize FAISS index
index = faiss.IndexFlatIP(embedding_model.get_sentence_embedding_dimension())  # Using Inner Product for cosine similarity

def load_json_data():
    documents = []
    try:
        # Load knowledge base data
        with open('D:/gen-ai-support/server/knowledge_base.json', 'r') as f:
            knowledge_base = json.load(f)
            for item in knowledge_base:
                text = f"KB {item['KA Number']}: {item['Title']}. {item['Summary']}" + \
       (f". {item['ResolutionSteps']}" if item.get('ResolutionSteps') else "")
                documents.append({
                    'text': text,
                    'type': 'knowledge_base',
                    'source': json.dumps(item)  # Proper JSON serialization
                })
        
        # Load incidents data
        with open('D:/gen-ai-support/server/servicenow_apigee_incidents.json', 'r') as f:
            incidents_data = json.load(f)
            for item in incidents_data:
                text = f"INC {item['Incident Number']}: {item['Short Description']}. {item.get('Resolution Notes', '')}"
                documents.append({
                    'text': text,
                    'type': 'incident',
                    'source': json.dumps(item)
                })
    except Exception as e:
        print(f"Error loading JSON data: {str(e)}")
    return documents

def initialize_database():
    cursor.execute('DELETE FROM documents')  # Clear existing data
    documents = load_json_data()
    embeddings = []
    
    for doc in documents:
        embedding = embedding_model.encode(doc['text'], normalize_embeddings=True).astype(np.float32)
        embeddings.append(embedding)
        cursor.execute('INSERT INTO documents (text, type, source, embedding) VALUES (?, ?, ?, ?)',
                      (doc['text'], doc['type'], doc['source'], embedding.tobytes()))
    
    if embeddings:
        index.add(np.array(embeddings))
    conn.commit()
    print(f"Initialized database with {len(documents)} documents")

def perform_rag_search(query: str, top_k: int = 5, threshold: float = 0.5):
    try:
        query_embedding = embedding_model.encode(query, normalize_embeddings=True).astype(np.float32)
        distances, indices = index.search(np.array([query_embedding]), top_k)
        
        results = []
        for idx, score in zip(indices[0], distances[0]):
            if idx == -1 or score < threshold:  # Using cosine similarity threshold
                continue
            
            cursor.execute('SELECT text, type, source FROM documents WHERE id=?', (idx+1,))
            result = cursor.fetchone()
            if result:
                try:
                    source_data = json.loads(result[2])
                    results.append({
                        'text': result[0],
                        'type': result[1],
                        'source': source_data,
                        'score': float(score)  # Include similarity score
                    })
                except json.JSONDecodeError:
                    continue
        
        # Fallback to keyword search if semantic search fails
        if not results:
            print("Semantic search failed, falling back to keyword search")
            cursor.execute('SELECT text, type, source FROM documents')
            all_docs = cursor.fetchall()
            query_lower = query.lower()
            
            for doc in all_docs:
                if query_lower in doc[0].lower():  # Simple keyword match in text
                    try:
                        source_data = json.loads(doc[2])
                        results.append({
                            'text': doc[0],
                            'type': doc[1],
                            'source': source_data,
                            'score': 0.5  # Default score for keyword matches
                        })
                    except json.JSONDecodeError:
                        continue
        
        return sorted(results, key=lambda x: x['score'], reverse=True)
    except Exception as e:
        print(f"Search error: {str(e)}")
        return []

def generate_technical_insights(query: str, documents: List[Dict]) -> str:
    if not documents:
        return "No technical insights available for this query."
    
    context = "\n".join([f"Document {i+1} ({doc['type']}, similarity: {doc['score']:.2f}):\n{doc['text']}\n" 
                         for i, doc in enumerate(documents[:3])])  # Use top 3 most relevant
    
    print(context)
    prompt = f"""
    As a technical analyst, provide specific recommendations for: "{query}"
    
    Context:
    {context}
    
    Provide:
    1. Root cause analysis
    2. Recommended solutions from the documents
    3. Implementation steps
    4. AnsiblePlaybook trigger option with hyperlink incase if the knowledge base has the same, otherwise don't mention the same.
    
    Be concise and technical. Only use information from the provided context.
    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
            max_tokens=600
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"LLM error: {str(e)}")
        return "Could not generate insights due to technical error."


def chatbot(query: str, documents: List[Dict]) -> str:
    if not documents:
        return "No data available for this query."
    
    context = "\n".join([f"Document {i+1} ({doc['type']}, similarity: {doc['score']:.2f}):\n{doc['text']}\n" 
                         for i, doc in enumerate(documents[:3])])  # Use top 3 most relevant
    
    prompt = f"""
    As a technical analyst chatbot, provide your view for on resolution / suggestions based on: "{query}"
    
    Context:
    {context}
    
    
    Be concise and technical. Only use information from the provided context.
    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
            max_tokens=600
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"LLM error: {str(e)}")
        return "Could not generate insights due to technical error."

@app.get("/api/search")
async def search(query: str):
    try:
        if not query.strip():
            return {"status": "error", "message": "Query cannot be empty"}

        results = perform_rag_search(query)
        if not results:
            return {
                "status": "success",
                "query": query,
                "insights": "No matching documents found. Try different search terms.",
                "results": []
            }
        
        insights = generate_technical_insights(query, results)
        return {
            "status": "success",
            "query": query,
            "insights": insights,
            "results": results
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

def build_chat_prompt(query: str, chat_history: List[Dict], documents: List[Dict]) -> List[Dict]:
    messages = []
    
    # System message
    messages.append({
        "role": "system",
        "content": """You are a technical support assistant. Use the following documents to answer questions.
        If you don't know the answer, say you don't know. Be concise and technical."""
    })
    
    # Add document context if available
    if documents:
        context = "\n".join([f"Document {i+1} ({doc['type']}):\n{doc['text']}\n" 
                           for i, doc in enumerate(documents[:3])])  # Fixed the closing parenthesis here
        messages.append({
            "role": "system",
            "content": f"Relevant documents:\n{context}"
        })
    
    # Add chat history
    for msg in chat_history[-6:]:  # Keep last 6 messages for context
        messages.append({
            "role": msg["role"],
            "content": msg["content"]
        })
    
    # Add current query
    messages.append({
        "role": "user",
        "content": query
    })
    
    return messages

from pydantic import BaseModel
from typing import List, Dict
class ChatRequest(BaseModel):
    query: str
    chat_history: List[Dict[str, str]] = []

@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        if not request.query.strip():
            return {"status": "error", "message": "Query cannot be empty"}

        results = perform_rag_search(request.query)
        
        # Generate response using chat history context
        prompt = build_chat_prompt(request.query, request.chat_history, results)
        
        response = client.chat.completions.create(
            model="gpt-4",
            messages=prompt,
            temperature=0.7
        )
        
        return {
            "status": "success",
            "response": response.choices[0].message.content
        }
    except Exception as e:
        print(f"Chat error: {str(e)}")
        return {"status": "error", "message": str(e)}

@app.on_event("startup")
async def startup_event():
    initialize_database()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)