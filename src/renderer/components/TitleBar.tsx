import { usePlayerStore } from '../store/playerStore';

interface TitleBarProps {
  variant?: 'modern' | 'winamp';
}

export function TitleBar({ variant = 'modern' }: TitleBarProps) {
  const { skin, setSkin } = usePlayerStore();

  const handleMinimize = () => window.electronAPI?.minimize();
  const handleMaximize = () => window.electronAPI?.maximize();
  const handleClose = () => window.electronAPI?.close();

  if (variant === 'winamp') {
    return (
      <div className="winamp-titlebar h-[14px] bg-gradient-to-b from-[#1e3a5f] to-[#0a1628] flex items-center justify-between px-1 drag-region">
        <div className="flex items-center gap-1 no-drag">
          <button
            onClick={() => setSkin(skin === 'winamp' ? 'modern' : 'winamp')}
            className="w-[9px] h-[9px] bg-[#1e3a5f] border border-[#4080ff] text-[6px] flex items-center justify-center hover:bg-[#4080ff] transition-colors"
            title="Toggle skin"
          >
            <span className="text-[#4080ff] hover:text-white">◈</span>
          </button>
        </div>
        <span className="text-[8px] text-[#4080ff] font-bold tracking-wide">CLOUD MUSIC PLAYER</span>
        <div className="flex items-center gap-[2px] no-drag">
          <button
            onClick={handleMinimize}
            className="w-[9px] h-[9px] bg-[#1e3a5f] border border-[#4080ff] text-[8px] leading-none text-[#4080ff] hover:bg-[#4080ff] hover:text-white transition-colors"
          >
            _
          </button>
          <button
            onClick={handleMaximize}
            className="w-[9px] h-[9px] bg-[#1e3a5f] border border-[#4080ff] text-[6px] leading-none text-[#4080ff] hover:bg-[#4080ff] hover:text-white transition-colors"
          >
            □
          </button>
          <button
            onClick={handleClose}
            className="w-[9px] h-[9px] bg-[#1e3a5f] border border-[#4080ff] text-[8px] leading-none text-[#4080ff] hover:bg-[#ff4040] hover:text-white transition-colors"
          >
            ×
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-10 bg-app-surface flex items-center justify-between px-4 drag-region border-b border-app-surface-light">
      <div className="flex items-center gap-3 no-drag">
        <div className="w-6 h-6 bg-app-accent rounded-lg flex items-center justify-center">
          <span className="text-white text-xs font-bold">♪</span>
        </div>
        <span className="text-app-text font-medium text-sm">Cloud Music Player</span>
      </div>

      <div className="flex items-center gap-2 no-drag">
        <button
          onClick={() => setSkin(skin === 'modern' ? 'winamp' : 'modern')}
          className="px-3 py-1 text-xs bg-app-surface-light hover:bg-app-accent text-app-text-muted hover:text-white rounded transition-colors"
          title="Switch to Winamp skin"
        >
          {skin === 'modern' ? '🎵 Classic' : '✨ Modern'}
        </button>
        <button
          onClick={handleMinimize}
          className="w-8 h-8 flex items-center justify-center text-app-text-muted hover:text-app-text hover:bg-app-surface-light rounded transition-colors"
        >
          −
        </button>
        <button
          onClick={handleMaximize}
          className="w-8 h-8 flex items-center justify-center text-app-text-muted hover:text-app-text hover:bg-app-surface-light rounded transition-colors"
        >
          □
        </button>
        <button
          onClick={handleClose}
          className="w-8 h-8 flex items-center justify-center text-app-text-muted hover:text-white hover:bg-red-500 rounded transition-colors"
        >
          ×
        </button>
      </div>
    </div>
  );
}
