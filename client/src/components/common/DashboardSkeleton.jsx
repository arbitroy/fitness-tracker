import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const SkeletonPulse = () => (
    <motion.div
        animate={{
            opacity: [0.4, 0.7, 0.4]
        }}
        transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
        }}
        className="bg-red-500/10 rounded-md"
    />
);

export const StatCardSkeleton = () => (
    <div className="bg-gradient-to-br from-black to-red-950/30 p-6 rounded-xl border border-red-500/10">
        <div className="h-6 w-1/3 mb-4">
            <SkeletonPulse />
        </div>
        <div className="h-10 w-1/2 mb-3">
            <SkeletonPulse />
        </div>
        <div className="h-2 w-full rounded-full overflow-hidden">
            <SkeletonPulse />
        </div>
    </div>
);

export const ActionButtonSkeleton = () => (
    <div className="bg-gradient-to-br from-black to-red-950/30 p-6 rounded-xl border border-red-500/10">
        <div className="flex items-center space-x-3">
            <div className="relative p-3 rounded-lg h-12 w-12">
                <SkeletonPulse />
            </div>
            <div className="space-y-2 flex-1">
                <div className="h-5 w-1/3">
                    <SkeletonPulse />
                </div>
                <div className="h-4 w-2/3">
                    <SkeletonPulse />
                </div>
            </div>
        </div>
    </div>
);

export const ActivityItemSkeleton = () => (
    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-black to-red-950/20 rounded-lg border border-red-500/10">
        <div className="flex items-center space-x-3">
            <div className="w-2 h-2 rounded-full">
                <SkeletonPulse />
            </div>
            <div className="h-5 w-32">
                <SkeletonPulse />
            </div>
        </div>
        <div className="flex items-center space-x-4">
            <div className="h-4 w-16">
                <SkeletonPulse />
            </div>
            <div className="h-4 w-20">
                <SkeletonPulse />
            </div>
        </div>
    </div>
);

export const RecentActivitySkeleton = () => (
    <div className="bg-gradient-to-br from-black to-red-950/30 rounded-xl border border-red-500/10 p-6">
        <div className="flex justify-between items-center mb-4">
            <div className="h-6 w-32">
                <SkeletonPulse />
            </div>
            <div className="h-4 w-16">
                <SkeletonPulse />
            </div>
        </div>
        <div className="space-y-4">
            <ActivityItemSkeleton />
            <ActivityItemSkeleton />
            <ActivityItemSkeleton />
        </div>
    </div>
);

export const DashboardSkeleton = () => (
    <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ActionButtonSkeleton />
            <ActionButtonSkeleton />
            <ActionButtonSkeleton />
            <ActionButtonSkeleton />
            <ActionButtonSkeleton />
        </div>

        {/* Recent Activity */}
        <RecentActivitySkeleton />
    </div>
);

export default DashboardSkeleton;