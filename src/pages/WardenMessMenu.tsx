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
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import DashboardLayout from '../components/DashboardLayout';
import { MessMenu } from '../types';

export default function WardenMessMenu() {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState<MessMenu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<MessMenu | null>(null);
  
  const [formData, setFormData] = useState({
    day_of_week: 'Monday',
    meal_type: 'Breakfast',
    veg_item: '',
    non_veg_item: '',
    timing: ''
  });

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

  const handleEdit = (item: MessMenu) => {
    setEditingItem(item);
    setFormData({
      day_of_week: item.day_of_week,
      meal_type: item.meal_type,
      veg_item: item.veg_item,
      non_veg_item: item.non_veg_item || '',
      timing: item.timing
    });
    setOpenDialog(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      day_of_week: 'Monday',
      meal_type: 'Breakfast',
      veg_item: '',
      non_veg_item: '',
      timing: ''
    });
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingItem) {
        await api.patch(`/mess/${editingItem.menu_id}`, formData);
      } else {
        await api.post('/mess', formData);
      }
      setOpenDialog(false);
      fetchMenu();
    } catch (err) {
      alert('Failed to save menu item');
    }
  };

  return (
    <DashboardLayout title="Manage Mess Menu">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ color: '#2D3748' }}>
            Manage Mess Menu
          </Typography>
          <Box>
            <Button variant="contained" color="primary" onClick={handleAdd} sx={{ mr: 2 }}>
              Add Menu Item
            </Button>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/warden-dashboard')} sx={{ color: '#6B46C1' }}>
              Back to Dashboard
            </Button>
          </Box>
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
                  <TableCell><strong>Actions</strong></TableCell>
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
                    <TableCell>
                      <Button size="small" variant="outlined" onClick={() => handleEdit(item)}>Edit</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{editingItem ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Day of Week</InputLabel>
                <Select
                  value={formData.day_of_week}
                  label="Day of Week"
                  onChange={(e) => setFormData({ ...formData, day_of_week: e.target.value })}
                  disabled={!!editingItem} // Usually day/meal_type are fixed, we just edit the items
                >
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                    <MenuItem key={d} value={d}>{d}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Meal Type</InputLabel>
                <Select
                  value={formData.meal_type}
                  label="Meal Type"
                  onChange={(e) => setFormData({ ...formData, meal_type: e.target.value })}
                  disabled={!!editingItem} // Usually day/meal_type are fixed
                >
                  {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map(m => (
                    <MenuItem key={m} value={m}>{m}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField 
                label="Timing" 
                fullWidth 
                value={formData.timing} 
                onChange={(e) => setFormData({ ...formData, timing: e.target.value })} 
              />
              <TextField 
                label="Veg Item" 
                fullWidth 
                multiline
                rows={2}
                value={formData.veg_item} 
                onChange={(e) => setFormData({ ...formData, veg_item: e.target.value })} 
              />
              <TextField 
                label="Non-Veg Item (Optional)" 
                fullWidth 
                multiline
                rows={2}
                value={formData.non_veg_item} 
                onChange={(e) => setFormData({ ...formData, non_veg_item: e.target.value })} 
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>Save</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </DashboardLayout>
  );
}
