# Monkey-Type

This project is a clone of MonkeyType, featuring typing speed tests and typing pattern analysis.

## Features

- 15 or 30 second typing tests
- Different text options (words, numbers, punctuation, mixed)
- Real-time typing speed and accuracy tracking
- Detailed typing analysis and error patterns
- User authentication and session history
- Neuropsychological insights based on typing behavior

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/monkey-type-clone.git
cd monkey-type-clone
```

2. Install dependencies:
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. Create a `.env` file in the server directory:
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

4. Start the development servers:
```bash
# Start backend server
cd server
npm run dev

# Start frontend server
cd ../client
npm start
```

## Usage

1. Create an account or login
2. Choose a typing test duration (15 or 30 seconds)
3. Select text type (words, numbers, punctuation, or mixed)
4. Start typing and see your results
5. View your typing history and analysis in the dashboard