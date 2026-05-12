// components/media/AudioPlayer.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Shuffle,
  Download,
  Share2,
  Heart,
  List,
  Music,
  Headphones,
  Clock,
  Calendar,
  User,
  Mic2,
  Radio,
  Disc3,
  Library,
  Plus,
  Check,
  MoreHorizontal,
  PlayCircle,
  PauseCircle,
  ArrowLeft,
  ArrowRight,
  Maximize2,
  Minimize2
} from 'lucide-react';
import ReactPlayer from 'react-player';

const AudioPlayer = ({ playlist, currentTrack, onTrackChange }) => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [loop, setLoop] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [liked, setLiked] = useState({});
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [queue, setQueue] = useState([]);
  const [history, setHistory] = useState([]);
  const [visualizer, setVisualizer] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  const playerRef = useRef(null);
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);

    const tracks = playlist || [];  const track = currentTrack || tracks[0];

  // Visualiseur audio
  useEffect(() => {
    if (visualizer && playerRef.current) {
      const audio = playerRef.current.getInternalPlayer();
      
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        const source = audioContextRef.current.createMediaElementSource(audio);
        source.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
          requestAnimationFrame(draw);
          analyserRef.current.getByteFrequencyData(dataArray);
          
          ctx.fillStyle = 'hsl(var(--b2))';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          const barWidth = (canvas.width / bufferLength) * 2.5;
          let x = 0;
          
          for (let i = 0; i < bufferLength; i++) {
            const barHeight = dataArray[i] / 2;
            ctx.fillStyle = `hsl(var(--a) / ${barHeight / 200})`;
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            x += barWidth + 1;
          }
        };
        
        draw();
      }
    }
  }, [visualizer]);

  // Formatage du temps
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Gestionnaire de progression
  const handleProgress = (state) => {
    setPlayed(state.played);
    setCurrentTime(state.playedSeconds);
  };

  // Gestionnaire de durée
  const handleDuration = (duration) => {
    setDuration(duration);
  };

  // Lecture suivante
  const playNext = () => {
    if (shuffle) {
      const randomIndex = Math.floor(Math.random() * tracks.length);
      onTrackChange(tracks[randomIndex]);
    } else {
      const currentIndex = tracks.findIndex(t => t.id === track.id);
      const nextIndex = (currentIndex + 1) % tracks.length;
      onTrackChange(tracks[nextIndex]);
    }
  };

  // Lecture précédente
  const playPrevious = () => {
    const currentIndex = tracks.findIndex(t => t.id === track.id);
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    onTrackChange(tracks[prevIndex]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-300">
      {/* Lecteur principal */}
      <div className="fixed bottom-0 left-0 right-0 bg-base-100 border-t border-base-300 shadow-2xl z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            {/* Pochette album */}
            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={track.cover}
                alt={track.title}
                className="w-full h-full object-cover"
              />
              {playing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="w-1 h-8 bg-accent animate-pulse" />
                </div>
              )}
            </div>

            {/* Infos track */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold truncate">{track.title}</h4>
              <p className="text-sm text-base-content/50 truncate">{track.artist}</p>
            </div>

            {/* Contrôles */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShuffle(!shuffle)}
                className={`p-2 rounded-full hover:bg-base-200 transition-colors ${
                  shuffle ? 'text-accent' : ''
                }`}
              >
                <Shuffle className="w-5 h-5" />
              </button>

              <button
                onClick={playPrevious}
                className="p-2 rounded-full hover:bg-base-200 transition-colors"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              <button
                onClick={() => setPlaying(!playing)}
                className="w-12 h-12 bg-accent rounded-full flex items-center justify-center hover:scale-105 transition-transform"
              >
                {playing ? (
                  <Pause className="w-6 h-6 text-white" />
                ) : (
                  <Play className="w-6 h-6 text-white ml-1" />
                )}
              </button>

              <button
                onClick={playNext}
                className="p-2 rounded-full hover:bg-base-200 transition-colors"
              >
                <SkipForward className="w-5 h-5" />
              </button>

              <button
                onClick={() => setLoop(!loop)}
                className={`p-2 rounded-full hover:bg-base-200 transition-colors ${
                  loop ? 'text-accent' : ''
                }`}
              >
                <Repeat className="w-5 h-5" />
              </button>
            </div>

            {/* Barre de progression */}
            <div className="flex-1 max-w-md">
              <div className="flex items-center gap-2">
                <span className="text-xs text-base-content/50">
                  {formatTime(currentTime)}
                </span>
                <div className="flex-1 relative group/progress">
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step="any"
                    value={played}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      setPlayed(value);
                      playerRef.current.seekTo(value);
                    }}
                    className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="w-full h-1 bg-base-300 rounded-full">
                    <div
                      className="h-full bg-accent rounded-full relative"
                      style={{ width: `${played * 100}%` }}
                    >
                      <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-accent rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>
                <span className="text-xs text-base-content/50">
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMuted(!muted)}
                className="p-2 rounded-full hover:bg-base-200 transition-colors"
              >
                {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step="any"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-20 accent-accent"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setLiked({...liked, [track.id]: !liked[track.id]})}
                className={`p-2 rounded-full hover:bg-base-200 transition-colors ${
                  liked[track.id] ? 'text-red-500' : ''
                }`}
              >
                <Heart className={`w-5 h-5 ${liked[track.id] ? 'fill-current' : ''}`} />
              </button>

              <button className="p-2 rounded-full hover:bg-base-200 transition-colors">
                <Download className="w-5 h-5" />
              </button>

              <button className="p-2 rounded-full hover:bg-base-200 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>

              <button
                onClick={() => setShowPlaylist(!showPlaylist)}
                className={`p-2 rounded-full hover:bg-base-200 transition-colors ${
                  showPlaylist ? 'bg-base-200 text-accent' : ''
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Lecteur caché */}
        <ReactPlayer
          ref={playerRef}
          url={track.url}
          playing={playing}
          volume={volume}
          muted={muted}
          loop={loop}
          playbackRate={playbackRate}
          onProgress={handleProgress}
          onDuration={handleDuration}
          onEnded={playNext}
          width={0}
          height={0}
          config={{
            file: {
              forceAudio: true
            }
          }}
        />
      </div>

      {/* Playlist */}
      <AnimatePresence>
        {showPlaylist && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 right-4 w-96 bg-base-100 rounded-2xl shadow-2xl border border-base-300 z-40 max-h-[500px] overflow-hidden"
          >
            <div className="p-4 border-b border-base-300">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">File d'attente</h3>
                <span className="text-sm text-base-content/50">
                  {tracks.length} titres
                </span>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[400px]">
              {tracks.map((t, index) => (
                <div
                  key={t.id}
                  onClick={() => onTrackChange(t)}
                  className={`flex items-center gap-3 p-3 hover:bg-base-200 cursor-pointer transition-colors ${
                    t.id === track.id ? 'bg-accent/10' : ''
                  }`}
                >
                  <span className="text-sm text-base-content/50 w-6 text-right">
                    {index + 1}
                  </span>
                  <img
                    src={t.cover}
                    alt={t.title}
                    className="w-10 h-10 rounded object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{t.title}</p>
                    <p className="text-xs text-base-content/50 truncate">{t.artist}</p>
                  </div>
                  <span className="text-xs text-base-content/50">
                    {formatTime(t.duration)}
                  </span>
                  {t.id === track.id && playing && (
                    <div className="w-1 h-8 bg-accent animate-pulse" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AudioPlayer;