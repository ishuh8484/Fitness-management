import {BrowserRouter as Router, Navigate, Routes, Route, useLocation} from 'react-router'
import Button from '@mui/material/Button';
import { useAuthContext } from 'react-oauth2-code-pkce';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { useEffect } from 'react';
import { setCredentials } from './store/authSlice';
import Box from '@mui/material/Box';
import ActivityForm from './components/ActivityForm';
import ActivityList from './components/ActivityList';
import ActivityDetails from './components/ActivityDetails';

  const ActivitiesPage = () => {
    return (
    <Box  sx={{ p: 2, border: '1px dashed grey' }}>
          <ActivityForm onActivityAdded={()=>window.location.reload()} />
          <ActivityList />
        </Box>
    );
  };


function App() {

  const {token,tokenData,logIn,logOut} = useAuthContext();
  const dispatch = useDispatch();
  const[authReady, setAuthReady] = useState(false);

  useEffect(()=>{
    if(token){
      dispatch(setCredentials({token,user:tokenData}));
      setAuthReady(true);
    }

  },[token,tokenData,dispatch])


    return (
        <Router>
          {!token ? (
        <Button variant="contained" color="#3b00dc"
        onClick={()=>{logIn()}} >
          Login
          </Button> 
          ) : !authReady ? (
            <div>Loading...</div>
          ) : (
            <div>
              <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
        <Button variant= "contained" onClick={logOut}>
          Logout
        </Button>
        <Routes>
          <Route path="/activities" element={<ActivitiesPage />} />
          <Route path="/activities/:id" element={<ActivityDetails />} />
          <Route path="/" element={token ? <Navigate to="/activities" replace /> : <div>Welcome to Fitness Tracker,Please Login</div>} />
        </Routes>
      </Box>
            </div>    
          )}
          </Router>
        
  )
}

export default App
