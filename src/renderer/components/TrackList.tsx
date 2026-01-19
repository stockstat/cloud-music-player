import { usePlayerStore } from '../store/playerStore';
import type { Track } from '../types';

interface TrackListProps {
  tracks: Track[];
  variant?: 'modern' | 'winamp';
  onTrackSelect?: (track: Track, index: number) => void;
}

function formatDuration(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function TrackList({ tracks, variant = 'modern', onTrackSelect }: TrackListProps) {
  const { currentTrack, setQueue } = usePlayerStore();

  const handleTrackClick = (track: Track, index: number) => {
    if (onTrackSelect) {
      onTrackSelect(track, index);
    } else {
      setQueue(tracks, index);
    }
  };

  if (variant === 'winamp') {
    return (
      <div className="flex-1 overflow-y-auto bg-[#0a0a0a] border border-[#3a3a5c]">
        {tracks.length === 0 ? (
          <div className="flex items-center justify-center h-full text-[#00aa00] text-[10px]">
            No tracks - Open files or connect cloud
          </div>
        ) : (
          tracks.map((track, index) => (
            <div
              key={track.id}
              onClick={() => handleTrackClick(track, index)}
              className={`flex items-center gap-2 px-2 py-1 cursor-pointer text-[10px] ${
                currentTrack?.id === track.id
                  ? 'bg-[#0000aa] text-white'
                  : 'text-[#00ff00] hover:bg-[#1a1a3a]'
              }`}
            >
              <span className="w-6 text-right text-[#00aa00]">{index + 1}.</span>
              <span className="flex-1 truncate">
                {track.artist ? `${track.artist} - ` : ''}{track.title}
              </span>
              <span className="text-[#00aa00]">{formatDuration(track.duration)}</span>
            </div>
          ))
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {tracks.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-app-text-muted">
          <svg className="w-16 h-16 mb-4 opacity-50" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
          </svg>
          <p className="text-lg font-medium mb-2">No tracks yet</p>
          <p className="text-sm">Open audio files or connect your cloud storage</p>
        </div>
      ) : (
        <table className="w-full">
          <thead className="sticky top-0 bg-app-surface z-10">
            <tr className="text-left text-xs text-app-text-muted uppercase tracking-wide border-b border-app-surface-light">
              <th className="px-4 py-3 w-12">#</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3 hidden md:table-cell">Artist</th>
              <th className="px-4 py-3 hidden lg:table-cell">Album</th>
              <th className="px-4 py-3 w-16 text-right">Duration</th>
            </tr>
          </thead>
          <tbody>
            {tracks.map((track, index) => (
              <tr
                key={track.id}
                onClick={() => handleTrackClick(track, index)}
                className={`group cursor-pointer transition-colors ${
                  currentTrack?.id === track.id
                    ? 'bg-app-accent/20 text-app-accent'
                    : 'hover:bg-app-surface-light'
                }`}
              >
                <td className="px-4 py-3 text-sm text-app-text-muted">
                  {currentTrack?.id === track.id ? (
                    <span className="text-app-accent">▶</span>
                  ) : (
                    <span className="group-hover:hidden">{index + 1}</span>
                  )}
                  {currentTrack?.id !== track.id && (
                    <span className="hidden group-hover:inline text-app-accent">▶</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {track.artwork ? (
                      <img
                        src={track.artwork}
                        alt=""
                        className="w-10 h-10 rounded object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded bg-app-surface-light flex items-center justify-center">
                        <span className="text-app-text-muted">♪</span>
                      </div>
                    )}
                    <span className="font-medium truncate">{track.title}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-app-text-muted hidden md:table-cell truncate">
                  {track.artist || 'Unknown Artist'}
                </td>
                <td className="px-4 py-3 text-app-text-muted hidden lg:table-cell truncate">
                  {track.album || 'Unknown Album'}
                </td>
                <td className="px-4 py-3 text-right text-sm text-app-text-muted">
                  {formatDuration(track.duration)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
