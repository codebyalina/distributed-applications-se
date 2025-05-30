// src/pages/Dashboard/TaskList.tsx

import React from 'react';
import type { Task } from "./types";
import TaskCard from './TaskCard';

export interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  error: string;
  processing: boolean;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onComplete: (id: number) => void;
  currentUserId: number;
}

export default function TaskList({
  tasks,
  loading,
  error,
  processing,
  onEdit,
  onDelete,
  onComplete,
  currentUserId,
}: TaskListProps) {
  if (loading) return <p className="info">Зареждане...</p>;

  if (error) {
    return (
      <div className="animated-message error show" style={{ margin: "20px 0" }}>
        {error}
      </div>
    );
  }

  return (
    <ul className="task-list">
      {tasks.length === 0 ? (
        <li className="info">Няма задачи.</li>
      ) : (
        tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            processing={processing}
            onEdit={onEdit}
            onDelete={onDelete}
            onComplete={onComplete}
            currentUserId={currentUserId}
          />
        ))
      )}
    </ul>
  );
}
