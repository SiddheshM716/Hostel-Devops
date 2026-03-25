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
  Chip
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import DashboardLayout from '../components/DashboardLayout';
import { Visitor, LeaveApplication } from '../types';

export default function WardenApprovals() {
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = useState(0);
  
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [leaves, setLeaves] = useState<LeaveApplication[]>([]);

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

  const handleUpdateVisitor = async (id: number, status: string) => {
    try {
      await api.patch(`/visitors/${id}/status`, { status });
      fetchVisitors();
    } catch (e) {
      alert('Failed to update visitor status');
    }
  };

  const handleUpdateLeave = async (id: number, status: string) => {
    try {
      await api.patch(`/leaves/${id}/status`, { status });
      fetchLeaves();
    } catch (e) {
      alert('Failed to update leave status');
    }
  };

  const getStatusColor = (status: string) => {
    if (status === 'Approved') return 'success';
    if (status === 'Declined') return 'error';
    return 'warning';
  };

  return (
    <DashboardLayout title="Approvals">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ color: '#2D3748' }}>
            Approvals
          </Typography>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/warden-dashboard')} sx={{ color: '#6B46C1' }}>
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
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell><strong>Student</strong></TableCell>
                  <TableCell><strong>Visitor Name</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visitors.map(v => (
                  <TableRow key={v.visitor_id}>
                    <TableCell>{v.student_name}</TableCell>
                    <TableCell>{v.visitor_name}</TableCell>
                    <TableCell>{v.visitor_email}</TableCell>
                    <TableCell>{new Date(v.visitor_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip label={v.status} color={getStatusColor(v.status)} size="small" />
                    </TableCell>
                    <TableCell>
                      {v.status === 'Pending' && (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button size="small" variant="contained" color="success" onClick={() => handleUpdateVisitor(v.visitor_id, 'Approved')}>Approve</Button>
                          <Button size="small" variant="contained" color="error" onClick={() => handleUpdateVisitor(v.visitor_id, 'Declined')}>Decline</Button>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {visitors.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">No visitors found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {tabIndex === 1 && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell><strong>Student</strong></TableCell>
                  <TableCell><strong>Reason</strong></TableCell>
                  <TableCell><strong>Start Date</strong></TableCell>
                  <TableCell><strong>End Date</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaves.map(l => (
                  <TableRow key={l.leave_id}>
                    <TableCell>{l.student_name}</TableCell>
                    <TableCell>{l.reason}</TableCell>
                    <TableCell>{new Date(l.start_date).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(l.end_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip label={l.status} color={getStatusColor(l.status)} size="small" />
                    </TableCell>
                    <TableCell>
                      {l.status === 'Pending' && (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button size="small" variant="contained" color="success" onClick={() => handleUpdateLeave(l.leave_id, 'Approved')}>Approve</Button>
                          <Button size="small" variant="contained" color="error" onClick={() => handleUpdateLeave(l.leave_id, 'Declined')}>Decline</Button>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {leaves.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">No leaves found</TableCell>
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
