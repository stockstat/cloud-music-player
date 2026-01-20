import { useState, useRef, useCallback, useEffect } from 'react';
import { usePlayerStore } from '../../store/playerStore';
import { useLibraryStore } from '../../store/libraryStore';
import type { Track } from '../../types';
import './winamp.css';

interface WinampSkinProps {
  onSeek: (time: number) => void;
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatTimeShort(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

export function WinampSkin({ onSeek }: WinampSkinProps) {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    repeatMode,
    shuffleMode,
    isEqualizerOpen,
    isPlaylistOpen,
    setIsPlaying,
    togglePlayPause,
    nextTrack,
    previousTrack,
    cycleRepeatMode,
    toggleShuffle,
    setVolume,
    toggleMute,
    setQueue,
    toggleEqualizer,
    togglePlaylist,
    setCurrentTime,
  } = usePlayerStore();

  const { tracks, addTracks } = useLibraryStore();
  const { queue } = usePlayerStore();

  // Local state
  const [balance, setBalance] = useState(0);
  const [eqBands, setEqBands] = useState<number[]>([50, 50, 50, 50, 50, 50, 50, 50, 50, 50]);
  const [preamp, setPreamp] = useState(50);
  const [eqEnabled, setEqEnabled] = useState(true);
  const [eqAuto, setEqAuto] = useState(false);
  const [marqueeOffset, setMarqueeOffset] = useState(0);
  const [isDraggingSeek, setIsDraggingSeek] = useState(false);
  const [seekDragTime, setSeekDragTime] = useState(0);

  // Refs
  const seekRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);
  const balanceRef = useRef<HTMLDivElement>(null);

  // Marquee animation
  useEffect(() => {
    if (!isPlaying || !currentTrack) return;
    const interval = setInterval(() => {
      setMarqueeOffset((prev) => prev + 1);
    }, 150);
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack]);

  // Get marquee text
  const getMarqueeText = () => {
    if (!currentTrack) {
      return 'Winamp 2.81 - ***  ';
    }
    const artist = currentTrack.artist || '';
    const title = currentTrack.title || 'Unknown';
    return `${artist ? artist + ' - ' : ''}${title}  ***  `;
  };

