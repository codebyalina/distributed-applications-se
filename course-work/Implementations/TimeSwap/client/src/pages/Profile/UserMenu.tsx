import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import AvatarUpload from './AvatarUpload'

interface UserMenuProps {
  token: string
  onLogout: () => void
}

export default function UserMenu({ token, onLogout }: UserMenuProps) {
  const [open, setOpen] = useState(false)
  const [balance, setBalance] = useState<number>(0)
  const [avatarUrl, setAvatarUrl] = useState<string>('/assets/default-avatar.png')
  const menuRef = useRef<HTMLDivElement>(null)

  // Взимаш баланса
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/wallet/balance`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setBalance((res.data as { balance: number }).balance || 0))
      .catch(() => setBalance(0))
  }, [token])

  // Взимаш аватара
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/profile/avatar`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setAvatarUrl((res.data as { avatar_url: string }).avatar_url || '/assets/default-avatar.png'))
      .catch(() => setAvatarUrl('/assets/default-avatar.png'))
  }, [token])

  // Скрий менюто ако цъкнеш навън
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <div className="user-menu" ref={menuRef} style={{ position: "relative", display: "flex", alignItems: "center", gap: 10 }}>
      <img
        src={avatarUrl}
        alt="avatar"
        className="user-avatar"
        style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", cursor: "pointer", border: "2px solid #7C4DFF" }}
        onClick={() => setOpen(!open)}
      />
      <span style={{ fontWeight: 600, fontSize: 17, color: "#b39ddb", background: "#211944", borderRadius: 8, padding: "5px 12px" }}>
        {balance} лв
      </span>
      {open && (
        <div className="user-dropdown" style={{
          position: "absolute",
          right: 0,
          top: 52,
          minWidth: 180,
          background: "#232339",
          borderRadius: 12,
          boxShadow: "0 2px 18px 0 rgba(87,33,135,0.20)",
          zIndex: 10,
          padding: 10
        }}>
          <div style={{ marginBottom: 10 }}>
            <strong style={{ color: "#b39ddb" }}>Моят акаунт</strong>
          </div>
          <div>
            <AvatarUpload
              token={token}
              currentUrl={avatarUrl}
              onUpload={setAvatarUrl}
            />
          </div>
          <button className="main-btn" style={{ width: "100%", marginTop: 10 }} onClick={onLogout}>Изход</button>
          <button className="main-btn" style={{ width: "100%", marginTop: 6 }}>Настройки</button>
          <button className="main-btn" style={{ width: "100%", marginTop: 6 }}>Портфейл</button>
        </div>
      )}
    </div>
  )
}
