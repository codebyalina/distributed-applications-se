// src/pages/Dashboard/DashboardHeader.tsx

import UserMenu from '../Profile/UserMenu'

interface DashboardHeaderProps {
  token: string
  onLogout: () => void
}

export default function DashboardHeader({
  token,
  onLogout
}: DashboardHeaderProps) {
  return (
    <div
      className="dashboard-header"
      style={{
        width: "100%",
        marginBottom: 20,
        marginTop: 6,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 24, color: "#b39ddb", letterSpacing: 1 }}>
        <span className="logo">TimeSwap <span style={{fontSize: 18, color:'#8e24aa'}}>✨</span></span>
      </div>
      <UserMenu token={token} onLogout={onLogout} />
    </div>
  )
}
