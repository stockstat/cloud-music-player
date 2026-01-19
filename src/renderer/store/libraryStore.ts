import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Track, Playlist, CloudAccount } from '../types';

interface LibraryStore {
  // State
  tracks: Track[];
  playlists: Playlist[];
  cloudAccounts: CloudAccount[];
  isScanning: boolean;
  scanProgress: number;
  currentFolder: string | null;

  // Actions
  addTrack: (track: Track) => void;
  addTracks: (tracks: Track[]) => void;
  removeTrack: (id: string) => void;
  clearTracks: () => void;

  createPlaylist: (name: string) => Playlist;
  deletePlaylist: (id: string) => void;
  addToPlaylist: (playlistId: string, track: Track) => void;
  removeFromPlaylist: (playlistId: string, trackId: string) => void;
  renamePlaylist: (id: string, name: string) => void;

  addCloudAccount: (account: CloudAccount) => void;
  removeCloudAccount: (id: string) => void;

  setScanning: (scanning: boolean) => void;
  setScanProgress: (progress: number) => void;
  setCurrentFolder: (folder: string | null) => void;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export const useLibraryStore = create<LibraryStore>()(
  persist(
    (set, get) => ({
      // Initial state
      tracks: [],
      playlists: [],
      cloudAccounts: [],
      isScanning: false,
      scanProgress: 0,
      currentFolder: null,

      // Track actions
      addTrack: (track) => set((state) => {
        if (state.tracks.some(t => t.id === track.id)) {
          return state;
        }
        return { tracks: [...state.tracks, track] };
      }),

      addTracks: (tracks) => set((state) => {
        const existingIds = new Set(state.tracks.map(t => t.id));
        const newTracks = tracks.filter(t => !existingIds.has(t.id));
        return { tracks: [...state.tracks, ...newTracks] };
      }),

      removeTrack: (id) => set((state) => ({
        tracks: state.tracks.filter(t => t.id !== id),
      })),

      clearTracks: () => set({ tracks: [] }),

      // Playlist actions
      createPlaylist: (name) => {
        const playlist: Playlist = {
          id: generateId(),
          name,
          tracks: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ playlists: [...state.playlists, playlist] }));
        return playlist;
      },

      deletePlaylist: (id) => set((state) => ({
        playlists: state.playlists.filter(p => p.id !== id),
      })),

      addToPlaylist: (playlistId, track) => set((state) => ({
        playlists: state.playlists.map(p => {
          if (p.id !== playlistId) return p;
          if (p.tracks.some(t => t.id === track.id)) return p;
          return {
            ...p,
            tracks: [...p.tracks, track],
            updatedAt: new Date(),
          };
        }),
      })),

      removeFromPlaylist: (playlistId, trackId) => set((state) => ({
        playlists: state.playlists.map(p => {
          if (p.id !== playlistId) return p;
          return {
            ...p,
            tracks: p.tracks.filter(t => t.id !== trackId),
            updatedAt: new Date(),
          };
        }),
      })),

      renamePlaylist: (id, name) => set((state) => ({
        playlists: state.playlists.map(p =>
          p.id === id ? { ...p, name, updatedAt: new Date() } : p
        ),
      })),

      // Cloud account actions
      addCloudAccount: (account) => set((state) => ({
        cloudAccounts: [...state.cloudAccounts, account],
      })),

      removeCloudAccount: (id) => set((state) => ({
        cloudAccounts: state.cloudAccounts.filter(a => a.id !== id),
      })),

      // Scanning actions
      setScanning: (scanning) => set({ isScanning: scanning }),
      setScanProgress: (progress) => set({ scanProgress: progress }),
      setCurrentFolder: (folder) => set({ currentFolder: folder }),
    }),
    {
      name: 'cloud-music-library-storage',
      partialize: (state) => ({
        tracks: state.tracks,
        playlists: state.playlists,
        cloudAccounts: state.cloudAccounts.map(a => ({
          ...a,
          accessToken: '', // Don't persist tokens in local storage
          refreshToken: '',
        })),
      }),
    }
  )
);
