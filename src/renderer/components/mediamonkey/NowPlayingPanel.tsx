import { usePlayerStore } from '../../store/playerStore';

interface NowPlayingPanelProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

function formatDuration(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function NowPlayingPanel({ isCollapsed = false, onToggleCollapse }: NowPlayingPanelProps) {
  const { currentTrack, queue, queueIndex } = usePlayerStore();

  if (isCollapsed) {
    return (
      <button
        onClick={onToggleCollapse}
        className="h-full w-8 flex flex-col items-center justify-center bg-white border-l border-slate-200 hover:bg-slate-50 transition-colors"
      >
        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-[9px] text-slate-400 mt-2 writing-vertical">Now Playing</span>
      </button>
    );
  }

  const upNextTracks = queue.slice(queueIndex + 1, queueIndex + 6);

  return (
    <div className="w-64 flex flex-col bg-white border-l border-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200 bg-slate-50">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Now Playing</span>
        <button
          onClick={onToggleCollapse}
          className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Current Track */}
      {currentTrack ? (
        <div className="p-4 border-b border-slate-200">
          {/* Album Art */}
          <div className="aspect-square rounded-lg overflow-hidden bg-slate-100 mb-3 shadow-md">
            {currentTrack.artwork ? (
              <img
                src={currentTrack.artwork}
                alt={currentTrack.album || 'Album artwork'}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-400 to-purple-500">
                <svg className="w-16 h-16 text-white/30" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
              </div>
            )}
          </div>

          {/* Track Info */}
          <div className="text-center">
            <h3 className="text-sm font-semibold text-slate-700 truncate">{currentTrack.title}</h3>
            <p className="text-xs text-slate-500 truncate">{currentTrack.artist}</p>
            <p className="text-[10px] text-slate-400 truncate">{currentTrack.album}</p>
          </div>

          {/* Track Details */}
          <div className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
            {currentTrack.genre && (
              <div className="flex items-center gap-1">
                <span className="text-slate-400">Genre:</span>
                <span className="text-slate-500 truncate">{currentTrack.genre}</span>
              </div>
            )}
            {currentTrack.year && (
              <div className="flex items-center gap-1">
                <span className="text-slate-400">Year:</span>
                <span className="text-slate-500">{currentTrack.year}</span>
              </div>
            )}
            {currentTrack.bitrate && (
              <div className="flex items-center gap-1">
                <span className="text-slate-400">Bitrate:</span>
                <span className="text-slate-500">{currentTrack.bitrate} kbps</span>
              </div>
            )}
            {currentTrack.format && (
              <div className="flex items-center gap-1">
                <span className="text-slate-400">Format:</span>
                <span className="text-slate-500">{currentTrack.format}</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-4 text-center border-b border-slate-200">
          <div className="w-20 h-20 mx-auto rounded-lg bg-slate-100 flex items-center justify-center mb-3">
            <svg className="w-10 h-10 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
          </div>
          <p className="text-xs text-slate-400">No track playing</p>
        </div>
      )}

      {/* Up Next Queue */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-3 py-2 bg-slate-50">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Up Next</span>
          {queue.length > 0 && (
            <span className="text-[10px] text-slate-400 ml-2">
              ({queueIndex + 1} of {queue.length})
            </span>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {upNextTracks.length === 0 ? (
            <div className="px-3 py-4 text-center">
              <p className="text-[10px] text-slate-400 italic">No more tracks in queue</p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {upNextTracks.map((track, index) => (
                <div
                  key={`${track.id}-${index}`}
                  className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 transition-colors"
                >
                  {/* Mini Album Art */}
                  <div className="w-8 h-8 rounded overflow-hidden flex-shrink-0 bg-slate-100">
                    {track.artwork ? (
                      <img
                        src={track.artwork}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Track Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-slate-700 truncate">{track.title}</p>
                    <p className="text-[10px] text-slate-400 truncate">{track.artist}</p>
                  </div>

                  {/* Duration */}
                  <span className="text-[10px] text-slate-400 flex-shrink-0">
                    {formatDuration(track.duration)}
                  </span>
                </div>
              ))}
              {queue.length - queueIndex - 1 > 5 && (
                <div className="px-3 py-2 text-center">
                  <span className="text-[10px] text-slate-400">
                    +{queue.length - queueIndex - 6} more tracks
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
