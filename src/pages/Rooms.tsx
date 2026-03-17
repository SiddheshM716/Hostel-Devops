import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  Room as RoomIcon,
  ArrowBack as ArrowBackIcon,
  Report as ReportIcon,
  Payment as PaymentIcon,
  EventNote as EventNoteIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { Room } from '../types';
import DashboardLayout from '../components/DashboardLayout';

const menuItems = [
  { text: 'Dashboard', icon: <RoomIcon />, path: '/student-dashboard' },
  { text: 'Complaints', icon: <ReportIcon />, path: '/student-dashboard/complaints' },
  { text: 'Payments', icon: <PaymentIcon />, path: '/student-dashboard/payments' },
  { text: 'My Bookings', icon: <EventNoteIcon />, path: '/student-dashboard/bookings' },
];

export default function Rooms() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await api.get('/rooms');

      // Show all rooms that have at least 1 vacancy (regardless of occupancy_status)
      const roomsWithVacancies = data
        .map((room: any) => ({
          ...room,
          hostel: room.hostel_name ? { hostel_id: room.hostel_id, hostel_name: room.hostel_name } : null,
          vacancies: parseInt(room.vacancies, 10) ?? 0,
        }))
        .filter((room: any) => room.vacancies > 0)
        .sort((a: any, b: any) => a.room_no.localeCompare(b.room_no));

      setRooms(roomsWithVacancies);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setError('Failed to load available rooms');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Available Rooms" menuItems={menuItems}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ color: '#2D3748' }}>
            Available Rooms
          </Typography>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/student-dashboard')}
            sx={{ color: '#6B46C1' }}
          >
            Back to Dashboard
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Loading rooms...</Typography>
          </Box>
        ) : rooms.length === 0 ? (
          <Alert severity="info">No available rooms found</Alert>
        ) : (
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { 
              xs: '1fr', 
              sm: 'repeat(2, 1fr)', 
              md: 'repeat(3, 1fr)' 
            }, 
            gap: 3 
          }}>
            {rooms.map((room) => (
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
                        {room.hostel?.hostel_name || 'Unknown Hostel'}
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary">
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
                    <Typography color="text.secondary">
                      Vacancies: {room.vacancies}
                    </Typography>
                    <Typography variant="h6" color="primary">
                      ₹{room.rent}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={() => setSelectedRoom(room)}
                    >
                      View Details
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

        {/* Room Details Dialog */}
        <Dialog
          open={!!selectedRoom}
          onClose={() => setSelectedRoom(null)}
          maxWidth="sm"
          fullWidth
        >
          {selectedRoom && (
            <>
              <DialogTitle>
                {selectedRoom.hostel?.hostel_name || 'Hostel'} - Room {selectedRoom.room_no}
              </DialogTitle>
              <DialogContent>
                <Stack spacing={2} sx={{ mt: 2 }}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Hostel
                    </Typography>
                    <Typography variant="body1">
                      {selectedRoom.hostel?.hostel_name || 'Not specified'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Room Type
                    </Typography>
                    <Typography variant="body1">{selectedRoom.room_type}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Capacity
                    </Typography>
                    <Typography variant="body1">{selectedRoom.room_capacity} students</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Current Vacancies
                    </Typography>
                    <Typography variant="body1">{selectedRoom.vacancies}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Rent
                    </Typography>
                    <Typography variant="body1">₹{selectedRoom.rent}</Typography>
                  </Box>
                </Stack>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setSelectedRoom(null)}>Close</Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={async () => {
                    if (!selectedRoom) return;
                  
                    // 1. Get currently logged-in user
                    if (!user || user.role !== 'student') {
                      alert('Not logged in as student.');
                      return;
                    }
                  
                    const studentId = user.student_id || user.id;
                  
                    try {
                      // 3. Insert into payment table and create allocation (simulated)
                      // Ideally we'd have a booking endpoint, but for now we emulate the logic
                      await api.post('/payments', {
                        amount: selectedRoom.rent,
                        payment_mode: 'UPI',
                        payment_date: new Date().toISOString().split('T')[0]
                      });

                      await api.post('/allocations', {
                        student_id: studentId,
                        room_id: selectedRoom.room_id,
                        lease_end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
                      });
                  
                      alert('Room booked successfully!');
                    
                      // 5. Update room vacancies (we don't have a room patch endpoint in our backend yet. But the allocation trigger usually handles status!)
                      // Actually the trigger update_room_occupancy updates 'Occupied', but what about vacancies?
                      // We will just let the DB handle it if we had a trigger for vacancies.
                      // Given our simple mock, we'll just ignore manual patching of room vacancies.
                      
                      fetchRooms();
                    } catch (error: any) {
                      console.error('Booking failed:', error.message);
                      alert('Room booking failed!');
                    }
                  
                    setSelectedRoom(null);
                  }}
                  
                >
                  Book Room
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>
    </DashboardLayout>
  );
}