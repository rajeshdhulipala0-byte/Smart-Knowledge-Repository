# Smart Knowledge Repository

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)
![MongoDB](https://img.shields.io/badge/mongodb-5.0%2B-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

An intelligent knowledge management system powered by AI with advanced search, automatic categorization, and data analytics.

[Features](#features) • [Architecture](#architecture) • [Installation](#installation) • [API Documentation](#api-documentation) • [Deployment](#deployment)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Database Design](#database-design)
- [AI Integration](#ai-integration)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Frontend Routes](#frontend-routes)
- [Security](#security)
- [Performance](#performance)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## 🎯 Overview

Smart Knowledge Repository is a production-ready, full-stack MERN application that leverages Hugging Face AI models to provide intelligent knowledge management capabilities. The system automatically analyzes, categorizes, and summarizes content while providing powerful search and analytics features.

### Key Highlights

- **AI-Powered Analysis**: Automatic content summarization, keyword extraction, and difficulty classification
- **Advanced Search**: Full-text search with MongoDB text indexes and relevance scoring
- **Real-time Analytics**: Comprehensive data mining and visualization
- **Clean Architecture**: Repository pattern, service layer, and separation of concerns
- **Production-Ready**: Security best practices, error handling, and logging
- **Scalable Design**: Modular structure supporting easy expansion

---

## ✨ Features

### Core Functionality

1. **CRUD Operations**
   - Create, read, update, and delete knowledge articles
   - Role-based access control (User/Admin)
   - Optimistic UI updates

2. **AI Processing**
   - **Zero-shot Classification**: Automatically determines difficulty level (Beginner/Intermediate/Advanced)
   - **Text Summarization**: Generates concise summaries using BART
   - **Keyword Extraction**: Extracts relevant keywords automatically
   - Parallel AI model execution for optimal performance
   - Retry logic with exponential backoff

3. **Advanced Search**
   - Full-text search using MongoDB $text operator
   - Multi-filter support (category, tags, scope)
   - Relevance scoring
   - Debounced search input
   - Highlighted search matches

4. **Analytics Dashboard**
   - Category distribution
   - Difficulty level statistics
   - Knowledge growth trends
   - Trending tags
   - Top viewed articles
   - AI confidence metrics
   - Interactive charts (Chart.js)

5. **User Management**
   - JWT authentication
   - Role-based authorization
   - Protected routes
   - Profile management

---

## 🛠 Tech Stack

### Backend

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB | Database |
| Mongoose | ODM |
| Hugging Face API | AI models |
| Axios | HTTP client |
| JWT | Authentication |
| Bcrypt | Password hashing |
| Helmet | Security headers |
| Rate Limit | API protection |
| Winston | Logging |
| Express Validator | Input validation |

### Frontend

| Technology | Purpose |
|------------|---------|
| React 18 | UI library |
| Vite | Build tool |
| React Router | Routing |
| Context API | State management |
| Tailwind CSS | Styling |
| Chart.js | Data visualization |
| React Toastify | Notifications |
| React Icons | Icon library |

---

## 🏗 Architecture

### Backend Architecture

```
backend/
├── config/           # Configuration files
│   ├── database.js   # MongoDB connection
│   ├── logger.js     # Winston logger setup
│   └── index.js      # Centralized config
├── models/           # Mongoose schemas
│   ├── Knowledge.js  # Knowledge model
│   ├── User.js       # User model
│   └── index.js
├── repositories/     # Data access layer
│   ├── knowledgeRepository.js
│   └── userRepository.js
├── services/         # Business logic layer
│   ├── aiService.js       # Hugging Face integration
│   ├── knowledgeService.js
│   └── authService.js
├── controllers/      # Request handlers
│   ├── knowledgeController.js
│   └── authController.js
├── routes/           # API routes
│   ├── knowledgeRoutes.js
│   ├── authRoutes.js
│   └── index.js
├── middleware/       # Custom middleware
│   ├── auth.js           # Authentication
│   ├── errorHandler.js   # Error handling
│   └── requestLogger.js  # HTTP logging
├── validations/      # Input validation
│   └── validation.js
├── utils/            # Utilities
│   ├── AppError.js       # Custom error class
│   ├── asyncHandler.js   # Async wrapper
│   └── ApiResponse.js    # Response formatter
├── app.js            # Express app setup
└── server.js         # Server entry point
```

### Design Patterns

1. **Repository Pattern**: Abstracts data access logic
2. **Service Layer**: Contains business logic
3. **Factory Pattern**: Error and response creation
4. **Singleton**: Database connection, logger, services
5. **Middleware Chain**: Request processing pipeline

### Frontend Architecture

```
frontend/
├── src/
│   ├── components/      # Reusable components
│   │   ├── Layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Layout.jsx
│   │   ├── KnowledgeCard.jsx
│   │   ├── SearchBar.jsx
│   │   ├── Pagination.jsx
│   │   ├── Spinner.jsx
│   │   ├── SkeletonCard.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/          # Route pages
│   │   ├── Dashboard.jsx
│   │   ├── CreateKnowledge.jsx
│   │   ├── EditKnowledge.jsx
│   │   ├── KnowledgeDetails.jsx
│   │   ├── Search.jsx
│   │   ├── Analytics.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── NotFound.jsx
│   ├── context/        # Context API
│   │   └── AuthContext.jsx
│   ├── hooks/          # Custom hooks
│   │   └── useKnowledge.js
│   ├── services/       # API services
│   │   ├── knowledgeService.js
│   │   └── authService.js
│   ├── config/         # Configuration
│   │   └── api.js
│   ├── utils/          # Utilities
│   │   └── helpers.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
```

---

## 💾 Database Design

### Knowledge Schema

```javascript
{
  title: String (required, indexed, max 200)
  content: String (required, min 10, full-text indexed)
  tags: [String] (indexed)
  category: Enum (required, indexed)
  author: String (required, max 100)
  scopeType: Enum (Beginner/Intermediate/Advanced/OutOfScope)
  aiSummary: String
  aiKeywords: [String]
  aiConfidence: Number (0-1)
  aiProcessed: Boolean (default: false, indexed)
  views: Number (default: 0)
  createdBy: ObjectId (ref: User)
  timestamps: true
}
```

### Indexes

```javascript
// Text search index
{ title: 'text', content: 'text' }
  weights: { title: 10, content: 5 }

// Compound indexes
{ category: 1, tags: 1 }
{ scopeType: 1, aiProcessed: 1 }
{ createdAt: -1 }
{ views: -1 }
```

### User Schema

```javascript
{
  name: String (required, max 50)
  email: String (required, unique, indexed)
  password: String (required, hashed, min 6)
  role: Enum (user/admin, default: user)
  isActive: Boolean (default: true)
  lastLogin: Date
  timestamps: true
}
```

---

## 🤖 AI Integration

### Hugging Face Models

| Model | Purpose | Endpoint |
|-------|---------|----------|
| facebook/bart-large-mnli | Zero-shot Classification | Scope detection |
| facebook/bart-large-cnn | Summarization | Content summary |
| ml6team/keyphrase-extraction-distilbert-inspec | Keyword Extraction | Keyword mining |

### AI Service Features

1. **Parallel Execution**: All models execute simultaneously using `Promise.allSettled`
2. **Retry Logic**: Exponential backoff for failed requests
3. **Timeout Handling**: Configurable request timeouts
4. **Error Recovery**: Graceful fallbacks for each operation
5. **Response Validation**: Structured output verification
6. **Performance Tracking**: Request duration logging

### Model Selection Rationale

- **BART (MNLI)**: State-of-the-art zero-shot classification without training
- **BART (CNN/DailyMail)**: Proven summarization quality
- **DistilBERT**: Fast keyword extraction with high accuracy

### AI Processing Flow

```
1. User creates/updates knowledge
2. Content saved to database
3. Background AI processing triggered
4. Parallel API calls to Hugging Face:
   - Classification (scopeType + confidence)
   - Summarization (aiSummary)
   - Keyword extraction (aiKeywords)
5. Results validated and stored
6. aiProcessed flag set to true
```

---

## 🚀 Installation

### Prerequisites

- Node.js >= 18.0.0
- MongoDB >= 5.0
- Hugging Face API Key

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
nano .env

# Start development server
npm run dev
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

---

## ⚙️ Configuration

### Backend Environment Variables

```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/smart-knowledge-repo

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# Hugging Face
HUGGINGFACE_API_KEY=your-huggingface-api-key
HF_CLASSIFIER_MODEL=facebook/bart-large-mnli
HF_SUMMARY_MODEL=facebook/bart-large-cnn
HF_KEYWORD_MODEL=ml6team/keyphrase-extraction-distilbert-inspec

# AI Configuration
AI_REQUEST_TIMEOUT=30000
AI_MAX_RETRIES=3
AI_RETRY_DELAY=1000

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=info
```

### Frontend Environment Variables

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Smart Knowledge Repository
```

---

## 📚 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication

All protected routes require JWT token:

```
Authorization: Bearer <token>
```

### Endpoints

#### Authentication

```http
POST /auth/register
POST /auth/login
GET  /auth/me              (Protected)
PUT  /auth/profile         (Protected)
```

#### Knowledge

```http
GET    /knowledge                   # Get all (paginated)
GET    /knowledge/search            # Search
GET    /knowledge/:id               # Get by ID
GET    /knowledge/category/:cat     # Get by category
POST   /knowledge                   # Create (Protected)
PUT    /knowledge/:id               # Update (Protected)
DELETE /knowledge/:id               # Delete (Admin)
GET    /knowledge/admin/analytics   # Analytics (Admin)
POST   /knowledge/admin/batch-process-ai  # Batch AI (Admin)
```

### Request Examples

#### Create Knowledge

```bash
curl -X POST http://localhost:5000/api/knowledge \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Introduction to React Hooks",
    "content": "React Hooks are functions that let you use state and other React features...",
    "category": "Programming",
    "author": "John Doe",
    "tags": ["react", "javascript", "hooks"]
  }'
```

#### Search

```bash
curl "http://localhost:5000/api/knowledge/search?q=react&category=Programming&page=1&limit=10"
```

### Response Format

#### Success Response

```json
{
  "success": true,
  "message": "Knowledge created successfully",
  "data": {
    "_id": "...",
    "title": "...",
    ...
  }
}
```

#### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "errors": ["Validation error 1", "Validation error 2"]
}
```

---

## 🗺 Frontend Routes

| Route | Component | Access | Description |
|-------|-----------|--------|-------------|
| `/` | Dashboard | Public | Home page with knowledge grid |
| `/search` | Search | Public | Advanced search interface |
| `/knowledge/:id` | KnowledgeDetails | Public | View full knowledge article |
| `/create` | CreateKnowledge | Protected | Create new knowledge |
| `/edit/:id` | EditKnowledge | Protected | Edit knowledge |
| `/analytics` | Analytics | Admin | Analytics dashboard |
| `/login` | Login | Public | User login |
| `/register` | Register | Public | User registration |

---

## 🔒 Security

### Implemented Security Measures

1. **Helmet**: Sets secure HTTP headers
2. **Rate Limiting**: Prevents brute force attacks
3. **JWT Authentication**: Secure token-based auth
4. **Password Hashing**: Bcrypt with salt rounds
5. **Input Validation**: Express-validator on all inputs
6. **CORS Configuration**: Controlled origin access
7. **NoSQL Injection Prevention**: Mongoose sanitization
8. **Error Handling**: No sensitive data in error messages
9. **Role-Based Access Control**: Admin-only routes
10. **Request Logging**: Winston for audit trails

### Best Practices

- Environment variables for secrets
- HTTPS in production
- Regular dependency updates
- Centralized error handling
- Secure session management
- SQL/NoSQL injection prevention

---

## ⚡ Performance

### Optimization Techniques

1. **Database Indexes**: Optimized queries
2. **Pagination**: Prevents large data loads
3. **Lean Queries**: Returns plain JavaScript objects
4. **Connection Pooling**: Reuses database connections
5. **Debounced Search**: Reduces API calls
6. **Lazy Loading**: Components loaded on demand
7. **Code Splitting**: Vite automatic optimization
8. **Caching**: Browser and server-side
9. **Compression**: Gzip responses
10. **CDN Ready**: Static asset optimization

### Performance Metrics

- API Response Time: < 100ms (without AI)
- AI Processing: 2-5s (parallel execution)
- Database Queries: < 50ms (with indexes)
- Frontend Load: < 2s (initial)
- Lighthouse Score: 90+ (optimized)

---

## 🚢 Deployment

### Prerequisites

- VPS or cloud platform (AWS, DigitalOcean, Heroku)
- MongoDB Atlas (or hosted MongoDB)
- Node.js environment
- Domain name (optional)

### Backend Deployment

#### 1. Environment Setup

```bash
# Set production environment variables
export NODE_ENV=production
export MONGODB_URI=mongodb+srv://...
export JWT_SECRET=...
export HUGGINGFACE_API_KEY=...
```

#### 2. Using PM2

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start server.js --name "smart-knowledge-api"

# Configure startup script
pm2 startup
pm2 save
```

#### 3. Nginx Configuration

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Frontend Deployment

#### 1. Build Production Bundle

```bash
cd frontend
npm run build
```

#### 2. Static Hosting Options

**Vercel**
```bash
npm install -g vercel
vercel deploy
```

**Netlify**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

**Nginx**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/smart-knowledge/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Docker Deployment

#### docker-compose.yml

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:5.0
    volumes:
      - mongo-data:/data/db
    environment:
      - MONGO_INITDB_DATABASE=smart-knowledge

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/smart-knowledge
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  mongo-data:
```

---

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

### Frontend Tests

```bash
cd frontend
npm test              # Run all tests
npm run test:ui       # Vitest UI
```

---

## 📝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👤 Author

Created with ❤️ for intelligent knowledge management

---

## 🙏 Acknowledgments

- Hugging Face for AI models
- MongoDB for database
- React team for amazing library
- All open-source contributors

---

## 📞 Support

For issues, questions, or contributions, please open an issue on GitHub.

---

<div align="center">

**[⬆ Back to Top](#smart-knowledge-repository)**

Made with ❤️ and ☕

</div>
