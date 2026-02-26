# MarkRead

A lightweight, portable desktop Markdown viewer for Windows, macOS, and Linux. No installation required — just a single executable.

## Features

- **Open any Markdown file** — Native file dialog to browse and select `.md`, `.markdown`, or `.txt` files
- **GitHub-Flavored Markdown** — Tables, task lists, strikethrough, fenced code blocks, and autolinks
- **Theme switching** — Light, Dark, and Sepia modes for comfortable reading in any environment
- **Text zoom** — Adjustable font size from 50% to 200% in 10% increments
- **File association support** — Double-click a `.md` file in Windows Explorer to open it directly in MarkRead
- **Single portable executable** — Resources embedded into the binary; no installer, no runtime dependencies
- **Cross-platform** — Builds for Windows (x64), macOS (x64, ARM64, Universal), and Linux (x64, ARM64, ARMhf)

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Desktop runtime | [Neutralinojs](https://neutralino.js.org/) v6.5.0 | Lightweight native window, file system access, OS dialogs |
| UI framework | [React](https://react.dev/) v19 | Component-based UI rendering |
| Markdown rendering | [react-markdown](https://github.com/remarkjs/react-markdown) v10 + [remark-gfm](https://github.com/remarkjs/remark-gfm) v4 | Parses and renders GitHub-Flavored Markdown |
| Build tool | [Vite](https://vite.dev/) v7 | Fast bundling of React into static assets |
| Styling | CSS custom properties | Theme variables for light, dark, and sepia palettes |
| Code signing | Windows `signtool` (via Node script) | Optional post-build executable signing |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Neutralinojs CLI](https://neutralino.js.org/docs/cli/neu-cli) (`npm install -g @neutralinojs/neu`)

### Install Dependencies

```bash
npm install
```

### Development

```bash
npm run dev
```

Builds the React frontend and launches MarkRead in a native window.

### Production Build

```bash
npm run build
```

Outputs a single portable executable per platform into `dist/MarkRead/`. The Windows binary is `MarkRead-win_x64.exe` (~3 MB).

### Code Signing (Optional)

Set the certificate environment variables before building:

```powershell
$env:SIGN_PFX_PATH = "C:\certs\markread.pfx"
$env:SIGN_PFX_PASS = "your-password"
npm run build
```

If no certificate is configured, the build completes normally and the signing step is skipped with a warning.

## Project Structure

```
MarkRead/
├── src/                    React source code
│   ├── App.jsx             Main component (file dialog, themes, zoom, about)
│   ├── main.jsx            Entry point, Neutralino init
│   ├── styles.css           Theme variables and layout
│   └── index.html          Vite HTML entry
├── resources/              Neutralino document root (Vite build output)
│   ├── js/neutralino.js    Neutralino client library
│   └── icons/              App icons
├── scripts/
│   └── sign.js             Post-build Windows code signing script
├── neutralino.config.json  App config (permissions, window, metadata)
├── vite.config.js          Vite build config
└── package.json            Dependencies and scripts
```

## npm Scripts

| Script | Description |
|---|---|
| `npm run dev` | Build React + launch in dev mode |
| `npm run build` | Build React + create portable executables + sign |
| `npm run dev:react` | Watch-mode React build only |
| `npm run build:react` | One-off React build only |

## License

[MIT](LICENSE)

## Author

Built with ❤️ by [ManiG](https://ManiG.dev)
