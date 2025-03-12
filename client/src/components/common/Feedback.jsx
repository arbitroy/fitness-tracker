import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';

const Feedback = ({ type, message, onClose, autoClose = false, duration = 3000 }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (autoClose) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(() => onClose && onClose(), 300); // Wait for exit animation to complete
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [autoClose, duration, onClose]);

    const getTypeStyles = () => {
        switch (type) {
            case 'success':
                return {
                    bgColor: 'bg-green-500/20',
                    borderColor: 'border-green-500/30',
                    textColor: 'text-green-400',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    )
                };
            case 'error':
                return {
                    bgColor: 'bg-red-500/20',
                    borderColor: 'border-red-500/30',
                    textColor: 'text-red-400',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    )
                };
            case 'warning':
                return {
                    bgColor: 'bg-yellow-500/20',
                    borderColor: 'border-yellow-500/30',
                    textColor: 'text-yellow-400',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    )
                };
            case 'info':
            default:
                return {
                    bgColor: 'bg-blue-500/20',
                    borderColor: 'border-blue-500/30',
                    textColor: 'text-blue-400',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )
                };
        }
    };

    const { bgColor, borderColor, textColor, icon } = getTypeStyles();

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`relative ${bgColor} ${borderColor} border rounded-lg p-4 mb-4 flex items-start`}
                >
                    <div className={`${textColor} flex-shrink-0 mr-3`}>
                        {icon}
                    </div>
                    <div className="flex-1">
                        <p className="text-orange-200">{message}</p>
                    </div>
                    <button
                        onClick={() => {
                            setIsVisible(false);
                            setTimeout(() => onClose && onClose(), 300);
                        }}
                        className={`${textColor} hover:text-white transition-colors ml-4`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {autoClose && (
                        <motion.div
                            initial={{ width: '100%' }}
                            animate={{ width: '0%' }}
                            transition={{ duration: duration / 1000, ease: 'linear' }}
                            className={`absolute bottom-0 left-0 h-0.5 ${textColor} bg-opacity-50`}
                        />
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

Feedback.propTypes = {
    type: PropTypes.oneOf(['success', 'error', 'warning', 'info']).isRequired,
    message: PropTypes.string.isRequired,
    onClose: PropTypes.func,
    autoClose: PropTypes.bool,
    duration: PropTypes.number
};

export default Feedback;