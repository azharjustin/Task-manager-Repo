import { useState } from "react";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { Link } from "@mui/material";
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import TextField from '@mui/material/TextField';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import GoogleSignup from "./Google";

const SignUp = () => {
   const [firstName, setFirstName] = useState('')
   const [lastName, setLastName] = useState('')
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const [confirmPassword, setConfirmPassword] = useState('')
   const [firstNameError, setFirstNameError] = useState(false)
   const [lastNameError, setLastNameError] = useState(false)
   const [emailError, setEmailError] = useState(false)
   const [passwordError, setPasswordError] = useState(false)
   const [confirmPasswordError, setConfirmPasswordError] = useState(false)
   const [passwordErrorMsg,setPasswordErrorMsg]=useState('')
   const navigate = useNavigate();

   const validateForm = () => {
      let isValid = true;

      if (!firstName.trim()) {
         setFirstNameError(true);
         isValid = false;
      } else {
         setFirstNameError(false);
      }

      if (!lastName.trim()) {
         setLastNameError(true);
         isValid = false;
      } else {
         setLastNameError(false);
      }

      // Email validation with regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.trim() || !emailRegex.test(email)) {
         setEmailError(true);
         isValid = false;
      } else {
         setEmailError(false);
      }

      // Password strength validation
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!password.trim() || !passwordRegex.test(password)) {
         setPasswordError(true);
         setPasswordErrorMsg(
            "Password must be at least 8 characters long, include a letter, a number, and a special character."
         );
         isValid = false;
      } else {
         setPasswordError(false);
         setPasswordErrorMsg(null);
      }

      if (!confirmPassword.trim() || password !== confirmPassword) {
         setConfirmPasswordError(true);
         setPasswordErrorMsg("Passwords do not match.");
         isValid = false;
      } else {
         setConfirmPasswordError(false);
      }

      return isValid;
   };
   const signUp = async() => {
      // Run validation
      const isFormValid = validateForm();
      if (!isFormValid) return;
      try {
   
         const signupUser = await axios.post(`https://task-manager-repo.onrender.com/api/auth/signup`,
            {
               first_name: firstName, 
               last_name: lastName,
               email,
               password
            }
         )
         if (signupUser.status === 201) {
            toast.success('User Created successfully!');
            navigate('/login');
         }
      } catch (err) {
         toast.error(err.response.data.message);
      }
   }

   return (
      <div className="loginLayout">
         <div style={{width:'35%'}}>
            <div style={{ color: '#1976d2', fontSize: 'large', fontWeight: 'bold' }}>SignUp</div>
            <Card style={{ border: '3px solid #1976d2' }}>
               <CardContent >
                  <TextField
                     required
                     style={{ width: '100%' }} size='small'
                     label='First Name'
                     type="text"
                     placeholder="enter your first name"
                     value={firstName}
                     onChange={(e) => setFirstName(e.target.value)}
                     error={firstNameError}
                  />
                  <TextField
                     required
                     style={{ width: '100%', marginTop: '20px' }}
                     size='small'
                     label='Last Name'
                     type="text"
                     placeholder="enter your last name"
                     value={lastName}
                     onChange={(e) => setLastName(e.target.value)}
                     error={lastNameError}
                     />
                  <TextField
                     required
                     style={{ width: '100%', marginTop: '20px' }}
                     size='small'
                     label='email'
                     type="text"
                     placeholder="enter your email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     error={emailError}
                     helperText={emailError ? "Please enter a valid email address." : null}
                     />
                  <TextField
                     required
                     style={{ width: '100%', marginTop: '20px' }}
                     size="small"
                     type='password'
                     placeholder="enter your password"
                     label="Password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     error={passwordError}
                  />
                  <TextField
                     required
                     style={{ width: '100%', marginTop: '20px' }}
                     size="small"
                     type='password'
                     placeholder="enter your password"
                     label="Confirm Password"
                     value={confirmPassword}
                     onChange={(e) => setConfirmPassword(e.target.value)}
                     error={confirmPasswordError}
                     helperText={passwordError ? passwordErrorMsg : null}
                  />
                  {/* {passwordErrorMsg &&
                     <div style={{color:'red'}}>{passwordErrorMsg}</div>
                  } */}
               </CardContent>
               <CardActions style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                  <Button style={{ width: '100%' }} variant="contained" onClick={signUp}>SignUp</Button>
                  <div>Already have an account? <Link href='/login'>Login</Link></div>
                  {/* <Button variant="contained">Signup with Google</Button>
                   */}
                  <GoogleSignup/>
               </CardActions>
            </Card>
        
            <ToastContainer />
         </div>
      </div>
   )
};

export default SignUp