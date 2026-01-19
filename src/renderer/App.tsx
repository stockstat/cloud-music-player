import { usePlayerStore } from './store/playerStore';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { ModernSkin } from './skins/modern/ModernSkin';
import { WinampSkin } from './skins/winamp/WinampSkin';

function App() {
  const { skin } = usePlayerStore();
  const { seek } = useAudioPlayer();

  return (
    <div className="h-full">
      {skin === 'modern' ? (
        <ModernSkin onSeek={seek} />
      ) : (
        <WinampSkin onSeek={seek} />
      )}
    </div>
  );
}

export default App;
