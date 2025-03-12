const mongoose = require('mongoose');

const StreakSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    currentStreak: {
        type: Number,
        default: 0
    },
    bestStreak: {
        type: Number,
        default: 0
    },
    lastActivityDate: Date,
    streakHistory: [{
        date: Date,
        activityType: String,
        streakCount: Number
    }]
}, { timestamps: true });

// Check if the model already exists to prevent recompilation
const Streak = mongoose.models.Streak || mongoose.model('Streak', StreakSchema);

// Export as an object with a Streak property
module.exports = { Streak };