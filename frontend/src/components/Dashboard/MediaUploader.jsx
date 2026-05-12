// src/components/Dashboard/MediaUploader.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Upload, Image, Video, Music, Loader } from "lucide-react";
import toast from "react-hot-toast";

const MediaUploader = ({ media, mode, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: media?.title || "",
    description: media?.description || "",
    type: media?.type || "image",
    url: media?.url || "",
    date: media?.date || new Date().toISOString().split('T')[0],
    tags: media?.tags?.join(", ") || ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSave = {
        ...formData,
        tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
        id: media?.id || Date.now(),
        downloads: media?.downloads || 0,
        views: media?.views || 0
      };

      await onSave(dataToSave);
      toast.success(mode === "add" ? "Média ajouté !" : "Média modifié !");
    } catch (error) {
      toast.error("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {mode === "add" ? "Ajouter un média" : "Modifier le média"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Type de média *</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="type"
                    value="image"
                    checked={formData.type === "image"}
                    onChange={handleChange}
                    className="text-accent"
                  />
                  <Image className="w-4 h-4" />
                  <span>Image</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="type"
                    value="video"
                    checked={formData.type === "video"}
                    onChange={handleChange}
                    className="text-accent"
                  />
                  <Video className="w-4 h-4" />
                  <span>Vidéo</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="type"
                    value="audio"
                    checked={formData.type === "audio"}
                    onChange={handleChange}
                    className="text-accent"
                  />
                  <Music className="w-4 h-4" />
                  <span>Audio</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Titre *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Titre du média"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Description du média"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">URL *</label>
              <input
                type="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="https://exemple.com/image.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tags (séparés par des virgules)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="culte, louange, enseignement"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/80 disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Traitement...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>{mode === "add" ? "Ajouter" : "Modifier"}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Exportation par défaut - C'EST CE QUI MANQUAIT
export default MediaUploader;