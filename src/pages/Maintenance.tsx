import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import { 
  Room as RoomIcon,
  Report as ReportIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import DashboardLayout from '../components/DashboardLayout';
import { api } from '../lib/api';

interface MaintenanceTask {
  task_id: string;
  room_number: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  assigned_to: string;
  created_at: string;
}

const menuItems = [
  { text: 'Dashboard', icon: <RoomIcon />, path: '/warden-dashboard' },
  { text: 'Complaints', icon: <ReportIcon />, path: '/warden-dashboard/warden-complaints' },
  { text: 'Students', icon: <PeopleIcon />, path: '/warden-dashboard/students' },
  { text: 'Maintenance', icon: <AssignmentIcon />, path: '/warden-dashboard/maintenance' },
];

export default function Maintenance() {
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<MaintenanceTask | null>(null);
  const [selectedWorker, setSelectedWorker] = useState('');

  useEffect(() => {
    fetchMaintenanceTasks();
  }, []);

  const fetchMaintenanceTasks = async () => {
    try {
      const data = await api.get('/maintenance');
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching maintenance tasks:', error);
    }
  };

  const handleAssignWorker = async () => {
    if (!selectedTask || !selectedWorker) return;

    try {
      await api.patch(`/maintenance/${(selectedTask as any).maintenance_id}/status`, {
        status: 'In Progress'
      });
      // Worker info is mocked out
      setOpenDialog(false);
      fetchMaintenanceTasks();
    } catch (error) {
      console.error('Error assigning worker:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase();
    switch (s) {
      case 'pending':
        return 'warning';
      case 'in_progress':
        return 'info';
      case 'completed':
        return 'success';
      case 'resolved': // mapping resolved to success just in case
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <DashboardLayout title="Maintenance Tasks" menuItems={menuItems}>
      <Box sx={{ p: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Maintenance Tasks
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Room Number</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Assigned To</TableCell>
                    <TableCell>Created At</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.task_id}>
                      <TableCell>{task.room_number}</TableCell>
                      <TableCell>{task.description}</TableCell>
                      <TableCell>
                        <Chip
                          label={task.status}
                          color={getStatusColor(task.status)}
                          size="small"
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </TableCell>
                      <TableCell>{task.assigned_to || 'Unassigned'}</TableCell>
                      <TableCell>{new Date(task.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {task.status?.toLowerCase() === 'pending' && (
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => {
                              setSelectedTask(task);
                              setOpenDialog(true);
                            }}
                            sx={{ textTransform: 'none' }}
                          >
                            Assign Worker
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
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
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleAssignWorker} variant="contained" color="primary">
              Assign
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
} 