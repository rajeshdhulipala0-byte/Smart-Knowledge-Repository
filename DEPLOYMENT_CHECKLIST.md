# Deployment Checklist

Use this checklist before deploying to production.

---

## Pre-Deployment

### 1. Code Review
- [ ] All features tested locally
- [ ] No console.log statements in production code
- [ ] Code follows clean architecture principles
- [ ] All error handlers in place
- [ ] API responses standardized

### 2. Security
- [ ] All secrets moved to environment variables
- [ ] JWT_SECRET changed from default
- [ ] CORS configured for production domain
- [ ] Rate limiting configured appropriately
- [ ] Helmet security headers enabled
- [ ] Input validation on all endpoints
- [ ] MongoDB injection prevention in place
- [ ] Password hashing verified (bcrypt)
- [ ] HTTPS enabled (SSL certificate)
- [ ] Database connection uses authentication

### 3. Environment Configuration

#### Backend .env
- [ ] NODE_ENV=production
- [ ] PORT configured
- [ ] MONGODB_URI with production database
- [ ] JWT_SECRET is strong and unique
- [ ] HUGGINGFACE_API_KEY valid
- [ ] CORS_ORIGIN set to frontend domain
- [ ] LOG_LEVEL set appropriately
- [ ] All AI model names correct

#### Frontend .env
- [ ] VITE_API_URL points to production backend
- [ ] VITE_APP_NAME configured

### 4. Database
- [ ] MongoDB connection tested
- [ ] Database indexes created 
- [ ] Backup strategy in place
- [ ] Connection pooling configured
- [ ] Database authentication enabled
- [ ] Network access restricted (IP whitelist)
- [ ] Replica set for high availability (optional)

### 5. Dependencies
- [ ] All dependencies updated to stable versions
- [ ] No vulnerabilities (run `npm audit`)
- [ ] Production dependencies only in package.json
- [ ] Lock files committed (package-lock.json)

---

## Build & Test

### 6. Backend
- [ ] `npm install` completes without errors
- [ ] Server starts successfully
- [ ] Health check endpoint responds
- [ ] Database connection successful
- [ ] AI service connects to Hugging Face
- [ ] Authentication works
- [ ] All CRUD operations tested
- [ ] Search functionality verified
- [ ] Analytics dashboard loads

### 7. Frontend
- [ ] `npm install` completes without errors
- [ ] `npm run build` successful
- [ ] Build size optimized (check dist/ folder)
- [ ] No build warnings
- [ ] Production build tested locally (`npm run preview`)
- [ ] All routes accessible
- [ ] API calls work with production backend
- [ ] Environment variables loaded correctly
- [ ] Responsive design verified

---

## Server Setup

