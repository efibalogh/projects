import { deleteFile } from '../middleware/file.middleware.js';
import { courseModel } from '../models/course.model.js';
import { enrollmentModel } from '../models/enrollment.model.js';
import { formatDate } from '../util/date.util.js';
import { courseSchema, taskSchema } from '../validation/course.schemas.js';

export const getAllCourses = async (req, res) => {
  console.log('GET /api/courses');

  try {
    // eslint-disable-next-line init-declarations
    let courses;
    if (req.user.role === 'teacher') {
      // Teachers can see all courses but only modify their own
      courses = await courseModel.getAll();
    } else {
      courses = await enrollmentModel.getStudentCourses(req.user.id);
    }

    courses = courses.map((course) => ({
      ...course,
      isOwner: course.userId === req.user.id,
    }));

    return res.json(courses);
  } catch (error) {
    console.error('Get all courses error:', error);
    return res.status(500).json({ error: 'Failed to fetch courses' });
  }
};

export const getCourse = async (req, res) => {
  console.log(`GET /api/courses/${req.params.id}`);

  try {
    const courseId = parseInt(req.params.id, 10);
    const course = await courseModel.get(courseId);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check access: teachers can see all courses, students can see enrolled courses
    if (req.user.role === 'student') {
      const enrollment = await enrollmentModel.getByUserAndCourse(req.user.id, courseId);
      if (!enrollment || enrollment.status !== 'accepted') {
        return res.status(403).json({ error: 'You are not enrolled in this course' });
      }
    }

    course.isOwner = course.userId === req.user.id;

    return res.json(course);
  } catch (error) {
    console.error('Get course error:', error);
    return res.status(500).json({ error: 'Failed to fetch course' });
  }
};

export const createCourse = async (req, res) => {
  console.log('POST /api/courses');

  try {
    const validatedData = courseSchema.parse(req.body);

    const course = await courseModel.create({
      ...validatedData,
      userId: req.user.id,
    });

    return res.status(201).json({
      message: 'Course created successfully',
      course,
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors,
      });
    }
    console.error('Create course error:', error);
    return res.status(500).json({ error: error.message || 'Failed to create course' });
  }
};

export const editCourse = async (req, res) => {
  console.log(`PUT /api/courses/${req.params.id}`);

  try {
    const courseId = parseInt(req.params.id, 10);

    const validatedData = courseSchema.parse(req.body);

    const updatedCourse = await courseModel.update(courseId, validatedData);

    if (!updatedCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }

    return res.json({
      message: 'Course updated successfully',
      course: updatedCourse,
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors,
      });
    }
    console.error('Edit course error:', error);
    return res.status(500).json({ error: error.message || 'Failed to update course' });
  }
};

export const deleteCourse = async (req, res) => {
  console.log(`DELETE /api/courses/${req.params.id}`);

  try {
    const courseId = parseInt(req.params.id, 10);
    const success = await courseModel.delete(courseId);

    if (!success) {
      return res.status(404).json({ error: 'Course not found' });
    }

    return res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete course error:', error);
    return res.status(500).json({ error: 'Failed to delete course' });
  }
};

export const createTask = async (req, res) => {
  console.log(`POST /api/courses/${req.params.id}/tasks`);

  try {
    const courseId = parseInt(req.params.id, 10);

    const validatedData = taskSchema.parse({
      name: req.body['task-name'],
      deadline: req.body['task-deadline'],
    });

    const formattedDeadline = formatDate(validatedData.deadline);

    console.log(validatedData, formattedDeadline);

    if (!req.file) {
      return res.status(400).json({ error: 'Task file is required' });
    }

    const task = await courseModel.addTask(courseId, {
      name: validatedData.name,
      deadline: formattedDeadline,
      file: req.file.filename,
    });

    return res.status(201).json({
      message: 'Task created successfully',
      task,
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors,
      });
    }
    console.error('Create task error:', error);
    return res.status(500).json({ error: error.message || 'Failed to create task' });
  }
};

export const editTask = async (req, res) => {
  console.log(`PUT /api/courses/${req.params.id}/tasks/${req.params.taskId}`);

  try {
    const taskId = parseInt(req.params.taskId, 10);

    const validatedData = taskSchema.parse({
      name: req.body['task-name'],
      deadline: req.body['task-deadline'],
    });

    const formattedDeadline = formatDate(validatedData.deadline);
    console.log(validatedData, formattedDeadline);

    const task = await courseModel.updateTask(taskId, {
      name: validatedData.name,
      deadline: formattedDeadline,
      file: req.file ? req.file.filename : null,
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    return res.json({
      message: 'Task updated successfully',
      task,
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors,
      });
    }
    console.error('Edit task error:', error);
    return res.status(500).json({ error: error.message || 'Failed to update task' });
  }
};

export const deleteTask = async (req, res) => {
  console.log(`DELETE /api/courses/${req.params.id}/tasks/${req.params.taskId}`);

  try {
    const taskId = parseInt(req.params.taskId, 10);

    const task = await courseModel.getTask(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const success = await courseModel.deleteTask(taskId);
    if (!success) {
      return res.status(500).json({ error: 'Failed to delete task' });
    }

    if (task.filePath) {
      deleteFile(task.filePath);
    }

    return res.json({
      message: 'Task deleted successfully',
      taskId,
    });
  } catch (error) {
    console.error('Delete task error:', error);
    return res.status(500).json({ error: 'Failed to delete task' });
  }
};

export const getCourseStudents = async (req, res) => {
  console.log(`GET /api/courses/${req.params.id}/students`);

  try {
    const courseId = parseInt(req.params.id, 10);

    // First verify the course exists and user has access
    const course = await courseModel.get(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Only course owners can view enrolled students
    if (course.userId !== req.user.id) {
      return res.status(403).json({ error: 'You can only view students for your own courses' });
    }

    const students = await enrollmentModel.getCourseStudents(courseId);
    return res.json(students);
  } catch (error) {
    console.error('Get course students error:', error);
    return res.status(500).json({ error: 'Failed to fetch course students' });
  }
};
