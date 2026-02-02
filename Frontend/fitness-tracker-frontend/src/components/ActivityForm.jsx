import React, { use } from 'react'
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { addActivities } from '../services/apiFetch';


  const ActivityForm = ({onActivityAdded}) => {

    const [activity,setActivity] = useState({
      type:"RUNNING",
      duration: '',
      caloriesBurned:'',
      additionalMatrics:{}
    });

    const handleSubmit = async(e)=>{
      e.preventDefault();
      try{
        await addActivities(activity);
        onActivityAdded();
        setActivity({
      type:"RUNNING",
      duration: '',
      caloriesBurned:'',
      additionalMatrics:{}
    })

      }catch(err){
        console.error(err);
      }
    }

    return (
      <Box component="form" sx={{ mb: 2 }} onSubmit={handleSubmit}>
      <FormControl fullWidth sx={{mb:2}}>
    <InputLabel>Activity Type</InputLabel>
    <Select
      value={activity.type}
      onChange={(e)=>{setActivity({...activity, type: e.target.value})}}
    >
      <MenuItem value="RUNNING">Running</MenuItem>
      <MenuItem value="CYCLING">Cycling</MenuItem>
      <MenuItem value="WALKING">Walking</MenuItem>
    </Select>
  </FormControl>

  <TextField fullWidth 
  label ="Duration" 
  type ='number'
  sx={{mb:2}}
  value={activity.duration}
  onChange={(e)=>{setActivity({...activity, duration: e.target.value})}}
  />

  <TextField fullWidth 
  label ="Calories Burned" 
  type ='number'
  sx={{mb:2}}
  value={activity.caloriesBurned}
  onChange={(e)=>{setActivity({...activity, caloriesBurned: e.target.value})}}
  />

<Button type='submit' variant="contained">
  Add Activity
</Button>

      </Box>
    )
  }



export default ActivityForm