  // Seek handling
  const handleSeekMouseDown = useCallback((e: React.MouseEvent) => {
    if (!seekRef.current || !duration) return;
    setIsDraggingSeek(true);

    const updateSeek = (clientX: number) => {
      const rect = seekRef.current!.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percent = x / rect.width;
      setSeekDragTime(percent * duration);
    };

    updateSeek(e.clientX);

    const handleMouseMove = (e: MouseEvent) => updateSeek(e.clientX);
    const handleMouseUp = (e: MouseEvent) => {
      const rect = seekRef.current!.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const percent = x / rect.width;
      onSeek(percent * duration);
      setIsDraggingSeek(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [duration, onSeek]);

  // Volume handling
  const handleVolumeMouseDown = useCallback((e: React.MouseEvent) => {
    if (!volumeRef.current) return;

    const updateVolume = (clientX: number) => {
      const rect = volumeRef.current!.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      setVolume(x / rect.width);
    };

    updateVolume(e.clientX);

    const handleMouseMove = (e: MouseEvent) => updateVolume(e.clientX);
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [setVolume]);

  // Balance handling
  const handleBalanceMouseDown = useCallback((e: React.MouseEvent) => {
    if (!balanceRef.current) return;

    const updateBalance = (clientX: number) => {
      const rect = balanceRef.current!.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      setBalance(((x / rect.width) - 0.5) * 2);
    };

    updateBalance(e.clientX);

    const handleMouseMove = (e: MouseEvent) => updateBalance(e.clientX);
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, []);

  // File handling
  const handleOpenFiles = useCallback(async () => {
    if (!window.electronAPI) return;
    const filePaths = await window.electronAPI.openFile();
    if (!filePaths || filePaths.length === 0) return;

    try {
      const metadataResults = await window.electronAPI.parseMetadataMultiple(filePaths);
      const newTracks: Track[] = filePaths.map((filePath, index) => {
        const metadata = metadataResults[index];
        return {
          id: generateId(),
          title: metadata?.title || filePath.split('/').pop()?.replace(/\.[^/.]+$/, '') || 'Unknown',
          artist: metadata?.artist || '',
          album: metadata?.album || '',
          duration: metadata?.duration || 0,
          filePath,
          artwork: metadata?.artwork,
          genre: metadata?.genre,
          year: metadata?.year,
          trackNumber: metadata?.trackNumber,
          bitrate: metadata?.bitrate,
          sampleRate: metadata?.sampleRate,
          format: metadata?.format || 'MP3',
        };
      });

      addTracks(newTracks);
      if (queue.length === 0 && newTracks.length > 0) {
        setQueue(newTracks, 0);
      }
    } catch (error) {
      console.error('Error loading files:', error);
    }
  }, [addTracks, queue.length, setQueue]);

  const handleTrackClick = (track: Track, index: number) => {
    setQueue(tracks, index);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // Calculate positions
  const seekPosition = duration > 0 ? ((isDraggingSeek ? seekDragTime : currentTime) / duration) * 100 : 0;
  const volumePosition = (isMuted ? 0 : volume) * 100;
  const balancePosition = ((balance + 1) / 2) * 100;

  // Calculate total playlist time
  const totalPlaylistTime = tracks.reduce((acc, t) => acc + (t.duration || 0), 0);

  return (
    <div className="winamp-wrapper">
      <div className="winamp-container">
        {/* ===== MAIN PLAYER WINDOW ===== */}
        <div className="winamp-main">
          {/* Title Bar */}
          <div className="winamp-titlebar">
            <div className="winamp-titlebar-left">
              <div className="winamp-menu-btn" title="Winamp Menu"></div>
            </div>
            <div className="winamp-titlebar-title">
              <span className="winamp-titlebar-text">WINAMP</span>
            </div>
            <div className="winamp-titlebar-buttons">
              <button className="winamp-btn-minimize" title="Minimize">_</button>
              <button className="winamp-btn-shade" title="Shade Mode"></button>
              <button className="winamp-btn-close" title="Close">x</button>
            </div>
          </div>

          {/* Display Section */}
          <div className="winamp-display">
            {/* Visualization Area (placeholder) */}
            <div className="winamp-visualizer">
              {isPlaying && [...Array(19)].map((_, i) => (
                <div
                  key={i}
                  className="winamp-viz-bar"
                  style={{
                    height: `${Math.random() * 80 + 20}%`,
                    animationDelay: `${i * 50}ms`,
                  }}
                />
              ))}
            </div>

            {/* Time Display */}
            <div className="winamp-time-display">
              <div className="winamp-time-minutes">
                {Math.floor((isDraggingSeek ? seekDragTime : currentTime) / 60).toString().padStart(2, ' ')}
              </div>
              <div className="winamp-time-colon">:</div>
              <div className="winamp-time-seconds">
                {Math.floor((isDraggingSeek ? seekDragTime : currentTime) % 60).toString().padStart(2, '0')}
              </div>
            </div>

            {/* Status indicators - Play/Pause/Stop */}
            <div className="winamp-status-display">
              {isPlaying ? (
                <div className="winamp-status-play"></div>
              ) : currentTrack ? (
                <div className="winamp-status-pause"></div>
              ) : (
                <div className="winamp-status-stop"></div>
              )}
            </div>

            {/* Stereo/Mono Indicator */}
            <div className="winamp-stereo-mono">
              <span className={`winamp-stereo ${currentTrack ? 'active' : ''}`}>STEREO</span>
              <span className="winamp-mono">MONO</span>
            </div>

            {/* Bitrate/kHz Display */}
            <div className="winamp-kbps-khz">
              <div className="winamp-kbps">
                <span className="winamp-kbps-value">{currentTrack?.bitrate || '128'}</span>
                <span className="winamp-kbps-label">KBPS</span>
              </div>
              <div className="winamp-khz">
                <span className="winamp-khz-value">{currentTrack?.sampleRate ? Math.round(currentTrack.sampleRate / 1000) : '44'}</span>
                <span className="winamp-khz-label">KHZ</span>
              </div>
            </div>

            {/* Volume Bar Visual */}
            <div className="winamp-volume-visual">
              {[...Array(28)].map((_, i) => (
                <div
                  key={i}
                  className={`winamp-volume-bar ${i < Math.floor(volumePosition / 3.6) ? 'active' : ''}`}
                />
              ))}
            </div>

            {/* Balance Bar Visual */}
            <div className="winamp-balance-visual">
              {[...Array(28)].map((_, i) => {
                const center = 14;
                const balanceIndex = Math.floor(balancePosition / 3.6);
                const isActive = balance === 0
                  ? i >= center - 1 && i <= center
                  : balance > 0
                    ? i >= center && i <= balanceIndex
                    : i >= balanceIndex && i <= center;
                return (
                  <div
                    key={i}
                    className={`winamp-balance-bar ${isActive ? 'active' : ''}`}
                  />
                );
              })}
            </div>

            {/* Song Title Marquee */}
            <div className="winamp-song-title">
              <div
                className="winamp-song-title-text"
                style={{ transform: `translateX(-${marqueeOffset % (getMarqueeText().length * 6)}px)` }}
              >
                {getMarqueeText().repeat(3)}
              </div>
            </div>

            {/* Position Slider */}
            <div className="winamp-posbar" ref={seekRef} onMouseDown={handleSeekMouseDown}>
              <div className="winamp-posbar-track"></div>
              <div
                className="winamp-posbar-thumb"
                style={{ left: `${Math.min(seekPosition, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Controls Section */}
          <div className="winamp-controls">
            {/* Transport Buttons */}
            <div className="winamp-transport">
              <button className="winamp-btn-prev" onClick={previousTrack} title="Previous">
                <span></span>
              </button>
              <button className="winamp-btn-play" onClick={togglePlayPause} title="Play">
                <span></span>
              </button>
              <button className="winamp-btn-pause" onClick={togglePlayPause} title="Pause">
                <span></span>
              </button>
              <button className="winamp-btn-stop" onClick={handleStop} title="Stop">
                <span></span>
              </button>
              <button className="winamp-btn-next" onClick={nextTrack} title="Next">
                <span></span>
              </button>
              <button className="winamp-btn-eject" onClick={handleOpenFiles} title="Open File">
                <span></span>
              </button>
            </div>

            {/* Shuffle/Repeat */}
            <div className="winamp-shuffle-repeat">
              <button
                className={`winamp-btn-shuffle ${shuffleMode === 'on' ? 'active' : ''}`}
                onClick={toggleShuffle}
                title="Shuffle"
              >
                S
              </button>
              <button
                className={`winamp-btn-repeat ${repeatMode !== 'off' ? 'active' : ''}`}
                onClick={cycleRepeatMode}
                title={`Repeat: ${repeatMode}`}
              >
                R
              </button>
            </div>

            {/* EQ / Playlist Buttons */}
            <div className="winamp-eq-pl-buttons">
              <button
                className={`winamp-btn-eq ${isEqualizerOpen ? 'active' : ''}`}
                onClick={toggleEqualizer}
                title="Equalizer"
              >
                EQ
              </button>
              <button
                className={`winamp-btn-pl ${isPlaylistOpen ? 'active' : ''}`}
                onClick={togglePlaylist}
                title="Playlist"
              >
                PL
              </button>
            </div>

            {/* Volume Slider */}
            <div className="winamp-volume-slider" ref={volumeRef} onMouseDown={handleVolumeMouseDown}>
              <div className="winamp-slider-track"></div>
              <div
                className="winamp-slider-thumb"
                style={{ left: `${volumePosition}%` }}
              ></div>
            </div>

            {/* Balance Slider */}
            <div className="winamp-balance-slider" ref={balanceRef} onMouseDown={handleBalanceMouseDown}>
              <div className="winamp-slider-track"></div>
              <div
                className="winamp-slider-thumb"
                style={{ left: `${balancePosition}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* ===== EQUALIZER WINDOW ===== */}
        {isEqualizerOpen && (
          <div className="winamp-equalizer">
            <div className="winamp-eq-titlebar">
              <div className="winamp-eq-title">WINAMP EQUALIZER</div>
              <button className="winamp-btn-close-small" onClick={toggleEqualizer}>x</button>
            </div>

            <div className="winamp-eq-controls">
              {/* ON / AUTO buttons */}
              <div className="winamp-eq-toggles">
                <button
                  className={`winamp-eq-on ${eqEnabled ? 'active' : ''}`}
                  onClick={() => setEqEnabled(!eqEnabled)}
                >
                  ON
                </button>
                <button
                  className={`winamp-eq-auto ${eqAuto ? 'active' : ''}`}
                  onClick={() => setEqAuto(!eqAuto)}
                >
                  AUTO
                </button>
              </div>

              {/* Presets */}
              <button className="winamp-eq-presets">PRESETS</button>

              {/* Preamp */}
              <div className="winamp-eq-preamp">
                <div className="winamp-eq-slider-container">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={preamp}
                    onChange={(e) => setPreamp(Number(e.target.value))}
                    className="winamp-eq-slider-input"
                    orient="vertical"
                  />
                  <div className="winamp-eq-slider-track">
                    <div
                      className="winamp-eq-slider-fill"
                      style={{ height: `${preamp}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* EQ Bands */}
              <div className="winamp-eq-bands">
                {['60', '170', '310', '600', '1K', '3K', '6K', '12K', '14K', '16K'].map((label, i) => (
                  <div key={i} className="winamp-eq-band">
                    <div className="winamp-eq-slider-container">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={eqBands[i]}
                        onChange={(e) => {
                          const newBands = [...eqBands];
                          newBands[i] = Number(e.target.value);
                          setEqBands(newBands);
                        }}
                        className="winamp-eq-slider-input"
                        orient="vertical"
                      />
                      <div className="winamp-eq-slider-track">
                        <div
                          className="winamp-eq-slider-fill"
                          style={{ height: `${eqBands[i]}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="winamp-eq-label">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== PLAYLIST WINDOW ===== */}
        {isPlaylistOpen && (
          <div className="winamp-playlist">
            <div className="winamp-pl-titlebar">
              <div className="winamp-pl-title">WINAMP PLAYLIST</div>
              <div className="winamp-pl-titlebar-buttons">
                <button className="winamp-btn-shade-small" title="Shade">-</button>
                <button className="winamp-btn-close-small" onClick={togglePlaylist}>x</button>
              </div>
            </div>

            {/* Playlist Content */}
            <div className="winamp-pl-content">
              <div className="winamp-pl-list">
                {tracks.length === 0 ? (
                  <div className="winamp-pl-empty">
                    -- Winamp playlist is empty --
                  </div>
                ) : (
                  tracks.map((track, index) => (
                    <div
                      key={track.id}
                      className={`winamp-pl-item ${currentTrack?.id === track.id ? 'selected' : ''}`}
                      onClick={() => handleTrackClick(track, index)}
                      onDoubleClick={() => handleTrackClick(track, index)}
                    >
                      <span className="winamp-pl-item-num">{index + 1}.</span>
                      <span className="winamp-pl-item-title">
                        {track.artist ? `${track.artist} - ` : ''}{track.title}
                      </span>
                      <span className="winamp-pl-item-time">{formatTimeShort(track.duration)}</span>
                    </div>
                  ))
                )}
              </div>

              {/* Playlist Scrollbar */}
              <div className="winamp-pl-scrollbar">
                <div className="winamp-pl-scrollbar-thumb"></div>
              </div>
            </div>

            {/* Playlist Footer */}
            <div className="winamp-pl-footer">
              {/* Left Buttons */}
              <div className="winamp-pl-buttons-left">
                <button className="winamp-pl-btn" onClick={handleOpenFiles}>ADD</button>
                <button className="winamp-pl-btn">REM</button>
                <button className="winamp-pl-btn">SEL</button>
                <button className="winamp-pl-btn">MISC</button>
              </div>

              {/* Time Display */}
              <div className="winamp-pl-time">
                <span className="winamp-pl-time-current">
                  {tracks.length} item{tracks.length !== 1 ? 's' : ''}
                </span>
                <span className="winamp-pl-time-total">
                  {formatTime(totalPlaylistTime)}
                </span>
              </div>

              {/* Right Buttons */}
              <div className="winamp-pl-buttons-right">
                <button className="winamp-pl-btn-list">LIST</button>
              </div>
            </div>

            {/* Resize Grip */}
            <div className="winamp-pl-resize"></div>
          </div>
        )}
      </div>
    </div>
  );
}
