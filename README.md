# Smart Job Tracker – AI-Powered Job Portal

Smart Job Tracker is a full-stack job portal platform built with **Flask** backend and **Next.js** frontend, designed for **cPanel deployment**. It allows employers to post job listings and job seekers to search, apply, and track their applications with AI-powered resume and cover letter generation.

---

## 🚀 Features

### For Job Seekers:
- Browse job listings with advanced filters
- AI-powered resume and cover letter generation
- One-click job applications
- Comprehensive application tracking dashboard
- Interview scheduling and follow-up reminders

### For Employers:
- Post and manage job listings
- Review applications and download resumes
- Company dashboard with analytics
- Candidate management system

---

## 🛠 Tech Stack

- **Frontend:** Next.js 14, React 18, Tailwind CSS
- **Backend:** Flask, Python 3.7+
- **Database:** MongoDB
- **Authentication:** JWT tokens
- **AI Integration:** Gemini API (configurable)
- **Deployment:** cPanel compatible with static export

---

## 📁 Project Structure

```
/
├── app.py                    # Flask entry point for cPanel
├── backend/                  # Flask application
│   ├── app.py               # Main Flask app factory
│   ├── .env.example         # Environment variables template
│   └── .env                 # Your environment variables
├── next-frontend/           # Next.js application
│   ├── pages/               # Next.js pages
│   ├── components/          # React components
│   ├── context/             # React context providers
│   ├── utils/               # Utility functions
│   ├── styles/              # CSS styles
│   └── out/                 # Built static files (generated)
├── requirements.txt         # Python dependencies
├── .htaccess               # Apache URL rewriting rules
├── deploy.sh               # Deployment script
└── README.md               # This file
```

---

## 🔧 Local Development Setup

### Prerequisites
- Python 3.7 or higher
- Node.js 16 or higher
- MongoDB (local or cloud)

### Backend Setup (Flask)

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure environment variables:**
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your configuration
   ```

3. **Run the Flask development server:**
   ```bash
   python app.py
   ```
   The API will be available at `http://localhost:5000/api`

### Frontend Setup (Next.js)

1. **Navigate to frontend directory:**
   ```bash
   cd next-frontend
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   # Create .env.local file
   echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:3000`

---

## 🚀 cPanel Deployment Guide

### Automated Deployment

1. **Run the deployment script:**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

2. **Upload to cPanel:**
   - Upload all files to your `public_html` directory
   - Ensure proper file permissions (644 for files, 755 for directories)

### Manual Deployment Steps

1. **Prepare the backend:**
   ```bash
   pip install -r requirements.txt
   cp backend/.env.example backend/.env
   # Edit backend/.env with your production values
   ```

2. **Build the frontend:**
   ```bash
   cd next-frontend
   npm install
   npm run build
   cd ..
   ```

3. **Upload files to cPanel:**
   - Upload all files to `public_html`
   - The `.htaccess` file will handle URL routing
   - Ensure `app.py` has execute permissions

### Environment Configuration

Update `backend/.env` with your production values:

```env
# MongoDB Configuration
MONGO_URL=mongodb://your-mongodb-connection-string
DB_NAME=smart_job_tracker_prod

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-key

# Flask Configuration
FLASK_ENV=production
FLASK_DEBUG=False

# API Configuration
API_BASE_URL=https://yourdomain.com/api

# Gemini AI Configuration (optional)
GEMINI_API_KEY=your-gemini-api-key-here
```

### cPanel Requirements

- **Python 3.7+** with pip
- **Apache** with mod_rewrite enabled
- **MongoDB** access (local or cloud)
- **SSL Certificate** (recommended)

---

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Jobs
- `GET /api/jobs` - List all active jobs
- `GET /api/jobs/{id}` - Get specific job
- `POST /api/jobs` - Create job (employers only)

### Applications
- `GET /api/applications` - Get user's applications
- `POST /api/applications` - Apply to a job

### AI Features
- `POST /api/ai/generate` - Generate resume/cover letter

---

## 🎨 Frontend Routes

- `/` - Home page
- `/auth/login` - Login page
- `/auth/register` - Registration page
- `/jobs` - Job listings
- `/jobs/[id]` - Job details
- `/dashboard` - User dashboard
- `/contact` - Contact page

---

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Input validation
- SQL injection prevention
- XSS protection headers

---

## 🧪 Testing

### Backend Testing
```bash
python -m pytest tests/
```

### Frontend Testing
```bash
cd next-frontend
npm test
```

---

## 🚀 Production Optimizations

### Performance
- Static file compression (gzip)
- Image optimization
- CSS/JS minification
- Browser caching headers

### SEO
- Server-side rendering (SSR) ready
- Meta tags optimization
- Sitemap generation
- Structured data markup

---

## 🔧 Troubleshooting

### Common Issues

1. **Flask app not starting:**
   - Check Python version (3.7+)
   - Verify all dependencies are installed
   - Check MongoDB connection

2. **Next.js build fails:**
   - Ensure Node.js 16+
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and reinstall

3. **API calls failing:**
   - Check CORS configuration
   - Verify API URL in frontend environment
   - Check network connectivity

4. **cPanel deployment issues:**
   - Verify file permissions
   - Check .htaccess syntax
   - Ensure mod_rewrite is enabled

### Logs and Debugging

- Flask logs: Check cPanel error logs
- Frontend errors: Browser console
- API errors: Network tab in dev tools

---

## 📱 Mobile Responsiveness

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

---

## 🔄 Updates and Maintenance

### Updating the Application

1. **Backend updates:**
   ```bash
   git pull origin main
   pip install -r requirements.txt
   # Restart Flask application
   ```

2. **Frontend updates:**
   ```bash
   cd next-frontend
   npm install
   npm run build
   # Upload new static files
   ```

### Database Maintenance

- Regular backups recommended
- Monitor database performance
- Clean up old application data periodically

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).

---

## 👥 Authors

- **Saddam Hussain Safi** – [GitHub](https://github.com/SaddamHussainSafi)
- **Rajni Bhatia** – [GitHub](https://github.com/SaddamHussainSafi)
- **Simranjeet Kaur** – [GitHub](https://github.com/SaddamHussainSafi)

---

## 🙏 Acknowledgments

- Built with assistance from AI tools for planning and documentation
- Thanks to the open-source community for the amazing tools and libraries

---

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Review the documentation

---

**Happy coding! 🚀**
