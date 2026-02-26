import { useState, useCallback, useEffect } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const THEMES = ["light", "dark", "sepia"];
const ZOOM_STEP = 10;
const ZOOM_MIN = 50;
const ZOOM_MAX = 200;

function App() {
  const [markdown, setMarkdown] = useState("");
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [theme, setTheme] = useState("light");
  const [zoom, setZoom] = useState(100);
  const [aboutOpen, setAboutOpen] = useState(false);

  const loadFile = useCallback(async (filePath) => {
    try {
      setError("");
      const content = await Neutralino.filesystem.readFile(filePath);
      const name = filePath.split(/[\\/]/).pop();
      setFileName(name);
      setMarkdown(content);
    } catch (err) {
      setError(err.message || "Failed to read file");
    }
  }, []);

  // When the app launches via a Windows file association (e.g. double-clicking
  // a .md file), the OS passes the file path as a CLI argument. NL_ARGS[0] is
  // the binary path; NL_ARGS[1] is the associated file path, if present.
  useEffect(() => {
    const args = typeof NL_ARGS !== "undefined" ? NL_ARGS : [];
    if (args.length >= 2) {
      const filePath = args[1];
      const ext = filePath.split(".").pop().toLowerCase();
      if (["md", "markdown", "txt"].includes(ext)) {
        loadFile(filePath);
      }
    }
  }, [loadFile]);

  const openFile = useCallback(async () => {
    try {
      setError("");
      const entries = await Neutralino.os.showOpenDialog("Open Markdown File", {
        filters: [
          { name: "Markdown Files", extensions: ["md", "markdown", "txt"] },
          { name: "All Files", extensions: ["*"] },
        ],
      });

      if (!entries || entries.length === 0) return;

      await loadFile(entries[0]);
    } catch (err) {
      setError(err.message || "Failed to open file");
    }
  }, [loadFile]);

  const zoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + ZOOM_STEP, ZOOM_MAX));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - ZOOM_STEP, ZOOM_MIN));
  }, []);

  return (
    <div className={`app theme-${theme}`} data-testid="app-root">
      <header className="toolbar" role="banner">
        <h1 className="app-title">MarkRead</h1>

        <button
          className="toolbar-btn primary"
          onClick={openFile}
          aria-label="Open a Markdown file"
          data-testid="open-file-btn"
        >
          Open File
        </button>

        {fileName && (
          <span className="file-name" aria-live="polite" data-testid="file-name">
            {fileName}
          </span>
        )}

        <div className="toolbar-spacer" />

        <div className="toolbar-group" role="group" aria-label="Theme selection">
          {THEMES.map((t) => (
            <button
              key={t}
              className={`toolbar-btn icon${theme === t ? " active" : ""}`}
              onClick={() => setTheme(t)}
              aria-label={`${t} theme`}
              aria-pressed={theme === t}
              data-testid={`theme-${t}-btn`}
            >
              {t === "light" && "☀️"}
              {t === "dark" && "🌙"}
              {t === "sepia" && "📜"}
            </button>
          ))}
        </div>

        <div className="toolbar-divider" aria-hidden="true" />

        <div className="toolbar-group" role="group" aria-label="Zoom controls">
          <button
            className="toolbar-btn icon"
            onClick={zoomOut}
            disabled={zoom <= ZOOM_MIN}
            aria-label="Zoom out"
            data-testid="zoom-out-btn"
          >
            −
          </button>
          <span className="zoom-label" aria-live="polite" data-testid="zoom-level">
            {zoom}%
          </span>
          <button
            className="toolbar-btn icon"
            onClick={zoomIn}
            disabled={zoom >= ZOOM_MAX}
            aria-label="Zoom in"
            data-testid="zoom-in-btn"
          >
            +
          </button>
        </div>

        <div className="toolbar-divider" aria-hidden="true" />

        <button
          className="toolbar-btn icon"
          onClick={() => setAboutOpen(true)}
          aria-label="About MarkRead"
          data-testid="about-btn"
        >
          ℹ️
        </button>
      </header>

      <main className="content" role="main">
        {error && (
          <div className="error-banner" role="alert" data-testid="error-msg">
            {error}
          </div>
        )}

        {!markdown && !error && (
          <div className="empty-state" data-testid="empty-state">
            <div className="empty-icon" aria-hidden="true">📄</div>
            <p>Open a Markdown file to start reading</p>
            <button
              className="toolbar-btn primary"
              onClick={openFile}
              aria-label="Open a Markdown file"
              data-testid="open-file-empty-btn"
            >
              Open File
            </button>
          </div>
        )}

        {markdown && (
          <article
            className="markdown-body"
            style={{ fontSize: `${zoom}%` }}
            data-testid="markdown-content"
          >
            <Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown>
          </article>
        )}
      </main>

      {aboutOpen && (
        <div
          className="about-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="About MarkRead"
          onClick={() => setAboutOpen(false)}
          data-testid="about-dialog"
        >
          <div className="about-card" onClick={(e) => e.stopPropagation()}>
            <h2 className="about-title">MarkRead</h2>
            <p className="about-text">
              Built with <span className="heart" aria-label="love">❤️</span> by{" "}
              <a
                href="#"
                role="link"
                className="about-link"
                data-testid="about-author-link"
                onClick={(e) => {
                  e.preventDefault();
                  Neutralino.os.open("https://ManiG.dev");
                }}
              >
                ManiG
              </a>
            </p>
            <button
              className="toolbar-btn primary about-close"
              onClick={() => setAboutOpen(false)}
              aria-label="Close about dialog"
              data-testid="about-close-btn"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
