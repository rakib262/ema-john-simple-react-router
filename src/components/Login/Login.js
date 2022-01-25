
import { useContext, useState } from 'react';
import { userContext } from '../../App';
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import { createUserEmailAndPassword, handleFbSignIn, handleGoogleSignIn, handleSignOut, initializeLoginFrameWork, signInEmailAndPassword } from './loginManager';


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
     <input type="checkbox" name="newUser" onChange={() => setNewUser(!newUser)} id="" />
     <label htmlFor="newUser">New User Sign up</label>
     <form onClick={handleSubmit}>
       {
         newUser && <input onBlur={handleBlur} type="text" name="name" placeholder="Enter Your Name"/>
       }
       <br/>
       <input onBlur={handleBlur} type="email" name="email" placeholder="Enter Your Email" required/>
       <br />
       <input onBlur={handleBlur} type="password" name="password" placeholder="Enter your password" required/>
       <br />
       <input type="submit" value="submit" />
     </form>

     <p style={{color: 'red'}}>{user.error}</p>
     {
       user.success && <p style={{color: 'green'}}>User {newUser? 'created' : 'Logged In'} successfully</p>
     }
    </div>
  );
}

export default Login;
