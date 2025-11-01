# 🚀 Deployment Guide

This guide covers deploying the Mini Event Finder application to various platforms.

## 📋 Pre-deployment Checklist

- [ ] All features tested locally
- [ ] Environment variables configured
- [ ] Build process working
- [ ] API endpoints tested
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Responsive design verified

## 🔧 Backend Deployment

### Option 1: Railway (Recommended)

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy Backend**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login to Railway
   railway login
   
   # Navigate to backend folder
   cd backend
   
   # Initialize Railway project
   railway init
   
   # Deploy
   railway up
   ```

3. **Set Environment Variables**
   ```bash
   railway variables set PORT=5000
   railway variables set NODE_ENV=production
   ```

4. **Custom Domain (Optional)**
   - Go to Railway dashboard
   - Add custom domain
   - Update DNS settings

### Option 2: Render

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Connect GitHub account

2. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect repository
   - Configure settings:
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Environment**: Node

3. **Environment Variables**
   ```
   PORT=5000
   NODE_ENV=production
   ```

### Option 3: Heroku

1. **Install Heroku CLI**
   ```bash
   # Install Heroku CLI
   npm install -g heroku
   
   # Login
   heroku login
   ```

2. **Deploy**
   ```bash
   cd backend
   
   # Create Heroku app
   heroku create mini-event-finder-api
   
   # Set environment variables
   heroku config:set NODE_ENV=production
   
   # Deploy
   git push heroku main
   ```

## 🎨 Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd frontend
   
   # Login to Vercel
   vercel login
   
   # Deploy
   vercel
   ```

3. **Environment Variables**
   - Go to Vercel dashboard
   - Add environment variable:
     ```
     REACT_APP_API_URL=https://your-backend-url.railway.app/api
     ```

4. **Custom Domain**
   - Go to project settings
   - Add custom domain
   - Update DNS records

### Option 2: Netlify

1. **Build the App**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy via Drag & Drop**
   - Go to [netlify.com](https://netlify.com)
   - Drag `build` folder to deploy area

3. **Or Deploy via Git**
   - Connect GitHub repository
   - Set build settings:
     - **Build Command**: `npm run build`
     - **Publish Directory**: `build`

4. **Environment Variables**
   ```
   REACT_APP_API_URL=https://your-backend-url.railway.app/api
   ```

### Option 3: GitHub Pages

1. **Install gh-pages**
   ```bash
   cd frontend
   npm install --save-dev gh-pages
   ```

2. **Update package.json**
   ```json
   {
     "homepage": "https://yourusername.github.io/mini-event-finder",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     }
   }
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

## 🔗 Full-Stack Deployment

### Option 1: Single Platform (Railway)

1. **Deploy Backend** (as above)
2. **Deploy Frontend** with backend URL
3. **Update CORS** in backend for frontend domain

### Option 2: Separate Platforms

1. **Backend**: Railway/Render/Heroku
2. **Frontend**: Vercel/Netlify
3. **Configure CORS** for cross-origin requests

## 🌐 Environment Configuration

### Backend (.env)
```env
# Production
NODE_ENV=production
PORT=5000

# Development
NODE_ENV=development
PORT=5000
```

### Frontend (.env)
```env
# Production
REACT_APP_API_URL=https://your-api-domain.com/api

# Development
REACT_APP_API_URL=http://localhost:5000/api
```

## 🔒 Security Considerations

### Backend Security
```javascript
// Add to server.js
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Security headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

### Frontend Security
- Use HTTPS in production
- Validate all user inputs
- Sanitize data before display
- Use environment variables for API URLs

## 📊 Performance Optimization

### Backend Optimization
```javascript
// Compression middleware
const compression = require('compression');
app.use(compression());

// Response caching
app.use('/api/events', (req, res, next) => {
  res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
  next();
});
```

### Frontend Optimization
```bash
# Analyze bundle size
npm install --save-dev webpack-bundle-analyzer
npm run build
npx webpack-bundle-analyzer build/static/js/*.js
```

## 🔍 Monitoring & Analytics

### Backend Monitoring
```javascript
// Add logging
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### Frontend Analytics
```javascript
// Google Analytics (optional)
import ReactGA from 'react-ga4';

ReactGA.initialize('G-XXXXXXXXXX');
ReactGA.send('pageview');
```

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   ```javascript
   // Backend: Update CORS configuration
   app.use(cors({
     origin: ['http://localhost:3000', 'https://your-frontend-domain.com']
   }));
   ```

2. **Build Failures**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

3. **Environment Variables Not Working**
   - Ensure variables start with `REACT_APP_` for frontend
   - Restart development server after adding variables
   - Check deployment platform variable settings

4. **API Connection Issues**
   - Verify API URL in environment variables
   - Check network tab in browser dev tools
   - Ensure backend is deployed and accessible

## 📈 Deployment Checklist

### Pre-deployment
- [ ] All features working locally
- [ ] Tests passing (if implemented)
- [ ] Environment variables configured
- [ ] Build process successful
- [ ] Error handling implemented

### Post-deployment
- [ ] Frontend loads correctly
- [ ] API endpoints responding
- [ ] CORS configured properly
- [ ] Environment variables working
- [ ] Error pages displaying correctly
- [ ] Mobile responsiveness verified
- [ ] Performance acceptable
- [ ] Analytics configured (optional)

## 🔄 CI/CD Pipeline (Advanced)

### GitHub Actions Example
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        run: |
          # Railway deployment commands
          
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: |
          # Vercel deployment commands
```

## 📞 Support

If you encounter issues during deployment:

1. Check the platform-specific documentation
2. Review error logs in deployment dashboard
3. Verify environment variables
4. Test API endpoints manually
5. Check browser console for frontend errors

---

**Happy Deploying! 🚀**