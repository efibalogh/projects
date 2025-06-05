import multer from 'multer';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { courseModel } from '../models/course.model.js';

const dirName = dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(dirName, '../../uploads');

if (!fs.existsSync(uploadDir)) {
  console.log(`Creating upload directory: ${uploadDir}`);
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: async (req, file, cb) => {
    try {
      const courseId = parseInt(req.params.id, 10);
      const course = await courseModel.get(courseId);
      const courseCode = course.code;
      const taskName = req.body['task-name'].replace(/[^A-Za-z0-9_-]+/gu, '-').toLowerCase();
      const deadline = req.body['task-deadline'].split('T')[0].split('-').slice(1).join('-');
      const filename = `${courseCode}_${taskName}_${deadline}${path.extname(file.originalname)}`;

      cb(null, filename);
    } catch (error) {
      console.error('Error generating filename:', error);
      cb(error);
    }
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    console.log('File is accepted:', file.originalname);
    cb(null, true);
  } else {
    console.log('File is rejected:', file.originalname);
    cb(new Error('Only PDF files are allowed.'));
  }
};

export const upload = multer({ storage, fileFilter });
export { uploadDir };
