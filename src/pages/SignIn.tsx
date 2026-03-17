import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signIn(formData.email, formData.password, formData.role);
      // Redirect based on role
      if (formData.role === 'student') {
        navigate('/student-dashboard');
      } else {
        navigate('/warden-dashboard');
      }
    } catch (err) {
      console.error('Sign in error:', err);
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', bgcolor: '#F7FAFC' }}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ color: '#6B46C1' }}>
            Welcome Back
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
            Sign in to your account
          </Typography>

          {location.state?.message && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {location.state.message}
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'grid', gap: 2 }}>
              <FormControl fullWidth required>
                <InputLabel>Role</InputLabel>
                <Select
                  value={formData.role}
                  label="Role"
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <MenuItem value="student">Student</MenuItem>
                  <MenuItem value="warden">Warden</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                bgcolor: '#6B46C1',
                '&:hover': {
                  bgcolor: '#553C9A',
                },
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>

            <Button
              fullWidth
              variant="text"
              onClick={() => navigate('/signup')}
              sx={{ color: '#6B46C1' }}
            >
              Don't have an account? Sign Up
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
} 