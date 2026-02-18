#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}TOCFLIX - Movie Website Startup${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${YELLOW}Python 3 is required but not installed.${NC}"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}Node.js is required but not installed.${NC}"
    exit 1
fi

# Install Python dependencies
echo -e "${BLUE}Installing Python dependencies...${NC}"
cd backend
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}Failed to install Python dependencies${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Python dependencies installed${NC}\n"

# Install Node dependencies
echo -e "${BLUE}Installing Node.js dependencies...${NC}"
cd ..
npm install
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}Failed to install Node dependencies${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js dependencies installed${NC}\n"

# Start the backend
echo -e "${BLUE}Starting Flask backend on http://localhost:5000...${NC}"
cd backend
python3 api.py &
BACKEND_PID=$!
sleep 3

# Start the frontend
echo -e "${BLUE}Starting Vite development server on http://localhost:5173...${NC}"
cd ..
npm run dev &
FRONTEND_PID=$!

echo -e "${GREEN}✓ Application started!${NC}"
echo -e "${GREEN}Backend (Flask): http://localhost:5000${NC}"
echo -e "${GREEN}Frontend (Vite): http://localhost:5173${NC}"
echo -e "\n${YELLOW}Press Ctrl+C to stop both servers${NC}\n"

# Handle cleanup on exit
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT

# Wait for processes
wait
