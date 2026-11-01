function App() {
  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">V</div>

          <div>
            <h2>VocalSplit</h2>
            <span>AI AUDIO STUDIO</span>
          </div>
        </div>

        <nav className="navigation">
          <p className="nav-heading">WORKSPACE</p>

          <button className="nav-item active">
            <span>▦</span>
            Dashboard
          </button>

          <button className="nav-item">
            <span>♫</span>
            Separation
          </button>

          <button className="nav-item">
            <span>◷</span>
            History
          </button>

          <p className="nav-heading settings-heading">PREFERENCES</p>

          <button className="nav-item">
            <span>⚙</span>
            Settings
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="status-dot"></div>
          <span>Local processing environment</span>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="breadcrumb">Workspace / Dashboard</p>
          </div>

          <div className="topbar-right">
            <span className="version">VERSION 1.0.0</span>
            <div className="profile">A</div>
          </div>
        </header>

        <section className="dashboard">
          <div className="welcome">
            <div>
              <p className="eyebrow">AI AUDIO PROCESSING</p>
              <h1>Separate your sound.</h1>

              <p className="welcome-description">
                Extract vocals and instrumentals from your audio
                with AI-powered source separation.
              </p>
            </div>

            <div className="welcome-badge">
              <span>✦</span> AI POWERED
            </div>
          </div>

          <div className="section-title">
            <div>
              <h2>New separation</h2>
              <p>Start by importing an audio file.</p>
            </div>
          </div>

          <div className="upload-card">
            <div className="upload-icon">♫</div>

            <h3>Import your audio</h3>

            <p>
              Drag and drop an audio file here, or browse your computer.
            </p>

            <button className="upload-button" disabled>
              Browse audio files
            </button>

            <span className="supported-formats">
              WAV · MP3 · FLAC · AAC
            </span>
          </div>

          <div className="output-section">
            <div className="section-title">
              <div>
                <h2>Separation outputs</h2>
                <p>Your independent audio stems.</p>
              </div>
            </div>

            <div className="output-grid">
              <div className="output-card">
                <div className="output-symbol vocal">♫</div>
                <div>
                  <h3>Vocals</h3>
                  <p>Isolated vocal track</p>
                </div>
                <span className="output-status">READY AFTER PROCESSING</span>
              </div>

              <div className="output-card">
                <div className="output-symbol instrumental">≋</div>
                <div>
                  <h3>Instrumental</h3>
                  <p>Music without vocals</p>
                </div>
                <span className="output-status">READY AFTER PROCESSING</span>
              </div>
            </div>
          </div>

          <footer className="dashboard-footer">
            VocalSplit AI <span>•</span> AI-powered audio source separation
          </footer>
        </section>
      </main>
    </div>
  )
}

export default App