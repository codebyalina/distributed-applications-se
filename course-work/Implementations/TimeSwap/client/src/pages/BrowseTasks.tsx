import { useEffect, useState } from "react";
import api from "../api";

interface Task {
  id: number;
  title: string;
  description: string;
  deadline: string;
  reward: number;
  status: string;
  created_by: number;
  claimed_by?: number | null;
}

interface Props {
  token: string;
}

type InfoMsg = { text: string, type: "info" | "error" };

export default function BrowseTasks({ token }: Props) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [minReward, setMinReward] = useState('');
  const [maxReward, setMaxReward] = useState('');
  const [loading, setLoading] = useState(true);

  // Анимирано съобщение за info/error
  const [info, setInfo] = useState<InfoMsg | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 4;

  const filterTasks = (all: Task[]) => {
    // Показвай само задачи със status: open и които НЯМАТ claimed_by
    return all.filter(
      (task) => task.status === "open" && (task.claimed_by === null || typeof task.claimed_by === "undefined")
    );
  };

  const totalPages = Math.ceil(tasks.length / tasksPerPage);
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

  const showMessage = (msg: string, type: "info" | "error" = "info") => {
    setInfo({ text: msg, type });
    setShowInfo(true);
    setTimeout(() => setShowInfo(false), 3500);
  };

  const fetchTasks = () => {
    setLoading(true);
    let params: any = {};
    if (minReward) params.reward_min = minReward;
    if (maxReward) params.reward_max = maxReward;
    api
      .get('/tasks/search', {
        headers: { Authorization: `Bearer ${token}` },
        params,
      })
      .then(res => {
        const data = res.data as { tasks: Task[] };
        setTasks(filterTasks(data.tasks || []));
        setCurrentPage(1); // Reset to first page on filter
        setLoading(false);
      })
      .catch(() => {
        showMessage("Грешка при зареждане на задачите", "error");
        setLoading(false);
      });
  };

  useEffect(fetchTasks, [token]);

  const handleLike = async (taskId: number) => {
    try {
      await api.post(`/like/task/${taskId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      showMessage("Задачата е харесана! Очаквай авторът да я потвърди.", "info");
      fetchTasks();
    } catch (e: any) {
      showMessage(e?.response?.data?.error || "Не може да харесаш тази задача.", "error");
    }
  };

  return (
    <>
      {/* GLOBAL TOAST – винаги най-отгоре на viewport */}
      {info && (
        <div
          className={`animated-message ${info.type} ${showInfo ? "show" : "hide"}`}
          style={{
            position: "fixed",
            top: 36,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            minWidth: 320,
            maxWidth: 480,
            pointerEvents: "none",
            marginTop: 0
          }}
        >
          {info.text}
        </div>
      )}

      <div className="page-container">
        <h2 className="page-title">Общи задачи (размяна)</h2>
        <div className="filters" style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <input
            type="number"
            placeholder="Мин. награда"
            value={minReward}
            onChange={e => setMinReward(e.target.value)}
            className="task-input"
            style={{ width: 110 }}
          />
          <input
            type="number"
            placeholder="Макс. награда"
            value={maxReward}
            onChange={e => setMaxReward(e.target.value)}
            className="task-input"
            style={{ width: 110 }}
          />
          <button className="main-btn" onClick={fetchTasks}>Филтрирай</button>
        </div>
        {loading ? (
          <p className="info">Зареждане...</p>
        ) : (
          <>
            <ul className="task-list">
              {currentTasks.length === 0 ? (
                <li className="info">Няма чужди задачи.</li>
              ) : (
                currentTasks.map(task => (
                  <li key={task.id} className="task-card">
                    <strong className="task-title">{task.title}</strong>
                    <div className="task-desc">{task.description}</div>
                    <div className="task-meta">
                      Дедлайн: {new Date(task.deadline).toLocaleString('bg-BG')}
                    </div>
                    <div className="task-meta">
                      Награда: {task.reward} лв.
                    </div>
                    <button
                      className="main-btn"
                      onClick={() => handleLike(task.id)}
                      style={{ marginTop: 10, minWidth: 100 }}
                    >🤍 Харесай</button>
                  </li>
                ))
              )}
            </ul>
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="page-btn"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Предишна
                </button>
                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx}
                    className={`page-btn ${currentPage === idx + 1 ? 'active' : ''}`}
                    onClick={() => setCurrentPage(idx + 1)}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  className="page-btn"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Следваща
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
