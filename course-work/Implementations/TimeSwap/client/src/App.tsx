// src/pages/App.tsx

import { useEffect, useState } from 'react'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import BrowseTasks from './pages/BrowseTasks'
import { AuthProvider, useAuth } from './AuthContext'
import { setLogoutHandler } from './api'

function MainApp() {
  const { token, login, logout } = useAuth()
  // Екран: home / login / register
  const [screen, setScreen] = useState<'home' | 'login' | 'register'>('home')
  const [view, setView] = useState<'dashboard' | 'browse'>('dashboard')

  // logout (за глобален logout)
  useEffect(() => {
    setLogoutHandler(logout)
  }, [logout])

  // Ако има токен, винаги да сме във view mode, не в login/register/home
  useEffect(() => {
    if (token) setScreen('home')
  }, [token])

  // Ако няма token, нека не стоим в dashboard/browse view
  useEffect(() => {
    if (!token) setView('dashboard')
  }, [token])

  // Ако НЕ си логнат, показваме Home/Login/Register (с анимация)
  if (!token) {
    return (
      <div className="fullscreen-center" style={{ minHeight: "100vh", width: "100vw" }}>
        <div className="page-container" style={{ animation: 'showup 0.6s', maxWidth: 420, marginTop: 60 }}>
          {screen === 'home' && (
            <Home
              onGoToLogin={() => setScreen('login')}
              onGoToRegister={() => setScreen('register')}
            />
          )}
          {screen === 'login' && (
            <Login
              onSuccessLogin={login}
              onSwitchToRegister={() => setScreen('register')}
            />
          )}
          {screen === 'register' && (
            <Register
              onSuccessLogin={login}
              onSwitchToLogin={() => setScreen('login')}
            />
          )}
        </div>
      </div>
    )
  }

  // Вече си логнат!
  return (
    <div className="fullscreen-center" style={{ minHeight: "100vh", width: "100vw" }}>
      <div className="page-container" style={{
        gap: 0,
        paddingTop: 16,
        paddingBottom: 0,
        boxShadow: 'none',
        background: 'none',
        maxWidth: 540,
        animation: 'showup 0.6s'
      }}>
        <div className="header-row" style={{ width: "100%", marginBottom: 20, marginTop: 6 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              className={`main-btn${view === 'dashboard' ? ' active-btn' : ''}`}
              onClick={() => setView('dashboard')}
              style={{ minWidth: 120 }}
            >
              Твоите задачи
            </button>
            <button
              className={`main-btn${view === 'browse' ? ' active-btn' : ''}`}
              onClick={() => setView('browse')}
              style={{ minWidth: 120 }}
            >
              Общи задачи
            </button>
          </div>
          <button className="logout-btn" onClick={logout}>
            Изход
          </button>
        </div>
        <div style={{ width: "100%" }}>
          {view === 'dashboard' && token && <Dashboard token={token} onLogout={logout} />}
          {view === 'browse' && token && <BrowseTasks token={token} />}
        </div>
      </div>
    </div>
  )
}

// Обгърни App-а с AuthProvider
export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  )
}
