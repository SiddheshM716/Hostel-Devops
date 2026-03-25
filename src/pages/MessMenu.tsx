import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  CircularProgress,
  Button
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import DashboardLayout from '../components/DashboardLayout';
import { MessMenu } from '../types';

export default function StudentMessMenu() {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState<MessMenu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const data = await api.get('/mess');
      setMenuItems(data);
    } catch (err: any) {
      setError('Failed to load mess menu');
    } finally {
      setLoading(false);
    }
  };


  return (
    <DashboardLayout title="Mess Menu">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ color: '#2D3748' }}>
            Weekly Mess Menu
          </Typography>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/student-dashboard')} sx={{ color: '#6B46C1' }}>
            Back to Dashboard
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell><strong>Day</strong></TableCell>
                  <TableCell><strong>Meal Type</strong></TableCell>
                  <TableCell><strong>Timing</strong></TableCell>
                  <TableCell><strong>Veg Item</strong></TableCell>
                  <TableCell><strong>Non-Veg Item</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {menuItems.map((item) => (
                  <TableRow key={item.menu_id}>
                    <TableCell>{item.day_of_week}</TableCell>
                    <TableCell>{item.meal_type}</TableCell>
                    <TableCell>{item.timing}</TableCell>
                    <TableCell>{item.veg_item}</TableCell>
                    <TableCell>{item.non_veg_item || '-'}</TableCell>
                  </TableRow>
                ))}
                {menuItems.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">No menu available</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </DashboardLayout>
  );
}
