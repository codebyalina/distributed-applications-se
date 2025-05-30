import React from 'react';
import type { Task } from './types';

export interface TaskCardProps {
  task: Task;
  processing: boolean;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onComplete: (id: number) => void;
  currentUserId: number;
}

export default function TaskCard({
  task,
  processing,
  onEdit,
  onDelete,
  onComplete,
  currentUserId,
}: TaskCardProps) {
  // Само авторът вижда Complete, ако задачата е in_progress
  const showComplete = task.status === 'in_progress' && task.created_by === currentUserId;

  return (
    <li className="task-card">
      <strong className="task-title">{task.title}</strong>
      <div className="task-desc">{task.description}</div>
      <div className="task-meta">
        Дедлайн: {new Date(task.deadline).toLocaleString('bg-BG')}
      </div>
      <div className="task-meta">
        Награда: {task.reward} лв. | Статус: {task.status}
      </div>
      <div className="task-actions">
        <button
          onClick={() => onEdit(task)}
          disabled={processing}
          className="edit-btn"
        >
          Редакция
        </button>
        <button
          onClick={() => onDelete(task.id)}
          disabled={processing}
          className="delete-btn"
        >
          Изтрий
        </button>
        {showComplete && (
          <button
            onClick={() => onComplete(task.id)}
            disabled={processing}
            className="complete-btn show-complete-anim"
            style={{
              animation: 'popUp 0.41s cubic-bezier(.61,-0.07,.47,1.15)'
            }}
          >
            Complete
          </button>
        )}
      </div>
    </li>
  );
}
