# Troubleshooting Guide

Common issues and their solutions for the Smart Knowledge Repository.

---

## Backend Issues

### 1. MongoDB Connection Failed

**Error:**
```
Error connecting to MongoDB: MongoNetworkError: failed to connect to server
```

**Solutions:**

A. **MongoDB Not Running (Local)**
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongodb
```

B. **Wrong Connection String**
```env
# Check your .env file
MONGODB_URI=mongodb://localhost:27017/smart-knowledge-repo

# For Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
```

C. **MongoDB Atlas - Network Access**
- Go to MongoDB Atlas Dashboard
- Click "Network Access"
- Add your IP address or use 0.0.0.0/0 (for development)

D. **MongoDB Atlas - Authentication**
- Verify username and password
- Check database user has read/write permissions
- Ensure special characters in password are URL-encoded

---

### 2. Hugging Face API Errors

**Error:**
```
AI request failed: 401 Unauthorized
```

**Solutions:**

A. **Invalid API Key**
```env
# Get new key from https://huggingface.co/settings/tokens
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxxx
```

B. **Model Loading**
```
Error: Model is currently loading
```
This is normal for first request. The AI service will retry automatically.

C. **Rate Limiting**
```
Error: 429 Too Many Requests
```
Solution: 
- Wait a few minutes
- Upgrade Hugging Face plan for higher limits
- Implement request queuing in aiService.js

D. **Model Not Found**
```env
# Verify model names in .env
HF_CLASSIFIER_MODEL=facebook/bart-large-mnli
HF_SUMMARY_MODEL=facebook/bart-large-cnn
HF_KEYWORD_MODEL=ml6team/keyphrase-extraction-distilbert-inspec
```

---

### 3. Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**

A. **Kill Process Using Port**
```powershell
# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process

# Or find and kill manually
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

```bash
# Linux/macOS
lsof -ti:5000 | xargs kill -9
```

B. **Change Port**
```env
# In backend/.env
PORT=5001
```

---

### 4. JWT Token Errors

**Error:**
```
JsonWebTokenError: invalid signature
```

**Solutions:**

A. **JWT Secret Mismatch**
- Ensure JWT_SECRET in .env is same as when token was created
- Clear old tokens (logout and login again)

B. **Token Expired**
```
TokenExpiredError: jwt expired
```
- User needs to login again
- Adjust JWT_EXPIRE in .env (default: 7d)

C. **Missing Token**
```
Error: No token provided
```
- Check Authorization header: `Bearer <token>`
- Verify token is saved in localStorage (frontend)

---

### 5. Validation Errors

**Error:**
```
Validation Error: title is required
```

**Solutions:**

Check request body matches validation rules:

```javascript
// Knowledge creation
{
  "title": "Required, 5-200 chars",
  "content": "Required, min 10 chars",
  "category": "Must be valid enum value",
  "author": "Required, 2-100 chars",
  "tags": ["optional", "array"]
}
```

Valid categories:
- Programming
- Web Development
- Mobile Development
- DevOps
- Database
- AI/ML
- Cloud Computing
- Cybersecurity
- Data Science
- Software Architecture
- Testing
- Technology

---

### 6. Database Indexes Not Created

**Error:**
```
Slow search queries
```

**Solution:**

Manually create indexes:

```javascript
// Connect to MongoDB
use smart-knowledge-repo

// Create text index
db.knowledges.createIndex({ title: "text", content: "text" }, { weights: { title: 10, content: 5 } })

// Create compound index
db.knowledges.createIndex({ category: 1, tags: 1 })

// Create timestamp index
db.knowledges.createIndex({ createdAt: -1 })

// Verify indexes
db.knowledges.getIndexes()
```

---

## Frontend Issues

### 1. Blank Page / White Screen

**Error:**
White screen with no content

**Solutions:**

A. **Check Browser Console (F12)**
- Look for JavaScript errors
- Check network tab for failed API calls

B. **API Connection Failed**
```env
# Verify frontend/.env
VITE_API_URL=http://localhost:5000/api
```

C. **Clear Cache**
```bash
# Stop dev server (Ctrl+C)
# Delete node_modules
rm -rf node_modules
# Reinstall
npm install
# Start again
npm run dev
```

