// src/pages/Dashboard/hooks.ts

import { useState, useCallback } from "react";
import api from "../../api";
import type { Task, LikeNotification } from "./types";

// 🟢 Hook за твоите задачи
export function useTasks(token: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTasks = useCallback(() => {
    setLoading(true);
    setError("");
    api
      .get(`/tasks/my`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        // Очаква се { tasks: Task[] }
        const data = res.data as { tasks: Task[] };
        setTasks(Array.isArray(data) ? data : data.tasks || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Грешка при зареждане на задачите");
        setLoading(false);
      });
  }, [token]);

  return { tasks, loading, error, setTasks, fetchTasks };
}

// 🟢 Hook за известията
export function useNotifications(token: string) {
  const [notifications, setNotifications] = useState<LikeNotification[]>([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifInfo, setNotifInfo] = useState("");

  const fetchNotifications = useCallback(() => {
    setNotifLoading(true);
    api
      .get(`/like/notifications`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setNotifications((res.data as { notifications: LikeNotification[] }).notifications || []);
        setNotifLoading(false);
      })
      .catch(() => {
        setNotifInfo("Грешка при зареждане на известията.");
        setNotifLoading(false);
      });
  }, [token]);

  return { notifications, notifLoading, notifInfo, setNotifInfo, fetchNotifications };
}

// 🩷 Hook за харесаните задачи (liked tasks)
export function useLikedTasks(token: string) {
  const [likedTasks, setLikedTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLikedTasks = useCallback(() => {
    setLoading(true);
    setError('');
    api
      .get(`/like/mine`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        // !!! Правилен ключ според backend: { liked_tasks: Task[] }
        const data = res.data as { liked_tasks: Task[] };
        setLikedTasks(Array.isArray(data) ? data : data.liked_tasks || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Грешка при зареждане на харесаните задачи');
        setLoading(false);
      });
  }, [token]);

  return { likedTasks, loading, error, fetchLikedTasks };
}
