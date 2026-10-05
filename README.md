# 🦜 Echo Paste

A lightweight clipboard manager desktop app for Windows. Echo Paste runs quietly in the background, automatically capturing everything you copy with `Ctrl+C`, so you never lose something you copied over by accident.

Built with **Electron** and **React** as a hands-on learning project — from a blank folder to a fully packaged, installable Windows app.

---

## ✨ Features

- **Automatic clipboard capture** — detects new copied text in the background, no manual action needed
- **Duplicate prevention** — won't clutter your history with the same consecutive copy
- **Persistent local history** — stored in a local JSON file, survives app restarts
- **Live-updating UI** — built with React; the list updates instantly as you copy
- **Click to re-copy** — click any item in the list to put it back on your clipboard
- **24-hour auto-expiration** — old entries clean themselves up automatically
- **System tray integration** — lives in your tray with a custom parrot icon; closing the window hides it instead of quitting
- **Global keyboard shortcut** — `Ctrl+Shift+V` shows/hides the app from anywhere
- **100% local** — no network requests, no cloud sync, nothing ever leaves your machine

---

## 🛠️ Tech Stack

| Purpose | Tool |
|---|---|
| Desktop app framework | [Electron](https://www.electronjs.org/) |
| UI | [React](https://react.dev/) |
| Build tool / bundler | [Vite](https://vitejs.dev/) |
| Packaging | [electron-builder](https://www.electron.build/) |
| Storage | Local JSON file (Node.js `fs`) |

---

## 📦 Installation

### Option 1 — Download the installer
Download the latest `Echo Paste Setup.exe` from the [Releases](../../releases) page and run it. (You may see a Windows SmartScreen warning since the app isn't code-signed — click **More info → Run anyway**.)

### Option 2 — Run from source

```bash
# Clone the repository
git clone https://github.com/Antiguen/echo-paste.git
cd echo-paste

# Install dependencies
npm install

# Run in development
npm start
```

---

## 🏗️ Building the Installer Yourself

```bash
npm run dist
```

This builds the React app and packages everything into a Windows installer using electron-builder. The output lands in `dist/Echo Paste Setup 1.0.0.exe`.

---

## 🖥️ Usage

1. Launch Echo Paste — it opens a window and starts running in the background
2. Copy any text as normal (`Ctrl+C` or right-click → Copy)
3. Open Echo Paste (or press `Ctrl+Shift+V`) to see your clipboard history
4. Click any item to copy it back to your clipboard
5. Click ✕ to delete a single item, or **Clear All** to wipe the whole history
6. Closing the window doesn't quit the app — find it in your system tray (right-click the parrot icon for **Show** / **Quit**)

---

## 📁 Project Structure

```
echo-paste/
├── main.js           # Electron main process — clipboard watching, storage, tray, shortcuts
├── preload.js         # Secure bridge between main process and the UI (contextBridge/IPC)
├── index.html          # HTML entry point loaded by Electron
├── icon.png           # App & tray icon
├── src/
│   ├── main.jsx        # React entry point
│   ├── App.jsx         # Main UI component
│   └── index.css       # Styles
├── vite.config.js      # Vite build configuration
└── package.json        # Project manifest, scripts, and electron-builder config
```

---

## ⚠️ Known Limitations

- **Text only** — images, files, and rich formatted content are not captured (planned as a future enhancement)
- **No encryption** — clipboard history is stored as plain, unencrypted JSON locally. Avoid copying sensitive data like passwords while the app is running
- **No cloud sync** — history is local to the machine it's installed on
- **Unsigned installer** — Windows SmartScreen will flag the installer as from an unrecognized publisher; this is expected for a self-built app

---

## 🚀 Possible Future Improvements

- [ ] Search bar to filter clipboard history
- [ ] Pin/favorite items so they don't expire
- [ ] Settings screen to customize the expiration time
- [ ] Support for images and rich text
- [ ] Optional encryption for stored history

---

## 📄 License

ISC