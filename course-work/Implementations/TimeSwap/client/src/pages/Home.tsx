import '../SharedStyles.css';

interface HomeProps {
  onGoToLogin: () => void
  onGoToRegister: () => void
}

export default function Home({ onGoToLogin, onGoToRegister }: HomeProps) {
  return (
    <div
      className="page-container"
      style={{
        maxWidth: 410,
        minHeight: 410,
        boxShadow: "0 8px 64px 0 #a93aaf24, 0 1.5px 32px 0 #8e24aa18",
        background: "linear-gradient(135deg, #19162c 0%, #231134 100%)",
        position: "relative",
        overflow: "hidden",
        border: "2.5px solid #2e2947"
      }}
    >
      {/* Минимална SVG икона */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 0,
        marginTop: 12,
      }}>
        <svg width={44} height={44} viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="19" fill="#8e24aa" fillOpacity="0.22" />
          <circle cx="24" cy="24" r="13" fill="#b42da4" fillOpacity="0.21" />
          <path d="M19 26 Q24 16 29 26" stroke="#b42da4" strokeWidth="2" fill="none" />
          <circle cx="24" cy="31" r="1.8" fill="#fff" />
        </svg>
      </div>

      <h2 style={{
        color: "#b42da4",
        fontWeight: 900,
        letterSpacing: 1.2,
        fontSize: "2rem",
        textAlign: "center",
        margin: "10px 0 8px 0",
        lineHeight: 1.12,
        textShadow: "0 1.5px 8px #b42da425"
      }}>
        Добре дошъл в<br />
        <span style={{ color: "#fff", fontWeight: 900, textShadow: "0 0 6px #b42da433" }}>TimeSwap!</span>
      </h2>

      <div style={{
        marginBottom: 28,
        color: '#b42da4',
        fontWeight: 600,
        textAlign: 'center',
        fontSize: 16.2,
        lineHeight: 1.43,
        letterSpacing: 0.3,
      }}>
        Платформа за размяна на задачи, време и услуги.
      </div>
      <div style={{
        color: '#cbbde2',
        textAlign: 'center',
        fontWeight: 500,
        fontSize: 15.5,
        marginBottom: 34,
        lineHeight: 1.37,
        opacity: 0.92,
      }}>
        Влез или си създай акаунт, за да започнеш.
      </div>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 17, zIndex: 2 }}>
        <button
          className="main-btn"
          onClick={onGoToLogin}
          style={{
            background: 'linear-gradient(92deg, #b42da4 0%, #8e24aa 100%)',
            color: '#fff',
            fontWeight: 800,
            fontSize: 19.5,
            padding: "13px 0",
            letterSpacing: 1.2,
            boxShadow: '0 2.5px 16px 0 #8e24aa28',
            border: 'none'
          }}
        >
          Вход
        </button>
        <button
          className="main-btn"
          onClick={onGoToRegister}
          style={{
            background: '#211944',
            color: '#b39ddb',
            fontWeight: 700,
            fontSize: 18,
            border: '1.5px solid #322955',
            boxShadow: '0 1px 8px 0 #8e24aa12'
          }}
        >
          Регистрация
        </button>
      </div>
    </div>
  )
}
