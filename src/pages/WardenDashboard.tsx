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
  LinearProgress,
} from '@mui/material';
import {
  Report as ReportIcon,
  People as PeopleIcon,
  Room as RoomIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import DashboardLayout from '../components/DashboardLayout';
import { api } from '../lib/api';
import { Complaint, Room } from '../types';

const menuItems = [
  { text: 'Dashboard', icon: <RoomIcon />, path: '/warden-dashboard' },
  { text: 'Complaints', icon: <ReportIcon />, path: '/warden-dashboard/warden-complaints' },
  { text: 'Students', icon: <PeopleIcon />, path: '/warden-dashboard/students' },
  { text: 'Maintenance', icon: <AssignmentIcon />, path: '/warden-dashboard/maintenance' },
];

export default function WardenDashboard() {
  const navigate = useNavigate();
  const [pendingComplaints, setPendingComplaints] = useState<Complaint[]>([]);
  const [roomOccupancy, setRoomOccupancy] = useState<Room[]>([]);
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [selectedWorker, setSelectedWorker] = useState('');

  useEffect(() => {
    fetchPendingComplaints();
    fetchRoomOccupancy();
  }, []);

  const fetchPendingComplaints = async () => {
    try {
      const data = await api.get('/complaints');
      setPendingComplaints(data.filter((c: any) => c.complaint_status?.toLowerCase() === 'pending'));
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  };

  const fetchRoomOccupancy = async () => {
    try {
      const data = await api.get('/rooms');
      setRoomOccupancy(data);
    } catch (error) {
      console.error('Error fetching room occupancy:', error);
    }
  };

  const handleAssignWorker = async () => {
    if (!selectedComplaint || !selectedWorker) return;

    try {
      await api.patch(`/complaints/${selectedComplaint.complaint_id}/status`, {
        status: 'In Progress',
        assigned_to: selectedWorker
      });
      // the assigned worker is mocked out since it's not in the db schema provided
      setOpenAssignDialog(false);
      fetchPendingComplaints();
    } catch (error) {
      console.error('Error assigning worker:', error);
    }
  };

  const totalRooms = roomOccupancy.length;
  // A room is "occupied" if it has at least one allocation (vacancies < capacity)
  const occupiedRooms = roomOccupancy.filter(room => {
    const capacity = parseInt(room.room_capacity as any, 10);
    const vacancies = parseInt(room.vacancies as any, 10);
    return vacancies < capacity;
  }).length;
  const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;

  return (
    <DashboardLayout title="Warden Dashboard" menuItems={menuItems}>
      <Box sx={{ display: 'grid', gap: 3 }}>
        {/* Welcome Section */}
        <Card sx={{ bgcolor: '#6B46C1', color: 'white' }}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              Welcome to Warden Dashboard
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              Manage hostel operations, handle complaints, and monitor occupancy all in one place.
            </Typography>
          </CardContent>
        </Card>

        {/* Main Stats Section */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
          {/* Room Occupancy Section */}
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Room Occupancy
              </Typography>
              <Box sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Occupancy Rate
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {Math.round(occupancyRate)}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={occupancyRate} 
                  sx={{ 
                    height: 10, 
                    borderRadius: 5,
                    bgcolor: '#E2E8F0',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: '#6B46C1',
                    },
                  }}
                />
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Occupied: {occupiedRooms}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total: {totalRooms}
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<RoomIcon />}
                onClick={() => navigate('/warden-dashboard/rooms')}
                sx={{ mt: 3 }}
              >
                View Room Details
              </Button>
            </CardContent>
          </Card>

          {/* Pending Complaints Section */}
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Pending Complaints
              </Typography>
              <Stack spacing={2}>
                {pendingComplaints.slice(0, 3).map((complaint) => (
                  <Card 
                    key={complaint.complaint_id}
                    variant="outlined"
                    sx={{
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                          <Typography variant="subtitle1" gutterBottom>
                            {complaint.complaint_type}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {complaint.description}
                          </Typography>
                        </Box>
                        <Chip 
                          label={complaint.complaint_status || 'Pending'} 
                          color={complaint.complaint_status?.toLowerCase() === 'pending' ? 'warning' : 'info'} 
                          size="small"
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </Box>
                      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                        {complaint.complaint_status?.toLowerCase() === 'pending' && (
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => {
                              setSelectedComplaint(complaint);
                              setOpenAssignDialog(true);
                            }}
                            sx={{ textTransform: 'none' }}
                          >
                            Assign Worker
                          </Button>
                        )}
                        {(complaint.complaint_status?.toLowerCase().includes('progress')) && (
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={async () => {
                              try {
                                await api.patch(`/complaints/${complaint.complaint_id}/status`, { status: 'Resolved' });
                                fetchPendingComplaints();
                              } catch (err) {
                                console.error('Error resolving complaint:', err);
                              }
                            }}
                            sx={{ textTransform: 'none' }}
                          >
                            Resolve
                          </Button>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<ReportIcon />}
                onClick={() => navigate('/warden-dashboard/warden-complaints')}
                sx={{ mt: 3 }}
              >
                View All Complaints
              </Button>
            </CardContent>
          </Card>
        </Box>

        {/* Quick Actions */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Student Management
              </Typography>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<PeopleIcon />}
                onClick={() => navigate('/warden-dashboard/students')}
                sx={{ mt: 2 }}
              >
                View All Students
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Maintenance
              </Typography>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<AssignmentIcon />}
                onClick={() => navigate('/warden-dashboard/maintenance')}
                sx={{ mt: 2 }}
              >
                Maintenance Tasks
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Assign Worker Dialog */}
      <Dialog open={openAssignDialog} onClose={() => setOpenAssignDialog(false)}>
        <DialogTitle>Assign Worker</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="Select Worker"
            value={selectedWorker}
            onChange={(e) => setSelectedWorker(e.target.value)}
            sx={{ mt: 2 }}
          >
            <MenuItem value="worker1">Worker 1</MenuItem>
            <MenuItem value="worker2">Worker 2</MenuItem>
            <MenuItem value="worker3">Worker 3</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAssignDialog(false)}>Cancel</Button>
          <Button onClick={handleAssignWorker} variant="contained" color="primary">
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
} 