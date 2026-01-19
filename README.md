# Cloud Music Player

A cross-platform music streaming app that syncs your personal music collections from cloud storage providers. Features a classic **Winamp-style skin** for that nostalgic experience!

![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

- **Multi-Cloud Support** - Connect Dropbox, Google Drive, OneDrive, and more
- **Full Metadata Sync** - All your tags, artwork, and organization preserved
- **Dual UI Skins** - Modern dark theme OR classic Winamp-style interface
- **Offline Playback** - Download and play without internet
- **Cross-Platform** - Windows, macOS, Linux (mobile coming soon)
- **Privacy First** - Your music stays yours, no cloud processing

## Screenshots

### Modern Skin
Clean, contemporary interface with album artwork focus and smooth controls.

### Winamp Classic Skin
"It really whips the llama's ass!" - Authentic retro experience with:
- LCD time display with green phosphor glow
- Spectrum analyzer visualization
- Classic beveled buttons and controls
- Scrolling track marquee

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/stockstat/cloud-music-player.git
cd cloud-music-player

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building for Windows

```bash
# Build the application
npm run build

# Package for Windows
npm run package:win
```

The packaged application will be in the `release/` folder.

## Development

### Project Structure

```
cloud-music-player/
├── src/
│   ├── main/           # Electron main process
│   │   ├── main.ts     # App entry point
│   │   └── preload.ts  # Context bridge
│   └── renderer/       # React frontend
│       ├── components/ # Shared UI components
│       ├── skins/      # UI themes
│       │   ├── modern/ # Modern dark skin
│       │   └── winamp/ # Classic Winamp skin
│       ├── store/      # Zustand state management
│       ├── hooks/      # Custom React hooks
│       └── types/      # TypeScript definitions
├── package.json
└── vite.config.ts
```

### Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Desktop**: Electron 28
- **State**: Zustand (with persist middleware)
- **Build**: Vite + electron-builder
- **Audio**: Web Audio API

## Supported Cloud Providers

| Provider | Status |
|----------|--------|
| Dropbox | 🚧 In Progress |
| Google Drive | 🚧 In Progress |
| OneDrive | 🚧 In Progress |
| iCloud Drive | 📋 Future |
| Box | 📋 Future |
| Nextcloud | 📋 Future |

## Supported Audio Formats

MP3, AAC, ALAC, FLAC, Ogg Vorbis, Opus, WAV, AIFF, WMA, and more.

## Documentation

- [Product Specification](./SPEC.md) - Detailed feature specifications and technical architecture

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Play/Pause | `Space` |
| Next Track | `→` or `N` |
| Previous Track | `←` or `P` |
| Volume Up | `↑` |
| Volume Down | `↓` |
| Mute | `M` |
| Toggle Skin | `S` |

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## License

MIT License - see [LICENSE](./LICENSE) for details.

---

*Built for music lovers who own their collections*

*"It really whips the llama's ass!"* 🦙
