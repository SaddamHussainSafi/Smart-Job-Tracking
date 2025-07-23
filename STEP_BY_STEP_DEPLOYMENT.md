# 📋 Step-by-Step Deployment Guide

## ✅ What We've Completed So Far

✅ **Frontend Built Successfully** - Your Next.js app is ready for deployment  
✅ **Static Files Generated** - All files are in `next-frontend/out/`  
✅ **Environment Files Created** - Both frontend and backend configured  

## 🚀 Next Steps for Complete Deployment

### Step 1: Test Frontend Locally (Optional)

You can test the built frontend locally:

```bash
# In your terminal, from the project root
cd next-frontend
npx serve out
```

This will serve your static files at `http://localhost:3000`

### Step 2: Set Up MongoDB Database

**Option A: MongoDB Atlas (Recommended - Free)**

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster (free tier)
4. Create a database user
5. Get your connection string
6. Update `backend/.env` with your connection string:
   ```env
   MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/
   ```

**Option B: Local MongoDB (Advanced)**
```bash
# Install MongoDB locally (varies by OS)
# Ubuntu/Debian:
sudo apt-get install mongodb

# macOS:
brew install mongodb/brew/mongodb-community

# Start MongoDB
sudo systemctl start mongod  # Linux
brew services start mongodb/brew/mongodb-community  # macOS
```

### Step 3: Test Backend Locally

```bash
# From project root
python app.py
```

Your Flask API should start at `http://localhost:5000`

Test the health endpoint:
```bash
curl http://localhost:5000/api/health
```

### Step 4: Deploy to cPanel

#### 4.1 Prepare Files for Upload

Your files are already ready! You need to upload these to your cPanel:

```
Files to upload to public_html/:
├── app.py
├── backend/ (entire folder)
├── next-frontend/out/ (rename to 'frontend' or keep as 'next-frontend')
├── requirements.txt
├── .htaccess
└── Any other files in the root
```

#### 4.2 Upload to cPanel

**Method 1: File Manager**
1. Login to your cPanel
2. Open "File Manager"
3. Navigate to `public_html`
4. Upload all the files and folders

**Method 2: FTP Client**
1. Use FileZilla, WinSCP, or similar
2. Connect to your hosting account
3. Upload to `public_html` directory

#### 4.3 Set File Permissions

In cPanel File Manager, set permissions:
- Files: 644
- Directories: 755
- `app.py`: 755 (make it executable)

#### 4.4 Install Python Dependencies

**Option 1: cPanel Terminal (if available)**
```bash
cd public_html
pip3 install --user -r requirements.txt
```

**Option 2: Python Selector (if available)**
1. Go to cPanel → Software → Select Python Version
2. Choose Python 3.7+
3. Install packages from requirements.txt

**Option 3: Contact Host Support**
Some hosts require manual installation - contact support with your requirements.txt

#### 4.5 Update Environment for Production

Update `backend/.env` for production:
```env
# MongoDB Configuration
MONGO_URL=mongodb+srv://your-atlas-connection-string
DB_NAME=smart_job_tracker_prod

# JWT Configuration
JWT_SECRET=your-super-secure-production-secret-key

# Flask Configuration
FLASK_ENV=production
FLASK_DEBUG=False

# API Configuration
API_BASE_URL=https://yourdomain.com/api
```

#### 4.6 Update Frontend API URL

If needed, update the frontend to point to your domain:

1. Edit `next-frontend/.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=https://yourdomain.com/api
   ```

2. Rebuild the frontend:
   ```bash
   cd next-frontend
   npm run build
   ```

3. Re-upload the `out/` folder

### Step 5: Test Your Live Application

1. **Visit your domain** - Should load the homepage
2. **Test API** - Visit `https://yourdomain.com/api/health`
3. **Test Registration** - Try creating an account
4. **Test Login** - Try logging in
5. **Browse Jobs** - Check the jobs page

### Step 6: Troubleshooting Common Issues

**Issue: 500 Internal Server Error**
- Check cPanel error logs
- Verify Python dependencies installed
- Check file permissions
- Verify .env configuration

**Issue: API not working**
- Check .htaccess file is uploaded
- Verify mod_rewrite is enabled
- Check Flask app.py permissions

**Issue: Frontend not loading**
- Verify static files uploaded correctly
- Check .htaccess routing rules
- Ensure index.html exists

**Issue: Database connection failed**
- Verify MongoDB connection string
- Check network access in MongoDB Atlas
- Test connection from cPanel terminal

## 🎉 Success Checklist

- [ ] Frontend builds successfully ✅ (Already done!)
- [ ] Backend starts without errors
- [ ] Database connection works
- [ ] Files uploaded to cPanel
- [ ] Python dependencies installed
- [ ] Environment variables configured
- [ ] Website loads at your domain
- [ ] API endpoints respond
- [ ] User registration works
- [ ] Login/logout works
- [ ] Job browsing works

## 📞 Need Help?

1. **Check the logs**: cPanel → Metrics → Error Logs
2. **Test locally first**: Make sure everything works on your computer
3. **Contact your host**: They can help with Python setup
4. **MongoDB Atlas support**: Free tier includes support

## 🚀 Your Application Features

Once deployed, users can:
- ✅ Register as job seekers or employers
- ✅ Browse and search job listings
- ✅ Apply to jobs with AI-generated resumes
- ✅ Track applications and manage profiles
- ✅ Modern, mobile-friendly interface

---

**You're almost there!** 🎯 The frontend is ready, now just follow these steps to get everything live!