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
│   └── README.md           # Backend documentation
├── frontend/               # React frontend application
│   ├── src/                # React source code
│   │   ├── components/     # React components
│   │   ├── context/        # State management
│   │   └── App.js          # Main app component
│   ├── package.json        # Node.js dependencies
│   └── README.md           # Frontend documentation
└── README.md               # This file
```

## 🛠️ Technology Stack

### Backend
- **FastAPI**: Modern, fast web framework
- **SQLite**: Lightweight database
- **Groq API**: LLM integration for AI responses
- **Pydantic**: Data validation
- **Uvicorn**: ASGI server

### Frontend
- **React 18**: Modern UI framework
- **Styled Components**: CSS-in-JS styling
- **Context API**: State management
- **Axios**: HTTP client
- **React Scripts**: Development tools

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 14+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up database**:
   ```bash
   python db.py
   python load_data.py
   ```

4. **Start the backend server**:
   ```bash
   python main.py
   ```
   
   The API will be available at: http://localhost:8000

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```
   
   The app will be available at: http://localhost:3000

## 📊 Database Schema

### E-commerce Tables
- **users**: Customer information and demographics
- **products**: Product catalog with pricing
- **orders**: Order records and status
- **order_items**: Individual items in orders
- **inventory_items**: Inventory tracking
- **distribution_centers**: Warehouse locations

### Conversation Tables
- **conversations**: Chat session management
- **messages**: Individual messages with timestamps

## 🔌 API Endpoints

### Chat API
- `POST /api/chat` - Send messages and get AI responses
- `GET /api/conversations/{user_id}` - Load conversation history
- `GET /api/health` - Health check endpoint

### Request Format
```json
{
  "message": "What products do you have?",
  "user_id": "user123",
  "conversation_id": "optional_existing_conversation_id"
}
```

### Response Format
```json
{
  "response": "I can help you find products! Here are some categories...",
  "conversation_id": "1",
  "message_id": 5
}
```

## 🎨 Frontend Features

### Chat Interface
- **Real-time messaging** with AI assistant
- **Message history** with user/AI differentiation
- **Auto-scroll** to latest messages
- **Loading states** and error handling

### Conversation Management
- **Sidebar panel** for conversation history
- **New chat** functionality
- **Conversation switching** with previews
- **Message counts** and timestamps

### User Experience
- **Quick action buttons** for common queries
- **Responsive design** for all devices
- **Modern UI** with smooth animations
- **Error boundaries** for graceful error handling

## 🤖 AI Capabilities

The AI assistant can help with:
- **Product recommendations** and searches
- **Order status** and tracking
- **Customer support** queries
- **Sales analytics** and reporting
- **Inventory information**
- **Pricing and availability**

## 🔧 Configuration

### Environment Variables
- `GROQ_API_KEY`: Your Groq API key (optional, uses mock responses if not set)

### Database
- SQLite database file: `backend/ecommerce.db`
- Auto-created on first run
- Sample data loaded from CSV files

## 🧪 Testing

### Backend Testing
```bash
cd backend
python test_api.py
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📦 Deployment

### Backend Deployment
1. Build the application:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. Run with production server:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```

### Frontend Deployment
1. Build for production:
   ```bash
   cd frontend
   npm run build
   ```

2. Serve the build folder with any static file server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is part of the E-commerce AI Agent application.

## 🆘 Support

For issues and questions:
1. Check the documentation in `backend/README.md` and `frontend/README.md`
2. Review the API documentation at http://localhost:8000/docs
3. Check the browser console for frontend errors
4. Review the backend logs for API errors

## 🎯 Milestones Completed

- ✅ **Milestone 2**: Database Setup and Data Ingestion
- ✅ **Milestone 3**: Data Schemas and Conversation Management
- ✅ **Milestone 4**: Core Chat API Implementation
- ✅ **Milestone 5**: LLM Integration and Business Logic
- ✅ **Milestone 6**: UI Component Development
- ✅ **Milestone 7**: Client-Side State Management
- ✅ **Milestone 8**: Conversation History Panel

**I have completed all milestones and am ready to move forward.** 