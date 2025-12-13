import { useMemo } from 'react';
import type { Task } from '../types';

export type MoodLevel = 'happy' | 'normal' | 'annoyed' | 'angry';

interface MoodInfo {
    level: MoodLevel;
    emoji: string;
    message: string;
    color: string;
    fontWeight: string;
}

interface ProgressStats {
    total: number;
    completed: number;
    overdue: number;
    completionRate: number;
}

const getMoodInfo = (completionRate: number, overdueCount: number): MoodInfo => {
    // 遅延タスクが多いほど、または完了率が低いほど態度が悪くなる
    const overdueRatio = overdueCount > 0 ? Math.min(overdueCount * 0.15, 0.3) : 0;
    const adjustedRate = completionRate - overdueRatio;

    if (adjustedRate >= 0.8) {
        return {
            level: 'happy',
            emoji: '😊',
            message: '素晴らしい進捗です！この調子で頑張りましょう！',
            color: 'text-green-600',
            fontWeight: 'font-normal'
        };
    } else if (adjustedRate >= 0.5) {
        return {
            level: 'normal',
            emoji: '😐',
            message: '順調に進んでいますね。引き続き頑張りましょう。',
            color: 'text-slate-600',
            fontWeight: 'font-normal'
        };
    } else if (adjustedRate >= 0.3) {
        return {
            level: 'annoyed',
            emoji: '😤',
            message: 'もう少し頑張れるはずです。ペースを上げましょう！',
            color: 'text-orange-600',
            fontWeight: 'font-medium'
        };
    } else {
        return {
            level: 'angry',
            emoji: '😠',
            message: 'このままでは間に合いません！今すぐタスクに取り掛かってください！',
            color: 'text-red-600',
            fontWeight: 'font-bold'
        };
    }
};

export const useProgressMood = (tasks: Task[]): { stats: ProgressStats; mood: MoodInfo } => {
    return useMemo(() => {
        const now = new Date();
        const total = tasks.length;
        const completed = tasks.filter(t => t.is_completed).length;
        const overdue = tasks.filter(t =>
            !t.is_completed &&
            t.deadline &&
            new Date(t.deadline) < now
        ).length;

        const completionRate = total === 0 ? 1 : completed / total;

        const stats: ProgressStats = {
            total,
            completed,
            overdue,
            completionRate
        };

        const mood = getMoodInfo(completionRate, overdue);

        return { stats, mood };
    }, [tasks]);
};
