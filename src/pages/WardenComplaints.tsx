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
  CircularProgress,
  Alert,
} from '@mui/material';
import { 
  Room as RoomIcon,
  Report as ReportIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import DashboardLayout from '../components/DashboardLayout';
import { api } from '../lib/api';

interface Complaint {
  complaint_id: string;
  description: string;
  complaint_type: string;
  complaint_status: string;
  student_id: string;
  room_no: string;
  room_type: string;
  hostel_id: number;
  assigned_to?: string;
  updated_at: string;
}


export default function WardenComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [selectedWorker, setSelectedWorker] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const workers = ['Maintenance Staff 1', 'Maintenance Staff 2', 'Electrician', 'Plumber'];
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError(null);
  
      const data = await api.get('/complaints');
      setComplaints(data || []);
    } catch (err) {
      console.error('Error fetching complaints:', err);
      setError('Failed to load complaints. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // First, create this function in your database
  // CREATE OR REPLACE FUNCTION public.execute_query(query text)
  // RETURNS SETOF record
  // LANGUAGE plpgsql
  // AS $$
  // BEGIN
  //   RETURN QUERY EXECUTE query;
  // END;
  // $$;

  const handleAssignWorker = async () => {
    if (!selectedComplaint || !selectedWorker) return;

    try {
      setLoading(true);
      await api.patch(`/complaints/${selectedComplaint.complaint_id}/status`, {
        status: 'In Progress',
        assigned_to: selectedWorker
      });
      // The worker isn't tracked in schema
      
      setOpenDialog(false);
      setSelectedWorker('');
      fetchComplaints();
    } catch (err) {
      console.error('Error assigning worker:', err);
      setError('Failed to assign worker. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResolveComplaint = async (complaintId: string) => {
    try {
      setResolvingId(complaintId);
      await api.patch(`/complaints/${complaintId}/status`, {
        status: 'Resolved'
      });
      fetchComplaints();
    } catch (err) {
      console.error('Error resolving complaint:', err);
      setError('Failed to resolve complaint. Please try again.');
    } finally {
      setResolvingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase();
    switch (s) {
      case 'pending':
        return 'warning';
      case 'in_progress':
        return 'info';
      case 'resolved':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <DashboardLayout title="Complaints Management">
      <Box sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Complaints
            </Typography>
            
            {loading && !complaints.length ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Room Number</TableCell>
                      <TableCell>Hostel ID</TableCell>
                      <TableCell>Room Type</TableCell>
                      <TableCell>Complaint Type</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Assigned To</TableCell>
                      <TableCell>Last Updated</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {complaints.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} align="center">
                          No complaints found
                        </TableCell>
                      </TableRow>
                    ) : (
                      complaints.map((complaint) => (
                        <TableRow key={complaint.complaint_id}>
                          <TableCell>{complaint.room_no}</TableCell>
                          <TableCell>{complaint.hostel_id}</TableCell>
                          <TableCell>{complaint.room_type}</TableCell>
                          <TableCell>{complaint.complaint_type}</TableCell>
                          <TableCell>{complaint.description}</TableCell>
                          <TableCell>
                            <Chip
                              label={(complaint.complaint_status || 'pending').replace('_', ' ')}
                              color={getStatusColor(complaint.complaint_status)}
                              size="small"
                              sx={{ textTransform: 'capitalize' }}
                            />
                          </TableCell>
                          <TableCell>{complaint.assigned_to || 'Unassigned'}</TableCell>
                          <TableCell>
                            {new Date(complaint.updated_at).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {complaint.complaint_status?.toLowerCase() === 'pending' && (
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                  variant="contained"
                                  size="small"
                                  onClick={() => {
                                    setSelectedComplaint(complaint);
                                    setOpenDialog(true);
                                  }}
                                  disabled={loading}
                                  sx={{ textTransform: 'none' }}
                                >
                                  Assign
                                </Button>
                                <Button
                                  variant="outlined"
                                  color="success"
                                  size="small"
                                  onClick={() => handleResolveComplaint(complaint.complaint_id)}
                                  disabled={loading || resolvingId === complaint.complaint_id}
                                  sx={{ textTransform: 'none' }}
                                >
                                  Resolve
                                </Button>
                              </Box>
                            )}
                            {(complaint.complaint_status?.toLowerCase() === 'in_progress' || complaint.complaint_status?.toLowerCase() === 'in progress') && (
                              <Button
                                variant="contained"
                                color="success"
                                size="small"
                                onClick={() => handleResolveComplaint(complaint.complaint_id)}
                                disabled={loading || resolvingId === complaint.complaint_id}
                                sx={{ textTransform: 'none' }}
                              >
                                {resolvingId === complaint.complaint_id ? (
                                  <CircularProgress size={24} />
                                ) : (
                                  'Mark Resolved'
                                )}
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>

        <Dialog open={openDialog} onClose={() => !loading && setOpenDialog(false)}>
          <DialogTitle>Assign Worker to Complaint</DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              Room: {selectedComplaint?.room_no} (Hostel: {selectedComplaint?.hostel_id})
            </Typography>
            <Typography variant="body1" gutterBottom>
              Complaint Type: {selectedComplaint?.complaint_type}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Description: {selectedComplaint?.description}
            </Typography>
            <TextField
              select
              fullWidth
              label="Select Worker"
              value={selectedWorker}
              onChange={(e) => setSelectedWorker(e.target.value)}
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {workers.map((worker) => (
                <MenuItem key={worker} value={worker}>
                  {worker}
                </MenuItem>
              ))}
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setOpenDialog(false)} 
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAssignWorker} 
              variant="contained" 
              color="primary"
              disabled={loading || !selectedWorker}
            >
              {loading ? <CircularProgress size={24} /> : 'Assign Worker'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
}