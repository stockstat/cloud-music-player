import { useLibraryStore } from '../../store/libraryStore';
import { useMemo } from 'react';

interface StatusBarProps {
  trackCount: number;
  selectedCount?: number;
}

function formatTotalDuration(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00';

  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

export function StatusBar({ trackCount, selectedCount = 0 }: StatusBarProps) {
  const { tracks, selectedTrackIds, isScanning, scanProgress, getFilteredTracks } = useLibraryStore();

  const filteredTracks = getFilteredTracks();

  const stats = useMemo(() => {
    const totalDuration = filteredTracks.reduce((sum, track) => sum + (track.duration || 0), 0);
    return {
      totalDuration,
      displayCount: filteredTracks.length,
    };
  }, [filteredTracks]);

  const selectedStats = useMemo(() => {
    if (selectedTrackIds.size === 0) return null;

    const selectedTracks = filteredTracks.filter(t => selectedTrackIds.has(t.id));
    const totalDuration = selectedTracks.reduce((sum, track) => sum + (track.duration || 0), 0);

    return {
      count: selectedTracks.length,
      totalDuration,
    };
  }, [filteredTracks, selectedTrackIds]);

  return (
    <div className="h-6 flex items-center justify-between px-3 bg-slate-100 border-t border-slate-200 text-[10px] text-slate-500">
      {/* Left: Track Count and Duration */}
      <div className="flex items-center gap-4">
        {isScanning ? (
          <div className="flex items-center gap-2">
            <svg className="w-3 h-3 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-indigo-600">Scanning... {scanProgress}%</span>
          </div>
        ) : (
          <>
            <span>
              {stats.displayCount} track{stats.displayCount !== 1 ? 's' : ''}
              {stats.displayCount !== tracks.length && ` (${tracks.length} total)`}
            </span>
            <span className="text-slate-300">|</span>
            <span>Total: {formatTotalDuration(stats.totalDuration)}</span>
          </>
        )}
      </div>

      {/* Center: Selected Items Info */}
      {selectedStats && (
        <div className="flex items-center gap-2 text-indigo-600">
          <span>
            {selectedStats.count} selected - {formatTotalDuration(selectedStats.totalDuration)}
          </span>
        </div>
      )}

      {/* Right: Library Info */}
      <div className="flex items-center gap-4">
        <span className="text-slate-400">Library: {tracks.length} tracks</span>
      </div>
    </div>
  );
}
