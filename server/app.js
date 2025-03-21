﻿const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDatabase = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const activityRoutes = require('./routes/activityRoutes');
const nutritionRoutes = require('./routes/nutritionRoutes');
const socialRoutes = require('./routes/socialRoutes');
const gamificationRoutes = require('./routes/gamificationRoutes');
const chatRoutes = require('./routes/chatRoutes');
const partnershipRoutes = require('./routes/partnershipRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');


const app = express();

// Middleware
app.use(cors({
  origin: true, // Allows all origins
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/activity', activityRoutes);
app.use('/nutrition', nutritionRoutes);
app.use('/social', socialRoutes);
app.use('/chat', chatRoutes);
app.use('/partnerships', partnershipRoutes);
app.use('/gamification', gamificationRoutes);
app.use('/analytics', analyticsRoutes);
app.use('/dashboard', dashboardRoutes); 


// Connect to database
connectDatabase();

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;