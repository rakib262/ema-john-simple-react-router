
import * as firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from './firebase.config';
import { getAuth, signInWithPopup, 
        GoogleAuthProvider, signOut,
        createUserWithEmailAndPassword, 
        signInWithEmailAndPassword, 
        updateProfile, FacebookAuthProvider} from "firebase/auth";
import { useContext, useState } from 'react';
import { userContext } from '../../App';
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';



firebase.initializeApp(firebaseConfig);

function Login() { 

  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
      isSignedIn: false,
      name: '',
      email: '',
      password: '',
      photo: ''
  })

  const [loggedInUser, setLoggedInUser] = useContext(userContext);
  const history = useHistory();
  const location = useLocation();
  const { from } = location.state || { from: { pathname: "/" } };

  const googleProvider = new GoogleAuthProvider();
  const fbProvider = new FacebookAuthProvider();

  const handleSignIn = () => {
    const auth = getAuth();
    signInWithPopup(auth, googleProvider)
    .then(result => {
      const {displayName, email, photoURL} =result.user;
      const signedInUser = {
        isSignedIn: true,
        name:displayName,
        email: email,
        photo: photoURL
      }
      setUser(signedInUser);
      // console.log(displayName, email, photoURL)
    }).catch(err => {
      console.error(err);
      console.error(err.message);
    })
  }

  const handleFbSignIn = () => {
    const auth = getAuth();
    signInWithPopup(auth, fbProvider)
      .then((result) => {
        // The signed-in user info.
        const user = result.user;
        console.log(user)
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = FacebookAuthProvider.credentialFromError(error);

        // ...
      });
  }

  const handleSignOut = () => {
    const auth = getAuth();
    signOut(auth)
    .then(result => {
    const signOutUser = {
      isSignedIn: false,
      name: '',
      email: '',
      photo: '',
      success: false,
      error: ''
    }
    setUser(signOutUser);
  }).catch((error) => {
    console.log(error.message)
  });
    console.log(" sign out clicked");
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
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, user.email, user.password)
      .then((userCredential) => {
        const newUserInfo = {...user};
        newUserInfo.error = '';
        newUserInfo.success = true;
        setUser(newUserInfo);
        updateUserName(user.name)
      })
      .catch((error) => {
        const newUserInfo = {...user};
        newUserInfo.error = error.message;
        newUserInfo.success = false;
        setUser(newUserInfo);
      });
    }
    if(!newUser && user.email && user.password){
      const auth = getAuth();
      signInWithEmailAndPassword(auth, user.email, user.password)
        .then((userCredential) => {
          const newUserInfo = {...user};
          newUserInfo.error = '';
          newUserInfo.success = true;
          setUser(newUserInfo);
          setLoggedInUser(newUserInfo);
          history.replace(from);
          console.log('sign in user', userCredential.user);
        })
        .catch((error) => {
          const newUserInfo = {...user};
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
        });
    }
    e.preventDefault();
  }

  const updateUserName = (name) => {
    const auth = getAuth();
    updateProfile(auth.currentUser, {
      displayName:name
    }).then((res) => {
      console.log('user name update successfully')
    }).catch((error) => {
      console.log(error);
    });
  }
    
  return (
    <div style={{textAlign: 'center'}}>
      {
        user.isSignedIn? <button onClick={handleSignOut}>sign out</button>:
        <button onClick={handleSignIn}>Sign In</button>
      }
      <br />
      <button onClick={handleFbSignIn}>Sign In Using Facebook</button>
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
