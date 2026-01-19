import { usePlayerStore } from '../../store/playerStore';
import { useLibraryStore } from '../../store/libraryStore';
import { TitleBar } from '../../components/TitleBar';
import { PlaybackControls } from '../../components/PlaybackControls';
import { ProgressBar } from '../../components/ProgressBar';
import { VolumeControl } from '../../components/VolumeControl';
import { TrackList } from '../../components/TrackList';
import { FileOpener } from '../../components/FileOpener';
import './winamp.css';

interface WinampSkinProps {
  onSeek: (time: number) => void;
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function WinampSkin({ onSeek }: WinampSkinProps) {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    repeatMode,
    shuffleMode,
    cycleRepeatMode,
    toggleShuffle,
  } = usePlayerStore();

  const { tracks } = useLibraryStore();

  return (
    <div className="h-full flex flex-col items-center justify-center bg-[#3a3a5c] p-4">
      <div className="winamp-container flex flex-col gap-[2px]">
        {/* Main Window */}
        <div className="winamp-main w-[275px] bg-[#232336] border-2 border-t-[#4a4a6a] border-l-[#4a4a6a] border-b-[#1a1a2a] border-r-[#1a1a2a]">
          {/* Title Bar */}
          <TitleBar variant="winamp" />

          {/* Display Area */}
          <div className="p-[3px]">
            <div className="winamp-display bg-[#0a0a14] border-2 border-t-[#1a1a2a] border-l-[#1a1a2a] border-b-[#4a4a6a] border-r-[#4a4a6a] p-2">
              {/* Time Display */}
              <div className="flex items-start gap-2 mb-2">
                <div className="winamp-lcd bg-[#0a0a0a] px-2 py-1 border border-[#2a2a4a]">
                  <span className="font-lcd text-lg text-[#00ff00] tracking-wider">
                    {formatTime(currentTime)}
                  </span>
                </div>
                <div className="flex-1">
                  {/* Visualization placeholder */}
                  <div className="h-[20px] bg-[#0a0a0a] border border-[#2a2a4a] flex items-end justify-center gap-[1px] px-1">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className="w-[4px] bg-gradient-to-t from-[#00ff00] to-[#ffff00] transition-all"
                        style={{
                          height: isPlaying ? `${Math.random() * 100}%` : '10%',
                          opacity: isPlaying ? 1 : 0.3,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Track Info Marquee */}
              <div className="winamp-marquee bg-[#0a0a0a] border border-[#2a2a4a] px-2 py-1 mb-2 overflow-hidden">
                <div className={`whitespace-nowrap text-[10px] text-[#00ff00] ${isPlaying ? 'animate-marquee' : ''}`}>
                  {currentTrack
                    ? `${currentTrack.artist ? currentTrack.artist + ' - ' : ''}${currentTrack.title}    ***    ${currentTrack.album || 'Unknown Album'}    ***    `
                    : 'CLOUD MUSIC PLAYER - Winamp Classic Skin    ***    Open files to start playing    ***    '}
                </div>
              </div>

              {/* Bitrate/Frequency Info */}
              <div className="flex items-center justify-between text-[8px] text-[#00aa00] mb-2">
                <span>{currentTrack?.bitrate ? `${currentTrack.bitrate}kbps` : '---kbps'}</span>
                <span>{currentTrack?.sampleRate ? `${currentTrack.sampleRate / 1000}kHz` : '--kHz'}</span>
                <span>{currentTrack?.format || '---'}</span>
                <span>{shuffleMode === 'on' ? 'SHUF' : ''}</span>
                <span>{repeatMode !== 'off' ? (repeatMode === 'one' ? 'REP1' : 'REP') : ''}</span>
              </div>

              {/* Progress Bar */}
              <ProgressBar onSeek={onSeek} variant="winamp" />
            </div>
          </div>

          {/* Controls Area */}
          <div className="px-[3px] pb-[3px]">
            <div className="flex items-center justify-between gap-2 bg-[#2a2a3c] p-2 border border-[#3a3a5c]">
              {/* Playback Controls */}
              <PlaybackControls variant="winamp" />

              {/* Volume & Balance */}
              <div className="flex flex-col gap-1">
                <VolumeControl variant="winamp" />
                <div className="flex items-center gap-1">
                  <span className="text-[8px] text-[#00aa00]">BAL</span>
                  <div className="w-[50px] h-[6px] bg-[#0a0a0a] border border-[#3a3a5c]">
                    <div className="w-[2px] h-full bg-[#00ff00] mx-auto" />
                  </div>
                </div>
              </div>

              {/* Shuffle/Repeat */}
              <div className="flex flex-col gap-1">
                <button
                  onClick={toggleShuffle}
                  className={`winamp-btn text-[8px] px-2 py-[2px] ${
                    shuffleMode === 'on'
                      ? 'bg-[#00aa00] text-black'
                      : 'bg-[#3a3a5c] text-[#00aa00]'
                  } border-t border-l border-[#5a5a7c] border-b border-r border-[#1a1a2c]`}
                >
                  SHUF
                </button>
                <button
                  onClick={cycleRepeatMode}
                  className={`winamp-btn text-[8px] px-2 py-[2px] ${
                    repeatMode !== 'off'
                      ? 'bg-[#00aa00] text-black'
                      : 'bg-[#3a3a5c] text-[#00aa00]'
                  } border-t border-l border-[#5a5a7c] border-b border-r border-[#1a1a2c]`}
                >
                  {repeatMode === 'one' ? 'REP1' : 'REP'}
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Buttons */}
          <div className="px-[3px] pb-[3px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[2px]">
                <button className="winamp-btn w-[23px] h-[12px] bg-[#3a3a5c] border-t border-l border-[#5a5a7c] border-b border-r border-[#1a1a2c] text-[7px] text-[#00ff00]">
                  EQ
                </button>
                <button className="winamp-btn w-[23px] h-[12px] bg-[#00aa00] border-t border-l border-[#5a5a7c] border-b border-r border-[#1a1a2c] text-[7px] text-black">
                  PL
                </button>
              </div>
              <FileOpener variant="winamp" />
            </div>
          </div>
        </div>

        {/* Playlist Window */}
        <div className="winamp-playlist w-[275px] h-[232px] bg-[#232336] border-2 border-t-[#4a4a6a] border-l-[#4a4a6a] border-b-[#1a1a2a] border-r-[#1a1a2a] flex flex-col">
          {/* Playlist Title Bar */}
          <div className="h-[14px] bg-gradient-to-b from-[#1e3a5f] to-[#0a1628] flex items-center justify-between px-1">
            <span className="text-[8px] text-[#4080ff] font-bold">CLOUD MUSIC PLAYER - PLAYLIST</span>
            <div className="flex items-center gap-[2px]">
              <button className="w-[9px] h-[9px] bg-[#1e3a5f] border border-[#4080ff] text-[6px] text-[#4080ff]">
                -
              </button>
            </div>
          </div>

          {/* Playlist Content */}
          <div className="flex-1 flex flex-col p-[3px] min-h-0">
            <TrackList tracks={tracks} variant="winamp" />
          </div>

          {/* Playlist Footer */}
          <div className="h-[18px] bg-[#2a2a3c] border-t border-[#3a3a5c] flex items-center justify-between px-2">
            <span className="text-[8px] text-[#00aa00]">
              {tracks.length} track{tracks.length !== 1 ? 's' : ''}
            </span>
            <span className="text-[8px] text-[#00aa00]">
              {currentTrack ? `Playing: ${currentTrack.title.slice(0, 20)}${currentTrack.title.length > 20 ? '...' : ''}` : 'Stopped'}
            </span>
          </div>
        </div>
      </div>

      {/* Winamp branding */}
      <div className="mt-4 text-center">
        <p className="text-[10px] text-[#4a4a6a]">
          Cloud Music Player • Winamp Classic Skin
        </p>
        <p className="text-[8px] text-[#3a3a5a] mt-1">
          "It really whips the llama's ass!"
        </p>
      </div>
    </div>
  );
}
