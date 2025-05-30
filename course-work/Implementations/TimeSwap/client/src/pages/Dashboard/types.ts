// src/pages/Dashboard/types.ts

export interface Task {
  id: number
  title: string
  description: string
  deadline: string
  reward: number
  status: string
  created_by: number
}
export interface LikeNotification {
  task_id: number
  task_title: string
  liked_by_id: number
  liked_by_username: string
}
