// タスク期限に応じたランダムなセリフを表示するコンポーネント

import React, { useMemo } from 'react';
import { useTasks } from '../../context/TaskContext';
import type { Task } from '../../types';
import CharacterImage from '../../assets/character.jpg';

// セリフデータ
const DIALOGUES = {
    // 30分前のセリフ
    thirtyMinutes: [
        'ハハッ！30分だぞ？まさか"まだ"とか言わないよな？',
        '残り30分！ここで動かないのは頭が悪すぎるぞ！',
        'ハハッ！30分あれば終わるよな？"今すぐ"なら！',
        '30分前だ！焦らないと終わらないぞ！',
        'ハハッ！まだ余裕だと思ってる？30分しかないんだが！',
    ],
    // 5分前のセリフ
    fiveMinutes: [
        'ハハッ！5分前！もう終わってるよねえ？',
        'ハハッ！5分だ！間に合わなくなる音が聞こえるぞ！',
        'もう5分しかない！手は動いてるよな？',
        'ハハッ！5分前！ここで止まったら終わりだ！',
        '残り5分！さあ、覚悟は決まったか？',
    ],
    // 期限超過のセリフ
    overdue: [
        'ハハッ！終わったな！〆切はもう過ぎてる！',
        'タイムオーバー！次はちゃんと"早めに"やろうな？',
        'ハハッ！間に合わなかった理由はわかるかい？',
        '〆切オーバー！これが後回しの結果だ！',
        'ハハッ！やらなかった事実は消えないぞ！',
    ],
};

type DialogueCategory = 'thirtyMinutes' | 'fiveMinutes' | 'overdue' | null;

// 最も緊急なタスクの期限状態を取得
const getClosestDeadlineCategory = (tasks: Task[]): { category: DialogueCategory; task: Task | null } => {
    const now = new Date();
    const incompleteTasks = tasks.filter(t => !t.is_completed && t.deadline);

    if (incompleteTasks.length === 0) {
        return { category: null, task: null };
    }

    // 期限が最も近いタスクを見つける
    let closestTask: Task | null = null;
    let closestDiff = Infinity;
    let hasOverdue = false;

    for (const task of incompleteTasks) {
        const deadline = new Date(task.deadline!);
        const diffMs = deadline.getTime() - now.getTime();
        const diffMinutes = diffMs / (1000 * 60);

        // 超過しているタスクがあればそれを優先
        if (diffMinutes < 0) {
            hasOverdue = true;
            if (diffMinutes > closestDiff || closestDiff === Infinity) {
                closestDiff = diffMinutes;
                closestTask = task;
            }
        } else if (!hasOverdue && diffMinutes < closestDiff) {
            closestDiff = diffMinutes;
            closestTask = task;
        }
    }

    if (!closestTask) {
        return { category: null, task: null };
    }

    // カテゴリを決定
    if (closestDiff < 0) {
        return { category: 'overdue', task: closestTask };
    } else if (closestDiff <= 5) {
        return { category: 'fiveMinutes', task: closestTask };
    } else if (closestDiff <= 30) {
        return { category: 'thirtyMinutes', task: closestTask };
    }

    return { category: null, task: null };
};

// ランダムにセリフを選択（同じタスクに対しては同じセリフを返す）
const getRandomDialogue = (category: DialogueCategory, taskId: number): string => {
    if (!category) return '';
    const dialogues = DIALOGUES[category];
    // タスクIDを使って疑似ランダムなインデックスを生成（同じタスクには同じセリフ）
    const index = taskId % dialogues.length;
    return dialogues[index];
};

export const DeadlineDialogue: React.FC = () => {
    const { tasks } = useTasks();

    const { dialogue, taskTitle, category } = useMemo(() => {
        const { category, task } = getClosestDeadlineCategory(tasks);
        if (!category || !task) {
            return { dialogue: '', taskTitle: '', category: null };
        }
        const dialogue = getRandomDialogue(category, task.id);
        return { dialogue, taskTitle: task.title, category };
    }, [tasks]);

    if (!dialogue) {
        return null;
    }

    const bgColor = category === 'overdue'
        ? 'bg-red-50 border-red-200'
        : category === 'fiveMinutes'
            ? 'bg-orange-50 border-orange-200'
            : 'bg-yellow-50 border-yellow-200';

    const textColor = category === 'overdue'
        ? 'text-red-700'
        : category === 'fiveMinutes'
            ? 'text-orange-700'
            : 'text-yellow-700';

    const labelBg = category === 'overdue'
        ? 'bg-red-100 text-red-800'
        : category === 'fiveMinutes'
            ? 'bg-orange-100 text-orange-800'
            : 'bg-yellow-100 text-yellow-800';

    const label = category === 'overdue'
        ? '⚠️ 期限超過'
        : category === 'fiveMinutes'
            ? '🔥 残り5分以内'
            : '⏰ 残り30分以内';

    return (
        <div className={`rounded-lg border-2 p-4 ${bgColor}`}>
            <div className="flex items-start gap-3">
                <img
                    src={CharacterImage}
                    alt="キャラクター"
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${labelBg}`}>
                            {label}
                        </span>
                        <span className="text-xs text-slate-500 truncate">
                            {taskTitle}
                        </span>
                    </div>
                    <p className={`text-sm font-bold ${textColor}`}>
                        {dialogue}
                    </p>
                </div>
            </div>
        </div>
    );
};
