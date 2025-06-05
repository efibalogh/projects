import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { CourseProvider } from '@/context/CourseContext';

import Login from '@/components/auth/Login';
import Register from '@/components/auth/Register';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import TeacherRoute from '@/components/auth/TeacherRoute';

import CourseDetails from '@/components/courses/CourseDetails';
import CourseList from '@/components/courses/CourseList';
import CreateCourse from '@/components/courses/CreateCourse';
import EditCourse from '@/components/courses/EditCourse';

import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';

import Profile from '@/components/users/Profile';
import UserList from '@/components/users/UserList';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CourseProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Header title="Online Gradebook" />
              <div className="flex">
                <Sidebar />
                <main className="flex-1 min-h-[calc(100vh-4rem)] animate-fade-in">
                  <Routes>
                    {/* Public routes */}
                    <Route path="/auth/login" element={<Login />} />
                    <Route path="/auth/register" element={<Register />} />

                    {/* Protected routes for all authenticated users */}
                    <Route
                      path="/"
                      element={
                        <ProtectedRoute>
                          <CourseList />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/courses/:courseId"
                      element={
                        <ProtectedRoute>
                          <CourseDetails />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      }
                    />

                    {/* Teacher-only routes */}
                    <Route
                      path="/create-course"
                      element={
                        <TeacherRoute>
                          <CreateCourse />
                        </TeacherRoute>
                      }
                    />
                    <Route
                      path="/courses/:courseId/edit"
                      element={
                        <TeacherRoute>
                          <EditCourse />
                        </TeacherRoute>
                      }
                    />
                    <Route
                      path="/users"
                      element={
                        <TeacherRoute>
                          <UserList />
                        </TeacherRoute>
                      }
                    />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
              </div>
            </div>
          </Router>
        </CourseProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
