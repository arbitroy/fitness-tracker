const Activity = require('../models/Activity');
const { Streak } = require('../models/Streak');
const User = require('../models/User');
const { Points, Badge } = require('../models/Gamification');
const mongoose = require('mongoose');

exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.userId;

        // Get current date information for filtering
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // Start from Sunday
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        // Get user's profile and fitness data
        const user = await User.findById(userId)
            .select('profile fitness')
            .lean();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get activity summary
        const activityStats = await Activity.aggregate([
            { 
                $match: { 
                    user: new mongoose.Types.ObjectId(userId),
                    date: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) } // Last 30 days
                } 
            },
            { 
                $group: {
                    _id: null,
                    totalWorkouts: { $sum: 1 },
                    totalMinutes: { $sum: "$duration" },
                    totalCalories: { $sum: "$calories" }
                }
            }
        ]);

        // Get activities for the current week
        const weeklyActivities = await Activity.find({
            user: userId,
            date: { $gte: startOfWeek, $lte: endOfWeek }
        }).lean();

        // Calculate active days of the week
        const activeDays = new Set();
        weeklyActivities.forEach(activity => {
            const dayOfWeek = new Date(activity.date).getDay(); // 0-6
            activeDays.add(dayOfWeek);
        });

        // Get recent 3 activities
        const recentActivities = await Activity.find({ user: userId })
            .sort({ date: -1 })
            .limit(3)
            .lean();

        // Calculate daily goal progress (ideally from steps or other measurable goal)
        // For now using a mock value
        const dailyGoalTarget = user.fitness?.weeklyGoal?.workouts 
            ? Math.round(user.fitness.weeklyGoal.workouts / 7 * 10000) // Scale to steps
            : 5000; // Default
        
        const currentSteps = activeDays.has(today.getDay()) 
            ? Math.round(dailyGoalTarget * 0.65) 
            : Math.round(dailyGoalTarget * 0.35);
        
        const dailyProgress = Math.round((currentSteps / dailyGoalTarget) * 100);

        // Get user's weekly goal to calculate progress
        const weeklyGoal = user.fitness?.weeklyGoal?.workouts || 3;
        const workoutsThisWeek = weeklyActivities.length;
        const weeklyProgress = Math.min(100, Math.round((workoutsThisWeek / weeklyGoal) * 100));

        // Get streak information
        const streak = await Streak.findOne({ userId })
            .lean();

        // Get badges count
        const badgesCount = await Badge.countDocuments({ user: userId });

        // Prepare response
        const response = {
            dailyGoal: {
                target: dailyGoalTarget,
                current: currentSteps,
                progress: dailyProgress
            },
            weeklyProgress: {
                target: weeklyGoal,
                current: workoutsThisWeek,
                percentage: weeklyProgress,
                activeDays: Array.from(activeDays)
            },
            statistics: {
                totalWorkouts: activityStats[0]?.totalWorkouts || 0,
                totalMinutes: activityStats[0]?.totalMinutes || 0,
                totalCalories: activityStats[0]?.totalCalories || 0,
                currentStreak: streak?.currentStreak || 0,
                bestStreak: streak?.bestStreak || 0,
                badgesCount: badgesCount
            },
            recentActivities: recentActivities
        };

        res.json(response);
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({
            message: 'Failed to fetch dashboard data',
            error: error.message
        });
    }
};