D. **Check Backend is Running**
```bash
curl http://localhost:5000/api/health
```

---

### 2. CORS Errors

**Error:**
```
Access to fetch at 'http://localhost:5000/api/...' has been blocked by CORS policy
```

**Solutions:**

A. **Backend CORS Configuration**
```env
# backend/.env
CORS_ORIGIN=http://localhost:3000
```

B. **Restart Backend**
```bash
# Changes to .env require restart
cd backend
npm run dev
```

C. **Proxy Configuration (Alternative)**
```javascript
// frontend/vite.config.js
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
```

---

### 3. Router Not Working (404 on Refresh)

**Error:**
Refreshing page gives 404 error

**Solutions:**

A. **Development:**
Already handled by Vite's historyApiFallback

B. **Production (Nginx):**
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

C. **Production (Apache):**
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

### 4. Authentication Loop

**Error:**
Continuous redirect between login and dashboard

**Solutions:**

A. **Clear LocalStorage**
```javascript
// Open browser console (F12)
localStorage.clear()
// Refresh page
```

B. **Check Token Validity**
```javascript
// In browser console
const token = localStorage.getItem('token')
console.log(token)
// If null or invalid, login again
```

C. **Backend JWT Secret**
Ensure JWT_SECRET hasn't changed since login

---

### 5. Images/Assets Not Loading

**Error:**
404 on image files

**Solutions:**

A. **Move to Public Folder**
```
frontend/
  public/
    images/
      logo.png
```

Reference as: `/images/logo.png`

B. **Import in Component**
```javascript
import logo from './assets/logo.png'
<img src={logo} alt="Logo" />
```

---

## AI Processing Issues

### 1. AI Not Processing

**Error:**
Knowledge created but no AI summary/keywords

**Solutions:**

A. **Check Backend Logs**
```bash
# Watch logs in real-time
tail -f backend/logs/combined.log
```

B. **Verify Hugging Face API Key**
```bash
# Test API key
curl -H "Authorization: Bearer YOUR_HF_KEY" \
  https://api-inference.huggingface.co/models/facebook/bart-large-cnn \
  -d '{"inputs": "Test"}'
```

C. **Manual AI Processing**
```bash
# Use batch process endpoint
curl -X POST http://localhost:5000/api/knowledge/admin/batch-process-ai \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"limit": 10}'
```

D. **Check Content Length**
AI processing skips very short content (< 50 chars)

---

### 2. Low AI Confidence

**Issue:**
AI confidence scores are very low (< 0.3)

**Explanations:**

A. **Ambiguous Content**
- Content doesn't clearly fit one difficulty level
- Mix of beginner and advanced concepts
- This is normal and expected

B. **Short Content**
- AI performs better with more context
- Recommendation: 200+ words for better results

C. **Multiple Topics**
- Content covers multiple categories
- Consider splitting into separate articles

---

### 3. Incorrect Scope Detection

**Issue:**
AI assigns wrong difficulty level

**Solutions:**

A. **Manual Override**
```javascript
// Update knowledge with correct scope
{
  "scopeType": "Beginner" // or Intermediate/Advanced
}
```

B. **Improve Content**
- Add difficulty indicators: "For beginners", "Advanced topic"
- Structure content: Start basic, progress to complex
- Add prerequisites explicitly

C. **Custom Prompts (Advanced)**
Modify aiService.js classifyScope() parameters:
```javascript
parameters: {
  candidate_labels: ['Beginner-friendly content', 'Intermediate-level content', 'Advanced technical content', 'Too complex or out of scope'],
  multi_label: false,
  hypothesis_template: 'This text is {}'
}
```

---

## Database Issues

### 1. Duplicate Key Error

**Error:**
```
E11000 duplicate key error collection
```

**Solutions:**

A. **Email Already Exists**
```
Key (email): "user@example.com" already exists
```
Use different email for registration

B. **Remove Duplicate**
```javascript
// In MongoDB
db.users.find({ email: "user@example.com" })
// Delete duplicate
db.users.deleteOne({ _id: ObjectId("...") })
```

---

### 2. Slow Queries

