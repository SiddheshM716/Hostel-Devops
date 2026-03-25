import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Room as RoomIcon,
  Report as ReportIcon,
  Payment as PaymentIcon,
  EventNote as EventNoteIcon,
} from '@mui/icons-material';
import { api } from '../lib/api';
import { Complaint } from '../types';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/DashboardLayout';


export default function Complaints() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [newComplaint, setNewComplaint] = useState({
    complaint_type: '',
    description: '',
  });

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      if (!user) {
        setError('User not authenticated. Please sign in again.');
        return;
      }

      // the user object from AuthContext should already have the role and student_id

      const data = await api.get('/complaints');
      // Backend already filters by student_id for students, so we just sort
      const sortedComplaints = [...data].sort((a: any, b: any) => b.complaint_id - a.complaint_id);

      setComplaints(sortedComplaints);
    } catch (err) {
      console.error('Error in fetchComplaints:', err);
      setError(err instanceof Error ? err.message : 'Failed to load complaints. Please try again.');
    }
  };

  const handleSubmitComplaint = async () => {
    try {
      setLoading(true);
      setError(null);

      // Insert new complaint
      const complaintData = await api.post('/complaints', {
        complaint_type: newComplaint.complaint_type,
        description: newComplaint.description,
      });

      setComplaints([complaintData, ...complaints]);
      setSuccess('Complaint submitted successfully!');
      setOpenDialog(false);
      setNewComplaint({ complaint_type: '', description: '' });
    } catch (err) {
      console.error('Error submitting complaint:', err);
      setError('Failed to submit complaint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase();
    switch (s) {
      case 'pending':
        return 'warning';
      case 'in progress':
      case 'in_progress':
        return 'info';
      case 'resolved':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <DashboardLayout title="My Complaints">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ color: '#2D3748' }}>
            My Complaints
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{
              bgcolor: '#6B46C1',
              '&:hover': {
                bgcolor: '#553C9A',
              },
            }}
          >
            New Complaint
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Grid container spacing={3}>
          {complaints.map((complaint) => (
            <Grid item xs={12} key={complaint.complaint_id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="h2" sx={{ color: '#2D3748' }}>
                      {complaint.complaint_type}
                    </Typography>
                     <Chip
                      label={complaint.complaint_status || 'Pending'}
                      color={getStatusColor(complaint.complaint_status)}
                      size="small"
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </Box>
                  {complaint.assigned_to && (
                    <Typography variant="body2" sx={{ mb: 1, color: '#4A5568', fontWeight: 500 }}>
                      Assigned To: {complaint.assigned_to}
                    </Typography>
                  )}
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    {complaint.description}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Submitted on: {new Date(complaint.updated_at || '').toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Submit New Complaint</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'grid', gap: 2, pt: 2 }}>
              <FormControl fullWidth required>
                <InputLabel>Complaint Type</InputLabel>
                <Select
                  value={newComplaint.complaint_type}
                  label="Complaint Type"
                  onChange={(e) => setNewComplaint({ ...newComplaint, complaint_type: e.target.value })}
                >
                  <MenuItem value="plumbing">Plumbing</MenuItem>
                  <MenuItem value="management">Management</MenuItem>
                  <MenuItem value="furniture">Furniture</MenuItem>
                  <MenuItem value="house_keeping">House Keeping</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                value={newComplaint.description}
                onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })}
                required
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button
              onClick={handleSubmitComplaint}
              variant="contained"
              disabled={loading}
              sx={{
                bgcolor: '#6B46C1',
                '&:hover': {
                  bgcolor: '#553C9A',
                },
              }}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </DashboardLayout>
  );
} 