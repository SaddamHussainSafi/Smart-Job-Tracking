# 🚀 cPanel Deployment Guide for Smart Job Tracker

This guide will walk you through deploying the Smart Job Tracker application (Flask + Next.js) to cPanel hosting.

## 📋 Prerequisites

Before you begin, ensure you have:

- cPanel hosting account with Python 3.7+ support
- MongoDB database (local or cloud like MongoDB Atlas)
- Domain name configured with your hosting
- FTP/File Manager access to your cPanel account

## 🔧 Step 1: Prepare Your Local Environment

### 1.1 Clone and Setup
```bash
git clone <your-repository-url>
cd smart-job-tracker
```

### 1.2 Run the Deployment Script
```bash
chmod +x deploy.sh
./deploy.sh
```

This script will:
- Install Python dependencies
- Install Node.js dependencies
- Build the Next.js frontend for static export
- Create necessary configuration files

## 📤 Step 2: Upload Files to cPanel

### 2.1 File Structure for cPanel
Your cPanel `public_html` directory should contain:

```
public_html/
├── app.py                    # Flask entry point
├── backend/                  # Flask application
│   ├── app.py
│   └── .env                  # Your environment variables
├── next-frontend/
│   └── out/                  # Built Next.js static files
├── requirements.txt          # Python dependencies
├── .htaccess                 # URL rewriting rules
└── [other files]
```

### 2.2 Upload Methods

**Option A: File Manager**
1. Login to cPanel
2. Open File Manager
3. Navigate to `public_html`
4. Upload all files and folders

**Option B: FTP Client**
1. Use FileZilla, WinSCP, or similar
2. Connect to your hosting account
3. Upload to the `public_html` directory

## ⚙️ Step 3: Configure Environment Variables

### 3.1 Create .env File
In `public_html/backend/.env`:

```env
# MongoDB Configuration
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/
DB_NAME=smart_job_tracker_prod

# JWT Configuration  
JWT_SECRET=your-super-secure-random-jwt-secret-key-here

# Flask Configuration
FLASK_ENV=production
FLASK_DEBUG=False

# API Configuration
API_BASE_URL=https://yourdomain.com/api

# Optional: Gemini AI Configuration
GEMINI_API_KEY=your-gemini-api-key-here
```

### 3.2 Update Frontend Configuration
If needed, update `next-frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
```

## 🐍 Step 4: Install Python Dependencies in cPanel

### 4.1 Using cPanel Terminal (if available)
```bash
cd public_html
pip3 install --user -r requirements.txt
```

### 4.2 Using Python Selector (if available)
1. Go to cPanel → Software → Select Python Version
2. Choose Python 3.7+
3. Install packages from requirements.txt

### 4.3 Manual Installation (if needed)
Some cPanel hosts require manual package installation. Contact your hosting provider for assistance.

## 🔧 Step 5: Configure Web Server

### 5.1 Verify .htaccess
Ensure your `.htaccess` file is in the `public_html` directory with the correct content:

```apache
# Enable URL rewriting
RewriteEngine On

# Handle Flask API routes
RewriteCond %{REQUEST_URI} ^/api/(.*)$
RewriteRule ^api/(.*)$ app.py [L]

# Handle Next.js static files and routes
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/api/
RewriteRule ^(.*)$ /next-frontend/out/$1 [L]

# Default to index.html for client-side routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/api/
RewriteRule . /next-frontend/out/index.html [L]
```

### 5.2 Set File Permissions
Set appropriate permissions:
- Files: 644
- Directories: 755
- app.py: 755 (executable)

## 🗄️ Step 6: Set Up Database

### 6.1 MongoDB Atlas (Recommended)
1. Create account at mongodb.com
2. Create new cluster
3. Get connection string
4. Update MONGO_URL in .env

### 6.2 Local MongoDB (if supported)
1. Check if your host supports MongoDB
2. Create database and user
3. Update connection string

## 🧪 Step 7: Test Your Deployment

### 7.1 Test API Endpoints
Visit these URLs to test:
- `https://yourdomain.com/api/health` - Should return health status
- `https://yourdomain.com/` - Should load the homepage

### 7.2 Test Frontend
1. Visit your domain
2. Try registering a new account
3. Test login/logout functionality
4. Browse job listings

## 🔍 Step 8: Troubleshooting

### Common Issues

**1. 500 Internal Server Error**
- Check error logs in cPanel
- Verify Python dependencies are installed
- Check file permissions
- Verify .env file configuration

**2. API endpoints not working**
- Check .htaccess configuration
- Verify mod_rewrite is enabled
- Check Flask app.py file permissions

**3. Frontend not loading**
- Verify Next.js build completed successfully
- Check static files are in `next-frontend/out/`
- Verify .htaccess routing rules

**4. Database connection issues**
- Verify MongoDB connection string
- Check network access in MongoDB Atlas
- Verify database credentials

### Checking Logs
Access error logs through:
- cPanel → Metrics → Error Logs
- Or check `/home/username/logs/` directory

## 🔧 Step 9: Performance Optimization

### 9.1 Enable Compression
Add to .htaccess:
```apache
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript application/json
</IfModule>
```

### 9.2 Enable Caching
```apache
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
</IfModule>
```

### 9.3 SSL Certificate
1. Enable SSL in cPanel
2. Use Let's Encrypt (free)
3. Update API URLs to use HTTPS

## 🔄 Step 10: Updates and Maintenance

### Updating the Application
1. Build new version locally
2. Upload changed files via FTP/File Manager
3. Restart Python application if needed

### Regular Maintenance
- Monitor error logs
- Update dependencies periodically
- Backup database regularly
- Monitor application performance

## 📞 Support

### Getting Help
1. Check cPanel documentation
2. Contact your hosting provider
3. Review application logs
4. Check GitHub issues

### Hosting Provider Requirements
Ensure your hosting provider supports:
- Python 3.7+
- mod_rewrite
- Custom .htaccess files
- File permissions management

---

## 🎉 Congratulations!

Your Smart Job Tracker application should now be live and accessible via your domain name. Users can:

- Register as job seekers or employers
- Browse and search job listings
- Apply to jobs with AI-generated documents
- Track applications and manage profiles

Remember to regularly update your application and monitor its performance for the best user experience.

---

**Need help?** Check the main README.md for additional troubleshooting tips and configuration options.