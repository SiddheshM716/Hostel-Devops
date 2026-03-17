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
  TextField,
  InputAdornment,
} from '@mui/material';
import { 
  Search as SearchIcon,
  Room as RoomIcon,
  Report as ReportIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import DashboardLayout from '../components/DashboardLayout';
import { api } from '../lib/api';

interface Student {
  student_id: string;
  name: string;
  email: string;
  room_number: string;
  phone_number: string;
}

const menuItems = [
  { text: 'Dashboard', icon: <RoomIcon />, path: '/warden-dashboard' },
  { text: 'Complaints', icon: <ReportIcon />, path: '/warden-dashboard/warden-complaints' },
  { text: 'Students', icon: <PeopleIcon />, path: '/warden-dashboard/students' },
  { text: 'Maintenance', icon: <AssignmentIcon />, path: '/warden-dashboard/maintenance' },
];

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const data = await api.get('/students');
      
      // Convert to match expected frontend structure if needed
      setStudents(data.map((s: any) => ({
        ...s,
        phone_number: s.contact_number
      })));
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.room_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout title="Student Management" menuItems={menuItems}>
      <Box sx={{ p: 3 }}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Student List
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Room Number</TableCell>
                    <TableCell>Phone Number</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.student_id}>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.room_number}</TableCell>
                      <TableCell>{student.phone_number}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  );
} 