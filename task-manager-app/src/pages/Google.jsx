import { GoogleLogin } from 'react-google-login';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const GoogleSignup = () => {
   const navigate = useNavigate()
   const handleGoogleSuccess = async (response) => {
      try {
         const { tokenId } = response;
         console.log("token ifd--------------", response, tokenId)
         const res = await axios.post('http://localhost:8000/api/auth/google', { token: tokenId });

         if (res.status === 200) {
            toast.success('Signed in with Google successfully!');
            navigate('/dashboard');
         }
      } catch (error) {
         console.error('Google Sign-In Error:', error);
         toast.error('Google Sign-In failed');
      }
   };

   const handleGoogleFailure = (error) => {
      console.error('Google Sign-In Failed:', error);
      if (error.error === 'popup_closed_by_user') {
         toast.warning('Google Sign-In was canceled. Please try again.');
      }
   };
   return (
      <>
         <GoogleLogin
            // style={{backgroundColor:'blue'}}
            clientId="1021079153697-emd6dom1iqoaea71bf8u0tt2v7jqef8p.apps.googleusercontent.com"
            buttonText="Sign up with Google"
            onSuccess={handleGoogleSuccess}
            onFailure={handleGoogleFailure}
            cookiePolicy={'single_host_origin'}
         />

         <ToastContainer />
      </>
   )
}

export default GoogleSignup