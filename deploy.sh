#!/bin/bash

echo "🚀 Starting deployment preparation for cPanel..."

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip3 install --user -r requirements.txt || pip install --break-system-packages -r requirements.txt

# Navigate to Next.js frontend directory
cd next-frontend

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found in next-frontend directory"
    exit 1
fi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf node_modules package-lock.json .next out

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
npm install

# Build Next.js application for static export
echo "🔨 Building Next.js application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Next.js build completed successfully"
else
    echo "❌ Next.js build failed"
    exit 1
fi

# Return to root directory
cd ..

# Create .env file from example if it doesn't exist
if [ ! -f "backend/.env" ]; then
    echo "📝 Creating .env file from example..."
    cp backend/.env.example backend/.env
    echo "⚠️  Please update the .env file with your actual configuration values"
fi

echo ""
echo "🎉 Deployment preparation completed!"
echo ""
echo "📋 Next steps for cPanel deployment:"
echo "1. Upload all files to your cPanel public_html directory"
echo "2. Update backend/.env with your actual database and API credentials"
echo "3. Ensure your cPanel supports Python 3.7+ and has the required modules"
echo "4. The Flask API will be available at yourdomain.com/api/"
echo "5. The Next.js frontend will be served from yourdomain.com/"
echo ""
echo "📁 File structure:"
echo "   - app.py (Flask entry point)"
echo "   - backend/ (Flask application)"
echo "   - next-frontend/out/ (Built Next.js static files)"
echo "   - .htaccess (URL rewriting rules)"
echo "   - requirements.txt (Python dependencies)"
echo ""
echo "🔧 Make sure to:"
echo "   - Set proper file permissions (644 for files, 755 for directories)"
echo "   - Configure your MongoDB connection string in backend/.env"
echo "   - Update NEXT_PUBLIC_API_URL in next-frontend/.env.local if needed"