import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
} from '@mui/material';
import {
  Home as HomeIcon,
  Security as SecurityIcon,
  Payment as PaymentIcon,
  Support as SupportIcon,
  Room as RoomIcon,
  Assignment as AssignmentIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';

const features = [
  {
    icon: <RoomIcon sx={{ fontSize: 32 }} />,
    title: 'Easy Room Booking',
    description: 'Browse available rooms, check amenities, and book your preferred accommodation with just a few clicks.',
  },
  {
    icon: <AssignmentIcon sx={{ fontSize: 32 }} />,
    title: 'Complaint Management',
    description: 'Raise maintenance requests and track their status in real-time. Get quick responses from hostel management.',
  },
  {
    icon: <PaymentIcon sx={{ fontSize: 32 }} />,
    title: 'Secure Payments',
    description: 'Make hassle-free payments for room rent, mess charges, and other expenses through multiple secure options.',
  },
  {
    icon: <HomeIcon sx={{ fontSize: 32 }} />,
    title: 'Booking Management',
    description: 'View your booking history, manage room preferences, and handle lease renewals efficiently.',
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 32 }} />,
    title: '24/7 Security',
    description: 'Rest assured with round-the-clock security, CCTV surveillance, and controlled access to hostel premises.',
  },
  {
    icon: <SupportIcon sx={{ fontSize: 32 }} />,
    title: 'Dedicated Support',
    description: 'Get assistance from hostel wardens and support staff for any queries or concerns.',
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', overflowX: 'hidden', position: 'relative' }} className="hero-gradient">
      {/* Decorative Blur Orbs */}
      <Box sx={{
        position: 'absolute',
        top: '-10%',
        right: '-5%',
        width: '500px',
        height: '500px',
        bgcolor: 'rgba(107, 70, 193, 0.15)',
        filter: 'blur(100px)',
        borderRadius: '50%',
        zIndex: -1,
      }} />
      <Box sx={{
        position: 'absolute',
        bottom: '10%',
        left: '-5%',
        width: '400px',
        height: '400px',
        bgcolor: 'rgba(139, 92, 246, 0.1)',
        filter: 'blur(100px)',
        borderRadius: '50%',
        zIndex: -1,
      }} />

      {/* Navigation Header */}
      <Container maxWidth="lg" sx={{ pt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>
          HMS.
        </Typography>
        <Stack direction="row" spacing={3}>
          <Button onClick={() => navigate('/signin')} sx={{ color: 'hsl(var(--foreground))', fontWeight: 600, textTransform: 'none' }}>
            Login
          </Button>
          <Button 
            variant="contained" 
            onClick={() => navigate('/signup')} 
            sx={{ 
              bgcolor: 'primary.main', 
              borderRadius: '24px', 
              px: 4,
              boxShadow: '0 4px 14px 0 rgba(124, 58, 237, 0.39)',
              textTransform: 'none',
              '&:hover': {
                bgcolor: 'primary.dark',
              }
            }}
          >
            Get Started
          </Button>
        </Stack>
      </Container>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 15 } }}>
        <Grid container spacing={8} alignItems="center">
          <Grid item xs={12} md={6} className="animate-fade-in">
            <Typography
              variant="h1"
              sx={{
                mb: 3,
                fontSize: { xs: '3rem', md: '4.5rem' },
                lineHeight: 1.1,
                color: 'hsl(var(--foreground))',
              }}
            >
              The Next Gen <br />
              <span className="gradient-text">Hostel Experience.</span>
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 6,
                fontSize: '1.25rem',
                color: 'text.secondary',
                maxWidth: '500px',
                lineHeight: 1.6,
              }}
            >
              Experience seamless booking, instant support, and a vibrant community with our advanced management solution.
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/signup')}
                endIcon={<ArrowIcon />}
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  borderRadius: '12px',
                  px: 5,
                  py: 2,
                  fontWeight: 600,
                  boxShadow: '0 10px 15px -3px rgba(124, 58, 237, 0.3)',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Book Now
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} className="animate-fade-in animate-delay-1">
            <Box
              sx={{
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '-5%',
                  right: '-5%',
                  width: '110%',
                  height: '110%',
                  background: 'linear-gradient(135deg, rgba(107, 70, 193, 0.4) 0%, transparent 100%)',
                  borderRadius: '32px',
                  filter: 'blur(24px)',
                  zIndex: -1,
                }
              }}
            >
              <Box
                component="img"
                src="/hostel-hero-premium.png"
                alt="Modern Hostel Interior"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '24px',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                  transform: 'perspective(1000px) rotateY(-5deg)',
                  transition: 'transform 0.5s ease',
                  '&:hover': {
                    transform: 'perspective(1000px) rotateY(0deg)',
                  }
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Features Heading */}
      <Box sx={{ bgcolor: 'white', py: 15 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            sx={{ mb: 10, fontSize: { xs: '2.5rem', md: '3.5rem' } }}
          >
            Smarter Ways to <span className="gradient-text">Live.</span>
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index} className={`animate-fade-in animate-delay-${(index % 3) + 1}`}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: '24px',
                    boxShadow: 'none',
                    border: '1px solid rgba(0,0,0,0.05)',
                    p: 2,
                    transition: 'all 0.4s ease',
                    '&:hover': {
                      transform: 'translateY(-12px)',
                      boxShadow: '0 20px 40px rgba(107, 70, 193, 0.08)',
                      borderColor: 'rgba(107, 70, 193, 0.2)',
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: 'left', p: 3 }}>
                    <Box sx={{ 
                      width: 60, 
                      height: 60, 
                      borderRadius: '16px', 
                      bgcolor: 'rgba(107, 70, 193, 0.1)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: 'hsl(var(--primary))',
                      mb: 4
                    }}>
                      {feature.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ fontWeight: 700, mb: 2 }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ opacity: 0.8 }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 15, position: 'relative' }}>
        <Container maxWidth="md">
          <Box className="glass"
            sx={{
              borderRadius: '40px',
              p: { xs: 6, md: 10 },
              textAlign: 'center',
              border: '1px solid rgba(107, 70, 193, 0.2)',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            <Typography
              variant="h3"
              sx={{ fontWeight: 700, mb: 3 }}
            >
              Start Your Journey <br />
              With Us Today.
            </Typography>
            <Typography
              variant="h6"
              sx={{ mb: 6, color: 'text.secondary', opacity: 0.7 }}
            >
              Create your account in minutes and enjoy the best student experience.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/signup')}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                borderRadius: '14px',
                px: 8,
                py: 2.5,
                fontWeight: 600,
                fontSize: '1.1rem',
                boxShadow: '0 10px 15px -3px rgba(124, 58, 237, 0.3)',
                '&:hover': {
                  bgcolor: 'primary.dark',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Create Free Account
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Simple Footer */}
      <Container maxWidth="lg" sx={{ py: 6, borderTop: '1px solid rgba(0,0,0,0.05)', textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} HMS Hostel Management System. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
} 