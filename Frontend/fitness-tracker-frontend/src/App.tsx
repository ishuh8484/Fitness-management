import { BrowserRouter as Router, Navigate, Routes, Route } from 'react-router'
import Button from '@mui/material/Button';
import { useAuthContext } from 'react-oauth2-code-pkce';
import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { setCredentials } from './store/authSlice.ts';
import Box from '@mui/material/Box';
import { CircularProgress, Container, Typography, Paper } from '@mui/material';
import ActivityForm from './components/ActivityForm.tsx';
import ActivityList from './components/ActivityList.tsx';
import ActivityDetails from './components/ActivityDetails.tsx';
import Layout from './components/Layout.tsx';
import { TokenData } from './types/index.ts';
import { AppDispatch } from './store/store.ts';
import LoginIcon from '@mui/icons-material/Login';

const ActivitiesPage = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
          Add New Activity
        </Typography>
        <Paper elevation={2} sx={{ p: 3, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
          <ActivityForm onActivityAdded={() => window.location.reload()} />
        </Paper>
      </Box>

      <Box>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
          Your Activities
        </Typography>
        <ActivityList />
      </Box>
    </Box>
  );
};

function App() {
  const { token, tokenData, logIn, logOut } = useAuthContext() || {};
  const dispatch = useDispatch<AppDispatch>();
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    if (token && tokenData) {
      dispatch(setCredentials({ token, user: tokenData as TokenData }));
      setAuthReady(true);
    }
  }, [token, tokenData, dispatch])

  return (
    <Router>
      {!token ? (
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          gap: 3,
        }}>
          <Box sx={{ textAlign: 'center', color: 'white' }}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
              Fitness Tracker
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mb: 4 }}>
              Track your workouts. Get intelligent insights.
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="large"
            onClick={() => logIn?.()}
            startIcon={<LoginIcon />}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #fff 0%, #f0f0f0 100%)',
              color: '#667eea',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Login with Keycloak
          </Button>
        </Box>
      ) : !authReady ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress size={60} />
        </Box>
      ) : (
        <Layout onLogout={() => logOut?.()} showLogout={true}>
          <Routes>
            <Route path="/activities" element={<ActivitiesPage />} />
            <Route path="/activities/:id" element={<ActivityDetails />} />
            <Route path="/" element={<Navigate to="/activities" replace />} />
          </Routes>
        </Layout>
      )}
    </Router>
  )
}

export default App
