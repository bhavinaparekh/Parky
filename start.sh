#!/bin/bash

# Parky Startup Script

echo "🚗 Starting Parky Application..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install frontend dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Install backend dependencies if backend/node_modules doesn't exist
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend
    npm install
    cd ..
fi

# Check if .env file exists in backend
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Backend .env file not found. Please copy backend/.env.example to backend/.env and configure it."
    echo "📝 You can run: cp backend/.env.example backend/.env"
    exit 1
fi

# Start backend server in background
echo "🔧 Starting backend server..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "📱 Starting React Native app..."
echo "Choose your platform:"
echo "1) iOS Simulator"
echo "2) Android Emulator"
echo "3) Web Browser"
echo "4) All platforms"

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo "🍎 Starting iOS Simulator..."
        npm run ios
        ;;
    2)
        echo "🤖 Starting Android Emulator..."
        npm run android
        ;;
    3)
        echo "🌐 Starting Web Browser..."
        npm run web
        ;;
    4)
        echo "🚀 Starting all platforms..."
        npm run ios &
        npm run android &
        npm run web &
        ;;
    *)
        echo "❌ Invalid choice. Starting web browser by default..."
        npm run web
        ;;
esac

# Function to cleanup on exit
cleanup() {
    echo "🛑 Shutting down..."
    kill $BACKEND_PID 2>/dev/null
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user to stop the application
echo "✅ Parky is running!"
echo "Press Ctrl+C to stop the application"
wait
