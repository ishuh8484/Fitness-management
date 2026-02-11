import { FC, useState } from 'react'
import {
  Box,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Paper,
  Grid,
  Typography,
  Card,
  CardContent,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun'
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler'
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk'
import TimelapseIcon from '@mui/icons-material/Timelapse'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import { addActivities } from '../services/apiFetch.ts';
import { ActivityRequest } from '../types/index.ts';

interface ActivityFormProps {
  onActivityAdded: () => void;
}

const ActivityForm: FC<ActivityFormProps> = ({ onActivityAdded }) => {
  const [activity, setActivity] = useState<ActivityRequest>({
    type: "RUNNING",
    duration: 0,
    calories: 0,
    additionalMetric: {},
    startTime: new Date().toISOString()
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const activityIcons: Record<string, JSX.Element> = {
    RUNNING: <DirectionsRunIcon sx={{ fontSize: 32, color: '#ff6b6b' }} />,
    CYCLING: <TwoWheelerIcon sx={{ fontSize: 32, color: '#4ecdc4' }} />,
    WALKING: <DirectionsWalkIcon sx={{ fontSize: 32, color: '#95e1d3' }} />,
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const activityData = {
        ...activity,
        duration: parseInt(String(activity.duration)) || 0,
        calories: parseInt(String(activity.calories)) || 0
      };
      
      if (!activityData.duration || !activityData.calories) {
        setError('Please enter valid duration and calories');
        setLoading(false);
        return;
      }
      
      await addActivities(activityData);
      setActivity({
        type: "RUNNING",
        duration: 0,
        calories: 0,
        additionalMetric: {},
        startTime: new Date().toISOString()
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onActivityAdded();
      }, 1500);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to add activity';
      setError(errorMsg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
          Activity added successfully! 🎉
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Activity Type</InputLabel>
            <Select
              value={activity.type}
              onChange={(e) => {
                setActivity({ ...activity, type: e.target.value as 'RUNNING' | 'CYCLING' | 'WALKING' })
              }}
              label="Activity Type"
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="RUNNING">
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <DirectionsRunIcon sx={{ color: '#ff6b6b' }} />
                  Running
                </Box>
              </MenuItem>
              <MenuItem value="CYCLING">
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <TwoWheelerIcon sx={{ color: '#4ecdc4' }} />
                  Cycling
                </Box>
              </MenuItem>
              <MenuItem value="WALKING">
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <DirectionsWalkIcon sx={{ color: '#95e1d3' }} />
                  Walking
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea20 0%, #764ba220 100%)' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {activityIcons[activity.type]}
              <Box>
                <Typography variant="caption" color="textSecondary">Selected Activity</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {activity.type.charAt(0) + activity.type.slice(1).toLowerCase()}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Duration"
            type="number"
            value={activity.duration}
            onChange={(e) => {
              setActivity({ ...activity, duration: parseInt(e.target.value) || 0 })
            }}
            inputProps={{ min: 1, max: 999 }}
            disabled={loading}
            InputProps={{
              startAdornment: <TimelapseIcon sx={{ mr: 1, color: '#667eea' }} />,
            }}
            sx={{ borderRadius: 2 }}
          />
          <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, display: 'block' }}>
            minutes
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Calories Burned"
            type="number"
            value={activity.calories}
            onChange={(e) => {
              setActivity({ ...activity, calories: parseInt(e.target.value) || 0 })
            }}
            inputProps={{ min: 1, max: 9999 }}
            disabled={loading}
            InputProps={{
              startAdornment: <LocalFireDepartmentIcon sx={{ mr: 1, color: '#ff6b6b' }} />,
            }}
            sx={{ borderRadius: 2 }}
          />
          <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, display: 'block' }}>
            calories (kcal)
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Button
            type='submit'
            variant="contained"
            fullWidth
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
            sx={{
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5568d3 0%, #6a3f91 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 10px 25px rgba(102, 126, 234, 0.4)',
              },
              transition: 'all 0.3s ease',
              borderRadius: 2,
            }}
          >
            {loading ? 'Adding Activity...' : 'Add Activity'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ActivityForm
