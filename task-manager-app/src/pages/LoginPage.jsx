import {useState} from "react";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { Link } from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import axios from 'axios'
import {ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import GoogleSignup from "./Google";

const LoginPage = () => {
   const [showPassword, setShowPassword] = useState(false);
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [emailError, setEmailError] = useState(false)
   const [passwordError, setPasswordError] = useState(false)

   const navigate = useNavigate();
   const handleClickShowPassword = () => setShowPassword((show) => !show);

   const handleMouseDownPassword = (event) => {
      event.preventDefault();
   };

   const handleMouseUpPassword = (event) => {
      event.preventDefault();
   };

   const submitData = async() => {
      !email ? setEmailError(true) : setEmailError(false)
      !password ? setPasswordError(true) : setPasswordError(false)
      if (emailError || passwordError) return

      try {

         const signupUser = await axios.post(`https://task-manager-repo.onrender.com/api/auth/login`,
            {
               email,
               password
            }
         )
         if (signupUser.status === 200) {
            localStorage.setItem("token", signupUser.data.token)
            navigate('/dashboard');
         }
      } catch (err) {
         console.log(err)
         toast.error(err.response.data.message);
      }
      
   }
   return (
      <div className='loginLayout' >
         <div style={{width:'35%'}}>
            <div style={{ color:'#1976d2' ,fontSize:'large', fontWeight:'bold'}}>Login</div>
            <Card  style={{ border:'3px solid #1976d2'}}>
               <CardContent >
                  <TextField
                     required
                     style={{ width: '100%' }} size='small'
                     label='email'
                     type="text"
                     value={email}
                     error={emailError}
                     onChange={(e)=>setEmail(e.target.value)}
                     placeholder="enter your email"
                  />
                  <OutlinedInput
                     required
                     style={{width:'100%',color:'black', marginTop:'20px'}}
                     size="small"
                     // id="outlined-adornment-password"
                     type={showPassword ? 'text' : 'password'}
                     placeholder="enter your password"
                     value={password}
                     error={passwordError}
                     onChange={(e)=>setPassword(e.target.value)}
                     endAdornment={
                        <InputAdornment position="end">
                           <IconButton
                              // aria-label={
                              //    showPassword ? 'hide the password' : 'display the password'
                              // }
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              onMouseUp={handleMouseUpPassword}
                              edge="end"
                           >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                           </IconButton>
                        </InputAdornment>
                     }
                     label="Password"
                  />
               </CardContent>
               <CardActions style={{display:'flex', flexDirection:'column', alignItems:'center' , gap:'10px'}}>
                  <Button style={{ width: '100%' }} variant="contained" onClick={submitData}>Login</Button>
                  <div>Dont have an account? <Link href='/signup'>Signup </Link></div>
                  {/* <Button variant="contained">Login with Google</Button> */}
                  <GoogleSignup/>
               </CardActions>
            </Card>
            <ToastContainer />
         </div>
      </div>
   )
};

export default LoginPage