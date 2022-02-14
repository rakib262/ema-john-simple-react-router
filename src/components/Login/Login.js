
import { useContext, useState } from 'react';
import { userContext } from '../../App';
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import { createUserEmailAndPassword, handleFbSignIn, handleGoogleSignIn, handleSignOut,
   initializeLoginFrameWork, resetPassword, signInEmailAndPassword } from './loginManager';
import {Button, Grid,Paper, TextField} from '@material-ui/core'
import facebook from '../images/fb.png';
import google from '../images/google.png';


function Login() { 

  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
      isSignedIn: false,
      name: '',
      email: '',
      password: '',
      photo: ''
  })

  initializeLoginFrameWork();

  const [loggedInUser, setLoggedInUser] = useContext(userContext);
  const history = useHistory();
  const location = useLocation();
  const { from } = location.state || { from: { pathname: "/" } };

  const googleSignIn = () => {
    handleGoogleSignIn()
    .then((res) => {
      handleResponse(res, true);
    });
  }

  const fbSignIn = () => {
    handleFbSignIn()
    .then((res) => {
      handleResponse(res, true);
    });
  }

  const signOut = () => {
    handleSignOut()
    .then((res) => {
      handleResponse(res, false);
    })
  }

  const handleBlur = (e) => {
    let isFormValid = true;
    if(e.target.name === 'email'){
       isFormValid = /\S+@\S+\.\S+/.test(e.target.value);
    }
    if(e.target.name === 'password'){
      const isPasswordValid = e.target.value.length > 6;
      const isDigitValid = /\d{1}/.test(e.target.value);
      isFormValid = isPasswordValid && isDigitValid;
    }
    if(isFormValid){
    // [...cart, newItem]
    const newUserInfo = {...user}
     newUserInfo[e.target.name] = e.target.value;
     setUser(newUserInfo)
    } 
  }

  const handleSubmit = (e) => {
    if(newUser && user.email && user.password){
      createUserEmailAndPassword(user.name, user.email, user.password)
      .then((res) => {
        handleResponse(res, true);
      });
    }
    if(!newUser && user.email && user.password){
      signInEmailAndPassword(user.email, user.password)
      .then((res) => {
       handleResponse(res, true);
      });
    }
    e.preventDefault();
  }

  const handleResponse = (res, redirect) => {
    setUser(res);
    setLoggedInUser(res);
    if(redirect){
      history.replace(from);
    }
  }
  const paperStyle = {
    padding: 20,
    width:400,
    margin:'20px auto'
  }
  return (
    <div style={{textAlign: 'center'}}>
      {
        user.isSignedIn? <button onClick={signOut}>sign out</button>:
        <button onClick={googleSignIn}>Sign In</button>
      }
      <br />
      <button onClick={fbSignIn}>Sign In Using Facebook</button>
     {
       user.isSignedIn && <div>
         <p>Welcome {user.name}!</p>
         <p>Email : {user.email}</p>
         <img src={user.photo} alt="" />
       </div>
     }
     <h1>Our own Athentication </h1>
     {/* <input type="checkbox" name="newUser" onChange={() => setNewUser(!newUser)} id="" />
     <label htmlFor="newUser">{newUser? 'login' : 'create account'}</label> */}
     <p>{newUser? 'You have an Account? ' : 'You dont have an Account? '} 
      <a href="#" onClick={() => setNewUser(!newUser)}>{newUser? 'login' : 'create account'}</a>
     </p>
     <form onClick={handleSubmit}>
       {
         <h3>{newUser? 'Create Account' : 'Login'}</h3>
       }
       {
         newUser && <div><input onBlur={handleBlur} type="text" name="name" placeholder="Enter Your Name"/></div>
       }
       
       <input  onBlur={handleBlur} type="email" name="email" placeholder="Enter Your Email" required/>
       <br />
       <input  onBlur={handleBlur} type="password" name="password" placeholder="Enter your password" required/>
       <br />
       {
       !newUser && <button onClick={() => resetPassword(user.email)}>Forget or Reset Password</button>
       }
      <br />
       <input type="submit" value={newUser ? 'sign up' : 'sign in'} />
     </form>
     <p style={{color: 'red'}}>{user.error}</p>
     {
       user.success && <p style={{color: 'green'}}>User {newUser? 'created' : 'Logged In'} successfully</p>
     }
     
     <Grid>
        <Paper elevation={10} style={paperStyle}>
          
          <from onClick={handleSubmit}>
            <h3 style={{textAlign: 'left'}}>{newUser? 'Create Account' : 'Login'}</h3>
            {
              newUser && <div>
                <TextField onBlur={handleBlur} type="text" name="name" label='First name' placeholder='Enter First name' fullWidth required></TextField>
                <TextField onBlur={handleBlur} type="text" name="name" label='Last name' placeholder='Enter Last name' fullWidth required></TextField>
              </div>
            }
            <TextField onBlur={handleBlur} type="email" name="email" label='Email' placeholder='Enter Username or Email' fullWidth required></TextField>
            <TextField onBlur={handleBlur} type="password" name="password" label='Password' placeholder='Enter Password' fullWidth required></TextField>
            {
              !newUser && <div style={{marginTop:'15px',textAlign: 'right', fontSize:'14px'}}>
                <a href="#" onClick={() => resetPassword(user.email)} >Forgot Password</a></div>
            }
            {
              newUser && <TextField onBlur={handleBlur} type="password" name="password" label='Confirm Password' placeholder='Enter Confirm Password' fullWidth required></TextField>
            }
            <Button style={{marginTop:'15px'}} type='submit' color='primary' variant="contained" fullWidth>{newUser ? 'Create an account' : 'Login'}</Button>
          </from>

          <p style={{marginTop:'10px'}}>{newUser? 'You have an Account? ' : 'You dont have an Account? '} 
          <a href="#" onClick={() => setNewUser(!newUser)}>{newUser? 'Login' : 'Create an account'}</a>
          </p>

          <p>Or</p>

          <Button onClick={fbSignIn} style={{border: '1px solid black', borderRadius:'30px'}} type='submit' fullWidth>
            <img style={{width:'25px', height:'25px', marginRight:'15px'}} src={facebook} alt="" /> continue with facebook</Button>

          <Button onClick={googleSignIn} style={{marginTop:'15px', border: '1px solid black', borderRadius:'30px'}} type='submit' fullWidth>
            <img style={{width:'25px', height:'25px', marginRight:'15px'}} src={google} alt="" /> continue with google</Button>
        </Paper>
     </Grid>
    </div>
  );
}

export default Login;