**Issue:**
Queries take too long

**Solutions:**

A. **Check Indexes**
```javascript
// Explain query
db.knowledges.find({ title: /search/ }).explain("executionStats")

// Should use indexes
// Look for: "stage": "IXSCAN" (good)
// Avoid: "stage": "COLLSCAN" (bad - full collection scan)
```

B. **Add Missing Indexes**
```javascript
// Index on frequently queried fields
db.knowledges.createIndex({ author: 1 })
db.knowledges.createIndex({ views: -1 })
```

C. **Use Pagination**
```javascript
// Always use limit
const knowledge = await Knowledge.find()
  .limit(10)
  .skip(page * 10)
```

---

## Performance Issues

### 1. Slow API Response

**Issue:**
API calls take > 1 second

**Solutions:**

A. **Database Query Optimization**
- Add indexes on search fields
- Use select() to return only needed fields
- Use lean() for read-only queries

```javascript
// Before
const knowledge = await Knowledge.find({})

// After  
const knowledge = await Knowledge.find({})
  .select('title author createdAt')
  .lean()
  .limit(20)
```

B. **Enable Caching**
```javascript
// Install redis
npm install redis

// Cache frequent queries
const cachedData = await redis.get(key)
if (cachedData) return JSON.parse(cachedData)
```

C. **Enable Compression**
```javascript
// In app.js
const compression = require('compression')
app.use(compression())
```

---

### 2. Memory Leaks

**Issue:**
Application memory increases over time

**Solutions:**

A. **Monitor with PM2**
```bash
pm2 monit
```

B. **Check for Unclosed Connections**
```javascript
// Ensure connections are closed
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected')
})
```

C. **Limit Response Size**
```javascript
// Always paginate large responses
const PAGE_SIZE = 20
```

D. **Clear Old Logs**
```bash
# Rotate logs daily
pm2 install pm2-logrotate
```

---

## Build & Deployment Issues

### 1. Build Failed

**Error:**
```
npm run build failed
```

**Solutions:**

A. **Check Dependencies**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

B. **Check for Errors**
```bash
# Run with verbose
npm run build --verbose
```

C. **Environment Variables**
```env
# Ensure all VITE_ prefixed vars exist
VITE_API_URL=http://localhost:5000/api
```

---

### 2. PM2 Won't Start

**Error:**
```
PM2: App crashed
```

**Solutions:**

A. **Check Logs**
```bash
pm2 logs
```

B. **Missing .env**
```bash
# Ensure .env exists in backend folder
ls backend/.env
```

C. **Port Conflict**
```bash
# Check if port is free
netstat -tulpn | grep 5000
```

D. **Node Version**
```bash
# Requires Node 18+
node --version
```

---

## Security Issues

### 1. Rate Limit Exceeded

**Error:**
```
429: Too many requests
```

**Solutions:**

A. **Wait 15 Minutes**
Default window is 15 minutes

B. **Adjust Limits (Development)**
```javascript
// backend/app.js
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200 // Increase for development
})
```

C. **Whitelist IPs (Production)**
```javascript
const limiter = rateLimit({
  skip: (req) => {
    return req.ip === '192.168.1.100' // Your IP
  }
})
```

---

### 2. Blocked by CORS

See "CORS Errors" section above

---

## Getting More Help

If issue persists:

1. **Check Logs:**
   ```bash
   # Backend
   tail -f backend/logs/error.log
   
   # PM2
   pm2 logs
   ```

2. **Enable Debug Mode:**
   ```env
   LOG_LEVEL=debug
   NODE_ENV=development
   ```

3. **Test API Directly:**
   ```bash
   curl -v http://localhost:5000/api/health
   ```

4. **Check System Resources:**
   ```bash
   # Disk space
   df -h
   
   # Memory
   free -m
   
   # CPU
   top
   ```

5. **Search GitHub Issues:**
   Check if others have faced similar issues

6. **Create Issue:**
   Include:
   - Error message
   - Steps to reproduce
   - Environment (OS, Node version, MongoDB version)
   - Relevant logs

---

**Still stuck?** Review the comprehensive [README.md](README.md) for detailed documentation.
