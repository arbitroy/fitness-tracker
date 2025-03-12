import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationsDropdown from '../components/features/notifications/NotificationsDropdown';
import { NavigationMenu, MobileNavigationDrawer, BreadcrumbNavigation } from '../components/navigation';
import PropTypes from 'prop-types';
import { API_BASE_URL } from '../../../server/config/env';
import Feedback from '../components/common/Feedback';

// Tooltip Component
const StatsTooltip = ({ children, content }) => (
  <div className="group relative">
    {children}
    <div className="absolute hidden group-hover:block -bottom-2 left-1/2 transform -translate-x-1/2 translate-y-full 
                    bg-black/90 text-orange-200 text-sm px-3 py-1 rounded whitespace-nowrap z-50
                    border border-red-500/20">
      {content}
    </div>
  </div>
);

StatsTooltip.propTypes = {
  children: PropTypes.node.isRequired,
  content: PropTypes.string.isRequired
};

// Stats Card Component
const StatCard = ({ stat, onClick, index }) => (
  <motion.div
    initial={{ scale: 0.95, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ delay: 0.1 * index }}
    onClick={onClick}
    className={`bg-gradient-to-br from-black to-red-950/30 p-6 rounded-xl border border-red-500/10 
               hover:border-red-500/20 transition-all duration-300
               ${onClick ? 'cursor-pointer' : ''}`}
  >
    <h3 className="text-lg font-medium text-orange-200 mb-2">{stat.title}</h3>
    <StatsTooltip content={stat.tooltip}>
      <div className="flex items-center space-x-2">
        <p className="text-3xl font-bold text-red-500">{stat.value}</p>
        {stat.change && (
          <span className={`text-sm ${stat.change > 0 ? 'text-green-500' : 'text-red-400'}`}>
            {stat.change > 0 ? '↑' : '↓'} {Math.abs(stat.change)}%
          </span>
        )}
      </div>
    </StatsTooltip>
    {stat.progress !== undefined && (
      <div className="mt-3">
        <div className="h-2 bg-black/40 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${stat.progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
          />
        </div>
      </div>
    )}
  </motion.div>
);

StatCard.propTypes = {
  stat: PropTypes.shape({
    title: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    tooltip: PropTypes.string.isRequired,
    isClickable: PropTypes.bool,
    progress: PropTypes.number,
    change: PropTypes.number
  }).isRequired,
  onClick: PropTypes.func,
  index: PropTypes.number.isRequired
};

// Quick Action Button Component
const QuickActionButton = ({ action, index, onActionClick }) => (
  <motion.button
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 + (index * 0.1) }}
    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    whileTap={{ scale: 0.98 }}
    onClick={() => onActionClick(action)}
    className="relative group bg-gradient-to-br from-black to-red-950/30 p-6 rounded-xl 
             border border-red-500/10 hover:border-red-500/30 transition-all duration-300"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-orange-500/0 to-red-500/0 
                    group-hover:from-red-500/5 group-hover:via-orange-500/5 group-hover:to-red-500/5 
                    rounded-xl transition-all duration-500"/>
    <div className="flex items-center space-x-3">
      <div className="relative p-3 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg text-white">
        {action.icon}
        {action.stat && (
          <StatsTooltip content={`Recent activity trend: ${action.stat}`}>
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </div>
          </StatsTooltip>
        )}
      </div>
      <div className="text-left">
        <h3 className="font-medium text-orange-200">{action.name}</h3>
        <p className="text-sm text-orange-200/70">{action.description}</p>
      </div>
    </div>
  </motion.button>
);

QuickActionButton.propTypes = {
  action: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    icon: PropTypes.node.isRequired,
    stat: PropTypes.string
  }).isRequired,
  index: PropTypes.number.isRequired,
  onActionClick: PropTypes.func.isRequired
};

