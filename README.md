# 🛒 E-commerce AI Agent

A complete conversational AI agent for e-commerce platforms with a modern React frontend and FastAPI backend.

## 🚀 Features
- **Intelligent AI Assistant**: Powered by Groq LLM for natural conversations
- **E-commerce Database**: Comprehensive product, order, and customer data
- **Modern UI**: Beautiful React frontend with real-time chat interface
- **Conversation History**: Persistent chat sessions with conversation management
- **Database Integration**: SQLite database with e-commerce analytics
- **RESTful API**: FastAPI backend with comprehensive endpoints

## 📁 Project Structure
```
├── backend/                 # FastAPI backend service
│   ├── main.py             # Main FastAPI application
│   ├── db.py               # Database setup and schema
│   ├── load_data.py        # Data ingestion script
│   ├── requirements.txt    # Python dependencies
│   ├── data/               # CSV data files
│   └── Dockerfile          # Backend Dockerfile
├── frontend/               # React frontend application
│   ├── src/                # React source code
│   ├── package.json        # Node.js dependencies
│   └── Dockerfile          # Frontend Dockerfile
├── docker-compose.yml      # Orchestration for full stack
├── .env                    # Environment variables (template)
└── README.md               # This file
```

## 🛠️ Technology Stack
- **Backend**: FastAPI, SQLite, Groq API, Pydantic, Uvicorn
- **Frontend**: React 18, Styled Components, Context API, Axios, React Scripts
- **Containerization**: Docker, Docker Compose

## 🚀 Quick Start

### Local Development (No Docker)
#### Backend
```bash
cd backend
pip install -r requirements.txt
python db.py
python load_data.py
python main.py
```
- API: http://localhost:8000

#### Frontend
```bash
cd frontend
npm install
npm start
```
- App: http://localhost:3000

### 🐳 Dockerized Deployment
#### Prerequisites
- Docker and Docker Compose installed

#### Quick Start
```bash
docker-compose up --build
```
- Frontend: http://localhost:3000
- Backend: http://localhost:8000

#### Stopping the Application
```bash
docker-compose down
```

#### Environment Variables
- `GROQ_API_KEY` (optional): Set in your `.env` file for LLM integration.

## 📊 Database Schema
- **users**: Customer information and demographics
- **products**: Product catalog with pricing
- **orders**: Order records and status
- **order_items**: Individual items in orders
- **inventory_items**: Inventory tracking
- **distribution_centers**: Warehouse locations
- **conversations**: Chat session management
- **messages**: Individual messages with timestamps

## 🔌 API Endpoints
- `POST /api/chat` - Send messages and get AI responses
- `GET /api/conversations/{user_id}` - Load conversation history
- `GET /api/health` - Health check endpoint

## 🎨 Frontend Features
- Real-time messaging with AI assistant
- Message history with user/AI differentiation
- Auto-scroll to latest messages
- Loading states and error handling
- Sidebar panel for conversation history
- New chat functionality
- Conversation switching with previews
- Message counts and timestamps
- Quick action buttons for common queries
- Responsive design for all devices
- Modern UI with smooth animations
- Error boundaries for graceful error handling

## 🤖 AI Capabilities
- Product recommendations and searches
- Order status and tracking
- Customer support queries
- Sales analytics and reporting
- Inventory information
- Pricing and availability

## 🧪 Testing
#### Backend
```bash
cd backend
python test_api.py
```
#### Frontend
```bash
cd frontend
npm test
```

## 📦 Deployment
#### Backend (Production)
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```
#### Frontend (Production)
```bash
cd frontend
npm run build
# Serve the build folder with any static file server
```

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License
This project is part of the E-commerce AI Agent application.

## 🆘 Support
- Check the documentation in `backend/README.md` and `frontend/README.md`
- Review the API documentation at http://localhost:8000/docs
- Check the browser console for frontend errors
- Review the backend logs for API errors

## 🎯 Milestones Completed
- ✅ Milestone 2: Database Setup and Data Ingestion
- ✅ Milestone 3: Data Schemas and Conversation Management
- ✅ Milestone 4: Core Chat API Implementation
- ✅ Milestone 5: LLM Integration and Business Logic
- ✅ Milestone 6: UI Component Development
- ✅ Milestone 7: Client-Side State Management
- ✅ Milestone 8: Conversation History Panel
- ✅ Milestone 9: Full-Stack Integration
- ✅ Milestone 10: Dockerization

