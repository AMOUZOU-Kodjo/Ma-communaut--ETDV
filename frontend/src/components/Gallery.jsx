import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Image as ImageIcon,
  Video,
  Music,
  Download,
  Calendar,
  Eye,
  X,
  Maximize2,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Film,
  Headphones,
  Camera,
  Heart,
  Share2,
  Volume2,
  VolumeX,
  Info,
  Grid,
  List,
  Filter,
  Search,
  Loader,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Copy,
  Check,
  Trash2,
  Edit,
  Plus,
  Upload,
  AlertCircle,
  Youtube,
} from "lucide-react";
import { api } from "../context/AuthContext";
import NavBar from "./NavBar";
import Footer from "./Footer";
import toast, { Toaster } from "react-hot-toast";
import ReactPlayer from "react-player";

// ==================== FONCTIONS POUR SOUNDCLOUD ====================
const isSoundCloudUrl = (url) => {
  return url?.includes("soundcloud.com") || url?.includes("snd.sc");
};
// ==================== FONCTIONS UTILITAIRES POUR YOUTUBE ====================
const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;

  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?]+)/,
    /youtube\.com\/embed\/([^?]+)/,
    /youtube\.com\/shorts\/([^?]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
  }

  return url;
};

const getYouTubeThumbnail = (url) => {
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?]+)/,
    /youtube\.com\/embed\/([^?]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
    }
  }
  return null;
};

const isYouTubeUrl = (url) => {
  return url?.includes("youtube.com") || url?.includes("youtu.be");
};

const parseTags = (tags) => {
  if (Array.isArray(tags)) return tags;
  if (typeof tags === "string" && tags) return tags.split(",").map((t) => t.trim()).filter(Boolean);
  return [];
};

// ==================== CONFIGURATION ====================
const GALLERY_CONFIG = {
  itemsPerPage: 12,
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  },
  colors: {
    photos: {
      primary: "from-blue-500 to-cyan-500",
      secondary: "from-blue-600/20 to-cyan-600/20",
      accent: "text-blue-500",
      bg: "bg-blue-500/10",
      hover: "hover:bg-blue-500/20",
    },
    videos: {
      primary: "from-red-500 to-orange-500",
      secondary: "from-red-600/20 to-orange-600/20",
      accent: "text-red-500",
      bg: "bg-red-500/10",
      hover: "hover:bg-red-500/20",
    },
    audios: {
      primary: "from-green-500 to-teal-500",
      secondary: "from-green-600/20 to-teal-600/20",
      accent: "text-green-500",
      bg: "bg-green-500/10",
      hover: "hover:bg-green-500/20",
    },
  },
  animationVariants: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
};

