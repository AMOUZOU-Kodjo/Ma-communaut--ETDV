// components/media/VideoPlayer.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Dans VideoPlayer.jsx - CORRECTION FINALE
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  Subtitles,
  PictureInPicture,
  Download,
  Share2,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Bookmark,
  Flag,
  MoreVertical,
  PlayCircle,
  PauseCircle,
  SkipBack,
  SkipForward,
  RotateCcw,
  RotateCw,
  Film,
  Headphones,
  AlertCircle,
  Check,
  Copy,
  Youtube,
  MessageSquare,  // Used for WhatsApp sharing
  Link,
  Clock,
  Calendar,
  Eye,
  Heart,
  X
} from 'lucide-react';
import ReactPlayer from 'react-player';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const VideoPlayer = ({ video, relatedVideos, onVideoChange }) => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [pip, setPip] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [quality, setQuality] = useState('auto');
  const [subtitles, setSubtitles] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showMoreDescription, setShowMoreDescription] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentPage, setCommentPage] = useState(1);
  
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const controlsTimeout = useRef(null);
  const videoRef = useRef(null);

  // Données simulées
  const videoData = video || {
    id: 'video-1',
    title: 'Enseignement sur la foi - Pasteur Jean',
    description: `Dans cette vidéo, nous explorons les fondements de la foi chrétienne à travers les Écritures. 
    
Découvrez comment renforcer votre relation avec Dieu et vivre une vie de foi victorieuse.

**Chapitres :**
0:00 - Introduction
3:45 - Qu'est-ce que la foi ?
10:20 - Exemples bibliques de foi
18:30 - Comment développer sa foi
25:15 - Témoignages
30:00 - Prière finale

#foi #enseignement #bible #christianisme`,
    url: 'https://www.youtube.com/watch?v=YnCuqwnhS0k',
    thumbnail: 'https://img.youtube.com/vi/YnCuqwnhS0k/maxresdefault.jpg',
    views: 15420,
    likes: 1234,
    dislikes: 23,
    date: '2024-03-15',
    channel: {
      name: 'Temple du Dieu Vivant',
      subscribers: 15000,
      avatar: '/channel-avatar.jpg',
      verified: true
    },
    tags: ['foi', 'enseignement biblique', 'prière'],
    category: 'Enseignement'
  };

  // Contrôles automatiques
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(controlsTimeout.current);
      controlsTimeout.current = setTimeout(() => {
        if (playing) setShowControls(false);
      }, 3000);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', () => setShowControls(true));
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', () => setShowControls(true));
      }
      clearTimeout(controlsTimeout.current);
    };
  }, [playing]);

  // Gestionnaire de progression
  const handleProgress = (state) => {
    if (!seeking) {
      setPlayed(state.played);
      setCurrentTime(state.playedSeconds);
    }
  };

  // Gestionnaire de durée
  const handleDuration = (duration) => {
    setDuration(duration);
  };

  // Formatage du temps
  const formatTime = (seconds) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  // Gestionnaire de recherche
  const handleSeekChange = (e) => {
    setPlayed(parseFloat(e.target.value));
    setCurrentTime(parseFloat(e.target.value) * duration);
  };

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekMouseUp = (e) => {
    setSeeking(false);
    playerRef.current.seekTo(parseFloat(e.target.value));
  };

  // Plein écran
  const toggleFullscreen = () => {
    if (!fullscreen) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setFullscreen(!fullscreen);
  };

  // Picture in Picture
  const togglePip = () => {
    if (videoRef.current) {
      if (!pip) {
        videoRef.current.requestPictureInPicture();
      } else {
        document.exitPictureInPicture();
      }
      setPip(!pip);
    }
  };

  // Commentaires simulés
  useEffect(() => {
    setComments([
      {
        id: 1,
        user: 'Marie K.',
        avatar: null,
        comment: 'Excellent enseignement ! Merci pasteur 🙏',
        date: '2024-03-18T10:30:00',
        likes: 45,
        replies: [
          {
            id: 11,
            user: 'Jean P.',
            comment: 'Totalement d\'accord, très édificant !',
            date: '2024-03-18T11:15:00',
            likes: 12
          }
        ]
      },
      {
        id: 2,
        user: 'Thomas N.',
        avatar: null,
        comment: 'Dieu vous bénisse pour ce message puissant',
        date: '2024-03-17T15:20:00',
        likes: 23,
        replies: []
      }
    ]);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
      {/* Colonne principale - Vidéo */}
      <div className="lg:col-span-2 space-y-4">
        {/* Lecteur vidéo */}
        <div
          ref={containerRef}
          className="relative aspect-video bg-black rounded-2xl overflow-hidden group"
        >
          <ReactPlayer
            ref={playerRef}
            url={videoData.url}
            width="100%"
            height="100%"
            playing={playing}
            volume={volume}
            muted={muted}
            playbackRate={playbackRate}
            onProgress={handleProgress}
            onDuration={handleDuration}
            style={{ position: 'absolute', top: 0, left: 0 }}
            config={{
              youtube: {
                playerVars: {
                  modestbranding: 1,
                  rel: 0,
                  showinfo: 0
                }
              }
            }}
          />

          {/* Overlay de lecture/pause */}
          <AnimatePresence>
            {!playing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50 flex items-center justify-center"
              >
                <button
                  onClick={() => setPlaying(true)}
                  className="w-20 h-20 bg-accent rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <Play className="w-10 h-10 text-white ml-1" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Contrôles */}
          <AnimatePresence>
            {showControls && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4"
              >
                {/* Barre de progression */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-white text-sm">{formatTime(currentTime)}</span>
                  <div className="flex-1 relative group/progress">
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step="any"
                      value={played}
                      onMouseDown={handleSeekMouseDown}
                      onMouseUp={handleSeekMouseUp}
                      onChange={handleSeekChange}
                      className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="w-full h-1 bg-white/30 rounded-full">
                      <div
                        className="h-full bg-accent rounded-full relative"
                        style={{ width: `${played * 100}%` }}
                      >
                        <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-accent rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </div>
                  <span className="text-white text-sm">{formatTime(duration)}</span>
                </div>

                {/* Boutons de contrôle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPlaying(!playing)}
                      className="p-2 hover:bg-white/20 rounded-full transition-colors text-white"
                    >
                      {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                    </button>

                    <button
                      onClick={() => setMuted(!muted)}
                      className="p-2 hover:bg-white/20 rounded-full transition-colors text-white"
                    >
                      {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>

                    <div className="flex items-center gap-1">
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
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPlaybackRate(playbackRate === 2 ? 1 : playbackRate + 0.25)}
                      className="px-2 py-1 bg-white/20 rounded text-white text-sm hover:bg-white/30 transition-colors"
                    >
                      {playbackRate}x
                    </button>

                    <button
                      onClick={togglePip}
                      className="p-2 hover:bg-white/20 rounded-full transition-colors text-white"
                    >
                      <PictureInPicture className="w-5 h-5" />
                    </button>

                    <button
                      onClick={toggleFullscreen}
                      className="p-2 hover:bg-white/20 rounded-full transition-colors text-white"
                    >
                      {fullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Informations vidéo */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">{videoData.title}</h1>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <img
                    src={videoData.channel.avatar}
                    alt={videoData.channel.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">{videoData.channel.name}</span>
                    {videoData.channel.verified && (
                      <Check className="w-4 h-4 text-accent" />
                    )}
                  </div>
                  <span className="text-sm text-base-content/50">
                    {videoData.channel.subscribers} abonnés
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSubscribed(!subscribed)}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  subscribed
                    ? 'bg-base-300 text-base-content hover:bg-base-400'
                    : 'bg-accent text-white hover:bg-accent/80'
                }`}
              >
                {subscribed ? 'Abonné' : "S'abonner"}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-base-200 rounded-full overflow-hidden">
                <button
                  onClick={() => {
                    setLiked(!liked);
                    if (disliked) setDisliked(false);
                  }}
                  className={`flex items-center gap-1 px-4 py-2 hover:bg-base-300 transition-colors ${
                    liked ? 'text-accent' : ''
                  }`}
                >
                  <ThumbsUp className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                  <span>{videoData.likes + (liked ? 1 : 0)}</span>
                </button>
                <div className="w-px h-6 bg-base-300" />
                <button
                  onClick={() => {
                    setDisliked(!disliked);
                    if (liked) setLiked(false);
                  }}
                  className={`p-2 hover:bg-base-300 transition-colors ${
                    disliked ? 'text-red-500' : ''
                  }`}
                >
                  <ThumbsDown className={`w-5 h-5 ${disliked ? 'fill-current' : ''}`} />
                </button>
              </div>

              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="p-2 bg-base-200 rounded-full hover:bg-base-300 transition-colors relative"
              >
                <Share2 className="w-5 h-5" />
                
                <AnimatePresence>
                  {showShareMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute bottom-full right-0 mb-2 bg-base-100 rounded-xl shadow-2xl p-2 w-48"
                    >
                      <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-base-200 rounded-lg">
                        <MessageSquare className="w-4 h-4 text-blue-600" />
                        Facebook
                      </button>
                      <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-base-200 rounded-lg">
                        <MessageSquare className="w-4 h-4 text-sky-500" />
                        Twitter
                      </button>
                      <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-base-200 rounded-lg">
                        <MessageSquare className="w-4 h-4 text-green-500" />
                        WhatsApp
                      </button>
                      <div className="border-t my-1" />
                      <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-base-200 rounded-lg">
                        <Link className="w-4 h-4" />
                        Copier le lien
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

              <button className="p-2 bg-base-200 rounded-full hover:bg-base-300 transition-colors">
                <Download className="w-5 h-5" />
              </button>

              <button className="p-2 bg-base-200 rounded-full hover:bg-base-300 transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="bg-base-200 rounded-xl p-4">
            <div className="flex items-center gap-4 text-sm text-base-content/50 mb-2">
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {videoData.views.toLocaleString()} vues
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDistanceToNow(new Date(videoData.date), { addSuffix: true, locale: fr })}
              </span>
            </div>

            <div className="whitespace-pre-line">
              {showMoreDescription
                ? videoData.description
                : videoData.description.split('\n')[0]}
            </div>

            {videoData.description.split('\n').length > 1 && (
              <button
                onClick={() => setShowMoreDescription(!showMoreDescription)}
                className="text-accent hover:underline mt-2 text-sm"
              >
                {showMoreDescription ? 'Voir moins' : 'Voir plus'}
              </button>
            )}

            <div className="flex flex-wrap gap-2 mt-4">
              {videoData.tags.map((tag, i) => (
                <span key={i} className="text-sm text-accent hover:underline cursor-pointer">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Commentaires */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {comments.length} commentaires
            </h3>

            {/* Ajouter un commentaire */}
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex-shrink-0" />
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Ajouter un commentaire..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full bg-transparent border-b border-base-300 pb-2 focus:outline-none focus:border-accent"
                />
                {newComment && (
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      onClick={() => setNewComment('')}
                      className="px-4 py-1 hover:bg-base-200 rounded-full text-sm"
                    >
                      Annuler
                    </button>
                    <button className="px-4 py-1 bg-accent text-white rounded-full text-sm">
                      Commenter
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Liste des commentaires */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{comment.user}</span>
                      <span className="text-xs text-base-content/50">
                        {formatDistanceToNow(new Date(comment.date), { addSuffix: true, locale: fr })}
                      </span>
                    </div>
                    <p className="text-sm mb-2">{comment.comment}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <button className="flex items-center gap-1 hover:text-accent">
                        <ThumbsUp className="w-4 h-4" />
                        {comment.likes}
                      </button>
                      <button className="hover:text-accent">Répondre</button>
                    </div>

                    {/* Réponses */}
                    {comment.replies.length > 0 && (
                      <div className="ml-8 mt-4 space-y-3">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-accent/20 flex-shrink-0" />
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold">{reply.user}</span>
                                <span className="text-xs text-base-content/50">
                                  {formatDistanceToNow(new Date(reply.date), { addSuffix: true, locale: fr })}
                                </span>
                              </div>
                              <p className="text-sm">{reply.comment}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button className="text-accent hover:underline text-sm">
              Voir plus de commentaires
            </button>
          </div>
        </div>
      </div>

      {/* Colonne latérale - Vidéos suggérées */}
      <div className="space-y-4">
        <h3 className="font-semibold">Vidéos suggérées</h3>
        
        <div className="space-y-3">
          {relatedVideos?.map((video) => (
            <div
              key={video.id}
              onClick={() => onVideoChange?.(video)}
              className="flex gap-2 cursor-pointer hover:bg-base-200 p-2 rounded-lg transition-colors"
            >
              <div className="relative w-40 h-24 flex-shrink-0">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover rounded-lg"
                />
                <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                  {video.duration}
                </span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm line-clamp-2">{video.title}</h4>
                <p className="text-xs text-base-content/50 mt-1">{video.channel}</p>
                <div className="flex items-center gap-2 text-xs text-base-content/50 mt-1">
                  <span>{video.views} vues</span>
                  <span>•</span>
                  <span>{video.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;