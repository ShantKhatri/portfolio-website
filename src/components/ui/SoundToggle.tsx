"use client"
import { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { soundEngine } from '@/lib/soundEngine';

const SoundToggle: React.FC = () => {
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const unsub = soundEngine.onMuteChange(setMuted);
    return () => { unsub(); };
  }, []);

  return (
    <button
      onClick={() => {
        soundEngine.toggle();
        soundEngine.playClick();
      }}
      className="fixed bottom-6 left-6 z-50 p-3 rounded-full bg-gray-900/80 backdrop-blur-md border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 group shadow-lg shadow-purple-500/10"
      title={muted ? 'Enable sound effects' : 'Mute sound effects'}
      aria-label={muted ? 'Enable sound effects' : 'Mute sound effects'}
    >
      {muted ? (
        <VolumeX className="w-5 h-5 text-gray-500 group-hover:text-purple-400 transition-colors" />
      ) : (
        <Volume2 className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors animate-pulse" />
      )}
    </button>
  );
};

export default SoundToggle;
