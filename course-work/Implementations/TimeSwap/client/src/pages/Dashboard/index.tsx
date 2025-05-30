import { useEffect, useState } from 'react'
import api from '../../api'
import DashboardHeader from './DashboardHeader'
import NotificationsPanel from './NotificationsPanel'
import TaskForm from './TaskForm'
import TaskList from './TaskList'
import { useTasks, useNotifications, useLikedTasks } from './hooks'
import type { Task } from './types'
import AnimatedMessage from '../../components/AnimatedMessage' // 🩷
import '../../SharedStyles.css'

interface Props {
  token: string
  onLogout: () => void
}

const initialForm = {
  title: '',
  description: '',
  deadline: '',
  reward: '',
}

export default function Dashboard({ token, onLogout }: Props) {
  const [activeTab, setActiveTab] = useState<'mine' | 'liked'>('mine')

  // User info (user id за Complete бутона)
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)

  // Fancy animated error/info messages!
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [infoMsg, setInfoMsg] = useState<string | null>(null)

  useEffect(() => {
    // Вземи текущия потребител (id)
    api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setCurrentUserId((res.data as { id: number }).id))
      .catch(() => setCurrentUserId(null))
  }, [token])

  // My tasks
  const { tasks, loading, error, fetchTasks } = useTasks(token)
  // Liked tasks
  const { likedTasks, loading: likedLoading, error: likedError, fetchLikedTasks } = useLikedTasks(token)
  // Notifications
  const { notifications, notifLoading, notifInfo, setNotifInfo, fetchNotifications } = useNotifications(token)

  // Form state
  const [form, setForm] = useState(initialForm)
  const [formError, setFormError] = useState('')
  const [editId, setEditId] = useState<number | null>(null)
  const [processing, setProcessing] = useState(false)
  const [showForm, setShowForm] = useState(false)

  // Pagination for my tasks
  const [currentPage, setCurrentPage] = useState(1)
  const tasksPerPage = 3
  const totalPages = Math.ceil(tasks.length / tasksPerPage)
  const indexOfLastTask = currentPage * tasksPerPage
  const indexOfFirstTask = indexOfLastTask - tasksPerPage
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask)

  // Fetch my tasks on token/tab change
  useEffect(() => {
    if (activeTab === 'mine') fetchTasks()
  }, [token, activeTab])

  // Fetch liked tasks only if needed
  useEffect(() => {
    if (activeTab === 'liked') fetchLikedTasks()
  }, [token, activeTab])

  useEffect(() => {
    fetchNotifications()
  }, [token])

  const refreshAndGoFirst = () => {
    setCurrentPage(1)
    fetchTasks()
  }

  // Form handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }
  const resetForm = () => {
    setForm(initialForm)
    setEditId(null)
    setFormError('')
    setShowForm(false)
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    setProcessing(true)
    if (!form.title || !form.deadline || !form.reward) {
      setFormError('Попълни всички полета!')
      setProcessing(false)
      return
    }
    try {
      if (editId) {
        await api.put(`/tasks/${editId}`, {
          title: form.title,
          description: form.description,
          deadline: form.deadline,
          reward: Number(form.reward),
        }, { headers: { Authorization: `Bearer ${token}` } })
      } else {
        await api.post(`/tasks/`, {
          title: form.title,
          description: form.description,
          deadline: form.deadline,
          reward: Number(form.reward),
        }, { headers: { Authorization: `Bearer ${token}` } })
      }
      resetForm()
      refreshAndGoFirst()
      setInfoMsg('Задачата е записана успешно!')
    } catch {
      setFormError('Грешка при създаване/редакция на задачата.')
      setErrorMsg('Грешка при създаване/редакция на задачата!')
    } finally {
      setProcessing(false)
    }
  }
  const handleDelete = async (id: number) => {
    if (!window.confirm('Сигурен ли си, че искаш да изтриеш тази задача?')) return
    setProcessing(true)
    try {
      await api.delete(`/tasks/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      refreshAndGoFirst()
      setInfoMsg('Задачата е изтрита успешно!')
    } catch {
      setErrorMsg('Грешка при изтриване.')
    } finally {
      setProcessing(false)
    }
  }
  const handleEdit = (task: Task) => {
    setEditId(task.id)
    setForm({
      title: task.title,
      description: task.description,
      deadline: task.deadline.slice(0, 16),
      reward: String(task.reward),
    })
    setShowForm(true)
  }
  const handleMatch = async (task_id: number, user_id: number) => {
    setNotifInfo('')
    setProcessing(true)
    try {
      await api.post(`/match/confirm`, { task_id, user_id }, { headers: { Authorization: `Bearer ${token}` } })
      setNotifInfo('Успешно създаден match! Задачата е възложена.')
      setInfoMsg('Задачата е възложена и вече има изпълнител!')
      refreshAndGoFirst()
      fetchNotifications()
    } catch (e: any) {
      setNotifInfo(e?.response?.data?.error || 'Грешка при match.')
      setErrorMsg(e?.response?.data?.error || 'Грешка при match.')
    } finally {
      setProcessing(false)
    }
  }
  const handleComplete = async (id: number) => {
    setProcessing(true)
    try {
      await api.post(`/match/complete`, { task_id: id }, { headers: { Authorization: `Bearer ${token}` } })
      refreshAndGoFirst()
      setInfoMsg('Задачата е завършена и парите са изплатени! 🎉')
    } catch (e: any) {
      const msg = e?.response?.data?.error || 'Грешка при завършване.'
      setErrorMsg(msg)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="page-container dashboard-container">
      <DashboardHeader
        token={token}
        onLogout={onLogout}
      />

      {/* --- FANCY MESSAGE ZONE --- */}
      {errorMsg && (
        <AnimatedMessage type="error" message={errorMsg} onHide={() => setErrorMsg(null)} />
      )}
      {infoMsg && (
        <AnimatedMessage type="info" message={infoMsg} onHide={() => setInfoMsg(null)} />
      )}

      <NotificationsPanel
        notifications={notifications}
        notifLoading={notifLoading}
        notifInfo={notifInfo}
        onMatch={handleMatch}
      />

      {/* --- Tab Row --- */}
      <div className="tab-row" style={{
        width: '100%',
        display: 'flex',
        gap: 0,
        margin: '12px 0 18px 0',
        background: '#232339',
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: '0 1px 8px #b39ddb1a'
      }}>
        <button
          className={`main-btn tab-btn${activeTab === 'liked' ? ' active-btn' : ''}`}
          style={{
            flex: 1,
            borderRadius: 0,
            borderRight: '1.5px solid #333',
            fontSize: 18,
            fontWeight: 700,
            padding: '14px 0'
          }}
          onClick={() => { setActiveTab('liked'); setShowForm(false); }}
        >❤️ Харесани задачи</button>
        <button
          className={`main-btn tab-btn${activeTab === 'mine' ? ' active-btn' : ''}`}
          style={{
            flex: 1,
            borderRadius: 0,
            fontSize: 18,
            fontWeight: 700,
            padding: '14px 0'
          }}
          onClick={() => setActiveTab('mine')}
        >📝 Моите задачи</button>
        {/* + само ако сме в моите задачи */}
        {activeTab === 'mine' && (
          <button
            className="main-btn"
            style={{
              fontSize: 26,
              padding: "0 22px",
              borderRadius: "0 12px 12px 0",
              fontWeight: 900,
              background: "#8e24aa",
              color: "#fff",
              border: 'none'
            }}
            title="Създай нова задача"
            onClick={() => { setShowForm(v => !v); setEditId(null); setForm(initialForm) }}
            disabled={processing}
          >+</button>
        )}
      </div>

      {/* --- Tab Content --- */}
      {activeTab === 'mine' && (
        <>
          {showForm && (
            <TaskForm
              form={form}
              formError={formError}
              processing={processing}
              editId={editId}
              onChange={handleChange}
              onSubmit={handleSubmit}
              onCancel={resetForm}
            />
          )}
          <TaskList
            tasks={currentTasks}
            loading={loading}
            error={error}
            processing={processing}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onComplete={handleComplete}
            currentUserId={currentUserId ?? -1}
          />
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >Предишна</button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  className={`page-btn${currentPage === i + 1 ? ' active' : ''}`}
                  onClick={() => setCurrentPage(i + 1)}
                  disabled={currentPage === i + 1}
                >{i + 1}</button>
              ))}
              <button
                className="page-btn"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >Следваща</button>
            </div>
          )}
        </>
      )}

      {activeTab === 'liked' && (
        <TaskList
          tasks={likedTasks}
          loading={likedLoading}
          error={likedError}
          processing={processing}
          onEdit={() => {}}
          onDelete={() => {}}
          onComplete={() => {}}
          currentUserId={currentUserId ?? -1}
        />
      )}
    </div>
  )
}
