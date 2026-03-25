import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
  Stack,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Room as RoomIcon,
  Report as ReportIcon,
  Payment as PaymentIcon,
  EventNote as EventNoteIcon,
  RestaurantMenu as RestaurantMenuIcon,
  CardTravel as CardTravelIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const studentMenuItems = [
  { text: 'Dashboard', icon: <RoomIcon />, path: '/student-dashboard' },
  { text: 'Complaints', icon: <ReportIcon />, path: '/student-dashboard/complaints' },
  { text: 'Payments', icon: <PaymentIcon />, path: '/student-dashboard/payments' },
  { text: 'My Bookings', icon: <EventNoteIcon />, path: '/student-dashboard/bookings' },
  { text: 'Mess Menu', icon: <RestaurantMenuIcon />, path: '/student-dashboard/mess' },
  { text: 'My Requests', icon: <CardTravelIcon />, path: '/student-dashboard/requests' },
];

const wardenMenuItems = [
  { text: 'Dashboard', icon: <RoomIcon />, path: '/warden-dashboard' },
  { text: 'Complaints', icon: <ReportIcon />, path: '/warden-dashboard/warden-complaints' },
  { text: 'Students', icon: <PeopleIcon />, path: '/warden-dashboard/students' },
  { text: 'Rooms', icon: <RoomIcon />, path: '/warden-dashboard/rooms' },
  { text: 'Mess Menu', icon: <RestaurantMenuIcon />, path: '/warden-dashboard/mess' },
  { text: 'Approvals', icon: <CheckCircleIcon />, path: '/warden-dashboard/approvals' },
];

const drawerWidth = 240;

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  
  const menuItems = user?.role === 'warden' ? wardenMenuItems : studentMenuItems;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          {title || 'HostelMate'}
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            onClick={() => {
              navigate(item.path);
              setMobileOpen(false);
            }}
            selected={location.pathname === item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            HostelMate
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body1" sx={{ display: { xs: 'none', sm: 'block' } }}>
              {user?.name}
            </Typography>
            <Button
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={handleSignOut}
              sx={{ display: { xs: 'none', sm: 'flex' } }}
            >
              Sign Out
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
        }}
      >
        {children}
      </Box>
    </Box>
  );
} 