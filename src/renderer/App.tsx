import { useAudioPlayer } from './hooks/useAudioPlayer';
import { ModernSkin } from './skins/modern/ModernSkin';

function App() {
  const { seek } = useAudioPlayer();

  return (
    <div className="h-full">
      <ModernSkin onSeek={seek} />
    </div>
  );
}

export default App;
