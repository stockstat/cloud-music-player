import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Track, RepeatMode, ShuffleMode, SkinType } from '../types';

interface PlayerStore {
  // State
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  queue: Track[];
  queueIndex: number;
  originalQueue: Track[];
  repeatMode: RepeatMode;
  shuffleMode: ShuffleMode;
  skin: SkinType;
  isEqualizerOpen: boolean;
  isPlaylistOpen: boolean;

  // Actions
  setCurrentTrack: (track: Track | null) => void;
  setIsPlaying: (playing: boolean) => void;
  togglePlayPause: () => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setQueue: (tracks: Track[], startIndex?: number) => void;
  addToQueue: (track: Track) => void;
  playNext: (track: Track) => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setRepeatMode: (mode: RepeatMode) => void;
  cycleRepeatMode: () => void;
  toggleShuffle: () => void;
  setSkin: (skin: SkinType) => void;
  toggleEqualizer: () => void;
  togglePlaylist: () => void;
  clearQueue: () => void;
}

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentTrack: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 0.75,
      isMuted: false,
      queue: [],
      queueIndex: -1,
      originalQueue: [],
      repeatMode: 'off',
      shuffleMode: 'off',
      skin: 'modern',
      isEqualizerOpen: false,
      isPlaylistOpen: true,

      // Actions
      setCurrentTrack: (track) => set({ currentTrack: track }),

      setIsPlaying: (playing) => set({ isPlaying: playing }),

      togglePlayPause: () => set((state) => ({ isPlaying: !state.isPlaying })),

      setCurrentTime: (time) => set({ currentTime: time }),

      setDuration: (duration) => set({ duration }),

      setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)), isMuted: false }),

      toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

      setQueue: (tracks, startIndex = 0) => {
        const queue = get().shuffleMode === 'on' ? shuffleArray(tracks) : tracks;
        const track = queue[startIndex] || null;
        set({
          queue,
          originalQueue: tracks,
          queueIndex: startIndex,
          currentTrack: track,
          isPlaying: track !== null,
          currentTime: 0,
        });
      },

      addToQueue: (track) => set((state) => ({
        queue: [...state.queue, track],
        originalQueue: [...state.originalQueue, track],
      })),

      playNext: (track) => set((state) => {
        const newQueue = [...state.queue];
        newQueue.splice(state.queueIndex + 1, 0, track);
        return { queue: newQueue };
      }),

      nextTrack: () => {
        const { queue, queueIndex, repeatMode } = get();
        if (queue.length === 0) return;

        let nextIndex = queueIndex + 1;

        if (repeatMode === 'one') {
          set({ currentTime: 0, isPlaying: true });
          return;
        }

        if (nextIndex >= queue.length) {
          if (repeatMode === 'all') {
            nextIndex = 0;
          } else {
            set({ isPlaying: false });
            return;
          }
        }

        set({
          queueIndex: nextIndex,
          currentTrack: queue[nextIndex],
          currentTime: 0,
          isPlaying: true,
        });
      },

      previousTrack: () => {
        const { queue, queueIndex, currentTime } = get();
        if (queue.length === 0) return;

        // If more than 3 seconds in, restart current track
        if (currentTime > 3) {
          set({ currentTime: 0 });
          return;
        }

        let prevIndex = queueIndex - 1;
        if (prevIndex < 0) {
          prevIndex = queue.length - 1;
        }

        set({
          queueIndex: prevIndex,
          currentTrack: queue[prevIndex],
          currentTime: 0,
          isPlaying: true,
        });
      },

      setRepeatMode: (mode) => set({ repeatMode: mode }),

      cycleRepeatMode: () => set((state) => {
        const modes: RepeatMode[] = ['off', 'all', 'one'];
        const currentIndex = modes.indexOf(state.repeatMode);
        const nextIndex = (currentIndex + 1) % modes.length;
        return { repeatMode: modes[nextIndex] };
      }),

      toggleShuffle: () => set((state) => {
        if (state.shuffleMode === 'off') {
          // Enable shuffle
          const currentTrack = state.currentTrack;
          let shuffled = shuffleArray(state.originalQueue);

          // Move current track to front if exists
          if (currentTrack) {
            shuffled = shuffled.filter(t => t.id !== currentTrack.id);
            shuffled.unshift(currentTrack);
          }

          return {
            shuffleMode: 'on',
            queue: shuffled,
            queueIndex: 0,
          };
        } else {
          // Disable shuffle - restore original order
          const currentTrack = state.currentTrack;
          const originalIndex = currentTrack
            ? state.originalQueue.findIndex(t => t.id === currentTrack.id)
            : 0;

          return {
            shuffleMode: 'off',
            queue: state.originalQueue,
            queueIndex: Math.max(0, originalIndex),
          };
        }
      }),

      setSkin: (skin) => set({ skin }),

      toggleEqualizer: () => set((state) => ({ isEqualizerOpen: !state.isEqualizerOpen })),

      togglePlaylist: () => set((state) => ({ isPlaylistOpen: !state.isPlaylistOpen })),

      clearQueue: () => set({
        queue: [],
        originalQueue: [],
        queueIndex: -1,
        currentTrack: null,
        isPlaying: false,
        currentTime: 0,
        duration: 0,
      }),
    }),
    {
      name: 'cloud-music-player-storage',
      partialize: (state) => ({
        volume: state.volume,
        repeatMode: state.repeatMode,
        shuffleMode: state.shuffleMode,
        skin: state.skin,
      }),
    }
  )
);
