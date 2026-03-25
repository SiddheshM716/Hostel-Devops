import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import StudentDashboard from './pages/StudentDashboard';
import WardenDashboard from './pages/WardenDashboard';
import Complaints from './pages/Complaints';
import WardenComplaints from './pages/WardenComplaints';
import Rooms from './pages/Rooms';
import Payments from './pages/Payments';
import Bookings from './pages/Bookings';
import Students from './pages/Students';
import PrivateRoute from './components/PrivateRoute';
import StudentMessMenu from './pages/MessMenu';
import WardenMessMenu from './pages/WardenMessMenu';
import StudentRequests from './pages/StudentRequests';
import WardenApprovals from './pages/WardenApprovals';

const theme = createTheme({
  palette: {
    primary: {
      main: '#7C3AED', // More vibrant Violet
      light: '#8B5CF6',
      dark: '#5B21B6',
    },
    secondary: {
      main: '#F472B6', // Pink accent
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1E293B',
      secondary: '#64748B',
    },
  },
  typography: {
    fontFamily: '"Inter", "Outfit", sans-serif',
    h1: { fontFamily: '"Outfit", sans-serif', fontWeight: 700 },
    h2: { fontFamily: '"Outfit", sans-serif', fontWeight: 700 },
    h3: { fontFamily: '"Outfit", sans-serif', fontWeight: 700 },
    h4: { fontFamily: '"Outfit", sans-serif', fontWeight: 700 },
    h5: { fontFamily: '"Outfit", sans-serif', fontWeight: 700 },
    h6: { fontFamily: '"Outfit", sans-serif', fontWeight: 700 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/student-dashboard"
              element={
                <PrivateRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/student-dashboard/complaints"
              element={
                <PrivateRoute allowedRoles={['student']}>
                  <Complaints />
                </PrivateRoute>
              }
            />
            <Route
              path="/student-dashboard/rooms"
              element={
                <PrivateRoute allowedRoles={['student']}>
                  <Rooms />
                </PrivateRoute>
              }
            />
            <Route
              path="/student-dashboard/payments"
              element={
                <PrivateRoute allowedRoles={['student']}>
                  <Payments />
                </PrivateRoute>
              }
            />
            <Route
              path="/student-dashboard/bookings"
              element={
                <PrivateRoute allowedRoles={['student']}>
                  <Bookings />
                </PrivateRoute>
              }
            />
            <Route
              path="/student-dashboard/mess"
              element={
                <PrivateRoute allowedRoles={['student']}>
                  <StudentMessMenu />
                </PrivateRoute>
              }
            />
            <Route
              path="/student-dashboard/requests"
              element={
                <PrivateRoute allowedRoles={['student']}>
                  <StudentRequests />
                </PrivateRoute>
              }
            />
            <Route
              path="/warden-dashboard"
              element={
                <PrivateRoute allowedRoles={['warden']}>
                  <WardenDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/warden-dashboard/warden-complaints"
              element={
                <PrivateRoute allowedRoles={['warden']}>
                  <WardenComplaints />
                </PrivateRoute>
              }
            />
            <Route
              path="/warden-dashboard/students"
              element={
                <PrivateRoute allowedRoles={['warden']}>
                  <Students />
                </PrivateRoute>
              }
            />
            <Route
              path="/warden-dashboard/rooms"
              element={
                <PrivateRoute allowedRoles={['warden']}>
                  <Rooms />
                </PrivateRoute>
              }
            />
            <Route
              path="/warden-dashboard/mess"
              element={
                <PrivateRoute allowedRoles={['warden']}>
                  <WardenMessMenu />
                </PrivateRoute>
              }
            />
            <Route
              path="/warden-dashboard/approvals"
              element={
                <PrivateRoute allowedRoles={['warden']}>
                  <WardenApprovals />
                </PrivateRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
