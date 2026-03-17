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
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Payment as PaymentIcon,
  ArrowBack as ArrowBackIcon,
  Room as RoomIcon,
  Report as ReportIcon,
  EventNote as EventNoteIcon,
  Add as AddIcon,
  AttachMoney as AttachMoneyIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import DashboardLayout from '../components/DashboardLayout';

const menuItems = [
  { text: 'Dashboard', icon: <RoomIcon />, path: '/student-dashboard' },
  { text: 'Complaints', icon: <ReportIcon />, path: '/student-dashboard/complaints' },
  { text: 'Payments', icon: <PaymentIcon />, path: '/student-dashboard/payments' },
  { text: 'My Bookings', icon: <EventNoteIcon />, path: '/student-dashboard/bookings' },
];

interface Payment {
  payment_id: number;
  student_id: number;
  amount: number;
  payment_date: string;
  payment_mode: string;
  student_name?: string;
}

export default function Payments() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newPayment, setNewPayment] = useState({
    amount: '',
    payment_mode: 'UPI',
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const data = await api.get('/payments');
      setPayments(data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setError('Failed to load payment history');
    }
  };

  const handleAddPayment = async () => {
    if (!newPayment.amount || parseFloat(newPayment.amount) <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await api.post('/payments', {
        amount: parseFloat(newPayment.amount),
        payment_mode: newPayment.payment_mode,
        payment_date: new Date().toISOString().split('T')[0],
      });
      setSuccess('Payment recorded successfully!');
      setOpenDialog(false);
      setNewPayment({ amount: '', payment_mode: 'UPI' });
      fetchPayments();
    } catch (err) {
      console.error('Payment error:', err);
      setError('Failed to record payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const totalPaid = payments.reduce((sum, p) => sum + parseFloat(p.amount as any), 0);
  const lastPayment = payments[0];

  return (
    <DashboardLayout title="Payment History" menuItems={menuItems}>
      <Container maxWidth="lg" sx={{ py: 4 }}>

        {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>{success}</Alert>}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ color: '#2D3748' }}>
            Payment History
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
              sx={{ bgcolor: '#6B46C1', '&:hover': { bgcolor: '#553C9A' } }}
            >
              Make Payment
            </Button>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/student-dashboard')}
              sx={{ color: '#6B46C1' }}
            >
              Back
            </Button>
          </Box>
        </Box>

        {/* Summary Cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 3, mb: 4 }}>
          <Card sx={{ background: 'linear-gradient(135deg, #6B46C1 0%, #805AD5 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <AttachMoneyIcon />
                <Typography variant="h6">Total Paid</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold">
                ₹{totalPaid.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
                Across {payments.length} payment{payments.length !== 1 ? 's' : ''}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ background: 'linear-gradient(135deg, #2D3748 0%, #4A5568 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <TrendingUpIcon />
                <Typography variant="h6">Latest Payment</Typography>
              </Box>
              {lastPayment ? (
                <>
                  <Typography variant="h4" fontWeight="bold">
                    ₹{parseFloat(lastPayment.amount as any).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
                    {new Date(lastPayment.payment_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} · {lastPayment.payment_mode}
                  </Typography>
                </>
              ) : (
                <Typography variant="body1" sx={{ opacity: 0.75 }}>No payments yet</Typography>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Payment Table */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, color: '#2D3748' }}>Transaction History</Typography>
            <Divider sx={{ mb: 2 }} />
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow sx={{ '& th': { fontWeight: 700, color: '#4A5568', bgcolor: '#F7FAFC' } }}>
                    <TableCell>#</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Payment Mode</TableCell>
                    <TableCell align="center">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payments.map((payment, index) => (
                    <TableRow key={payment.payment_id} hover>
                      <TableCell sx={{ color: '#718096' }}>{index + 1}</TableCell>
                      <TableCell>
                        {new Date(payment.payment_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight={600} color="#6B46C1">
                          ₹{parseFloat(payment.amount as any).toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={payment.payment_mode}
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip label="Completed" color="success" size="small" />
                      </TableCell>
                    </TableRow>
                  ))}
                  {payments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 6, color: '#718096' }}>
                        No payment history found. Make your first payment above!
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Add Payment Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="xs" fullWidth>
          <DialogTitle>Make a Payment</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'grid', gap: 2, pt: 2 }}>
              <TextField
                fullWidth
                label="Amount (₹)"
                type="number"
                value={newPayment.amount}
                onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                inputProps={{ min: 1 }}
                required
              />
              <FormControl fullWidth>
                <InputLabel>Payment Mode</InputLabel>
                <Select
                  value={newPayment.payment_mode}
                  label="Payment Mode"
                  onChange={(e) => setNewPayment({ ...newPayment, payment_mode: e.target.value })}
                >
                  <MenuItem value="UPI">UPI</MenuItem>
                  <MenuItem value="Credit Card">Credit Card</MenuItem>
                  <MenuItem value="Debit Card">Debit Card</MenuItem>
                  <MenuItem value="Net Banking">Net Banking</MenuItem>
                  <MenuItem value="Cash">Cash</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleAddPayment}
              disabled={loading}
              sx={{ bgcolor: '#6B46C1', '&:hover': { bgcolor: '#553C9A' } }}
            >
              {loading ? 'Processing...' : 'Confirm Payment'}
            </Button>
          </DialogActions>
        </Dialog>

      </Container>
    </DashboardLayout>
  );
}