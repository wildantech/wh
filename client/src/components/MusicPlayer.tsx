import { useEffect, useRef } from "react";
import { useGallery } from "../context/GalleryContext";

const MusicPlayer = () => {
  const { musicPlaying, toggleMusic, volume, setVolume } = useGallery();
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (musicPlaying) {
        audioRef.current.play().catch(error => {
          console.log('Playback prevented by browser policy:', error);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [musicPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white bg-opacity-95 shadow-lg py-3 px-4 z-10 border-t border-pink-100">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <button 
            className="bg-[#FF6B8B] text-white w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:translate-y-[-2px] transition-transform"
            onClick={toggleMusic}
          >
            {musicPlaying ? (
              <i className="fas fa-pause"></i>
            ) : (
              <i className="fas fa-play"></i>
            )}
          </button>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-800">Musik Romantis</p>
            <p className="text-xs text-gray-500">
              {musicPlaying ? "Musik sedang diputar" : "Klik untuk mainkan"}
            </p>
          </div>
        </div>
        
        <div className="flex items-center">
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={volume} 
            onChange={handleVolumeChange}
            className="w-24 mr-2"
            style={{ accentColor: "#FF6B8B" }}
          />
          <span className="text-xs text-gray-500">{volume}%</span>
        </div>
      </div>
      <audio ref={audioRef} loop>
        <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default MusicPlayer;
