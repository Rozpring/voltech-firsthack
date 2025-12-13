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
 * 新規タスクを作成
 */
export const createTask = async (taskData: TaskCreateRequest): Promise<Task> => {
    const response = await apiClient.post<TaskResponse>('/api/v1/tasks/', taskData);
    return taskResponseToTask(response);
};

/**
 * タスクを更新
 */
export const updateTask = async (
    taskId: number,
    taskData: TaskUpdateRequest
): Promise<Task> => {
    const response = await apiClient.put<TaskResponse>(`/api/v1/tasks/${taskId}`, taskData);
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
 * APIレスポンスをTaskインターフェースに変換
 */
const taskResponseToTask = (response: TaskResponse): Task => ({
    id: response.id,
    title: response.title,
    description: response.description,
    is_completed: response.is_completed,
    priority: response.priority,
    category: response.category,
    deadline: response.deadline,
    created_at: response.created_at,
    owner_id: response.owner_id,
});