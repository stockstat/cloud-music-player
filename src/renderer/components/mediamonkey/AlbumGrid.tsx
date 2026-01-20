import { useLibraryStore, AlbumInfo } from '../../store/libraryStore';

interface AlbumGridProps {
  albums: AlbumInfo[];
  onAlbumClick: (album: AlbumInfo) => void;
}

export function AlbumGrid({ albums, onAlbumClick }: AlbumGridProps) {
  if (albums.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-500 bg-[#1a1a2a]">
        <svg className="w-16 h-16 mb-4 opacity-30" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/>
        </svg>
        <p className="text-sm font-medium mb-1">No albums</p>
        <p className="text-xs text-gray-600">Add music to your library to see albums</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#1a1a2a] p-4">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-4">
        {albums.map((album) => (
          <button
            key={`${album.name}__${album.artist}`}
            onClick={() => onAlbumClick(album)}
            className="flex flex-col items-center p-3 rounded-lg hover:bg-[#2a2a3a] transition-colors group text-left"
          >
            {/* Album Cover */}
            <div className="w-full aspect-square rounded-md overflow-hidden bg-[#2a2a3a] mb-2 shadow-lg group-hover:shadow-xl transition-shadow">
              {album.artwork ? (
                <img
                  src={album.artwork}
                  alt={album.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#3a3a4a] to-[#2a2a3a]">
                  <svg className="w-12 h-12 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/>
                  </svg>
                </div>
              )}
            </div>

            {/* Album Info */}
            <div className="w-full min-w-0">
              <p className="text-xs font-medium text-white truncate">{album.name}</p>
              <p className="text-[10px] text-gray-500 truncate">{album.artist}</p>
              <p className="text-[10px] text-gray-600">
                {album.trackCount} track{album.trackCount !== 1 ? 's' : ''}
                {album.year && ` - ${album.year}`}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

interface AlbumDetailProps {
  album: AlbumInfo;
  onBack: () => void;
}

export function AlbumDetail({ album, onBack }: AlbumDetailProps) {
  const { setSelectedAlbum, setCurrentView } = useLibraryStore();

  const handleViewTracks = () => {
    setSelectedAlbum(album.name);
    setCurrentView('songs');
  };

  return (
    <div className="flex flex-col h-full bg-[#1a1a2a]">
      {/* Album Header */}
      <div className="flex items-start gap-4 p-4 bg-gradient-to-b from-[#2a2a3a] to-[#1a1a2a]">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="p-1 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Album Art */}
        <div className="w-32 h-32 rounded-lg overflow-hidden shadow-xl flex-shrink-0">
          {album.artwork ? (
            <img
              src={album.artwork}
              alt={album.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#3a3a4a] to-[#2a2a3a]">
              <svg className="w-12 h-12 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/>
              </svg>
            </div>
          )}
        </div>

        {/* Album Info */}
        <div className="flex-1 min-w-0 pt-2">
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Album</p>
          <h2 className="text-xl font-bold text-white truncate">{album.name}</h2>
          <p className="text-sm text-gray-400">{album.artist}</p>
          <p className="text-xs text-gray-500 mt-1">
            {album.trackCount} track{album.trackCount !== 1 ? 's' : ''}
            {album.year && ` - ${album.year}`}
          </p>
          <button
            onClick={handleViewTracks}
            className="mt-3 px-4 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
          >
            View Tracks
          </button>
        </div>
      </div>

      {/* Track List Preview */}
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Tracks</h3>
        <div className="space-y-1">
          {album.tracks.map((track, index) => (
            <div
              key={track.id}
              className="flex items-center gap-3 px-2 py-1.5 rounded hover:bg-[#2a2a3a] transition-colors"
            >
              <span className="w-6 text-right text-xs text-gray-500">
                {track.trackNumber || index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{track.title}</p>
              </div>
              <span className="text-xs text-gray-500">
                {formatDuration(track.duration)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function formatDuration(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
