# API Testing Guide

This guide provides examples for testing the Smart Knowledge Repository API using various tools.

---

## Base URL

```
http://localhost:5000/api
```

---

## 1. Health Check

### Request
```bash
curl http://localhost:5000/api/health
```

### Response
```json
{
  "success": true,
  "message": "Server is healthy",
  "timestamp": "2025-02-26T12:00:00.000Z"
}
```

---

## 2. Authentication

### Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Save the token from response for authenticated requests!**

---

## 3. Knowledge Operations

### Create Knowledge (Authenticated)

```bash
curl -X POST http://localhost:5000/api/knowledge \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Introduction to Machine Learning",
    "content": "Machine Learning is a subset of artificial intelligence that provides systems the ability to automatically learn and improve from experience without being explicitly programmed. It focuses on the development of computer programs that can access data and use it to learn for themselves.",
    "category": "AI/ML",
    "author": "John Doe",
    "tags": ["machine-learning", "ai", "data-science"]
  }'
```

### Get All Knowledge

```bash
curl http://localhost:5000/api/knowledge?page=1&limit=10
```

### Get Knowledge by ID

```bash
curl http://localhost:5000/api/knowledge/YOUR_KNOWLEDGE_ID
```

### Search Knowledge

```bash
# Basic search
curl "http://localhost:5000/api/knowledge/search?q=machine%20learning"

# Search with filters
curl "http://localhost:5000/api/knowledge/search?q=react&category=Programming&scopeType=Beginner&page=1&limit=10"
```

### Update Knowledge (Authenticated)

```bash
curl -X PUT http://localhost:5000/api/knowledge/YOUR_KNOWLEDGE_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "content": "Updated content here..."
  }'
```

### Delete Knowledge (Admin Only)

```bash
curl -X DELETE http://localhost:5000/api/knowledge/YOUR_KNOWLEDGE_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

## 4. Analytics (Admin Only)

```bash
curl http://localhost:5000/api/knowledge/admin/analytics \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

## 5. Batch AI Processing (Admin Only)

```bash
curl -X POST http://localhost:5000/api/knowledge/admin/batch-process-ai \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "limit": 10
  }'
```

---

## Postman Collection

### Import these requests into Postman:

1. **Create Environment Variables:**
   - `baseUrl`: `http://localhost:5000/api`
   - `token`: `` (will be set after login)

2. **Authentication → Register**
   - POST `{{baseUrl}}/auth/register`
   - Body:
   ```json
   {
     "name": "Test User",
     "email": "test@example.com",
     "password": "test123"
   }
   ```

3. **Authentication → Login**
   - POST `{{baseUrl}}/auth/login`
   - Body:
   ```json
   {
     "email": "test@example.com",
     "password": "test123"
   }
   ```
   - Test Script (auto-save token):
   ```javascript
   pm.test("Save token", function() {
     var jsonData = pm.response.json();
     pm.environment.set("token", jsonData.data.token);
   });
   ```

4. **Knowledge → Create**
   - POST `{{baseUrl}}/knowledge`
   - Headers: `Authorization: Bearer {{token}}`
   - Body:
   ```json
   {
     "title": "Test Knowledge",
     "content": "This is test content for AI processing.",
     "category": "Technology",
     "author": "Test User",
     "tags": ["test", "demo"]
   }
   ```

5. **Knowledge → Get All**
   - GET `{{baseUrl}}/knowledge?page=1&limit=10`

6. **Knowledge → Search**
   - GET `{{baseUrl}}/knowledge/search?q=test&category=Technology`

---

## Testing with HTTPie

```bash
# Install HTTPie
pip install httpie

# Register
http POST localhost:5000/api/auth/register \
  name="John Doe" \
  email="john@example.com" \
  password="password123"

# Login
http POST localhost:5000/api/auth/login \
  email="john@example.com" \
  password="password123"

# Create knowledge
http POST localhost:5000/api/knowledge \
  "Authorization:Bearer YOUR_TOKEN" \
  title="Test" \
  content="Content here" \
  category="Technology" \
  author="John"

# Search
http GET "localhost:5000/api/knowledge/search?q=test"
```

---

## Testing with JavaScript (Fetch API)

```javascript
// Register
const register = async () => {
  const response = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    })
  });
  const data = await response.json();
  console.log(data);
  return data.data.token;
};

// Create knowledge
const createKnowledge = async (token) => {
  const response = await fetch('http://localhost:5000/api/knowledge', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      title: 'Test Knowledge',
      content: 'This is test content.',
      category: 'Technology',
      author: 'John Doe',
      tags: ['test']
    })
  });
  return await response.json();
};

// Search
const search = async (query) => {
  const response = await fetch(`http://localhost:5000/api/knowledge/search?q=${query}`);
  return await response.json();
};
```

---

## Expected Response Formats

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ...result }
}
```

### Paginated Response
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [...items],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Validation error 1", "Validation error 2"]
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

---

## Rate Limiting

- Window: 15 minutes
- Max Requests: 100 per window
- Applies to: All `/api/*` endpoints

If rate limit exceeded:
```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later"
}
```

---

## Tips for Testing

1. **Save Tokens**: After login, save the token for authenticated requests
2. **Use Environment Variables**: Store baseUrl and token as variables
3. **Test AI Processing**: Wait 3-5 seconds after creating knowledge for AI to process
4. **Check Logs**: Backend logs show detailed request/response information
5. **Use Pretty Print**: Add `| jq` to curl commands for formatted JSON

---

## Automated Testing Script

```bash
#!/bin/bash

BASE_URL="http://localhost:5000/api"

echo "1. Testing Health Check..."
curl -s $BASE_URL/health | jq

echo "\n2. Registering User..."
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test'$(date +%s)'@example.com",
    "password": "test123"
  }')

TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.data.token')
echo "Token: $TOKEN"

echo "\n3. Creating Knowledge..."
curl -s -X POST $BASE_URL/knowledge \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Automated Test Knowledge",
    "content": "This is automated test content.",
    "category": "Technology",
    "author": "Test User",
    "tags": ["test", "automation"]
  }' | jq

echo "\n4. Searching Knowledge..."
curl -s "$BASE_URL/knowledge/search?q=test" | jq

echo "\nAll tests completed!"
```

Save as `test-api.sh` and run: `bash test-api.sh`

---

Happy Testing! 🚀
