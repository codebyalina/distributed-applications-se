// src/pages/Dashboard/NotificationsPanel.tsx

import type { LikeNotification } from "./types";

export interface NotificationsPanelProps {
  notifications: LikeNotification[];
  notifLoading: boolean;
  notifInfo: string;
  onMatch: (task_id: number, user_id: number) => void;
}

export default function NotificationsPanel({
  notifications,
  notifLoading,
  notifInfo,
  onMatch,
}: NotificationsPanelProps) {
  return (
    <div
      className="notifications-panel"
      style={{
        width: "100%",
        marginBottom: 18,
        borderRadius: 10,
        background: "#232339",
        boxShadow: "0 2px 16px 0 rgba(87,33,135,0.06)",
        padding: 14,
        animation: "showup 0.4s"
      }}
    >
      <strong style={{ color: "#b39ddb", fontSize: 18 }}>
        Известия: харесани задачи
      </strong>
      {notifLoading ? (
        <div className="info" style={{ marginTop: 8 }}>Зареждане...</div>
      ) : notifications.length === 0 ? (
        <div className="info" style={{ marginTop: 8 }}>
          Никой още не е харесал твоите задачи... <span style={{ opacity: 0.75 }}>😢</span>
        </div>
      ) : (
        <ul style={{ padding: 0, margin: 0 }}>
          {notifications.map((n, i) => (
            <li
              key={i}
              style={{
                listStyle: "none",
                margin: "8px 0",
                borderBottom: "1px solid #3c2a55",
                paddingBottom: 6,
                display: "flex",
                alignItems: "center",
                gap: 7
              }}
            >
              <span style={{ color: "#fff", fontWeight: 500 }}>
                {n.liked_by_username}
              </span>
              <span style={{ color: "#aaa" }}>иска да изпълни</span>
              <b style={{ color: "#b39ddb" }}>{n.task_title}</b>
              <button
                className="main-btn"
                style={{
                  marginLeft: "auto",
                  padding: "6px 18px",
                  fontSize: 14,
                  background: "#b39ddb",
                  color: "#232339",
                  fontWeight: 700,
                  borderRadius: 8,
                  border: "none",
                  boxShadow: "0 1px 4px #b39ddb40",
                  transition: "background 0.16s, color 0.16s"
                }}
                onClick={() => onMatch(n.task_id, n.liked_by_id)}
                onMouseDown={e => (e.currentTarget.style.background = "#8e24aa")}
                onMouseUp={e => (e.currentTarget.style.background = "#b39ddb")}
                onMouseLeave={e => (e.currentTarget.style.background = "#b39ddb")}
              >
                Match!
              </button>
            </li>
          ))}
        </ul>
      )}
      {/* Покажи инфо само ако не е match duplicate error */}
      {notifInfo &&
        !notifInfo.toLowerCase().includes("вече е създаден match") &&
        !notifInfo.toLowerCase().includes("already matched") &&
        (
          <div
            className={`info${notifInfo.toLowerCase().includes('грешка') || notifInfo.toLowerCase().includes('error') ? ' error' : ''}`}
            style={{
              marginTop: 12,
              animation: "shake 0.18s linear 2, showup 0.2s"
            }}
          >
            {notifInfo}
          </div>
        )
      }
    </div>
  );
}
