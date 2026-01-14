'use client';

import { useState } from 'react';

type Status = 'Pending' | 'Running' | 'Completed';

interface SubTask {
  id: string;
  title: string;
  status: Status;
}

interface Task {
  id: string;
  title: string;
  status: Status;
  subtasks: SubTask[];
  isEditing?: boolean;
  showSubtasks?: boolean;
}

const statusColors = {
  Pending: 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  Running: 'bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  Completed: 'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200',
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const addTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle,
        status: 'Pending',
        subtasks: [],
        showSubtasks: false,
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
    }
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const updateTaskStatus = (taskId: string, status: Status) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, status } : task
    ));
  };

  const startEditingTask = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, isEditing: true } : task
    ));
  };

  const saveTaskTitle = (taskId: string, newTitle: string) => {
    if (newTitle.trim()) {
      setTasks(tasks.map(task =>
        task.id === taskId ? { ...task, title: newTitle, isEditing: false } : task
      ));
    }
  };

  const cancelEditingTask = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, isEditing: false } : task
    ));
  };

  const toggleSubtasks = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, showSubtasks: !task.showSubtasks } : task
    ));
  };

  const addSubtask = (taskId: string, subtaskTitle: string) => {
    if (subtaskTitle.trim()) {
      const newSubtask: SubTask = {
        id: Date.now().toString(),
        title: subtaskTitle,
        status: 'Pending',
      };
      setTasks(tasks.map(task =>
        task.id === taskId
          ? { ...task, subtasks: [...task.subtasks, newSubtask] }
          : task
      ));
    }
  };

  const deleteSubtask = (taskId: string, subtaskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, subtasks: task.subtasks.filter(st => st.id !== subtaskId) }
        : task
    ));
  };

  const updateSubtaskStatus = (taskId: string, subtaskId: string, status: Status) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? {
            ...task,
            subtasks: task.subtasks.map(st =>
              st.id === subtaskId ? { ...st, status } : st
            ),
          }
        : task
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          TODO管理アプリ
        </h1>

        {/* Add Task Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
              placeholder="新しいタスクを入力..."
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={addTask}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              追加
            </button>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onDelete={() => deleteTask(task.id)}
              onUpdateStatus={(status) => updateTaskStatus(task.id, status)}
              onStartEdit={() => startEditingTask(task.id)}
              onSaveTitle={(title) => saveTaskTitle(task.id, title)}
              onCancelEdit={() => cancelEditingTask(task.id)}
              onToggleSubtasks={() => toggleSubtasks(task.id)}
              onAddSubtask={(title) => addSubtask(task.id, title)}
              onDeleteSubtask={(subtaskId) => deleteSubtask(task.id, subtaskId)}
              onUpdateSubtaskStatus={(subtaskId, status) =>
                updateSubtaskStatus(task.id, subtaskId, status)
              }
            />
          ))}
          {tasks.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              タスクがありません。上のフォームから追加してください。
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface TaskItemProps {
  task: Task;
  onDelete: () => void;
  onUpdateStatus: (status: Status) => void;
  onStartEdit: () => void;
  onSaveTitle: (title: string) => void;
  onCancelEdit: () => void;
  onToggleSubtasks: () => void;
  onAddSubtask: (title: string) => void;
  onDeleteSubtask: (subtaskId: string) => void;
  onUpdateSubtaskStatus: (subtaskId: string, status: Status) => void;
}

function TaskItem({
  task,
  onDelete,
  onUpdateStatus,
  onStartEdit,
  onSaveTitle,
  onCancelEdit,
  onToggleSubtasks,
  onAddSubtask,
  onDeleteSubtask,
  onUpdateSubtaskStatus,
}: TaskItemProps) {
  const [editTitle, setEditTitle] = useState(task.title);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  const handleSave = () => {
    onSaveTitle(editTitle);
  };

  const handleAddSubtask = () => {
    if (newSubtaskTitle.trim()) {
      onAddSubtask(newSubtaskTitle);
      setNewSubtaskTitle('');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          {task.isEditing ? (
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                  if (e.key === 'Escape') onCancelEdit();
                }}
                className="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                autoFocus
              />
              <button
                onClick={handleSave}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
              >
                保存
              </button>
              <button
                onClick={onCancelEdit}
                className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
              >
                キャンセル
              </button>
            </div>
          ) : (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {task.title}
            </h3>
          )}

          <div className="flex flex-wrap gap-2 mb-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[task.status]}`}>
              {task.status}
            </span>
            {task.subtasks.length > 0 && (
              <span className="px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                サブタスク: {task.subtasks.filter(st => st.status === 'Completed').length}/{task.subtasks.length}
              </span>
            )}
          </div>

          {!task.isEditing && (
            <div className="flex flex-wrap gap-2 mt-3">
              <select
                value={task.status}
                onChange={(e) => onUpdateStatus(e.target.value as Status)}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="Pending">Pending</option>
                <option value="Running">Running</option>
                <option value="Completed">Completed</option>
              </select>
              <button
                onClick={onStartEdit}
                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
              >
                編集
              </button>
              <button
                onClick={onToggleSubtasks}
                className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
              >
                {task.showSubtasks ? 'サブタスクを非表示' : 'サブタスクを表示'}
              </button>
              <button
                onClick={onDelete}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
              >
                削除
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Subtasks Section */}
      {task.showSubtasks && (
        <div className="mt-4 pl-4 border-l-2 border-gray-300 dark:border-gray-600">
          <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-3">
            サブタスク
          </h4>

          {/* Add Subtask */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
              placeholder="サブタスクを追加..."
              className="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={handleAddSubtask}
              className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              追加
            </button>
          </div>

          {/* Subtasks List */}
          <div className="space-y-2">
            {task.subtasks.map(subtask => (
              <div
                key={subtask.id}
                className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 p-3 rounded"
              >
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-white text-sm">{subtask.title}</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[subtask.status]}`}>
                    {subtask.status}
                  </span>
                </div>
                <select
                  value={subtask.status}
                  onChange={(e) => onUpdateSubtaskStatus(subtask.id, e.target.value as Status)}
                  className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                >
                  <option value="Pending">Pending</option>
                  <option value="Running">Running</option>
                  <option value="Completed">Completed</option>
                </select>
                <button
                  onClick={() => onDeleteSubtask(subtask.id)}
                  className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                >
                  削除
                </button>
              </div>
            ))}
            {task.subtasks.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                サブタスクがありません
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
