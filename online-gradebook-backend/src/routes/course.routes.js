import { Router as expressRouter } from 'express';

import { upload } from '../config/multer.config.js';
import {
  createCourse,
  createTask,
  deleteCourse,
  deleteTask,
  editCourse,
  editTask,
  getAllCourses,
  getCourse,
  getCourseStudents,
} from '../controllers/course.controller.js';

import { requireAuth, requireTeacher, requireTeacherOwnership } from '../middleware/auth.middleware.js';
import { handleFileError } from '../middleware/file.middleware.js';
import { courseModel } from '../models/course.model.js';

const router = expressRouter();

// Course routes
router.get('/', requireAuth, getAllCourses);
router.get('/:id', requireAuth, getCourse);

router.post('/', requireAuth, requireTeacher, createCourse);

router.put(
  '/:id',
  requireAuth,
  requireTeacherOwnership(async (req) => {
    const course = await courseModel.get(parseInt(req.params.id, 10));
    return course.userId;
  }),
  editCourse,
);

router.delete(
  '/:id',
  requireAuth,
  requireTeacherOwnership(async (req) => {
    const course = await courseModel.get(parseInt(req.params.id, 10));
    return course.userId;
  }),
  deleteCourse,
);

// Task routes
router.post(
  '/:id/tasks',
  requireAuth,
  requireTeacherOwnership(async (req) => {
    const course = await courseModel.get(parseInt(req.params.id, 10));
    return course.userId;
  }),
  upload.single('task-file'),
  handleFileError,
  createTask,
);

router.put(
  '/:id/tasks/:taskId',
  requireAuth,
  requireTeacherOwnership(async (req) => {
    const course = await courseModel.get(parseInt(req.params.id, 10));
    return course.userId;
  }),
  upload.single('task-file'),
  handleFileError,
  editTask,
);

router.delete(
  '/:id/tasks/:taskId',
  requireAuth,
  requireTeacherOwnership(async (req) => {
    const course = await courseModel.get(parseInt(req.params.id, 10));
    return course.userId;
  }),
  deleteTask,
);

router.get(
  '/:id/students',
  requireAuth,
  requireTeacherOwnership(async (req) => {
    const course = await courseModel.get(parseInt(req.params.id, 10));
    return course.userId;
  }),
  getCourseStudents,
);

export default router;
