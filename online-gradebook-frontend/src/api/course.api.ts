import axios from 'axios';

import api from '@/config/axios.config';
import type { Course, CourseRequest, EnrolledStudent } from '@/types/course';
import type { Task, TaskRequest } from '@/types/task';

export const courseApi = {
  async getAllCourses(): Promise<Course[]> {
    try {
      const response = await api.get('/courses');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || 'Failed to fetch courses';
        throw new Error(errorMessage);
      }
      throw new Error('Failed to fetch courses');
    }
  },

  async getCourse(id: number): Promise<Course> {
    try {
      const response = await api.get(`/courses/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || 'Failed to fetch course';
        throw new Error(errorMessage);
      }
      throw new Error('Failed to fetch course');
    }
  },

  async createCourse(courseData: CourseRequest): Promise<{ message: string; course: Course }> {
    try {
      const response = await api.post('/courses', courseData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || 'Failed to create course';
        throw new Error(errorMessage);
      }
      throw new Error('Failed to create course');
    }
  },

  async updateCourse(id: number, courseData: CourseRequest): Promise<{ message: string; course: Course }> {
    try {
      const response = await api.put(`/courses/${id}`, courseData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || 'Failed to delete course';
        throw new Error(errorMessage);
      }
      throw new Error('Failed to delete course');
    }
  },

  async deleteCourse(id: number): Promise<{ message: string }> {
    try {
      const response = await api.delete(`/courses/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || 'Failed to create task';
        throw new Error(errorMessage);
      }
      throw new Error('Failed to create task');
    }
  },

  async createTask(courseId: number, taskData: TaskRequest): Promise<{ message: string; task: Task }> {
    try {
      const formData = new FormData();
      formData.append('task-name', taskData.name);
      formData.append('task-deadline', taskData.deadline);
      formData.append('task-file', taskData.file);
      const response = await api.post(`/courses/${courseId}/tasks`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || 'Failed to create task';
        throw new Error(errorMessage);
      }
      throw new Error('Failed to create task');
    }
  },

  async updateTask(
    courseId: number,
    taskId: number,
    taskData: Partial<TaskRequest>,
  ): Promise<{ message: string; task: Task }> {
    try {
      const formData = new FormData();
      if (taskData.name) formData.append('task-name', taskData.name);
      if (taskData.deadline) {
        formData.append('task-deadline', taskData.deadline);
      }
      if (taskData.file) formData.append('task-file', taskData.file);

      const response = await api.put(`/courses/${courseId}/tasks/${taskId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || 'Failed to delete task';
        throw new Error(errorMessage);
      }
      throw new Error('Failed to delete task');
    }
  },

  async deleteTask(courseId: number, taskId: number): Promise<{ message: string; taskId: number }> {
    try {
      const response = await api.delete(`/courses/${courseId}/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || 'Failed to delete task';
        throw new Error(errorMessage);
      }
      throw new Error('Failed to delete task');
    }
  },

  async getCourseStudents(courseId: number): Promise<EnrolledStudent[]> {
    try {
      const response = await api.get(`/courses/${courseId}/students`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || 'Failed to fetch course students';
        throw new Error(errorMessage);
      }
      throw new Error('Failed to fetch course students');
    }
  },
};
