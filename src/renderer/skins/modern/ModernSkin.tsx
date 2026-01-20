import { useState, useCallback } from 'react';
import { usePlayerStore } from '../../store/playerStore';
import { useLibraryStore, AlbumInfo, ArtistInfo } from '../../store/libraryStore';
import { TitleBar } from '../../components/TitleBar';
import { PlaybackControls } from '../../components/PlaybackControls';
import { ProgressBar } from '../../components/ProgressBar';
import { VolumeControl } from '../../components/VolumeControl';
import { CloudBrowser } from '../../components/CloudBrowser';
import {
  TreeNavigation,
  ColumnTrackList,
  AlbumGrid,
  ArtistList,
  GenreList,
  YearList,
  StatusBar,
  Toolbar,
  NowPlayingPanel,
} from '../../components/mediamonkey';

interface ModernSkinProps {
  onSeek: (time: number) => void;
}

export function ModernSkin({ onSeek }: ModernSkinProps) {
  const {
    currentTrack,
    repeatMode,
    shuffleMode,
    cycleRepeatMode,
    toggleShuffle,
    queue,
    setQueue,
  } = usePlayerStore();

  const {
    tracks,
    currentView,
    selectedArtist,
    selectedAlbum,
    selectedPlaylistId,
    playlists,
    getFilteredTracks,
    getArtists,
    getAlbums,
    getGenres,
    getYears,
    setCurrentView,
    setSelectedArtist,
    setSelectedAlbum,
    setSelectedGenre,
    setSelectedYear,
  } = useLibraryStore();

  const [showNowPlaying, setShowNowPlaying] = useState(true);
  const [showCloudBrowser, setShowCloudBrowser] = useState(false);
  const [albumViewMode, setAlbumViewMode] = useState<'list' | 'grid'>('grid');
  const [selectedAlbumDetail, setSelectedAlbumDetail] = useState<AlbumInfo | null>(null);

  const filteredTracks = getFilteredTracks();
  const artists = getArtists();
  const albums = getAlbums();
  const genres = getGenres();
  const years = getYears();

  // Get tracks to display based on current view
  const getDisplayTracks = useCallback(() => {
    if (currentView === 'nowPlaying') {
      return queue;
    }
    if (currentView === 'playlist' && selectedPlaylistId) {
      const playlist = playlists.find(p => p.id === selectedPlaylistId);
      return playlist?.tracks || [];
    }
    return filteredTracks;
  }, [currentView, queue, selectedPlaylistId, playlists, filteredTracks]);

  const displayTracks = getDisplayTracks();

  const handleArtistClick = useCallback((artist: ArtistInfo) => {
    setSelectedArtist(artist.name);
    setSelectedAlbum(null);
    setCurrentView('songs');
  }, [setSelectedArtist, setSelectedAlbum, setCurrentView]);

  const handleAlbumClick = useCallback((album: AlbumInfo) => {
    if (albumViewMode === 'grid') {
      setSelectedAlbumDetail(album);
    } else {
      setSelectedAlbum(album.name);
      setSelectedArtist(album.artist);
      setCurrentView('songs');
    }
  }, [albumViewMode, setSelectedAlbum, setSelectedArtist, setCurrentView]);

  const handleGenreClick = useCallback((genre: string) => {
    setSelectedGenre(genre);
    setCurrentView('songs');
  }, [setSelectedGenre, setCurrentView]);

  const handleYearClick = useCallback((year: number) => {
    setSelectedYear(year);
    setCurrentView('songs');
  }, [setSelectedYear, setCurrentView]);

  const handleBackFromAlbumDetail = useCallback(() => {
    setSelectedAlbumDetail(null);
  }, []);

  const handleAlbumDetailViewTracks = useCallback(() => {
    if (selectedAlbumDetail) {
      setSelectedAlbum(selectedAlbumDetail.name);
      setSelectedArtist(selectedAlbumDetail.artist);
      setCurrentView('songs');
      setSelectedAlbumDetail(null);
    }
  }, [selectedAlbumDetail, setSelectedAlbum, setSelectedArtist, setCurrentView]);

  // Render main content based on current view
  const renderMainContent = () => {
    // Album detail view
    if (selectedAlbumDetail) {
      return (
        <div className="flex-1 flex flex-col h-full bg-[#1a1a2a]">
          {/* Album Header */}
          <div className="flex items-start gap-4 p-4 bg-gradient-to-b from-[#2a2a3a] to-[#1a1a2a]">
            <button
              onClick={handleBackFromAlbumDetail}
              className="p-1 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="w-32 h-32 rounded-lg overflow-hidden shadow-xl flex-shrink-0">
              {selectedAlbumDetail.artwork ? (
                <img
                  src={selectedAlbumDetail.artwork}
                  alt={selectedAlbumDetail.name}
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

            <div className="flex-1 min-w-0 pt-2">
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Album</p>
              <h2 className="text-xl font-bold text-white truncate">{selectedAlbumDetail.name}</h2>
              <p className="text-sm text-gray-400">{selectedAlbumDetail.artist}</p>
              <p className="text-xs text-gray-500 mt-1">
                {selectedAlbumDetail.trackCount} track{selectedAlbumDetail.trackCount !== 1 ? 's' : ''}
                {selectedAlbumDetail.year && ` - ${selectedAlbumDetail.year}`}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => {
                    if (selectedAlbumDetail.tracks.length > 0) {
                      setQueue(selectedAlbumDetail.tracks, 0);
                    }
                  }}
                  className="px-4 py-1.5 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded transition-colors flex items-center gap-1"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  Play All
                </button>
                <button
                  onClick={handleAlbumDetailViewTracks}
                  className="px-4 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                >
                  View in Library
                </button>
              </div>
            </div>
          </div>

          {/* Album Tracks */}
          <ColumnTrackList tracks={selectedAlbumDetail.tracks} />
        </div>
      );
    }

    switch (currentView) {
      case 'artists':
        return <ArtistList artists={artists} onArtistClick={handleArtistClick} />;

      case 'albums':
        if (albumViewMode === 'grid') {
          return <AlbumGrid albums={albums} onAlbumClick={handleAlbumClick} />;
        }
        return (
          <div className="flex-1 overflow-y-auto bg-[#1a1a2a]">
            {albums.map((album, index) => (
              <button
                key={`${album.name}__${album.artist}`}
                onClick={() => handleAlbumClick(album)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${
                  index % 2 === 0 ? 'bg-[#1a1a2a]' : 'bg-[#1e1e2e]'
                } hover:bg-[#2a2a3a]`}
              >
                <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0 bg-[#2a2a3a]">
                  {album.artwork ? (
                    <img src={album.artwork} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/>
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{album.name}</p>
                  <p className="text-[10px] text-gray-500 truncate">{album.artist}</p>
                </div>
                <span className="text-[10px] text-gray-600">
                  {album.trackCount} track{album.trackCount !== 1 ? 's' : ''}
                </span>
              </button>
            ))}
          </div>
        );

      case 'genres':
        return <GenreList genres={genres} onGenreClick={handleGenreClick} />;

      case 'years':
        return <YearList years={years} onYearClick={handleYearClick} />;

      case 'songs':
      case 'nowPlaying':
      case 'playlist':
      default:
        return <ColumnTrackList tracks={displayTracks} />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#1a1a2a] text-gray-200">
      {/* Title Bar */}
      <TitleBar variant="modern" />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Tree Navigation */}
        <div className="w-52 flex-shrink-0">
          <TreeNavigation />

          {/* Cloud Browser Toggle */}
          <div className="border-t border-[#2a2a3a]">
            <button
              onClick={() => setShowCloudBrowser(!showCloudBrowser)}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-400 hover:text-white hover:bg-[#2a2a3a] transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
              </svg>
              <span>Cloud Storage</span>
              <svg
                className={`w-3 h-3 ml-auto transition-transform ${showCloudBrowser ? 'rotate-180' : ''}`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M7 10l5 5 5-5z"/>
              </svg>
            </button>
            {showCloudBrowser && (
              <div className="border-t border-[#2a2a3a] max-h-64 overflow-y-auto">
                <CloudBrowser variant="modern" />
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Toolbar */}
          <Toolbar
            currentView={currentView}
            viewMode={albumViewMode}
            onViewChange={setAlbumViewMode}
            showViewToggle={currentView === 'albums'}
          />

          {/* Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Track List / Grid View */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {renderMainContent()}
            </div>

            {/* Right Panel - Now Playing */}
            <NowPlayingPanel
              isCollapsed={!showNowPlaying}
              onToggleCollapse={() => setShowNowPlaying(!showNowPlaying)}
            />
          </div>

          {/* Status Bar */}
          <StatusBar
            trackCount={displayTracks.length}
            selectedCount={0}
          />
        </div>
      </div>

      {/* Player Bar */}
      <footer className="h-16 bg-[#252535] border-t border-[#2a2a3a] flex items-center px-4 gap-4">
        {/* Track Info (Mini) */}
        <div className="w-56 flex items-center gap-3 min-w-0">
          {currentTrack && (
            <>
              <div className="w-10 h-10 rounded overflow-hidden bg-[#2a2a3a] flex-shrink-0">
                {currentTrack.artwork ? (
                  <img src={currentTrack.artwork} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600">
                    <svg className="w-5 h-5 text-white/50" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                    </svg>
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{currentTrack.title}</p>
                <p className="text-[11px] text-gray-500 truncate">{currentTrack.artist}</p>
              </div>
            </>
          )}
        </div>

        {/* Center Controls */}
        <div className="flex-1 flex flex-col items-center gap-1 max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleShuffle}
              className={`w-7 h-7 flex items-center justify-center rounded transition-colors ${
                shuffleMode === 'on' ? 'text-green-400' : 'text-gray-500 hover:text-white'
              }`}
              title={`Shuffle: ${shuffleMode}`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
              </svg>
            </button>
            <PlaybackControls variant="modern" />
            <button
              onClick={cycleRepeatMode}
              className={`w-7 h-7 flex items-center justify-center rounded transition-colors ${
                repeatMode !== 'off' ? 'text-green-400' : 'text-gray-500 hover:text-white'
              }`}
              title={`Repeat: ${repeatMode}`}
            >
              {repeatMode === 'one' ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4zm-4-2V9h-1l-2 1v1h1.5v4H13z"/>
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
                </svg>
              )}
            </button>
          </div>
          <ProgressBar onSeek={onSeek} variant="modern" />
        </div>

        {/* Volume */}
        <div className="w-40 flex items-center justify-end">
          <VolumeControl variant="modern" />
        </div>
      </footer>
    </div>
  );
}
