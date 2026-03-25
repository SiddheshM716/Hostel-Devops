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
  Chip,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
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


export default function Rooms() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [allRooms, setAllRooms] = useState<Room[]>([]);
  const [displayedRooms, setDisplayedRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const [capacityFilter, setCapacityFilter] = useState<string>('all');
  const [acFilter, setAcFilter] = useState<string>('all');
  const [bathroomFilter, setBathroomFilter] = useState<string>('all');

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    let filtered = allRooms;
    if (capacityFilter !== 'all') {
      filtered = filtered.filter(r => r.room_capacity === parseInt(capacityFilter));
    }
    if (acFilter !== 'all') {
      const isAc = acFilter === 'true';
      filtered = filtered.filter(r => r.has_ac === isAc);
    }
    if (bathroomFilter !== 'all') {
      const isAttached = bathroomFilter === 'true';
      filtered = filtered.filter(r => r.has_attached_bathroom === isAttached);
    }
    setDisplayedRooms(filtered);
  }, [allRooms, capacityFilter, acFilter, bathroomFilter]);

  const fetchRooms = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await api.get('/rooms');

      const roomsWithVacancies = data
        .map((room: any) => ({
          ...room,
          hostel: room.hostel_name ? { hostel_id: room.hostel_id, hostel_name: room.hostel_name } : null,
          vacancies: parseInt(room.vacancies, 10) ?? 0,
        }))
        .filter((room: any) => room.vacancies > 0)
        .sort((a: any, b: any) => a.room_no.localeCompare(b.room_no));

      setAllRooms(roomsWithVacancies);
      setDisplayedRooms(roomsWithVacancies);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setError('Failed to load available rooms');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Available Rooms">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ color: '#2D3748' }}>
            Available Rooms
          </Typography>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(user?.role === 'warden' ? '/warden-dashboard' : '/student-dashboard')}
            sx={{ color: '#6B46C1' }}
          >
            Back to Dashboard
          </Button>
        </Box>

        {/* Filters */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Capacity</InputLabel>
            <Select
              value={capacityFilter}
              label="Capacity"
              onChange={(e) => setCapacityFilter(e.target.value)}
            >
              <MenuItem value="all">Any</MenuItem>
              <MenuItem value="1">1 Person</MenuItem>
              <MenuItem value="2">2 Persons</MenuItem>
              <MenuItem value="3">3 Persons</MenuItem>
              <MenuItem value="4">4 Persons</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>AC</InputLabel>
            <Select
              value={acFilter}
              label="AC"
              onChange={(e) => setAcFilter(e.target.value)}
            >
              <MenuItem value="all">Any</MenuItem>
              <MenuItem value="true">Yes</MenuItem>
              <MenuItem value="false">No</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel>Attached Bathroom</InputLabel>
            <Select
              value={bathroomFilter}
              label="Attached Bathroom"
              onChange={(e) => setBathroomFilter(e.target.value)}
            >
              <MenuItem value="all">Any</MenuItem>
              <MenuItem value="true">Yes</MenuItem>
              <MenuItem value="false">No</MenuItem>
            </Select>
          </FormControl>
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
        ) : displayedRooms.length === 0 ? (
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
            {displayedRooms.map((room) => (
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
                      <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap', gap: 1 }}>
                        <Chip
                          label={room.room_type}
                          color="primary"
                          size="small"
                        />
                        {room.has_ac && <Chip label="AC" color="secondary" size="small" />}
                        {room.has_attached_bathroom && <Chip label="Attached Bath" color="default" size="small" />}
                      </Stack>
                    </Box>
                    <Typography color="text.secondary">
                      Capacity: {room.room_capacity} students
                    </Typography>
                    <Typography color="text.secondary">
                      Vacancies: {room.vacancies}
                    </Typography>
                    <Typography variant="h6" color="primary">
                      Yearly Fee: ₹{room.yearly_fee}
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
                      Amenities
                    </Typography>
                    <Typography variant="body1">
                      {selectedRoom.has_ac ? 'AC' : 'Non-AC'},{' '}
                      {selectedRoom.has_attached_bathroom ? 'Attached Bathroom' : 'Shared Bathroom'}
                    </Typography>
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
                      Yearly Fee
                    </Typography>
                    <Typography variant="body1">₹{selectedRoom.yearly_fee}</Typography>
                  </Box>
                </Stack>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setSelectedRoom(null)}>Close</Button>
                {user?.role === 'student' && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={async () => {
                    if (!selectedRoom) return;
                  
                    if (!user || user.role !== 'student') {
                      alert('Not logged in as student.');
                      return;
                    }
                  
                    const studentId = user.student_id || user.id;
                  
                    try {
                      await api.post('/payments', {
                        amount: selectedRoom.yearly_fee,
                        payment_mode: 'UPI',
                        payment_date: new Date().toISOString().split('T')[0]
                      });

                      await api.post('/allocations', {
                        student_id: studentId,
                        room_id: selectedRoom.room_id,
                        lease_end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
                      });
                  
                      alert('Room booked successfully!');
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
                )}
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>
    </DashboardLayout>
  );
}