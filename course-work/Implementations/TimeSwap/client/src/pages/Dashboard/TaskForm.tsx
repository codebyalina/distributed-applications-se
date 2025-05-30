// src/pages/Dashboard/TaskForm.tsx

import React from 'react';

export interface TaskFormProps {
  form: { [key: string]: any };
  formError: string;
  processing: boolean;
  editId: number | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export default function TaskForm({
  form,
  formError,
  processing,
  editId,
  onChange,
  onSubmit,
  onCancel,
}: TaskFormProps) {
  return (
    <form onSubmit={onSubmit} className="task-form">
      <h4 className="task-form-title">
        {editId ? 'Редакция на задача' : 'Нова задача'}
      </h4>
      <input
        name="title"
        value={form.title}
        onChange={onChange}
        placeholder="Заглавие"
        required
        disabled={processing}
        className="task-input"
      />
      <textarea
        name="description"
        value={form.description}
        onChange={onChange}
        placeholder="Описание"
        className="task-input"
        style={{ resize: 'vertical', minHeight: 40 }}
        disabled={processing}
      />
      <input
        name="deadline"
        value={form.deadline}
        onChange={onChange}
        placeholder="Дедлайн"
        type="datetime-local"
        required
        disabled={processing}
        className="task-input"
      />
      <input
        name="reward"
        value={form.reward}
        onChange={onChange}
        placeholder="Награда"
        type="number"
        min={0}
        required
        disabled={processing}
        className="task-input"
      />
      {formError && (
        <div className="animated-message error show" style={{ marginBottom: 8 }}>
          {formError}
        </div>
      )}
      <div className="task-form-actions">
        <button
          type="submit"
          className="main-btn"
          disabled={processing}
        >
          {editId ? 'Запази' : 'Добави'}
        </button>
        <button
          type="button"
          className="cancel-btn"
          onClick={onCancel}
          disabled={processing}
        >
          Откажи
        </button>
      </div>
    </form>
  );
}
