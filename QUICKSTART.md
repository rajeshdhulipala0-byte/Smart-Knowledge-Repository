# Quick Start Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.0.0 or higher
- **MongoDB**: Version 5.0 or higher (or MongoDB Atlas account)
- **Git**: For cloning the repository
- **Hugging Face Account**: For AI API key

---

## Step 1: Get Hugging Face API Key

1. Visit [Hugging Face](https://huggingface.co/)
2. Sign up or log in
3. Go to Settings → Access Tokens
4. Create a new token with read access
5. Copy the token (you'll need it in Step 3)

---

## Step 2: Install MongoDB

### Option A: Local Installation

**Windows:**
- Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
- Run the installer
- MongoDB will start automatically as a service

**macOS (using Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

### Option B: MongoDB Atlas (Cloud)

1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (free tier)
4. Create a database user
5. Allow network access (0.0.0.0/0 for development)
6. Get your connection string

---

## Step 3: Backend Setup

### 1. Navigate to backend directory

```bash
cd "Smart Knowledge Repository/backend"
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment file

```bash
# Copy the example file
cp .env.example .env

# Open in your editor (Windows)
notepad .env

# Or use VS Code
code .env
```

### 4. Configure environment variables

Edit `.env` with your settings:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database (Local MongoDB)
MONGODB_URI=mongodb://localhost:27017/smart-knowledge-repo

# Or use MongoDB Atlas
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-knowledge-repo

# JWT Secret (change this!)
JWT_SECRET=your-secret-key-here-change-this-in-production
JWT_EXPIRE=7d

# Hugging Face API (REQUIRED)
HUGGINGFACE_API_KEY=your-huggingface-api-key-here
HF_CLASSIFIER_MODEL=facebook/bart-large-mnli
HF_SUMMARY_MODEL=facebook/bart-large-cnn
HF_KEYWORD_MODEL=ml6team/keyphrase-extraction-distilbert-inspec

# AI Service
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

### 5. Start the backend server

```bash
# Development mode with auto-reload
npm run dev

# Or production mode
npm start
```

You should see:
```
╔═══════════════════════════════════════════════════════╗
║   Smart Knowledge Repository Server                  ║
║   Environment: development                            ║
║   Port: 5000                                          ║
║   Server running at http://localhost:5000             ║
╚═══════════════════════════════════════════════════════╝
```

---

## Step 4: Frontend Setup

### 1. Open a NEW terminal and navigate to frontend

```bash
cd "Smart Knowledge Repository/frontend"
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment file

```bash
# Copy the example file
cp .env.example .env

# Open in your editor
notepad .env
```

### 4. Configure environment variables

Edit `.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Smart Knowledge Repository
```

### 5. Start the frontend server

```bash
npm run dev
```

You should see:
```
  VITE v5.0.0  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

---

## Step 5: Access the Application

Open your browser and visit:

**Frontend:** http://localhost:3000
**Backend API:** http://localhost:5000/api/health

---

## Step 6: Create Admin User (Optional)

### Option 1: Using API

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

Then manually update the user role in MongoDB:

```javascript
// In MongoDB Shell or Compass
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

### Option 2: Using MongoDB Compass

1. Connect to your MongoDB
2. Navigate to `smart-knowledge-repo` database
3. Find the `users` collection
4. Find your user and change `role` from `"user"` to `"admin"`

---

## Step 7: Test the Application

### 1. Register a new account
- Visit http://localhost:3000/register
- Fill in your details
- Click "Create account"

### 2. Create your first knowledge
- Once logged in, click "Create New Knowledge"
- Fill in the form:
  - Title: "Introduction to JavaScript"
  - Content: Write several paragraphs about JavaScript
  - Category: Select "Programming"
  - Author: Your name
  - Tags: javascript, programming, tutorial
- Click "Create Knowledge"

### 3. Watch AI Processing
- The knowledge will be created immediately
- AI processing happens in the background
- Refresh the page after a few seconds to see:
  - AI Summary
  - Extracted Keywords
  - Difficulty Level (scopeType)
  - Confidence Score

### 4. Try Search
- Click on "Search" in the navigation
- Search for keywords
- Try different filters (Category, Difficulty)

### 5. View Analytics (Admin only)
- If you're an admin, click "Analytics"
- View various charts and statistics

---

## Troubleshooting

### Backend Issues

**MongoDB Connection Error:**
```
Error connecting to MongoDB
```
**Solution:**
- Check if MongoDB is running: `mongod --version`
- Verify MONGODB_URI in .env
- For Atlas, check network access settings

**Hugging Face API Error:**
```
AI request failed: Invalid API key
```
**Solution:**
- Verify HUGGINGFACE_API_KEY in .env
- Check API key is valid on Hugging Face
- Ensure token has read permissions

**Port Already in Use:**
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:**
- Change PORT in .env to different number (e.g., 5001)
- Or kill the process using port 5000

### Frontend Issues

**Cannot Connect to API:**
```
Network Error
```
**Solution:**
- Ensure backend is running
- Check VITE_API_URL in frontend/.env
- Verify CORS_ORIGIN in backend/.env matches frontend URL

**Blank Page:**
```
White screen with no content
```
**Solution:**
- Check browser console for errors
- Ensure all dependencies are installed: `npm install`
- Clear browser cache
- Try different browser

---

## Verify Installation

Run these commands to verify everything is working:

```bash
# Check backend health
curl http://localhost:5000/api/health

# Should return:
# {
#   "success": true,
#   "message": "Server is healthy",
#   "timestamp": "..."
# }

# Check frontend is accessible
curl http://localhost:3000

# Should return HTML content
```

---

## Next Steps

1. **Explore Features:**
   - Create multiple knowledge articles
   - Experiment with search
   - View analytics dashboard

2. **Customize:**
   - Modify categories in models/Knowledge.js
   - Adjust AI models in services/aiService.js
   - Update styling in frontend/src/index.css

3. **Deploy:**
   - Follow deployment guide in README.md
   - Set up production environment
   - Configure domain and SSL

---

## Common Commands

### Backend
```bash
npm run dev      # Development with auto-reload
npm start        # Production mode
npm test         # Run tests
npm run lint     # Check code quality
```

### Frontend
```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Check code quality
```

---

## Getting Help

If you encounter any issues:

1. Check the [README.md](../README.md) for detailed documentation
2. Review error messages in terminal
3. Check browser console (F12) for frontend errors
4. Verify all environment variables are set correctly
5. Ensure all services (MongoDB, Backend, Frontend) are running

---

## Success! 🎉

You now have a fully functional Smart Knowledge Repository running locally!

Start creating knowledge articles and let the AI do its magic! ✨
