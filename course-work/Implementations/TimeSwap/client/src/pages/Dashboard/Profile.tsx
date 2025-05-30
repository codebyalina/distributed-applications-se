// src/pages/Dashboard/Profile.tsx

import React from "react";
import "./SharedStyles.css";

interface ProfileProps {
  username: string;
  email: string;
  onLogout: () => void;
  onEdit?: () => void;
}

const Profile: React.FC<ProfileProps> = ({ username, email, onLogout, onEdit }) => {
  return (
    <div className="page-container" style={{
      animation: "showup 0.55s"
    }}>
      <h2 style={{
        color: "#b39ddb",
        letterSpacing: "1.5px",
        marginBottom: 20
      }}>
        👤 Профил
      </h2>

      <div
        style={{
          width: "100%",
          textAlign: "left",
          color: "#f3e9ff",
          background: "#232339",
          borderRadius: 12,
          padding: "18px 18px 8px 18px",
          marginBottom: 18,
          boxShadow: "0 1px 8px 0 #b39ddb1c"
        }}
      >
        <p style={{ margin: "10px 0" }}>
          <span style={{ color: "#b39ddb", fontWeight: 700, fontSize: 16 }}>
            Потребителско име:
          </span>
          <span style={{ marginLeft: 8, color: "#fff" }}>{username}</span>
        </p>
        <p style={{ margin: "10px 0" }}>
          <span style={{ color: "#b39ddb", fontWeight: 700, fontSize: 16 }}>
            Email:
          </span>
          <span style={{ marginLeft: 8, color: "#fff" }}>{email}</span>
        </p>
      </div>

      <div
        className="task-form-actions"
        style={{ marginTop: 24, display: "flex", gap: 12, justifyContent: "center" }}
      >
        {onEdit && (
          <button
            className="main-btn"
            style={{
              minWidth: 110,
              fontWeight: 700,
              background: "#b39ddb",
              color: "#232339",
              borderRadius: 7,
              transition: "background 0.18s"
            }}
            onClick={onEdit}
            onMouseDown={e => (e.currentTarget.style.background = "#8e24aa")}
            onMouseUp={e => (e.currentTarget.style.background = "#b39ddb")}
            onMouseLeave={e => (e.currentTarget.style.background = "#b39ddb")}
          >
            ✏️ Редактирай
          </button>
        )}
        <button
          className="cancel-btn"
          style={{
            minWidth: 90,
            fontWeight: 700,
            borderRadius: 7
          }}
          onClick={onLogout}
        >
          🚪 Изход
        </button>
      </div>
    </div>
  );
};

export default Profile;
