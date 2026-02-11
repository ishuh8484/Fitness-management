import { FC, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import {
  Box,
  Card,
  CardContent,
  Divider,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Chip,
  Paper,
  Container,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Skeleton,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import SecurityIcon from '@mui/icons-material/Security'
import TimelapseIcon from '@mui/icons-material/Timelapse'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun'
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler'
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk'
import { addActivityDetail } from '../services/apiFetch.ts';
import { Recommendation } from '../types/index.ts';

interface ActivityDetailsParams {
  id: string;
}

const ActivityDetails: FC = () => {
  const { id } = useParams<ActivityDetailsParams>();
  const navigate = useNavigate();
  const [activity, setActivity] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivityDetail = async () => {
      try {
        if (!id) throw new Error('Activity ID not found');
        setLoading(true);
        setError(null);
        const response = await addActivityDetail(id);
        setActivity(response.data);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Failed to load activity details';
        setError(errorMsg);
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchActivityDetail();
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/activities')} sx={{ mb: 3 }}>
          Back to Activities
        </Button>
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/activities')} sx={{ mb: 3 }}>
          Back to Activities
        </Button>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!activity) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/activities')} sx={{ mb: 3 }}>
          Back to Activities
        </Button>
        <Typography>No activity data available</Typography>
      </Container>
    );
  }

  const improvements = Array.isArray(activity.improvements) ? activity.improvements : [];
  const suggestions = Array.isArray(activity.suggestions) ? activity.suggestions : [];
  const safetyGuidelines = Array.isArray(activity.safety) ? activity.safety : [];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'RUNNING':
        return <DirectionsRunIcon sx={{ fontSize: 50, color: '#ff6b6b' }} />;
      case 'CYCLING':
        return <TwoWheelerIcon sx={{ fontSize: 50, color: '#4ecdc4' }} />;
      case 'WALKING':
        return <DirectionsWalkIcon sx={{ fontSize: 50, color: '#95e1d3' }} />;
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/activities')}
        sx={{
          mb: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          '&:hover': {
            background: 'linear-gradient(135deg, #5568d3 0%, #6a3f91 100%)',
          },
        }}
      >
        Back to Activities
      </Button>

      {/* Activity Header */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mb: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 3,
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={3} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
            {getActivityIcon(activity.activityId)}
          </Grid>
          <Grid item xs={12} sm={9}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
              Activity Details
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Activity ID: {activity.activityId}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
              Last updated: {new Date(activity.updatedAt).toLocaleString()}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Recommendations Section */}
      {activity.recommendation && (
        <Card sx={{ borderRadius: 3, mb: 4, overflow: 'hidden' }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box sx={{
                width: 50,
                height: 50,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <LightbulbIcon sx={{ color: 'white', fontSize: 30 }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                AI Recommendations
              </Typography>
            </Box>

            {/* Analysis Section */}
            <Box sx={{ mb: 3, p: 2, background: '#f5f7fa', borderRadius: 2, borderLeft: '4px solid #667eea' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#667eea' }}>
                📊 Analysis
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                {activity.recommendation}
              </Typography>
            </Box>

            {/* Improvements Section */}
            {improvements.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{
                    width: 40,
                    height: 40,
                    background: '#fff3cd',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <CheckCircleIcon sx={{ color: '#ffc107', fontSize: 24 }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Areas for Improvement
                  </Typography>
                </Box>
                <List>
                  {improvements.map((improvement, index) => (
                    <ListItem key={index} sx={{ pl: 0 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Box sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: '#ffc107',
                        }} />
                      </ListItemIcon>
                      <ListItemText primary={improvement} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            <Divider sx={{ my: 3 }} />

            {/* Suggestions Section */}
            {suggestions.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{
                    width: 40,
                    height: 40,
                    background: '#d1ecf1',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <LightbulbIcon sx={{ color: '#17a2b8', fontSize: 24 }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    💡 Suggestions
                  </Typography>
                </Box>
                <List>
                  {suggestions.map((suggestion, index) => (
                    <ListItem key={index} sx={{ pl: 0 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Box sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: '#17a2b8',
                        }} />
                      </ListItemIcon>
                      <ListItemText primary={suggestion} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            <Divider sx={{ my: 3 }} />

            {/* Safety Guidelines Section */}
            {safetyGuidelines.length > 0 && (
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{
                    width: 40,
                    height: 40,
                    background: '#f8d7da',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <SecurityIcon sx={{ color: '#dc3545', fontSize: 24 }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    🛡️ Safety Guidelines
                  </Typography>
                </Box>
                <List>
                  {safetyGuidelines.map((safety, index) => (
                    <ListItem key={index} sx={{ pl: 0 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Box sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: '#dc3545',
                        }} />
                      </ListItemIcon>
                      <ListItemText primary={safety} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </CardContent>
        </Card>
      )}
    </Container>
  )
}

export default ActivityDetails;
