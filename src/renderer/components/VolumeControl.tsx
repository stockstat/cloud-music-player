import { useCallback, useRef } from 'react';
import { usePlayerStore } from '../store/playerStore';

interface VolumeControlProps {
  variant?: 'modern' | 'winamp';
}

export function VolumeControl({ variant = 'modern' }: VolumeControlProps) {
  const { volume, isMuted, setVolume, toggleMute } = usePlayerStore();
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleVolumeChange = useCallback((e: React.MouseEvent | MouseEvent) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();

    if (variant === 'winamp') {
      // Horizontal for Winamp
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      setVolume(x / rect.width);
    } else {
      // Vertical for modern
      const y = Math.max(0, Math.min(rect.bottom - e.clientY, rect.height));
      setVolume(y / rect.height);
    }
  }, [setVolume, variant]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    handleVolumeChange(e);

    const handleMouseMove = (e: MouseEvent) => handleVolumeChange(e);
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [handleVolumeChange]);

  const displayVolume = isMuted ? 0 : volume;

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return '🔇';
    if (volume < 0.3) return '🔈';
    if (volume < 0.7) return '🔉';
    return '🔊';
  };

  if (variant === 'winamp') {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={toggleMute}
          className="text-[10px] text-[#00ff00] hover:text-[#00ff00] w-4"
        >
          {getVolumeIcon()}
        </button>
        <div
          ref={sliderRef}
          onMouseDown={handleMouseDown}
          className="w-[68px] h-[10px] bg-[#0a0a0a] border border-[#3a3a5c] cursor-pointer relative"
        >
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#00aa00] to-[#00ff00]"
            style={{ width: `${displayVolume * 100}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-[6px] h-[8px] bg-[#00ff00] border border-[#00aa00]"
            style={{ left: `calc(${displayVolume * 100}% - 3px)` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 group relative">
      <button
        onClick={toggleMute}
        className="w-8 h-8 flex items-center justify-center text-app-text-muted hover:text-app-text transition-colors"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          {isMuted || volume === 0 ? (
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
          ) : volume < 0.5 ? (
            <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/>
          ) : (
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
          )}
        </svg>
      </button>
      <div
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        className="w-24 h-1 bg-app-surface-light rounded-full cursor-pointer relative"
      >
        <div
          className="absolute top-0 left-0 h-full bg-app-accent rounded-full"
          style={{ width: `${displayVolume * 100}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ left: `calc(${displayVolume * 100}% - 6px)` }}
        />
      </div>
    </div>
  );
}
