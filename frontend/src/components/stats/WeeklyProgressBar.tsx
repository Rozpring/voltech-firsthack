import React, { useMemo } from 'react';
import type { Task } from '../../types';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface WeeklyProgressBarProps {
    tasks: Task[];
}

export const WeeklyProgressBar: React.FC<WeeklyProgressBarProps> = ({ tasks }) => {
    const weeklyStats = useMemo(() => {
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay()); // 日曜日から
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);

        // 今週期限のタスク
        const weeklyTasks = tasks.filter(t => {
            if (!t.deadline) return false;
            const deadline = new Date(t.deadline);
            return deadline >= startOfWeek && deadline < endOfWeek;
        });

        const total = weeklyTasks.length;
        const completed = weeklyTasks.filter(t => t.is_completed).length;
        const overdue = weeklyTasks.filter(t =>
            !t.is_completed && new Date(t.deadline!) < now
        ).length;
        const pending = total - completed - overdue;

        const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

        return { total, completed, overdue, pending, completionRate };
    }, [tasks]);

    if (weeklyStats.total === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
                <h3 className="text-sm font-medium text-slate-700 mb-2">今週の進捗</h3>
                <p className="text-sm text-slate-500">今週期限のタスクはありません</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-slate-700">今週の進捗</h3>
                <span className="text-lg font-bold text-primary-600">{weeklyStats.completionRate}%</span>
            </div>

            {/* Progress Bar */}
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-3">
                <div className="h-full flex">
                    {weeklyStats.completed > 0 && (
                        <div
                            className="bg-green-500 transition-all duration-300"
                            style={{ width: `${(weeklyStats.completed / weeklyStats.total) * 100}%` }}
                        />
                    )}
                    {weeklyStats.overdue > 0 && (
                        <div
                            className="bg-red-500 transition-all duration-300"
                            style={{ width: `${(weeklyStats.overdue / weeklyStats.total) * 100}%` }}
                        />
                    )}
                    {weeklyStats.pending > 0 && (
                        <div
                            className="bg-yellow-400 transition-all duration-300"
                            style={{ width: `${(weeklyStats.pending / weeklyStats.total) * 100}%` }}
                        />
                    )}
                </div>
            </div>

            {/* Stats */}
            <div className="flex justify-between text-xs">
                <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle size={14} />
                    <span>完了 {weeklyStats.completed}</span>
                </div>
                <div className="flex items-center gap-1 text-yellow-600">
                    <Clock size={14} />
                    <span>進行中 {weeklyStats.pending}</span>
                </div>
                {weeklyStats.overdue > 0 && (
                    <div className="flex items-center gap-1 text-red-600">
                        <AlertCircle size={14} />
                        <span>遅延 {weeklyStats.overdue}</span>
                    </div>
                )}
            </div>
        </div>
    );
};
