# Fitness Tracker App

A modern, full-stack fitness tracking application with social features, gamification, and analytics to help users track their fitness journey, connect with workout partners, and stay motivated.

![Fitness Tracker Screenshot](https://via.placeholder.com/800x400?text=Fitness+Tracker+Screenshot)

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

### User Management
- Registration and login with JWT authentication
- Profile setup with fitness goals and preferences
- Personal profile page with stats and recent activities

### Fitness Tracking
- Log various workout activities (running, walking, cycling, swimming, etc.)
- Track workout duration, distance, calories, and sets/reps for strength training
- Filter and view workout history with detailed information

### Nutrition
- Log meals with detailed nutritional information
- Track calorie intake, protein, carbs, and fat
- Meal history and nutrition summary

### Social Features
- Add friends through direct requests or QR code scanning
- Create and join workout partnerships
- Social feed with friends' activities
- React and comment on activities
- Private messaging system
- Create and participate in fitness challenges

### Gamification
- Achievement system with badges for completing fitness goals
- Workout streaks tracking
- Points and leveling system
- Leaderboards for friendly competition

### Analytics & Insights
- Activity summaries and trends
- Workout statistics visualization
- Personalized recommendations based on activity history

## Tech Stack

### Frontend
- React (with Hooks and Context API)
- Vite for build tooling
- React Router for navigation
- Framer Motion for animations
- Tailwind CSS for styling
- Recharts for data visualization

### Backend
- Node.js with Express
- MongoDB with Mongoose ODM
- JWT for authentication
- RESTful API architecture

## Architecture

The application follows a client-server architecture:

- **Client**: React SPA (Single Page Application) that communicates with the server through RESTful API endpoints
- **Server**: Express.js API server that handles business logic and data persistence
- **Database**: MongoDB for storing user data, activities, social connections, etc.

### Data Models

- User (profile, authentication)
- Activity (workouts, exercise data)
- Meal (nutrition tracking)
- Social (friendships, partnerships, challenges)
- Gamification (points, streaks, achievements, badges)
- Notifications (system alerts and messages)

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- MongoDB (local or Atlas connection)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/fitness-tracker.git
cd fitness-tracker
```

2. Install dependencies
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### Environment Setup

1. Create a `.env` file in the `server` directory with the following variables:
```
MONGO_URI=mongodb://localhost:27017/fitnesstracker
JWT_SECRET=your_jwt_secret
PORT=5000
```

2. Create a `.env` file in the `client` directory:
```
VITE_API_URL=http://localhost:5000
```

## Running the Application

1. Start the full application (both frontend and backend)
```bash
# From the root directory
npm run dev
```

2. Or run the frontend and backend separately
```bash
# Run the backend server
npm run server

# Run the frontend client
npm run client
```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## API Endpoints

The API is organized into several groups of endpoints:

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get JWT token
- `GET /auth/me` - Get current user profile
- `PUT /auth/me` - Update user profile

### Activities
- `POST /activity/log` - Log a new activity
- `GET /activity/list` - Get user's activities (with optional filters)
- `GET /activity/summary` - Get activity summary stats
- `GET /activity/shared/:partnerId` - Get activities shared with a partner
- `GET /activity/feed` - Get social activity feed
- `POST /activity/:activityId/comment` - Comment on an activity
- `POST /activity/:activityId/react` - React to an activity

### Nutrition
- `POST /nutrition/meals` - Log a meal
- `GET /nutrition/meals` - Get user's meal history
- `GET /nutrition/summary` - Get nutrition summary
- `PUT /nutrition/goals` - Update nutrition goals

### Social
- `GET /social/friends` - Get user's friends
- `POST /social/friends/request` - Send friend request
- `GET /social/friends/requests` - Get friend requests
- `POST /social/friends/respond/:friendshipId` - Respond to friend request
- `GET /social/users/search` - Search for users
- `GET /social/users/:userId/profile` - Get a user's profile
- `GET /social/add-friend/:userId` - Handle QR code friend request

### Gamification
- `GET /gamification/points` - Get user's points and level
- `GET /gamification/streak` - Get user's streak information
- `GET /gamification/achievements` - Get user's achievements
- `GET /gamification/leaderboard` - Get global leaderboard

### Partnerships
- `POST /partnerships/create` - Create a workout partnership
- `GET /partnerships/:partnerId` - Get partnership with a specific user
- `POST /partnerships/:partnershipId/goals` - Add partnership goals

### Analytics
- `GET /analytics` - Get user fitness analytics and insights

## Project Structure

```
fitness-tracker/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── context/        # React Context providers
│       ├── hooks/          # Custom React hooks
│       ├── pages/          # Page components
│       └── services/       # API service functions
├── server/                 # Node.js backend
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Express middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # Express routes
│   └── utils/              # Utility functions
├── .gitignore
├── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
