/// <reference types="vite/client" />

interface ElectronAPI {
  minimize: () => Promise<void>;
  maximize: () => Promise<void>;
  close: () => Promise<void>;
  openFile: () => Promise<string[]>;
  openFolder: () => Promise<string>;
  readDir: (path: string) => Promise<Array<{ name: string; isDirectory: boolean; path: string }>>;
  readFile: (path: string) => Promise<Buffer | null>;
  platform: string;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};
