#!/bin/bash

# Healthcare CRM Complete System Startup Script
echo "🏥 Healthcare CRM - Complete System Startup"
echo "==========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_nodejs() {
    print_status "Checking Node.js installation..."
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_success "Node.js is installed: $NODE_VERSION"
    else
        print_error "Node.js is not installed. Please install Node.js (v16 or higher)"
        exit 1
    fi
}

# Check if MySQL is installed
check_mysql() {
    print_status "Checking MySQL installation..."
    if command -v mysql &> /dev/null; then
        MYSQL_VERSION=$(mysql --version)
        print_success "MySQL is installed: $MYSQL_VERSION"
    else
        print_error "MySQL is not installed. Please install MySQL (v8.0 or higher)"
        exit 1
    fi
}

# Install dependencies
install_dependencies() {
    print_status "Installing project dependencies..."
    
    # Install root dependencies
    print_status "Installing root dependencies..."
    npm install
    
    # Install server dependencies
    print_status "Installing server dependencies..."
    cd server
    npm install
    cd ..
    
    # Install client dependencies
    print_status "Installing client dependencies..."
    cd client
    npm install
    cd ..
    
    print_success "All dependencies installed successfully!"
}

# Setup environment files
setup_environment() {
    print_status "Setting up environment files..."
    
    # Server environment
    if [ ! -f "server/.env" ]; then
        print_status "Creating server environment file..."
        cp server/env.example server/.env
        print_warning "Please edit server/.env with your database credentials and API keys"
    else
        print_success "Server environment file already exists"
    fi
    
    # Client environment
    if [ ! -f "client/.env" ]; then
        print_status "Creating client environment file..."
        cp client/env.example client/.env
        print_success "Client environment file created"
    else
        print_success "Client environment file already exists"
    fi
}

# Setup database
setup_database() {
    print_status "Setting up database..."
    
    # Test database setup
    cd server
    node test-system.js
    cd ..
    
    print_success "Database setup completed!"
}

# Start the system
start_system() {
    print_status "Starting Healthcare CRM System..."
    echo ""
    print_success "🚀 Starting both frontend and backend servers..."
    echo ""
    echo "📱 Frontend will be available at: http://localhost:3000"
    echo "🔧 Backend API will be available at: http://localhost:5000"
    echo "📊 Health check: http://localhost:5000/api/health"
    echo ""
    echo "🔑 Default login credentials:"
    echo "   Email: admin@hospital.com"
    echo "   Password: admin123"
    echo ""
    echo "Press Ctrl+C to stop the servers"
    echo ""
    
    # Start both servers
    npm run dev
}

# Main function
main() {
    echo "Starting Healthcare CRM setup and launch..."
    echo ""
    
    # Check prerequisites
    check_nodejs
    check_mysql
    echo ""
    
    # Install dependencies
    install_dependencies
    echo ""
    
    # Setup environment
    setup_environment
    echo ""
    
    # Setup database
    setup_database
    echo ""
    
    # Start system
    start_system
}

# Run main function
main