### 8. Server Configuration
- [ ] Node.js installed (>=18)
- [ ] MongoDB installed or Atlas configured
- [ ] Nginx installed (if using reverse proxy)
- [ ] PM2 installed globally
- [ ] Firewall configured (ports 80, 443, optional SSH)
- [ ] Domain name configured
- [ ] DNS records updated (A/CNAME)
- [ ] SSL certificate obtained (Let's Encrypt)

### 9. Application Deployment

#### Backend Deployment
- [ ] Code uploaded to server
- [ ] Dependencies installed (`npm install --production`)
- [ ] .env file configured
- [ ] PM2 ecosystem configured
- [ ] Application started with PM2
- [ ] PM2 startup script enabled
- [ ] Application accessible on server port
- [ ] Logs location configured

#### Frontend Deployment
- [ ] Build files uploaded to server
- [ ] Nginx configured for SPA routing
- [ ] Static files served correctly
- [ ] Gzip compression enabled
- [ ] Browser caching configured
- [ ] HTTPS redirect configured

### 10. Reverse Proxy (Nginx)
- [ ] Backend proxy configured
- [ ] SSL certificates configured
- [ ] HTTP to HTTPS redirect
- [ ] Security headers added
- [ ] Rate limiting (optional, additional to app)
- [ ] Static file caching
- [ ] Compression enabled
- [ ] Configuration tested (`nginx -t`)
- [ ] Nginx restarted

---

## Monitoring & Logging

### 11. Logging
- [ ] Winston logs configured
- [ ] Log rotation enabled
- [ ] Error logs monitored
- [ ] Log location accessible
- [ ] Log level set appropriately (warn/error for production)

### 12. Monitoring
- [ ] PM2 monitoring enabled
- [ ] Server resource monitoring (CPU, RAM, Disk)
- [ ] Application uptime tracking
- [ ] Error tracking configured
- [ ] Performance monitoring

### 13. Backups
- [ ] Database backup scheduled (daily/weekly)
- [ ] Code repository backed up
- [ ] Environment files backed up securely
- [ ] Backup restoration tested
- [ ] Backup retention policy defined

---

## Performance

### 14. Optimization
- [ ] Database indexes verified
- [ ] Query performance tested
- [ ] API response times acceptable (<200ms)
- [ ] Frontend bundle size optimized
- [ ] Images optimized
- [ ] Lazy loading implemented
- [ ] Caching strategies in place
- [ ] CDN configured (optional)

### 15. Load Testing
- [ ] Concurrent users tested
- [ ] API endpoints stress tested
- [ ] Database performance under load
- [ ] Memory leaks checked
- [ ] Auto-scaling configured (optional)

---

## Documentation

### 16. Documentation
- [ ] README.md complete
- [ ] QUICKSTART.md available
- [ ] API_TESTING.md available
- [ ] Environment variables documented
- [ ] Deployment guide available
- [ ] Troubleshooting guide available
- [ ] Architecture diagrams included

---

## Post-Deployment

### 17. Verification
- [ ] Application accessible via domain
- [ ] HTTPS working (no certificate errors)
- [ ] User registration works
- [ ] User login works
- [ ] Knowledge creation works
- [ ] AI processing works
- [ ] Search functionality works
- [ ] Analytics dashboard accessible (admin)
- [ ] All pages load correctly
- [ ] Mobile responsiveness verified

### 18. Testing
- [ ] Create test account
- [ ] Create test knowledge
- [ ] Verify AI processing (summary, keywords, scope)
- [ ] Test search with various queries
- [ ] Test all filters
- [ ] Test pagination
- [ ] Test edit functionality
- [ ] Test delete functionality
- [ ] Test admin features

### 19. Monitoring Setup
- [ ] Error alerts configured
- [ ] Uptime monitoring enabled
- [ ] Performance baseline established
- [ ] Analytics tracking (optional)
- [ ] User feedback mechanism

---

## Production Checklist Quick Reference

```
✓ Security hardened
✓ Environment configured
✓ Database ready
✓ Dependencies clean
✓ Build successful
✓ Server configured
✓ Nginx configured
✓ SSL enabled
✓ Monitoring active
✓ Backups scheduled
✓ Performance optimized
✓ Documentation complete
✓ Application verified
```

---

## Common Deployment Commands

```bash
# Backend deployment
cd backend
npm install --production
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup

# Frontend deployment
cd frontend
npm run build
sudo cp -r dist/* /var/www/html/

# Nginx
sudo nginx -t
sudo systemctl restart nginx

# PM2 monitoring
pm2 monit
pm2 logs

# Check application
curl https://yourdomain.com/api/health
```

---

## Rollback Plan

If deployment fails:

1. **Backend:**
   ```bash
   pm2 stop all
   git checkout previous-commit
   npm install --production
   pm2 restart all
   ```

2. **Frontend:**
   ```bash
   cd frontend
   git checkout previous-commit
   npm run build
   sudo cp -r dist/* /var/www/html/
   ```

3. **Database:**
   ```bash
   # Restore from backup
   mongorestore --uri="mongodb://..." /path/to/backup
   ```

---

## Emergency Contacts

- **Server Admin:** [Contact]
- **Database Admin:** [Contact]
- **DevOps:** [Contact]
- **Project Lead:** [Contact]

---

## Sign-off

- [ ] Development Lead
- [ ] DevOps Engineer
- [ ] Security Review
- [ ] QA Testing
- [ ] Product Owner

**Deployment Date:** _____________

**Deployed By:** _____________

**Version:** _____________

---

🚀 **Ready for Production!**
