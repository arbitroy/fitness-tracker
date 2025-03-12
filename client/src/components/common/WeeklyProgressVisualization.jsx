import { useEffect } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const WeeklyProgressVisualization = ({ activeDays, workoutGoal }) => {
    const daysOfWeek = [
        { letter: 'S', name: 'Sunday', index: 0 },
        { letter: 'M', name: 'Monday', index: 1 },
        { letter: 'T', name: 'Tuesday', index: 2 },
        { letter: 'W', name: 'Wednesday', index: 3 },
        { letter: 'T', name: 'Thursday', index: 4 },
        { letter: 'F', name: 'Friday', index: 5 },
        { letter: 'S', name: 'Saturday', index: 6 }
    ];

    // Get current day of week
    const today = new Date().getDay();

    return (
        <div className="p-4 bg-black/30 rounded-lg border border-red-500/10">
            <h3 className="text-lg font-medium text-orange-200 mb-3">Weekly Progress</h3>

            <div className="flex justify-between mb-3">
                <div className="text-orange-200/70 text-sm">
                    <span className="mr-1">{activeDays.length}</span>
                    of
                    <span className="ml-1">{workoutGoal}</span>
                    workouts completed
                </div>
                <div className="text-orange-200/70 text-sm">
                    {Math.round((activeDays.length / workoutGoal) * 100)}% complete
                </div>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-black/40 rounded-full overflow-hidden mb-5">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (activeDays.length / workoutGoal) * 100)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
                />
            </div>

            {/* Days of week visualization */}
            <div className="flex justify-between">
                {daysOfWeek.map((day) => {
                    const isActive = activeDays.includes(day.index);
                    const isFuture = day.index > today;
                    const isToday = day.index === today;

                    return (
                        <div
                            key={day.index}
                            className="flex flex-col items-center"
                            title={day.name}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0.8 }}
                                animate={{
                                    scale: isActive ? 1 : 0.9,
                                    opacity: isFuture ? 0.4 : 1
                                }}
                                whileHover={{ scale: isActive ? 1.1 : 1 }}
                                className={`
                  w-8 h-8 rounded-full flex items-center justify-center mb-1
                  ${isActive
                                        ? 'bg-gradient-to-br from-red-500 to-orange-500 text-white'
                                        : isToday
                                            ? 'bg-gray-800 border border-orange-500/40 text-orange-200'
                                            : 'bg-black/40 text-gray-400'}
                  ${isFuture ? 'opacity-40' : ''}
                  transition-all duration-300
                `}
                            >
                                {day.letter}
                            </motion.div>
                            <span className={`text-xs ${isActive ? 'text-orange-200' : 'text-orange-200/40'}`}>
                                {day.letter}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

WeeklyProgressVisualization.propTypes = {
    activeDays: PropTypes.array.isRequired,
    workoutGoal: PropTypes.number.isRequired
};

export default WeeklyProgressVisualization;