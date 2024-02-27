import React,{ useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { postData } from '../services/ServerServices';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://voitics.com/">
        voitics
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function AdminLogin() {
 var navigation=useNavigate()

const [emailid,setEmailId]=useState('')
const [password,setPassword]=useState('')


  const handleClick = async() => {
    var body={emailid:emailid,password:password}
   var result= await postData('employee/chk_admin_login',body)
    alert(JSON.stringify(result.data))
   if(result.status)
     {
      Swal.fire({
        timer:1200,
        icon: 'success',
        title: result.message
    })
      localStorage.setItem('ADMIN',JSON.stringify(result.data))
      navigation('/dashboard')
     }
     else
     {
      Swal.fire({
        // grow:'fullscreen',
        timer:1500,
        icon: 'error',
        title: result.message
    })
     }
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://source.unsplash.com/random)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main',width:80}}
             src="https://icon-library.com/images/sign-in-icon/sign-in-icon-20.jpg"
             >
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              <span style={{fontWeight: 'bolder',fontSize: 22,fontFamily: 'Lobster',letterSpacing: 1}}>Sign in</span>
            </Typography>
            <Box  sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={(event)=>setEmailId(event.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={(event)=>setPassword(event.target.value)}
              />
             
              <Button
                type="button"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleClick}
              >
                Sign In
              </Button>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
