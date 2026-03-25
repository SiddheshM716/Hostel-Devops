import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  Stack,
  Container,
  Alert,
  CardActions as MuiCardActions,
} from '@mui/material';
import {
  Room as RoomIcon,
  Report as ReportIcon,
  Payment as PaymentIcon,
  EventNote as EventNoteIcon,
  Assignment as AssignmentIcon,
  ArrowForward as ArrowForwardIcon,
  RestaurantMenu as RestaurantMenuIcon,
  CardTravel as CardTravelIcon,
} from '@mui/icons-material';
import DashboardLayout from '../components/DashboardLayout';
import { api } from '../lib/api';
import { Room, Student } from '../types';
import { useAuth } from '../contexts/AuthContext';


export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [openComplaintDialog, setOpenComplaintDialog] = useState(false);
  const [complaintForm, setComplaintForm] = useState({
    type: '',
    description: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [studentData, setStudentData] = useState<Student | null>(null);

  useEffect(() => {
    fetchStudentData();
    fetchAvailableRooms();
  }, []);

  const fetchStudentData = async () => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      // If already have user data with student-specific fields, use it
      if (user.role === 'student' && user.student_id) {
        setStudentData(user as unknown as Student);
      } else {
        const data = await api.get('/auth/me');
        setStudentData(data.user as Student);
      }
    } catch (error) {
      console.error('Error in fetchStudentData:', error);
      setError(error instanceof Error ? error.message : 'Failed to load student data');
    }
  };

  const fetchAvailableRooms = async () => {
    try {
      const data = await api.get('/rooms');
      const available = data.filter((r: any) => r.occupancy_status === 'Available');
      setAvailableRooms(available);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setError('Failed to load available rooms');
    }
  };

  const handleComplaintSubmit = async () => {
    try {
      if (!studentData) throw new Error('Student data not found');

      await api.post('/complaints', {
        complaint_type: complaintForm.type,
        description: complaintForm.description
      });

      setOpenComplaintDialog(false);
      setComplaintForm({ type: '', description: '' });
    } catch (error) {
      console.error('Error submitting complaint:', error);
      setError('Failed to submit complaint');
    }
  };

  return (
    <DashboardLayout title="Student Dashboard">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'grid', gap: 4 }}>
          {/* Welcome Section */}
          <Card>
            <CardContent>
              <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#2D3748' }}>
                Welcome, {studentData?.name || 'Student'}!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Here's an overview of your hostel information
              </Typography>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { 
              xs: '1fr', 
              md: 'repeat(2, 1fr)' 
            }, 
            gap: 3 
          }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AssignmentIcon sx={{ fontSize: 40, color: '#6B46C1', mr: 2 }} />
                  <Typography variant="h6" component="h2" sx={{ color: '#2D3748' }}>
                    Complaints
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Submit and track your complaints
                </Typography>
              </CardContent>
              <MuiCardActions>
                <Button
                  startIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/student-dashboard/complaints')}
                  sx={{ color: '#6B46C1' }}
                >
                  View Complaints
                </Button>
              </MuiCardActions>
            </Card>

            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PaymentIcon sx={{ fontSize: 40, color: '#6B46C1', mr: 2 }} />
                  <Typography variant="h6" component="h2" sx={{ color: '#2D3748' }}>
                    Payments
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  View and manage your payment history
                </Typography>
              </CardContent>
              <MuiCardActions>
                <Button
                  startIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/student-dashboard/payments')}
                  sx={{ color: '#6B46C1' }}
                >
                  View Payments
                </Button>
              </MuiCardActions>
            </Card>

            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <RestaurantMenuIcon sx={{ fontSize: 40, color: '#6B46C1', mr: 2 }} />
                  <Typography variant="h6" component="h2" sx={{ color: '#2D3748' }}>
                    Mess Menu
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Check out the weekly mess menu 
                </Typography>
              </CardContent>
              <MuiCardActions>
                <Button
                  startIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/student-dashboard/mess')}
                  sx={{ color: '#6B46C1' }}
                >
                  View Menu
                </Button>
              </MuiCardActions>
            </Card>

            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CardTravelIcon sx={{ fontSize: 40, color: '#6B46C1', mr: 2 }} />
                  <Typography variant="h6" component="h2" sx={{ color: '#2D3748' }}>
                    My Requests
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Apply for visitors and leaves
                </Typography>
              </CardContent>
              <MuiCardActions>
                <Button
                  startIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/student-dashboard/requests')}
                  sx={{ color: '#6B46C1' }}
                >
                  View Requests
                </Button>
              </MuiCardActions>
            </Card>
          </Box>

          {/* Available Rooms Section */}
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" component="h2">
                  Available Rooms
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/student-dashboard/rooms')}
                  startIcon={<RoomIcon />}
                >
                  View All Rooms
                </Button>
              </Box>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { 
                  xs: '1fr', 
                  sm: 'repeat(2, 1fr)', 
                  md: 'repeat(3, 1fr)' 
                }, 
                gap: 2 
              }}>
                {availableRooms.slice(0, 3).map((room) => (
                  <Card
                    key={room.room_id}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                      },
                    }}
                  >
                    <CardContent>
                      <Stack spacing={2}>
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            Room {room.room_no}
                          </Typography>
                          <Chip
                            label={room.room_type}
                            color="primary"
                            size="small"
                            sx={{ mb: 1 }}
                          />
                        </Box>
                        <Typography color="text.secondary">
                          Capacity: {room.room_capacity} students
                        </Typography>
                        <Typography variant="h6" color="primary">
                          ₹{room.yearly_fee}/year
                        </Typography>
                        <Button
                          variant="contained"
                          color="primary"
                          fullWidth
                          onClick={() => navigate('/student-dashboard/rooms')}
                        >
                          View Details
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Complaint Dialog */}
        <Dialog open={openComplaintDialog} onClose={() => setOpenComplaintDialog(false)}>
          <DialogTitle>Raise a Complaint</DialogTitle>
          <DialogContent>
            <TextField
              select
              fullWidth
              label="Complaint Type"
              value={complaintForm.type}
              onChange={(e) => setComplaintForm({ ...complaintForm, type: e.target.value })}
              sx={{ mt: 2 }}
            >
              <MenuItem value="plumbing">Plumbing</MenuItem>
              <MenuItem value="furniture">Furniture</MenuItem>
              <MenuItem value="house_keeping">House Keeping</MenuItem>
              <MenuItem value="management">Management</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              value={complaintForm.description}
              onChange={(e) => setComplaintForm({ ...complaintForm, description: e.target.value })}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenComplaintDialog(false)}>Cancel</Button>
            <Button onClick={handleComplaintSubmit} variant="contained" color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </DashboardLayout>
  );
} 