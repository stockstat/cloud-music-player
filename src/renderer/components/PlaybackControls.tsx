import { usePlayerStore } from '../store/playerStore';

interface PlaybackControlsProps {
  variant?: 'modern' | 'winamp';
}

export function PlaybackControls({ variant = 'modern' }: PlaybackControlsProps) {
  const {
    isPlaying,
    togglePlayPause,
    nextTrack,
    previousTrack,
    currentTrack,
  } = usePlayerStore();

  if (variant === 'winamp') {
    return (
      <div className="flex items-center gap-[2px]">
        <button
          onClick={previousTrack}
          disabled={!currentTrack}
          className="winamp-btn w-[23px] h-[18px] bg-[#3a3a5c] border-t border-l border-[#5a5a7c] border-b border-r border-[#1a1a2c] active:border-t-[#1a1a2c] active:border-l-[#1a1a2c] active:border-b-[#5a5a7c] active:border-r-[#5a5a7c] flex items-center justify-center disabled:opacity-50"
          title="Previous"
        >
          <span className="text-[10px] text-[#00ff00]">⏮</span>
        </button>
        <button
          onClick={togglePlayPause}
          disabled={!currentTrack}
          className="winamp-btn w-[23px] h-[18px] bg-[#3a3a5c] border-t border-l border-[#5a5a7c] border-b border-r border-[#1a1a2c] active:border-t-[#1a1a2c] active:border-l-[#1a1a2c] active:border-b-[#5a5a7c] active:border-r-[#5a5a7c] flex items-center justify-center disabled:opacity-50"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          <span className="text-[10px] text-[#00ff00]">{isPlaying ? '⏸' : '▶'}</span>
        </button>
        <button
          onClick={() => usePlayerStore.getState().setIsPlaying(false)}
          disabled={!currentTrack}
          className="winamp-btn w-[23px] h-[18px] bg-[#3a3a5c] border-t border-l border-[#5a5a7c] border-b border-r border-[#1a1a2c] active:border-t-[#1a1a2c] active:border-l-[#1a1a2c] active:border-b-[#5a5a7c] active:border-r-[#5a5a7c] flex items-center justify-center disabled:opacity-50"
          title="Stop"
        >
          <span className="text-[10px] text-[#00ff00]">⏹</span>
        </button>
        <button
          onClick={nextTrack}
          disabled={!currentTrack}
          className="winamp-btn w-[23px] h-[18px] bg-[#3a3a5c] border-t border-l border-[#5a5a7c] border-b border-r border-[#1a1a2c] active:border-t-[#1a1a2c] active:border-l-[#1a1a2c] active:border-b-[#5a5a7c] active:border-r-[#5a5a7c] flex items-center justify-center disabled:opacity-50"
          title="Next"
        >
          <span className="text-[10px] text-[#00ff00]">⏭</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={previousTrack}
        disabled={!currentTrack}
        className="w-10 h-10 flex items-center justify-center text-app-text-muted hover:text-app-text disabled:opacity-30 transition-colors"
        title="Previous"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
        </svg>
      </button>
      <button
        onClick={togglePlayPause}
        disabled={!currentTrack}
        className="w-14 h-14 flex items-center justify-center bg-app-accent hover:bg-app-accent-hover disabled:bg-app-surface-light rounded-full transition-colors"
        title={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        )}
      </button>
      <button
        onClick={nextTrack}
        disabled={!currentTrack}
        className="w-10 h-10 flex items-center justify-center text-app-text-muted hover:text-app-text disabled:opacity-30 transition-colors"
        title="Next"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
        </svg>
      </button>
    </div>
  );
}
