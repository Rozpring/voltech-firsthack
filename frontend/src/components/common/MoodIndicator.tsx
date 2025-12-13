import React from 'react';
import { useTasks } from '../../context/TaskContext';
import { useProgressMood } from '../../hooks/useProgressMood';

export const MoodIndicator: React.FC = () => {
    const { tasks } = useTasks();
    const { stats, mood } = useProgressMood(tasks);

    if (tasks.length === 0) {
        return null;
    }

    return (
        <div className={`bg-white rounded-lg shadow-sm border border-slate-200 p-4 ${mood.level === 'angry' ? 'animate-pulse' : ''}`}>
            <div className="flex items-center gap-3">
                <span className="text-4xl" role="img" aria-label={mood.level}>
                    {mood.emoji}
                </span>
                <div className="flex-1">
                    <p className={`${mood.color} ${mood.fontWeight} text-sm`}>
                        {mood.message}
                    </p>
                    <div className="mt-1 flex gap-4 text-xs text-slate-500">
                        <span>完了: {stats.completed}/{stats.total}</span>
                        {stats.overdue > 0 && (
                            <span className="text-red-500">遅延: {stats.overdue}件</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
