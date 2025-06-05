import fs from 'fs';
import path from 'path';

import { uploadDir } from '../config/multer.config.js';

export const deleteFile = (filename) => {
  const filePath = path.join(uploadDir, filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Error deleting file:', err);
    } else {
      console.log('File deleted:', filePath);
    }
  });
};

export const handleFileError = (req, res, next) => {
  if (req.fileValidationError) {
    return res.status(400).json({ error: req.fileValidationError });
  }
  return next();
};
