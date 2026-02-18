#!/usr/bin/env python3
"""
TOCFLIX Startup Script
Starts both Flask backend and Vite frontend servers
"""

import subprocess
import sys
import time
import os
import signal

def print_colored(text, color='blue'):
    """Print colored text"""
    colors = {
        'green': '\033[92m',
        'blue': '\033[94m',
        'yellow': '\033[93m',
        'red': '\033[91m',
        'end': '\033[0m'
    }
    print(f"{colors.get(color, colors['blue'])}{text}{colors['end']}")

def main():
    print_colored("========================================", 'blue')
    print_colored("TOCFLIX - Movie Website Startup", 'blue')
    print_colored("========================================\n", 'blue')
    
    # Get the script directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(script_dir, 'backend')
    
    # Install dependencies
    print_colored("Installing Python dependencies...", 'blue')
    try:
        subprocess.run(['pip', 'install', '-r', os.path.join(backend_dir, 'requirements.txt')], 
                      check=True, cwd=backend_dir)
        print_colored("✓ Python dependencies installed\n", 'green')
    except subprocess.CalledProcessError:
        print_colored("✗ Failed to install Python dependencies", 'red')
        sys.exit(1)
    
    print_colored("Installing Node.js dependencies...", 'blue')
    try:
        subprocess.run(['npm', 'install'], check=True, cwd=script_dir)
        print_colored("✓ Node.js dependencies installed\n", 'green')
    except subprocess.CalledProcessError:
        print_colored("✗ Failed to install Node.js dependencies", 'red')
        sys.exit(1)
    
    # Start Flask backend
    print_colored("Starting Flask backend on http://localhost:5000...", 'blue')
    backend_process = subprocess.Popen(
        ['python3', 'api.py'],
        cwd=backend_dir,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    
    time.sleep(3)  # Wait for backend to start
    
    # Start Vite frontend
    print_colored("Starting Vite development server on http://localhost:5173...", 'blue')
    frontend_process = subprocess.Popen(
        ['npm', 'run', 'dev'],
        cwd=script_dir,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    
    print_colored("✓ Application started!", 'green')
    print_colored("✓ Backend (Flask): http://localhost:5000", 'green')
    print_colored("✓ Frontend (Vite): http://localhost:5173", 'green')
    print_colored("\nPress Ctrl+C to stop both servers\n", 'yellow')
    
    # Handle graceful shutdown
    def signal_handler(sig, frame):
        print_colored("\n\nShutting down servers...", 'yellow')
        backend_process.terminate()
        frontend_process.terminate()
        try:
            backend_process.wait(timeout=5)
            frontend_process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            backend_process.kill()
            frontend_process.kill()
        print_colored("✓ Servers stopped", 'green')
        sys.exit(0)
    
    signal.signal(signal.SIGINT, signal_handler)
    
    # Keep the script running
    try:
        backend_process.wait()
        frontend_process.wait()
    except KeyboardInterrupt:
        signal_handler(None, None)

if __name__ == '__main__':
    main()