// Activity Item Component
const ActivityItem = ({ activity, index }) => (
  <motion.div
    initial={{ x: -20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    whileHover={{ x: 5 }}
    transition={{ delay: 0.1 * index }}
    className="flex justify-between items-center p-3 bg-gradient-to-r from-black to-red-950/20 
              rounded-lg border border-red-500/10 hover:border-red-500/20 
              transition-all duration-300 cursor-pointer"
  >
    <div className="flex items-center space-x-3">
      <div className={`w-2 h-2 ${activity.color} rounded-full`}></div>
      <div>
        <span className="text-orange-200">{activity.name}</span>
        {activity.highlight && (
          <span className="ml-2 px-2 py-0.5 text-xs bg-red-500/20 text-red-400 rounded-full">
            New PR!
          </span>
        )}
      </div>
    </div>
    <div className="flex items-center space-x-4">
      {activity.stats && (
        <span className="text-sm text-orange-300">{activity.stats}</span>
      )}
      <span className="text-sm text-orange-200/70">{activity.time}</span>
    </div>
  </motion.div>
);

ActivityItem.propTypes = {
  activity: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    name: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    highlight: PropTypes.bool,
    stats: PropTypes.string
  }).isRequired,
  index: PropTypes.number.isRequired
};

// Weekly Insight Modal Component
const WeeklyInsightModal = ({ isOpen, onClose, insightData }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={e => e.stopPropagation()}
          className="bg-gradient-to-br from-black to-red-950/30 p-6 rounded-xl border border-red-500/20
                    max-w-lg w-full mx-4 space-y-4"
        >
          <h3 className="text-xl font-bold text-orange-200">Weekly Progress Insight</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-orange-200/80">Weekly Goal Progress</span>
              <span className="text-orange-200">{insightData.goalProgress}%</span>
            </div>
            <div className="h-2 bg-black/40 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${insightData.goalProgress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-black/20 p-4 rounded-lg">
                <p className="text-orange-200/60 text-sm">Total Workouts</p>
                <p className="text-2xl font-bold text-orange-200">{insightData.totalWorkouts}</p>
              </div>
              <div className="bg-black/20 p-4 rounded-lg">
                <p className="text-orange-200/60 text-sm">Calories Burned</p>
                <p className="text-2xl font-bold text-orange-200">{insightData.totalCalories}</p>
              </div>
            </div>
            
            <div className="mt-4">
              <h4 className="text-orange-200 font-medium mb-2">Active Days</h4>
              <div className="flex justify-between">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                  <div key={day} className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full mb-1 flex items-center justify-center
                      ${insightData.activeDays.includes(index) 
                        ? 'bg-gradient-to-br from-red-500 to-orange-500 text-white' 
                        : 'bg-black/40 text-gray-400'}`}>
                      {day[0]}
                    </div>
                    <span className="text-xs text-orange-200/60">{day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-full mt-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg
                     hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300"
          >
            Close
          </button>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

WeeklyInsightModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  insightData: PropTypes.shape({
    goalProgress: PropTypes.number.isRequired,
    totalWorkouts: PropTypes.number.isRequired,
    totalCalories: PropTypes.number.isRequired,
    activeDays: PropTypes.array.isRequired
  }).isRequired
};

// Main Dashboard Component
const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showWeeklyInsight, setShowWeeklyInsight] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    dailyGoal: {
      target: 5000,
      current: 0,
      progress: 0
    },
    weeklyProgress: {
      percentage: 0,
      activeDays: []
    },
    recentActivities: [],
    insightData: {
      goalProgress: 0,
      totalWorkouts: 0,
      totalCalories: 0,
      activeDays: []
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch activity summary data
      const activityResponse = await fetch(`${API_BASE_URL}/activity/summary`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!activityResponse.ok) {
        throw new Error('Failed to fetch activity data');
      }

      const activityData = await activityResponse.json();

      // Fetch recent activities
      const recentResponse = await fetch(`${API_BASE_URL}/activity/list?limit=3`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!recentResponse.ok) {
        throw new Error('Failed to fetch recent activities');
      }

      const recentActivities = await recentResponse.json();

      // Fetch streak data
      const streakResponse = await fetch(`${API_BASE_URL}/gamification/streak`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!streakResponse.ok) {
        throw new Error('Failed to fetch streak data');
      }

      const streakData = await streakResponse.json();

      // Calculate current day of week (0-6, where 0 is Sunday)
      const today = new Date().getDay();
      
      // Process active days from activity dates
      const activeDays = getActiveDaysOfWeek(recentActivities);
      
      // Calculate daily goal progress (using a placeholder step count)
      const dailyGoalTarget = 5000; // This could come from user settings
      const currentSteps = Math.min(3248, dailyGoalTarget); // Placeholder
      const stepsProgress = Math.round((currentSteps / dailyGoalTarget) * 100);
      
      // Calculate weekly progress based on activities compared to user's weekly goal
      const weeklyGoal = user?.fitness?.weeklyGoal?.workouts || 3;
      const workoutsThisWeek = activeDays.length;
      const weeklyProgress = Math.round((workoutsThisWeek / weeklyGoal) * 100);

      // Format recent activities for display
      const formattedActivities = recentActivities.map(activity => ({
        id: activity._id,
        name: formatActivityName(activity.type),
        time: formatTimeAgo(new Date(activity.date)),
        color: getActivityColor(activity.type),
        stats: activity.distance ? `${activity.distance} km` : `${activity.duration} min`,
        highlight: activity.calories > 300 // Just a sample condition for highlighting
      }));

      // Update dashboard data state
      setDashboardData({
        dailyGoal: {
          target: dailyGoalTarget,
          current: currentSteps,
          progress: stepsProgress
        },
        weeklyProgress: {
          percentage: weeklyProgress,
          activeDays: activeDays
        },
        recentActivities: formattedActivities,
        insightData: {
          goalProgress: weeklyProgress,
          totalWorkouts: activityData.totalActivities || workoutsThisWeek,
          totalCalories: activityData.totalCalories || 1284, // Fallback value
          activeDays: activeDays
        }
      });

      setFeedback({
        type: 'success',
        message: 'Dashboard data updated successfully',
        autoClose: true
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setFeedback({
        type: 'error',
        message: 'Failed to load dashboard data: ' + error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to get active days of week from activities
  const getActiveDaysOfWeek = (activities) => {
    const activeDays = new Set();
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Start from Sunday
    
    activities.forEach(activity => {
      const activityDate = new Date(activity.date);
      // Check if the activity was in the current week
      if (activityDate >= startOfWeek && activityDate <= today) {
        const dayOfWeek = activityDate.getDay(); // 0-6 (Sunday-Saturday)
        activeDays.add(dayOfWeek);
      }
    });
    
    return Array.from(activeDays);
  };

  // Helper to format activity name
  const formatActivityName = (type) => {
    const names = {
      running: 'Morning Run',
      walking: 'Walk',
      cycling: 'Cycling',
      swimming: 'Swimming',
      weightlifting: 'Weight Training',
      yoga: 'Yoga Session',
      other: 'Workout'
    };
    return names[type] || 'Workout';
  };

  // Helper to format time ago
  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return diffInDays === 1 ? 'Yesterday' : `${diffInDays} days ago`;
    }
  };

  // Helper to get color based on activity type
  const getActivityColor = (type) => {
    const colors = {
      running: 'bg-red-500',
      walking: 'bg-orange-500',
      cycling: 'bg-yellow-500',
      swimming: 'bg-blue-500',
      weightlifting: 'bg-purple-500',
      yoga: 'bg-green-500',
      other: 'bg-gray-500'
    };
    return colors[type] || 'bg-red-500';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleActionClick = (action) => {
    // Show feedback first
    setFeedback({
      type: 'info',
      message: `Navigating to ${action.name}...`,
      autoClose: true
    });
    
    // Then navigate after a short delay
    setTimeout(() => {
      action.onClick();
    }, 300);
  };

  // Format stats for display
  const stats = [
    {
      title: "Today's Goal",
      value: `${dashboardData.dailyGoal.current.toLocaleString()} / ${dashboardData.dailyGoal.target.toLocaleString()} steps`,
      progress: dashboardData.dailyGoal.progress,
      tooltip: `Daily step goal - you've completed ${dashboardData.dailyGoal.current.toLocaleString()} steps so far`,
      change: 5 // Sample value showing 5% improvement
    },
    {
      title: "Weekly Progress",
      value: `${dashboardData.weeklyProgress.percentage}%`,
      isClickable: true,
      tooltip: "Click to view detailed weekly stats",
      progress: dashboardData.weeklyProgress.percentage
    },
    {
      title: "Active Days",
      value: `${dashboardData.weeklyProgress.activeDays.length}/7`,
      tooltip: `You've been active ${dashboardData.weeklyProgress.activeDays.length} out of 7 days this week`
    }
  ];

  const quickActions = [
    {
      name: 'Track Fitness',
      description: 'Log workouts and track your activity',
      onClick: () => navigate('/fitness'),
      stat: '+15% more active',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      name: 'Track Nutrition',
      description: 'Log meals and monitor your diet',
      onClick: () => navigate('/nutrition'),
      stat: 'On track',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      )
    },
    {
      name: 'Social Hub',
      description: 'Connect with friends and join challenges',
      onClick: () => navigate('/social'),
      stat: '3 new friends',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      name: 'Achievements',
      description: 'View your badges and rankings',
      onClick: () => navigate('/gamification'),
      stat: '2 new badges',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    },
    {
      name: 'Analytics',
      description: 'View your progress and stats',
      onClick: () => navigate('/analytics'),
      stat: '+12% this week',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    }
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-orange-200">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-black/80 backdrop-blur-sm border-b border-red-500/10 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <motion.span
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                  fetchDashboardData();
                  setFeedback({
                    type: 'info',
                    message: 'Refreshing dashboard data...',
                    autoClose: true
                  });
                }}
                className="text-xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent 
                          cursor-pointer"
              >
                Fitness Tracker
              </motion.span>
            </div>
            <div className="flex items-center space-x-4">
              <NotificationsDropdown />
              <span className="text-orange-200">
                Welcome, {user?.profile?.fullName || user?.email || 'User'}
              </span>

              {/* Profile and Logout Buttons */}
              <div className="hidden md:flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/profile')}
                  className="text-orange-200 hover:text-orange-400 px-4 py-2 rounded-md transition-colors"
                >
                  Edit Profile
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 py-2 rounded-md 
                            transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20"
                >
                  Logout
                </motion.button>
              </div>

              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden text-orange-200 hover:text-orange-400"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content with Sidebar Navigation */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <BreadcrumbNavigation />
          
          <AnimatePresence>
            {feedback && (
              <motion.div
                className="mt-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Feedback
                  type={feedback.type}
                  message={feedback.message}
                  onClose={() => setFeedback(null)}
                />
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="grid md:grid-cols-[240px,1fr] gap-6 mt-6">
            {/* Navigation Sidebar - Hidden on mobile */}
            <div className="hidden md:block">
              <NavigationMenu />
            </div>
            
            {/* Dashboard Content */}
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                  <StatCard
                    key={stat.title}
                    stat={stat}
                    index={index}
                    onClick={stat.isClickable ? () => setShowWeeklyInsight(true) : undefined}
                  />
                ))}
              </div>

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {quickActions.map((action, index) => (
                  <QuickActionButton
                    key={action.name}
                    action={action}
                    index={index}
                    onActionClick={handleActionClick}
                  />
                ))}
              </div>

              {/* Recent Activity */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-black to-red-950/30 rounded-xl border border-red-500/10"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-orange-200">Recent Activity</h3>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => {
                        setFeedback({
                          type: 'info',
                          message: 'Navigating to Fitness Tracker...',
                          autoClose: true
                        });
                        setTimeout(() => navigate('/fitness'), 300);
                      }}
                      className="text-sm text-red-400 hover:text-red-300 transition-colors"
                    >
                      View All
                    </motion.button>
                  </div>
                  <div className="space-y-4">
                    {dashboardData.recentActivities.length > 0 ? (
                      dashboardData.recentActivities.map((activity, index) => (
                        <ActivityItem
                          key={activity.id}
                          activity={activity}
                          index={index}
                        />
                      ))
                    ) : (
                      <div className="text-center py-6 text-orange-200/70">
                        <p>No recent activities found. Start tracking your workouts!</p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => navigate('/fitness')}
                          className="mt-4 px-4 py-2 bg-gradient-to-r from-red-500/30 to-orange-500/30 
                                   text-orange-200 rounded-lg hover:from-red-500/40 hover:to-orange-500/40"
                        >
                          Log an Activity
                        </motion.button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <MobileNavigationDrawer 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Weekly Insight Modal */}
      <WeeklyInsightModal
        isOpen={showWeeklyInsight}
        onClose={() => setShowWeeklyInsight(false)}
        insightData={dashboardData.insightData}
      />
    </div>
  );
};

export default Dashboard;