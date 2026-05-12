const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = 'etdv-eglise/misc';
    let resourceType = 'auto';

    const ext = file.originalname.split('.').pop().toLowerCase();

    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
      folder = 'etdv-eglise/photos';
      resourceType = 'image';
    } else if (['mp4', 'webm', 'mov'].includes(ext)) {
      folder = 'etdv-eglise/videos';
      resourceType = 'video';
    } else if (['mp3', 'wav', 'ogg'].includes(ext)) {
      folder = 'etdv-eglise/audio';
      resourceType = 'raw';
    }

    return {
      folder,
      resource_type: resourceType,
      public_id: `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
    };
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp|mp4|webm|mov|mp3|wav|ogg/;
  const ext = file.originalname.split('.').pop().toLowerCase();
  if (allowed.test(ext)) cb(null, true);
  else cb(new Error('Type de fichier non supporté'));
};

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter,
});

module.exports = { upload, cloudinary };
