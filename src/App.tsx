import React from "react";

function App() {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [dragging, setDragging] = React.useState(false);
  const [error, setError] = React.useState("");

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const supportedExtensions = ["wav", "mp3", "flac", "aac", "m4a"];

  function handleFile(file?: File) {
    if (!file) return;

    const extension = file.name.split(".").pop()?.toLowerCase();

    if (!extension || !supportedExtensions.includes(extension)) {
      setError(
        "Unsupported audio format. Please select WAV, MP3, FLAC, AAC or M4A.",
      );
      setSelectedFile(null);
      return;
    }

    setError("");
    setSelectedFile(file);
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);

    handleFile(event.dataTransfer.files[0]);
  }

  function formatFileSize(bytes: number) {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  return (
    <div className="app">
      {" "}
      <aside className="sidebar">
        {" "}
        <div className="brand">
          {" "}
          <div className="brand-icon">V</div>{" "}
          <div>
            {" "}
            <h2>VocalSplit</h2> <span>AI AUDIO STUDIO</span>{" "}
          </div>{" "}
        </div>
        <nav className="navigation">
          <p className="nav-heading">WORKSPACE</p>

          <button className="nav-item active">
            <span>▦</span> Dashboard
          </button>

          <button className="nav-item">
            <span>♫</span> Separation
          </button>

          <button className="nav-item">
            <span>◷</span> History
          </button>

          <p className="nav-heading settings-heading">PREFERENCES</p>

          <button className="nav-item">
            <span>⚙</span> Settings
          </button>
        </nav>
        <div className="sidebar-footer">
          <div className="status-dot"></div>
          <span>Local processing environment</span>
        </div>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <p className="breadcrumb">Workspace / Dashboard</p>

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
                Extract vocals and instrumentals from your audio with AI-powered
                source separation.
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

          <div
            className={`upload-card ${dragging ? "dragging" : ""}`}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".wav,.mp3,.flac,.aac,.m4a,audio/*"
              hidden
              onChange={(event) => {
                handleFile(event.target.files?.[0]);
                event.target.value = "";
              }}
            />

            {!selectedFile ? (
              <>
                <div className="upload-icon">♫</div>

                <h3>Import your audio</h3>

                <p>
                  Drag and drop an audio file here, or browse your computer.
                </p>

                <button
                  className="upload-button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Browse audio files
                </button>

                <span className="supported-formats">
                  WAV · MP3 · FLAC · AAC · M4A
                </span>
              </>
            ) : (
              <div className="selected-file">
                <div className="upload-icon">♫</div>

                <h3>Audio file selected</h3>

                <p className="selected-filename">{selectedFile.name}</p>

                <div className="file-details">
                  <span>
                    Format: {selectedFile.name.split(".").pop()?.toUpperCase()}
                  </span>

                  <span>Size: {formatFileSize(selectedFile.size)}</span>
                </div>

                <button
                  className="remove-file-button"
                  onClick={() => {
                    setSelectedFile(null);
                    setError("");
                  }}
                >
                  Remove file
                </button>
              </div>
            )}
          </div>

          {error && <p className="upload-error">{error}</p>}

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
                <span className="output-status">AWAITING PROCESSING</span>
              </div>

              <div className="output-card">
                <div className="output-symbol instrumental">≋</div>
                <div>
                  <h3>Instrumental</h3>
                  <p>Music without vocals</p>
                </div>
                <span className="output-status">AWAITING PROCESSING</span>
              </div>
            </div>
          </div>

          <footer className="dashboard-footer">
            VocalSplit AI <span>•</span> AI-powered audio source separation
          </footer>
        </section>
      </main>
    </div>
  );
}

export default App;
