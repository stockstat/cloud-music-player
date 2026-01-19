import { useCallback } from 'react';
import { useLibraryStore } from '../store/libraryStore';
import { usePlayerStore } from '../store/playerStore';
import type { Track } from '../types';

interface FileOpenerProps {
  variant?: 'modern' | 'winamp';
}

// Generate a simple ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

// Extract filename without extension as title
function extractTitle(filePath: string): string {
  const filename = filePath.split(/[/\\]/).pop() || 'Unknown';
  return filename.replace(/\.[^.]+$/, '');
}

export function FileOpener({ variant = 'modern' }: FileOpenerProps) {
  const { addTracks } = useLibraryStore();
  const { setQueue, queue } = usePlayerStore();

  const handleOpenFiles = useCallback(async () => {
    if (!window.electronAPI) return;

    const filePaths = await window.electronAPI.openFile();
    if (!filePaths || filePaths.length === 0) return;

    const newTracks: Track[] = filePaths.map((filePath) => ({
      id: generateId(),
      title: extractTitle(filePath),
      artist: 'Unknown Artist',
      album: 'Unknown Album',
      duration: 0, // Will be set when audio loads
      filePath,
      format: filePath.split('.').pop()?.toUpperCase() || 'AUDIO',
    }));

    addTracks(newTracks);

    // If no tracks in queue, start playing
    if (queue.length === 0) {
      setQueue(newTracks, 0);
    }
  }, [addTracks, setQueue, queue.length]);

  const handleOpenFolder = useCallback(async () => {
    if (!window.electronAPI) return;

    const folderPath = await window.electronAPI.openFolder();
    if (!folderPath) return;

    // Read directory and filter audio files
    const entries = await window.electronAPI.readDir(folderPath);
    const audioExtensions = ['mp3', 'flac', 'wav', 'ogg', 'm4a', 'aac', 'wma', 'opus', 'aiff'];

    const audioFiles = entries.filter(entry => {
      if (entry.isDirectory) return false;
      const ext = entry.name.split('.').pop()?.toLowerCase();
      return ext && audioExtensions.includes(ext);
    });

    const newTracks: Track[] = audioFiles.map((entry) => ({
      id: generateId(),
      title: extractTitle(entry.name),
      artist: 'Unknown Artist',
      album: 'Unknown Album',
      duration: 0,
      filePath: entry.path,
      format: entry.name.split('.').pop()?.toUpperCase() || 'AUDIO',
    }));

    addTracks(newTracks);

    if (queue.length === 0 && newTracks.length > 0) {
      setQueue(newTracks, 0);
    }
  }, [addTracks, setQueue, queue.length]);

  if (variant === 'winamp') {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={handleOpenFiles}
          className="winamp-btn px-2 py-1 bg-[#3a3a5c] border-t border-l border-[#5a5a7c] border-b border-r border-[#1a1a2c] text-[9px] text-[#00ff00] hover:text-white active:border-t-[#1a1a2c] active:border-l-[#1a1a2c] active:border-b-[#5a5a7c] active:border-r-[#5a5a7c]"
        >
          + FILE
        </button>
        <button
          onClick={handleOpenFolder}
          className="winamp-btn px-2 py-1 bg-[#3a3a5c] border-t border-l border-[#5a5a7c] border-b border-r border-[#1a1a2c] text-[9px] text-[#00ff00] hover:text-white active:border-t-[#1a1a2c] active:border-l-[#1a1a2c] active:border-b-[#5a5a7c] active:border-r-[#5a5a7c]"
        >
          + DIR
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleOpenFiles}
        className="flex items-center gap-2 px-4 py-2 bg-app-accent hover:bg-app-accent-hover text-white rounded-lg transition-colors text-sm font-medium"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Files
      </button>
      <button
        onClick={handleOpenFolder}
        className="flex items-center gap-2 px-4 py-2 bg-app-surface-light hover:bg-app-surface text-app-text rounded-lg transition-colors text-sm font-medium border border-app-surface-light"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
        Add Folder
      </button>
    </div>
  );
}
