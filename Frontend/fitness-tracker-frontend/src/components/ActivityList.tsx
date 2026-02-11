import { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import {
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
  Box,
  Alert,
  Button,
  Chip,
} from '@mui/material'
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun'
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler'
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk'
import TimelapseIcon from '@mui/icons-material/Timelapse'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import RefreshIcon from '@mui/icons-material/Refresh'
import { getActivities } from '../services/apiFetch.ts';
import { Activity } from '../types/index.ts';

const ActivityList: FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getActivities();
      setActivities(response.data);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to fetch activities';
      setError(errorMsg);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'RUNNING':
        return <DirectionsRunIcon sx={{ fontSize: 40, color: '#ff6b6b' }} />;
      case 'CYCLING':
        return <TwoWheelerIcon sx={{ fontSize: 40, color: '#4ecdc4' }} />;
      case 'WALKING':
        return <DirectionsWalkIcon sx={{ fontSize: 40, color: '#95e1d3' }} />;
      default:
        return null;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'RUNNING':
        return '#ff6b6b';
      case 'CYCLING':
        return '#4ecdc4';
      case 'WALKING':
        return '#95e1d3';
      default:
        return '#667eea';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 6 }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} />
          <Typography sx={{ mt: 2 }} color="textSecondary">
            Loading your activities...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={fetchActivities} startIcon={<RefreshIcon />}>
            Retry
          </Button>
        }
      >
        {error}
      </Alert>
    );
  }

  if (activities.length === 0) {
    return (
      <Card sx={{
        textAlign: 'center',
        py: 6,
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        borderRadius: 3,
      }}>
        <CardContent>
          <Box sx={{ fontSize: 64, opacity: 0.3, mb: 2 }}>
            📋
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            No activities yet
          </Typography>
          <Typography color="textSecondary">
            Start tracking your fitness journey by adding your first activity!
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // Calculate totals
  const totalDuration = activities.reduce((sum, a) => sum + a.duration, 0);
  const totalCalories = activities.reduce((sum, a) => sum + a.caloriesBurned, 0);

  return (
    <Box>
      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: 2,
          }}>
            <CardContent>
              <Typography color="inherit" gutterBottom variant="caption">
                Total Activities
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {activities.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            borderRadius: 2,
          }}>
            <CardContent>
              <Typography color="inherit" gutterBottom variant="caption">
                Total Time
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {totalDuration}
              </Typography>
              <Typography variant="caption">minutes</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            borderRadius: 2,
          }}>
            <CardContent>
              <Typography color="inherit" gutterBottom variant="caption">
                Calories Burned
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {totalCalories}
              </Typography>
              <Typography variant="caption">kcal</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            color: 'white',
            borderRadius: 2,
          }}>
            <CardContent>
              <Typography color="inherit" gutterBottom variant="caption">
                Avg Per Activity
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {Math.round(totalCalories / activities.length)}
              </Typography>
              <Typography variant="caption">kcal</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Activity Cards */}
      <Grid container spacing={3}>
        {activities
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .map((activity) => (
          <Grid item xs={12} sm={6} md={4} key={activity.id}>
            <Card
              sx={{
                borderRadius: 2.5,
                overflow: 'hidden',
                background: 'white',
                border: `2px solid ${getActivityColor(activity.type)}20`,
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: `0 20px 40px ${getActivityColor(activity.type)}30`,
                  borderColor: getActivityColor(activity.type),
                },
              }}
              onClick={() => navigate(`/activities/${activity.id}`)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {getActivityIcon(activity.type)}
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {activity.type.charAt(0) + activity.type.slice(1).toLowerCase()}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {new Date(activity.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Chip
                      label={`${activity.duration} min`}
                      size="small"
                      icon={<TimelapseIcon />}
                      sx={{
                        background: `${getActivityColor(activity.type)}20`,
                        color: getActivityColor(activity.type),
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Chip
                    label={`${activity.caloriesBurned} kcal`}
                    icon={<LocalFireDepartmentIcon />}
                    size="small"
                    variant="outlined"
                    sx={{
                      borderColor: '#ff6b6b',
                      color: '#ff6b6b',
                    }}
                  />
                </Box>

                <Button
                  endIcon={<ArrowForwardIcon />}
                  fullWidth
                  sx={{
                    color: getActivityColor(activity.type),
                    fontWeight: 600,
                    '&:hover': {
                      background: `${getActivityColor(activity.type)}10`,
                    },
                  }}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default ActivityList;
