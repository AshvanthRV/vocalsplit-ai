import React from "react";
import { separateAudio } from "./services/separationService";

function App() {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [outputDirectory, setOutputDirectory] = React.useState<string | null>(
    null,
  );

  const [dragging, setDragging] = React.useState(false);
  const [error, setError] = React.useState("");
  const [folderError, setFolderError] = React.useState("");

  const [isProcessing, setIsProcessing] = React.useState(false);

  const [separationResult, setSeparationResult] = React.useState<Awaited<
    ReturnType<typeof separateAudio>
  > | null>(null);

  const [processingError, setProcessingError] = React.useState("");

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const supportedExtensions = ["wav", "mp3", "flac", "aac", "m4a"];

  // Validate and select an audio file
  function handleFile(file?: File) {
    if (!file || isProcessing) return;

    const extension = file.name.split(".").pop()?.toLowerCase();

    if (!extension || !supportedExtensions.includes(extension)) {
      setError(
        "Unsupported audio format. Please select WAV, MP3, FLAC, AAC or M4A.",
      );
      setSelectedFile(null);
      setSeparationResult(null);
      setProcessingError("");
      return;
    }

    setError("");
    setProcessingError("");
    setSeparationResult(null);
    setSelectedFile(file);
  }

  // Handle drag and drop
  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);

    if (isProcessing) return;

    handleFile(event.dataTransfer.files[0]);
  }

  // Format audio file size
  function formatFileSize(bytes: number) {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  // Open native Windows output-folder selection dialog
  async function handleOutputFolderSelection() {
    if (isProcessing) return;

    try {
      const folder = await window.api.selectOutputFolder();

      if (folder) {
        setOutputDirectory(folder);
        setFolderError("");
        setSeparationResult(null);
        setProcessingError("");
      }
    } catch (error) {
      setFolderError(
        error instanceof Error
          ? error.message
          : "Unable to select the output folder.",
      );
    }
  }

  // Start AI audio separation
  async function handleSeparation() {
    if (!selectedFile || !outputDirectory || isProcessing) return;

    setIsProcessing(true);
    setProcessingError("");
    setSeparationResult(null);

    try {
      const result = await separateAudio(selectedFile, outputDirectory);

      setSeparationResult(result);
    } catch (error) {
      setProcessingError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
      );
    } finally {
      setIsProcessing(false);
    }
  }

  // Remove selected audio file
  function handleRemoveFile() {
    if (isProcessing) return;

    setSelectedFile(null);
    setError("");
    setProcessingError("");
    setSeparationResult(null);
  }

  const canStartSeparation =
    Boolean(selectedFile) && Boolean(outputDirectory) && !isProcessing;

  return (
    <div className="app">
      {" "}
      <aside className="sidebar">
        {" "}
        <div className="brand">
          {" "}
          <div className="brand-icon">V</div>
          ```
          <div>
            <h2>VocalSplit</h2>
            <span>AI AUDIO STUDIO</span>
          </div>
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

              if (!isProcessing) {
                setDragging(true);
              }
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".wav,.mp3,.flac,.aac,.m4a,audio/*"
              hidden
              disabled={isProcessing}
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
                  disabled={isProcessing}
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
                  disabled={isProcessing}
                  onClick={handleRemoveFile}
                >
                  Remove file
                </button>
              </div>
            )}

            {error && <p className="upload-error">{error}</p>}
          </div>

          {/* Output folder selection */}
          <div className="output-folder-section">
            <div className="section-title">
              <div>
                <h2>Output location</h2>

                <p>Choose where your separated audio files should be saved.</p>
              </div>
            </div>

            <button
              className="upload-button"
              onClick={handleOutputFolderSelection}
              disabled={isProcessing}
            >
              {outputDirectory
                ? "Change Output Folder"
                : "Choose Output Folder"}
            </button>

            {outputDirectory && (
              <div className="selected-folder">
                <span>📁</span>

                <p className="output-folder-path">{outputDirectory}</p>
              </div>
            )}

            {folderError && <p className="upload-error">{folderError}</p>}
          </div>

          {/* Processing section */}
          <div className="processing-section">
            <button
              className="upload-button"
              onClick={handleSeparation}
              disabled={!canStartSeparation}
            >
              {isProcessing ? "Processing audio..." : "Separate Audio"}
            </button>

            {!selectedFile && <p>Select an audio file to continue.</p>}

            {selectedFile && !outputDirectory && (
              <p>Choose an output folder to continue.</p>
            )}

            {isProcessing && (
              <div className="processing-message">
                <div className="processing-spinner"></div>

                <h3>AI is separating your audio</h3>

                <p>
                  Demucs is processing your audio. Please wait. Processing time
                  depends on the audio duration and your computer's hardware.
                </p>
              </div>
            )}

            {processingError && (
              <p className="upload-error">{processingError}</p>
            )}
          </div>

          {/* Separation results */}
          {separationResult && (
            <div className="result-panel">
              <h2>Separation completed!</h2>

              <p>Your audio has been successfully separated.</p>

              <div className="result-details">
                <p>
                  <strong>Model:</strong> {separationResult.model}
                </p>

                <p>
                  <strong>Job ID:</strong> {separationResult.job_id}
                </p>

                <p>
                  <strong>Vocals:</strong>
                  <br />
                  {separationResult.vocals}
                </p>

                <p>
                  <strong>Instrumental:</strong>
                  <br />
                  {separationResult.instrumental}
                </p>
              </div>
            </div>
          )}

          {/* Output cards */}
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

                <span className="output-status">
                  {separationResult ? "COMPLETED" : "AWAITING PROCESSING"}
                </span>
              </div>

              <div className="output-card">
                <div className="output-symbol instrumental">≋</div>

                <div>
                  <h3>Instrumental</h3>
                  <p>Music without vocals</p>
                </div>

                <span className="output-status">
                  {separationResult ? "COMPLETED" : "AWAITING PROCESSING"}
                </span>
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
