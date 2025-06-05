import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Container } from '@mui/material';

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider as CustomThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';

import NavBar from './components/common/NavBar';
import Login from './components/auth/Login';
import Logout from './components/auth/Logout';
import Register from './components/auth/Register';
import AdminRoute from './components/auth/AdminRoute';
import ProtectedRoute from './components/auth/ProtectedRoute';
import EventList from './components/event/EventList';
import EventForm from './components/event/EventForm';
import EventDetails from './components/event/EventDetails';
import ParticipantForm from './components/participant/ParticipantForm';
import ParticipantDetails from './components/participant/ParticipantDetails';
import ParticipantList from './components/participant/ParticipantList';
import UserDetails from './components/user/UserDetails';
import UserList from './components/user/UserList';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CustomThemeProvider>
          <LanguageProvider>
            <Router>
              <NavBar />
              <Container>
                <Routes>
                  <Route path="/auth/login" element={<Login />} />
                  <Route path="/auth/register" element={<Register />} />
                  <Route
                    path="/events"
                    element={
                      <ProtectedRoute>
                        <EventList />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/events/new"
                    element={
                      <ProtectedRoute>
                        <EventForm />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/events/:id/edit"
                    element={
                      <ProtectedRoute>
                        <EventForm />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/events/:id"
                    element={
                      <ProtectedRoute>
                        <EventDetails />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/events/:eventId/participants"
                    element={
                      <ProtectedRoute>
                        <ParticipantList />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/events/:eventId/participants/new"
                    element={
                      <ProtectedRoute>
                        <ParticipantForm />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/events/:eventId/participants/:id/edit"
                    element={
                      <ProtectedRoute>
                        <ParticipantForm />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/events/:eventId/participants/:id"
                    element={
                      <ProtectedRoute>
                        <ParticipantDetails />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/users"
                    element={
                      <AdminRoute>
                        <UserList />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/users/:id"
                    element={
                      <AdminRoute>
                        <UserDetails />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <UserDetails />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/auth/logout" element={<Logout />} />
                  <Route path="/" element={<Navigate to="/events" replace />} />
                </Routes>
              </Container>
            </Router>
          </LanguageProvider>
        </CustomThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
