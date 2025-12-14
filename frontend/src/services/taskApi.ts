// タスク関連のAPIコール関数群

import { apiClient } from '../utils/apiClient';
import type { Task } from '../types';
import type { TaskCreateRequest, TaskUpdateRequest, TaskResponse } from '../types/api';

export type SortBy = 'created_at' | 'deadline' | 'priority';
export type SortOrder = 'asc' | 'desc';

/**
 * タスク一覧を取得
 */
export const getTasks = async (
    sortBy?: SortBy,
    sortOrder?: SortOrder
): Promise<Task[]> => {
    let endpoint = '/api/v1/tasks/';
    const params = new URLSearchParams();

    if (sortBy) params.append('sort_by', sortBy);
    if (sortOrder) params.append('sort_order', sortOrder);

    const queryString = params.toString();
    if (queryString) {
        endpoint += `?${queryString}`;
    }

    const response = await apiClient.get<TaskResponse[]>(endpoint);
    return response.map(taskResponseToTask);
};

/**
 * 優先度文字列を数値に変換
 */
const priorityStringToNumber = (priority?: string): number => {
    switch (priority) {
        case 'low': return 1;
        case 'high': return 3;
        case 'medium':
        default: return 2;
    }
};

/**
 * 新規タスクを作成
 */
export const createTask = async (taskData: TaskCreateRequest): Promise<Task> => {
    // バックエンドは priority を数値で期待するため変換
    const payload = {
        ...taskData,
        priority: priorityStringToNumber(taskData.priority),
    };
    const response = await apiClient.post<TaskResponse>('/api/v1/tasks/', payload);
    return taskResponseToTask(response);
};

/**
 * タスクを更新
 */
export const updateTask = async (
    taskId: number,
    taskData: TaskUpdateRequest
): Promise<Task> => {
    // バックエンドは priority を数値で期待するため変換
    const payload = {
        ...taskData,
        priority: taskData.priority ? priorityStringToNumber(taskData.priority) : undefined,
    };
    const response = await apiClient.put<TaskResponse>(`/api/v1/tasks/${taskId}`, payload);
    return taskResponseToTask(response);
};

/**
 * タスクを削除
 */
export const deleteTask = async (taskId: number): Promise<void> => {
    await apiClient.delete<void>(`/api/v1/tasks/${taskId}`);
};

/**
 * タスクの完了状態を切り替え
 */
export const toggleTaskCompletion = async (
    taskId: number,
    isCompleted: boolean
): Promise<Task> => {
    const response = await apiClient.put<TaskResponse>(`/api/v1/tasks/${taskId}`, {
        is_completed: isCompleted,
    });
    return taskResponseToTask(response);
};

/**
 * 優先度数値を文字列に変換
 */
const priorityNumberToString = (priority: number | string): string => {
    if (typeof priority === 'string') return priority;
    switch (priority) {
        case 1: return 'low';
        case 3: return 'high';
        case 2:
        default: return 'medium';
    }
};

/**
 * APIレスポンスをTaskインターフェースに変換
 */
const taskResponseToTask = (response: TaskResponse): Task => ({
    id: response.id,
    title: response.title,
    description: response.description,
    is_completed: response.is_completed,
    priority: priorityNumberToString(response.priority as unknown as number),
    deadline: response.deadline,
    created_at: response.created_at,
    owner_id: response.owner_id,
    category_id: response.category_id,
});