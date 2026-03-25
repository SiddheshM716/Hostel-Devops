import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Stack,
  Alert,
} from '@mui/material';
import {
  EventNote as EventNoteIcon,
  ArrowBack as ArrowBackIcon,
  Room as RoomIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/DashboardLayout';


interface Booking {
  booking_id: string;
  room_id: string;
  room_no: string;
  room_type: string;
  check_in_date: string;
  check_out_date: string;
  booking_status: string;
  created_at: string;
}

export default function Bookings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      if (!user) throw new Error('User not authenticated');
      const studentId = user.student_id || user.id;

      // Map allocations to "bookings" structure since the schema doesn't have booking table
      const data = await api.get('/allocations');
      const myAllocations = data.filter((a: any) => a.student_id === studentId).map((a: any) => ({
          booking_id: a.allocation_id,
          room_id: a.room_id,
          room_no: a.room_no,
          room_type: 'Mapped from Allocation',
          check_in_date: a.allocation_date,
          check_out_date: a.lease_end_date,
          booking_status: 'Confirmed',
          created_at: a.allocation_date
      }));

      setBookings(myAllocations);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Failed to load booking history');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <DashboardLayout title="My Bookings">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ color: '#2D3748' }}>
            My Bookings
          </Typography>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/student-dashboard')}
            sx={{ color: '#6B46C1' }}
          >
            Back to Dashboard
          </Button>
        </Box>

        <Card>
          <CardContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Room Details</TableCell>
                    <TableCell>Check-in Date</TableCell>
                    <TableCell>Check-out Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Booking Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.booking_id}>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <RoomIcon color="primary" />
                          <Box>
                            <Typography variant="body1">
                              Room {booking.room_no}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {booking.room_type}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        {new Date(booking.check_in_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(booking.check_out_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={booking.booking_status}
                          color={getStatusColor(booking.booking_status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(booking.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                  {bookings.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No bookings found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Container>
    </DashboardLayout>
  );
} 