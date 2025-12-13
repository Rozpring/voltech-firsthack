import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Task } from '../types';
import * as taskApi from '../services/taskApi';
import type { SortBy, SortOrder } from '../services/taskApi';
import type { TaskCreateRequest, TaskUpdateRequest } from '../types/api';

interface TaskContextType {
    tasks: Task[];
    isLoading: boolean;
    error: string | null;
    sortBy: SortBy | undefined;
    sortOrder: SortOrder;
    setSortBy: (sortBy: SortBy | undefined) => void;
    setSortOrder: (order: SortOrder) => void;
    fetchTasks: () => Promise<void>;
    createTask: (taskData: TaskCreateRequest) => Promise<void>;
    updateTask: (taskId: number, taskData: TaskUpdateRequest) => Promise<void>;
    deleteTask: (taskId: number) => Promise<void>;
    toggleTaskCompletion: (taskId: number, isCompleted: boolean) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<SortBy | undefined>(undefined);
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

    const fetchTasks = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const fetchedTasks = await taskApi.getTasks(sortBy, sortOrder);
            setTasks(fetchedTasks);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
        } finally {
            setIsLoading(false);
        }
    }, [sortBy, sortOrder]);

    const createTask = async (taskData: TaskCreateRequest) => {
        setError(null);
        try {
            const newTask = await taskApi.createTask(taskData);
            setTasks((prev) => [newTask, ...prev]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create task');
            throw err;
        }
    };

    const updateTask = async (taskId: number, taskData: TaskUpdateRequest) => {
        setError(null);
        try {
            const updatedTask = await taskApi.updateTask(taskId, taskData);
            setTasks((prev) =>
                prev.map((task) => (task.id === taskId ? updatedTask : task))
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update task');
            throw err;
        }
    };

    const deleteTask = async (taskId: number) => {
        setError(null);
        try {
            await taskApi.deleteTask(taskId);
            setTasks((prev) => prev.filter((task) => task.id !== taskId));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete task');
            throw err;
        }
    };

    const toggleTaskCompletion = async (taskId: number, isCompleted: boolean) => {
        setError(null);
        try {
            const updatedTask = await taskApi.toggleTaskCompletion(taskId, isCompleted);
            setTasks((prev) =>
                prev.map((task) => (task.id === taskId ? updatedTask : task))
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to toggle task');
            throw err;
        }
    };

    // Fetch tasks on mount and when sort changes
    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    return (
        <TaskContext.Provider
            value={{
                tasks,
                isLoading,
                error,
                sortBy,
                sortOrder,
                setSortBy,
                setSortOrder,
                fetchTasks,
                createTask,
                updateTask,
                deleteTask,
                toggleTaskCompletion,
            }}
        >
            {children}
        </TaskContext.Provider>
    );
};

export const useTasks = () => {
    const context = useContext(TaskContext);
    if (context === undefined) {
        throw new Error('useTasks must be used within a TaskProvider');
    }
    return context;
};
