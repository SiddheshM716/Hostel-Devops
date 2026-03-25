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
  Button,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import DashboardLayout from '../components/DashboardLayout';
import { Visitor, LeaveApplication } from '../types';

export default function StudentRequests() {
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = useState(0);
  
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [leaves, setLeaves] = useState<LeaveApplication[]>([]);
  
  const [openVisitorDialog, setOpenVisitorDialog] = useState(false);
  const [visitorForm, setVisitorForm] = useState({ visitor_name: '', visitor_email: '', visitor_date: '' });
  
  const [openLeaveDialog, setOpenLeaveDialog] = useState(false);
  const [leaveForm, setLeaveForm] = useState({ start_date: '', end_date: '', reason: '' });

  useEffect(() => {
    fetchVisitors();
    fetchLeaves();
  }, []);

  const fetchVisitors = async () => {
    try {
      const data = await api.get('/visitors');
      setVisitors(data);
    } catch (e) {}
  };

  const fetchLeaves = async () => {
    try {
      const data = await api.get('/leaves');
      setLeaves(data);
    } catch (e) {}
  };

  const handleApplyVisitor = async () => {
    try {
      await api.post('/visitors', visitorForm);
      setOpenVisitorDialog(false);
      fetchVisitors();
    } catch (e) {
      alert('Failed to apply for visitor');
    }
  };

  const handleApplyLeave = async () => {
    try {
      await api.post('/leaves', leaveForm);
      setOpenLeaveDialog(false);
      fetchLeaves();
    } catch (e) {
      alert('Failed to apply for leave');
    }
  };

  const getStatusColor = (status: string) => {
    if (status === 'Approved') return 'success';
    if (status === 'Declined') return 'error';
    return 'warning';
  };

  return (
    <DashboardLayout title="My Requests">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ color: '#2D3748' }}>
            My Requests
          </Typography>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/student-dashboard')} sx={{ color: '#6B46C1' }}>
            Back to Dashboard
          </Button>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabIndex} onChange={(_, nv) => setTabIndex(nv)}>
            <Tab label="Visitors" />
            <Tab label="Leaves" />
          </Tabs>
        </Box>

        {tabIndex === 0 && (
          <Box>
            <Button variant="contained" color="primary" onClick={() => setOpenVisitorDialog(true)} sx={{ mb: 2 }}>
              Apply for Visitor
            </Button>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell><strong>Visitor Name</strong></TableCell>
                    <TableCell><strong>Email</strong></TableCell>
                    <TableCell><strong>Date</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Reviewed By</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visitors.map(v => (
                    <TableRow key={v.visitor_id}>
                      <TableCell>{v.visitor_name}</TableCell>
                      <TableCell>{v.visitor_email}</TableCell>
                      <TableCell>{new Date(v.visitor_date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Chip label={v.status} color={getStatusColor(v.status)} size="small" />
                      </TableCell>
                      <TableCell>{v.warden_name || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                  {visitors.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">No visitors found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {tabIndex === 1 && (
          <Box>
            <Button variant="contained" color="primary" onClick={() => setOpenLeaveDialog(true)} sx={{ mb: 2 }}>
              Apply for Leave
            </Button>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell><strong>Reason</strong></TableCell>
                    <TableCell><strong>Start Date</strong></TableCell>
                    <TableCell><strong>End Date</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Reviewed By</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leaves.map(l => (
                    <TableRow key={l.leave_id}>
                      <TableCell>{l.reason}</TableCell>
                      <TableCell>{new Date(l.start_date).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(l.end_date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Chip label={l.status} color={getStatusColor(l.status)} size="small" />
                      </TableCell>
                      <TableCell>{l.warden_name || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                  {leaves.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">No leaves found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        <Dialog open={openVisitorDialog} onClose={() => setOpenVisitorDialog(false)}>
          <DialogTitle>Apply for Visitor</DialogTitle>
          <DialogContent>
            <TextField label="Visitor Name" fullWidth margin="normal" value={visitorForm.visitor_name} onChange={e => setVisitorForm({...visitorForm, visitor_name: e.target.value})} />
            <TextField label="Visitor Email" fullWidth margin="normal" value={visitorForm.visitor_email} onChange={e => setVisitorForm({...visitorForm, visitor_email: e.target.value})} />
            <TextField label="Date" fullWidth margin="normal" type="date" InputLabelProps={{ shrink: true }} value={visitorForm.visitor_date} onChange={e => setVisitorForm({...visitorForm, visitor_date: e.target.value})} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenVisitorDialog(false)}>Cancel</Button>
            <Button onClick={handleApplyVisitor} variant="contained">Apply</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openLeaveDialog} onClose={() => setOpenLeaveDialog(false)}>
          <DialogTitle>Apply for Leave</DialogTitle>
          <DialogContent>
            <TextField label="Reason" fullWidth margin="normal" value={leaveForm.reason} onChange={e => setLeaveForm({...leaveForm, reason: e.target.value})} />
            <TextField label="Start Date" fullWidth margin="normal" type="date" InputLabelProps={{ shrink: true }} value={leaveForm.start_date} onChange={e => setLeaveForm({...leaveForm, start_date: e.target.value})} />
            <TextField label="End Date" fullWidth margin="normal" type="date" InputLabelProps={{ shrink: true }} value={leaveForm.end_date} onChange={e => setLeaveForm({...leaveForm, end_date: e.target.value})} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenLeaveDialog(false)}>Cancel</Button>
            <Button onClick={handleApplyLeave} variant="contained">Apply</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </DashboardLayout>
  );
}