// ==================== COMPOSANT CARD ====================
const MediaCard = ({
  item,
  type,
  index,
  onOpen,
  onDownload,
  onLike,
  isLiked,
  isPlaying,
  onPlay,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const config = GALLERY_CONFIG.colors[type];
  const Icon =
    type === "photos" ? Camera : type === "videos" ? Film : Headphones;

  const isYouTubeUrl = (url) => {
    return url?.includes("youtube.com") || url?.includes("youtu.be");
  };

  const getYouTubeThumbnail = (url) => {
    const patterns = [
      /youtube\.com\/watch\?v=([^&]+)/,
      /youtu\.be\/([^?]+)/,
      /youtube\.com\/embed\/([^?]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
      }
    }
    return null;
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    try {
      if (navigator.share) {
        await navigator.share({
          title: item.titre,
          text: item.description,
          url: item.url,
        });
        toast.success("Partagé avec succès !");
      } else {
        await navigator.clipboard.writeText(item.url);
        toast.success("Lien copié !");
      }
    } catch (error) {
      toast.error("Erreur lors du partage");
    }
  };

  const isList = type === "videos" || type === "audios";

  return (
    <motion.div
      variants={GALLERY_CONFIG.animationVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`group relative bg-base-200 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer ${
        isList ? "flex flex-row" : ""
      }`}
      onClick={() => onOpen(item)}
    >
      {/* Bande de couleur */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${config.primary} z-10`}
      />

      {/* Aperçu */}
      <div className={`relative overflow-hidden ${isList ? "w-48 h-32 shrink-0" : "h-48 sm:h-56 lg:h-64"}`}>
        {type === "photos" && (
          <>
            <img
              src={item.url}
              alt={item.titre}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </>
        )}
        {type === "videos" && (
          <div className="relative w-full h-full">
            {isYouTubeUrl(item.url) ? (
              <>
                {/* Afficher la miniature YouTube */}
                <img
                  src={
                    getYouTubeThumbnail(item.url) ||
                    "https://img.youtube.com/vi/default.jpg"
                  }
                  alt={item.titre}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://img.youtube.com/vi/default.jpg";
                  }}
                />
                {/* Overlay avec bouton play */}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-10 h-10 bg-red-600/80 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 text-white ml-0.5" />
                  </div>
                </div>
                {/* Badge YouTube */}
                {!isList && (
                  <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                    <Youtube className="w-3 h-3" />
                    YouTube
                  </div>
                )}
              </>
            ) : (
              <>
                <video
                  src={item.url}
                  className="w-full h-full object-cover"
                  muted
                  loop
                  onMouseEnter={(e) => e.target.play()}
                  onMouseLeave={(e) => {
                    e.target.pause();
                    e.target.currentTime = 0;
                  }}
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-10 h-10 bg-primary/80 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 text-white ml-0.5" />
                  </div>
                </div>
              </>
            )}
          </div>
        )}
        
        {type === "audios" && (
          <div
            className={`relative w-full h-full bg-linear-to-br ${config.secondary}`}
          >
            {isSoundCloudUrl(item.url) ? (
              <>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-orange-500/80 rounded-full flex items-center justify-center">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                </div>
                <div className="absolute top-2 right-2 bg-orange-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                  <Headphones className="w-3 h-3" />
                  SoundCloud
                </div>
                {/* Vague audio décorative */}
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/50 to-transparent flex items-end justify-center gap-1 p-2">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-orange-500 rounded-t"
                      style={{ height: `${Math.random() * 30 + 10}%` }}
                    />
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex items-end space-x-1 h-24">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-1.5 rounded-t-full transition-all duration-300 ${
                          isPlaying ? "animate-pulse" : ""
                        }`}
                        style={{
                          height: `${Math.sin(i * 0.5) * 30 + 40}%`,
                          backgroundColor: isPlaying ? "#22c55e" : "#94a3b8",
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlay(item);
                    }}
                    className="w-16 h-16 bg-primary rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8 text-white" />
                    ) : (
                      <Play className="w-8 h-8 text-white ml-1" />
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
        {/* Badge de type */}
        {!isList && (
          <div
            className={`absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 z-10`}
          >
            <Icon className="w-3 h-3" />
            <span className="capitalize">{type}</span>
          </div>
        )}
        {/* Badge de durée */}
        {(type === "videos" || type === "audios") && item.duree && (
          <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
            {item.duree}
          </div>
        )}
        {/* Bouton téléchargement rapide */}
        {!isList && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDownload(item);
            }}
            className="absolute top-2 right-2 p-2 bg-black/50 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-black/70"
            title="Télécharger"
          >
            <Download className="w-4 h-4 text-white" />
          </button>
        )}
      </div>

      {/* Informations */}
      <div className={`${isList ? "flex-1 flex flex-col justify-center p-4" : "p-4"}`}>
        <div className="flex items-start justify-between mb-2">
          <h3 className={`font-bold truncate flex-1 ${isList ? "text-base" : ""}`}>{item.titre}</h3>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onLike(item);
            }}
            className={`ml-2 ${isLiked ? "text-red-500" : "text-base-content/30 hover:text-red-500"}`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
          </motion.button>
        </div>

        <p className={`text-base-content/60 line-clamp-2 mb-3 ${isList ? "text-xs" : "text-xs"}`}>
          {item.description}
        </p>

        <div className="flex items-center justify-between text-xs text-base-content/40">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{new Date(item.date).toLocaleDateString("fr-FR")}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{item.vues}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span>{item.telechargements} téléch.</span>
          </div>
        </div>

        {/* Tags */}
        <div className={`flex flex-wrap gap-1 mt-2 ${!isList ? "hidden" : ""}`}>
          {parseTags(item.tags).slice(0, 3).map((tag, i) => (
            <span
              key={i}
              className={`text-[10px] px-2 py-0.5 rounded-full ${config.bg} ${config.accent}`}
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Tags hors-liste */}
      {!isList && (
        <div className="px-4 pb-4 flex flex-wrap gap-1">
          {parseTags(item.tags).slice(0, 3).map((tag, i) => (
            <span
              key={i}
              className={`text-[10px] px-2 py-0.5 rounded-full ${config.bg} ${config.accent}`}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Effet de brillance au survol */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none">
        <div className="absolute top-0 -inset-full h-full w-1/2 transform -skew-x-12 bg-gradient-to-r from-transparent to-white/5 animate-shine" />
      </div>
    </motion.div>
  );
};

// ==================== COMPOSANT MODAL ====================
const MediaModal = ({
  item,
  type,
  isOpen,
  onClose,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
  onDownload,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showInfo, setShowInfo] = useState(false);
  const [liked, setLiked] = useState(false);
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const config = GALLERY_CONFIG.colors[type];
  const Icon =
    type === "photos" ? Camera : type === "videos" ? Film : Headphones;

  if (!item) return null;

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: item.titre,
          text: item.description,
          url: item.url,
        });
        toast.success("Partagé avec succès !");
      } else {
        await navigator.clipboard.writeText(item.url);
        toast.success("Lien copié dans le presse-papiers !");
      }
    } catch (error) {
      toast.error("Erreur lors du partage");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed inset-0 z-50 overflow-hidden"
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Navigation */}
              {hasPrev && (
                <button
                  onClick={onPrev}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 btn btn-circle btn-primary btn-lg z-20 hover:scale-110 transition-transform"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {hasNext && (
                <button
                  onClick={onNext}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 btn btn-circle btn-primary btn-lg z-20 hover:scale-110 transition-transform"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}

              {/* Barre d'outils supérieure */}
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-4 z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg bg-gradient-to-r ${config.primary} bg-opacity-20`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        {item.titre}
                      </h2>
                      <p className="text-sm text-white/70">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setLiked(!liked)}
                      className={`p-2 rounded-full transition-all ${liked ? "bg-red-500" : "bg-white/10 hover:bg-white/20"}`}
                    >
                      <Heart
                        className={`w-5 h-5 text-white ${liked ? "fill-current" : ""}`}
                      />
                    </button>
                    <button
                      onClick={handleShare}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
                    >
                      <Share2 className="w-5 h-5 text-white" />
                    </button>
                    <button
                      onClick={() => onDownload(item)}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
                    >
                      <Download className="w-5 h-5 text-white" />
                    </button>
                    <button
                      onClick={() => setShowInfo(!showInfo)}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
                    >
                      <Info className="w-5 h-5 text-white" />
                    </button>
                    <button
                      onClick={onClose}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Contenu principal */}
              <div className="w-full h-full flex items-center justify-center p-16">
                {type === "photos" && (
                  <img
                    src={item.url}
                    alt={item.titre}
                    className="max-w-full max-h-full object-contain rounded-lg"
                  />
                )}
                
                {type === "videos" && (
                  <div className="relative w-full h-full group">
                    {isYouTubeUrl(item.url) ? (
                      <iframe
                        src={
                          getYouTubeEmbedUrl(item.url) +
                          "?autoplay=1&rel=0&modestbranding=1"
                        }
                        className="w-full h-full rounded-lg"
                        title={item.titre}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        ref={videoRef}
                        src={item.url}
                        className="max-w-full max-h-full rounded-lg"
                        controls
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        onVolumeChange={() =>
                          setIsMuted(videoRef.current?.muted)
                        }
                      />
                    )}
                    {/* Description superposée sur la vidéo */}
                    {item.description && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <p className="text-white/90 text-sm line-clamp-3 drop-shadow-lg">
                          {item.description}
                        </p>
                      </div>
                    )}
                  </div>
                )}
                {type === "audios" && (
                  <div className="max-w-2xl w-full bg-base-200 rounded-2xl p-8">
                    {isSoundCloudUrl(item.url) ? (
                      // Lecteur SoundCloud intégré
                      <div className="space-y-4">
                        <div className="text-center mb-4">
                          <h3 className="text-2xl font-bold">{item.titre}</h3>
                          <p className="text-base-content/70">
                            {item.description}
                          </p>
                        </div>
                        <ReactPlayer
                          url={item.url}
                          width="100%"
                          height={166}
                          config={{
                            soundcloud: {
                              options: {
                                auto_play: true,
                                show_comments: false,
                                show_artwork: true,
                                color: "#ff5500",
                              },
                            },
                          }}
                          onPlay={() => setIsPlaying(true)}
                          onPause={() => setIsPlaying(false)}
                          onEnded={() => {
                            /* Optionnel */
                          }}
                        />
                      </div>
                    ) : (
                      <>
                        <div className="relative w-40 h-40 mx-auto mb-8">
                          <div
                            className={`absolute inset-0 bg-linear-to-r ${config.primary} rounded-full animate-pulse`}
                          />
                          <Headphones
                            className={`w-20 h-20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${config.accent}`}
                          />
                        </div>

                        <div className="text-center mb-8">
                          <h3 className="text-2xl font-bold mb-2">
                            {item.titre}
                          </h3>
                          <p className="text-base-content/70">
                            {item.description}
                          </p>
                        </div>

                        <audio
                          ref={audioRef}
                          controls
                          className="w-full"
                          onPlay={() => setIsPlaying(true)}
                          onPause={() => setIsPlaying(false)}
                        >
                          <source src={item.url} type="audio/mpeg" />
                        </audio>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Panneau d'information */}
              <AnimatePresence>
                {showInfo && (
                  <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", damping: 20 }}
                    className="absolute right-0 top-0 bottom-0 w-80 bg-base-100 shadow-2xl p-6 overflow-y-auto"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold text-lg">Informations</h3>
                      <button
                        onClick={() => setShowInfo(false)}
                        className="btn btn-sm btn-circle btn-ghost"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-xs opacity-60">Titre</label>
                        <p className="font-medium">{item.titre}</p>
                      </div>

                      <div>
                        <label className="text-xs opacity-60">
                          Description
                        </label>
                        <p className="text-sm">{item.description}</p>
                      </div>

                      <div>
                        <label className="text-xs opacity-60">Date</label>
                        <p>
                          {new Date(item.date).toLocaleDateString("fr-FR", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs opacity-60">Vues</label>
                          <p className="font-bold text-lg">{item.vues}</p>
                        </div>
                        <div>
                          <label className="text-xs opacity-60">Likes</label>
                          <p className="font-bold text-lg">{item.likes}</p>
                        </div>
                        <div>
                          <label className="text-xs opacity-60">
                            Téléchargements
                          </label>
                          <p className="font-bold text-lg">
                            {item.telechargements}
                          </p>
                        </div>
                      </div>

                      {item.tags && (
                        <div>
                          <label className="text-xs opacity-60">Tags</label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {parseTags(item.tags).map((tag, i) => (
                              <span
                                key={i}
                                className={`text-xs px-3 py-1 rounded-full ${GALLERY_CONFIG.colors[type].bg} ${GALLERY_CONFIG.colors[type].accent}`}
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="pt-4 border-t">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(item.url);
                            toast.success("URL copiée !");
                          }}
                          className="btn btn-outline btn-sm w-full gap-2"
                        >
                          <Copy className="w-4 h-4" />
                          Copier l'URL
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ==================== COMPOSANT FILTERS ====================
const FilterBar = ({
  tags,
  selectedTags,
  onTagToggle,
  sortBy,
  onSortChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-base-200 rounded-xl p-4 mb-8">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-sm font-medium"
        >
          <Filter className="w-4 h-4" />
          <span>Filtres et tri</span>
          {isOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="select select-sm select-bordered"
        >
          <option value="date">Plus récents</option>
          <option value="downloads">Plus téléchargés</option>
          <option value="views">Plus vus</option>
          <option value="likes">Plus aimés</option>
        </select>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 border-t mt-4">
              <h4 className="text-sm font-medium mb-3">Tags populaires</h4>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => onTagToggle(tag)}
                    className={`px-3 py-1 text-xs rounded-full transition-all ${
                      selectedTags.includes(tag)
                        ? "bg-accent text-white"
                        : "bg-base-300 hover:bg-base-400"
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ==================== COMPOSANT PRINCIPAL ====================
const Gallery = () => {
  const [activeTab, setActiveTab] = useState("photos");
  const [mediaItems, setMediaItems] = useState({ photos: [], videos: [], audios: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playingAudio, setPlayingAudio] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState("date");
  const [likedItems, setLikedItems] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  // Charger les données depuis l'API
  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/api/media');
        // Grouper par type
        const grouped = { photos: [], videos: [], audios: [] };
        data.forEach(item => {
          if (item.type === 'photo') grouped.photos.push(item);
          else if (item.type === 'video') grouped.videos.push(item);
          else if (item.type === 'audio') grouped.audios.push(item);
        });
        setMediaItems(grouped);
        setError(null);
      } catch (err) {
        console.error('Erreur chargement médias:', err);
        setError('Impossible de charger la galerie.');
      } finally {
        setLoading(false);
      }
    };
    fetchMedia();
  }, []);
// Mettre à jour l'index courant
  useEffect(() => {
    if (selectedItem) {
      const index = mediaItems[activeTab].findIndex(
        (item) => item.id === selectedItem.id,
      );
      setCurrentIndex(index);
    }
  }, [selectedItem, activeTab, mediaItems]);

  // Empêcher le scroll du body
  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedItem]);

  // Filtrer et trier les médias
  const filteredAndSortedMedia = useMemo(() => {
    let items = [...(mediaItems[activeTab] || [])];

    // Filtre par recherche
    if (search) {
      items = items.filter(
        (item) =>
          item.titre.toLowerCase().includes(search.toLowerCase()) ||
          item.description.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // Filtre par tags
    if (selectedTags.length > 0) {
      items = items.filter((item) =>
        selectedTags.every((tag) => parseTags(item.tags).includes(tag)),
      );
    }

    // Tri
    items.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.date) - new Date(a.date);
        case "downloads":
          return b.telechargements - a.telechargements;
        case "views":
          return b.vues - a.vues;
        case "likes":
          return b.likes - a.likes;
        default:
          return 0;
      }
    });

    return items;
  }, [activeTab, mediaItems, search, selectedTags, sortBy]);

  // Pagination
  const paginatedMedia = useMemo(() => {
    const start = (currentPage - 1) * GALLERY_CONFIG.itemsPerPage;
    const end = start + GALLERY_CONFIG.itemsPerPage;
    return filteredAndSortedMedia.slice(start, end);
  }, [filteredAndSortedMedia, currentPage]);

  const totalPages = Math.ceil(
    filteredAndSortedMedia.length / GALLERY_CONFIG.itemsPerPage,
  );

  // Réinitialiser la page quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, search, selectedTags, sortBy]);

  // Tags uniques
  const allTags = useMemo(() => {
    const tags = new Set();
    mediaItems[activeTab]?.forEach((item) => {
      parseTags(item.tags).forEach((tag) => tags.add(tag));
    });
    return Array.from(tags);
  }, [activeTab, mediaItems]);

  // Navigation
  const navigateMedia = useCallback(
    (direction) => {
      const newIndex = currentIndex + direction;
      if (newIndex >= 0 && newIndex < mediaItems[activeTab].length) {
        setCurrentIndex(newIndex);
        setSelectedItem(mediaItems[activeTab][newIndex]);
      }
    },
    [currentIndex, activeTab, mediaItems],
  );

  // Téléchargement
  const handleDownload = useCallback(
    (item, e) => {
      e?.stopPropagation();

      setMediaItems((prev) => {
        const newMedia = { ...prev };
        const index = newMedia[activeTab].findIndex((i) => i.id === item.id);
        if (index !== -1) {
          newMedia[activeTab][index].telechargements++;
        }
        return newMedia;
      });

      // Simuler un téléchargement
      const link = document.createElement("a");
      link.href = item.url;
      link.download = item.titre;
      link.click();

      toast.success(`Téléchargement de "${item.titre}" démarré !`, {
        icon: "📥",
        duration: 3000,
      });
    },
    [activeTab],
  );

  // Like
  const handleLike = useCallback(
    (item) => {
      setLikedItems((prev) => ({
        ...prev,
        [item.id]: !prev[item.id],
      }));

      setMediaItems((prev) => {
        const newMedia = { ...prev };
        const index = newMedia[activeTab].findIndex((i) => i.id === item.id);
        if (index !== -1) {
          newMedia[activeTab][index].likes += likedItems[item.id] ? -1 : 1;
        }
        return newMedia;
      });

      if (!likedItems[item.id]) {
        toast.success("Ajouté à vos favoris !", {
          icon: "❤️",
          duration: 2000,
        });
      }
    },
    [activeTab, likedItems],
  );

  // Lecture audio
  const handlePlayAudio = useCallback(
    (item) => {
      if (playingAudio === item.id) {
        setPlayingAudio(null);
      } else {
        setPlayingAudio(item.id);
      }
    },
    [playingAudio],
  );

  return (
    <>
      <NavBar />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "hsl(var(--b1))",
            color: "hsl(var(--bc))",
            border: "1px solid hsl(var(--b3))",
          },
        }}
      />

      <main className="min-h-screen bg-base-100">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-base-200 via-base-100 to-base-200 py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Notre Galerie
              </h1>
              <p className="text-lg md:text-xl text-base-content/70">
                Découvrez les moments forts de notre communauté à travers
                photos, vidéos et enseignements audio
              </p>
            </motion.div>
          </div>
        </section>

        {/* Section principale */}
        <section className="container mx-auto px-4 py-12">
          {/* Barre de recherche */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/40" />
              <input
                type="text"
                placeholder="Rechercher par titre ou description..."
                className="input input-bordered w-full pl-12"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Onglets */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {["photos", "videos", "audios"].map((tab) => {
              const Icon =
                tab === "photos"
                  ? Camera
                  : tab === "videos"
                    ? Film
                    : Headphones;
              const isActive = activeTab === tab;

              return (
                <motion.button
                  key={tab}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    relative px-6 py-3 rounded-full font-medium transition-all
                    flex items-center gap-2 overflow-hidden
                    ${
                      isActive
                        ? `text-white shadow-lg bg-gradient-to-r ${GALLERY_CONFIG.colors[tab].primary}`
                        : "bg-base-200 text-base-content/70 hover:bg-base-300"
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span className="capitalize">{tab}</span>
                  <span className="ml-1 text-xs bg-white/20 px-2 py-0.5 rounded-full">
                    {mediaItems[tab]?.length || 0}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Filtres */}
          <FilterBar
            tags={allTags}
            selectedTags={selectedTags}
            onTagToggle={(tag) => {
              setSelectedTags((prev) =>
                prev.includes(tag)
                  ? prev.filter((t) => t !== tag)
                  : [...prev, tag],
              );
            }}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          {/* En-tête de la galerie */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-base-content/60">
              {filteredAndSortedMedia.length} élément
              {filteredAndSortedMedia.length > 1 ? "s" : ""} trouvé
              {filteredAndSortedMedia.length > 1 ? "s" : ""}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-accent text-white" : "bg-base-200"}`}
                title="Vue grille"
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-accent text-white" : "bg-base-200"}`}
                title="Vue liste"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Grille des médias */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + viewMode + currentPage}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.05 },
                },
              }}
              className={`grid ${
                activeTab === "videos" || activeTab === "audios"
                  ? "grid-cols-1 xl:grid-cols-2"
                  : viewMode === "list"
                    ? "grid-cols-1"
                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              } gap-6`}
            >
              {paginatedMedia.map((item, index) => (
                <MediaCard
                  key={item.id}
                  item={item}
                  type={activeTab}
                  index={index}
                  onOpen={setSelectedItem}
                  onDownload={handleDownload}
                  onLike={handleLike}
                  isLiked={likedItems[item.id]}
                  isPlaying={playingAudio === item.id}
                  onPlay={handlePlayAudio}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col items-center gap-4 mt-12">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="btn btn-sm bg-base-200 hover:bg-base-300 disabled:opacity-50 disabled:cursor-not-allowed gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Précédent
                </button>

                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 2 && page <= currentPage + 2)
                  ) {
                    return (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(page)}
                        className={`hidden sm:inline-flex min-w-[40px] h-10 rounded-lg font-medium transition-all ${
                          currentPage === page
                            ? "bg-accent text-white shadow-lg scale-105"
                            : "bg-base-200 hover:bg-base-300"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  }
                  if (page === currentPage - 3 || page === currentPage + 3) {
                    return (
                      <span key={i} className="hidden sm:inline px-2">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="btn btn-sm bg-base-200 hover:bg-base-300 disabled:opacity-50 disabled:cursor-not-allowed gap-1"
                >
                  Suivant
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-base-content/50">
                Page {currentPage} sur {totalPages}
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Modal */}
      <MediaModal
        item={selectedItem}
        type={activeTab}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        onPrev={() => navigateMedia(-1)}
        onNext={() => navigateMedia(1)}
        hasPrev={currentIndex > 0}
        hasNext={currentIndex < mediaItems[activeTab]?.length - 1}
        onDownload={handleDownload}
      />

      {/* Lecteur audio flottant */}
      <AnimatePresence>
        {playingAudio && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 bg-base-200 border-t shadow-lg p-4 z-40"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-r ${GALLERY_CONFIG.colors.audios.primary} animate-pulse`}
                  />
                  <Headphones className="w-5 h-5 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div>
                  <p className="font-medium">
                    {
                      mediaItems.audios.find((a) => a.id === playingAudio)
                        ?.titre
                    }
                  </p>
                  <p className="text-xs text-base-content/60">
                    En cours de lecture...
                  </p>
                </div>
              </div>

              <audio
                controls
                autoPlay
                className="w-96"
                onEnded={() => setPlayingAudio(null)}
              >
                <source
                  src={
                    mediaItems.audios.find((a) => a.id === playingAudio)?.url
                  }
                  type="audio/mpeg"
                />
              </audio>

              <button
                onClick={() => setPlayingAudio(null)}
                className="btn btn-sm btn-ghost btn-circle"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Styles globaux */}
      <style>{`
        @keyframes shine {
          100% {
            left: 200%;
          }
        }
        .animate-shine {
          animation: shine 0.8s ease-out;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        /* Amélioration du scroll */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: hsl(var(--b2));
        }
        
        ::-webkit-scrollbar-thumb {
          background: hsl(var(--a) / 0.3);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--a) / 0.5);
        }
      `}</style>
    </>
  );
};

export default Gallery;
