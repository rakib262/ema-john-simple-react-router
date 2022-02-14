import * as firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from './firebase.config';
import { getAuth, signInWithPopup, 
        GoogleAuthProvider, signOut,
        createUserWithEmailAndPassword, 
        signInWithEmailAndPassword, 
        updateProfile, FacebookAuthProvider, sendPasswordResetEmail, sendEmailVerification
      } from "firebase/auth";

export const initializeLoginFrameWork = () => {
    // if(firebase.apps.length === 0){
    //     firebase.initializeApp(firebaseConfig);
    // }  //** doesn't work */
    firebase.initializeApp(firebaseConfig);
}

export const handleGoogleSignIn = () => {
    const googleProvider = new GoogleAuthProvider();
    const auth = getAuth();
    return signInWithPopup(auth, googleProvider)
    .then(result => {
      const {displayName, email, photoURL} =result.user;
      const signedInUser = {
        isSignedIn: true,
        name: displayName,
        email: email,
        photo: photoURL,
        success: true
      }
     return signedInUser;
      // console.log(displayName, email, photoURL)
    }).catch(err => {
      console.error(err);
      console.error(err.message);
    });
  }


 export const handleFbSignIn = () => {
    const fbProvider = new FacebookAuthProvider();
    const auth = getAuth();
    return signInWithPopup(auth, fbProvider)
      .then((result) => {
        const user = result.user;
        user.success = true;
        return user;
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage)
      });
  }

  export const handleSignOut = () => {
    const auth = getAuth();
    return signOut(auth)
    .then(result => {
    const signOutUser = {
      isSignedIn: false,
      name: '',
      email: '',
      photo: '',
      success: false,
      error: ''
    }
    return signOutUser;
    }).catch((error) => {
      console.log(error.message)
    });
    
  }


 export const createUserEmailAndPassword = (name, email, password) =>{
    const auth = getAuth();
    return createUserWithEmailAndPassword(auth, email, password)
    .then((res) => {
      const newUserInfo = res.user;
      newUserInfo.error = '';
      newUserInfo.success = true;
      updateUserName(res.user.name);
      emailVerify();
      return newUserInfo;
    })
    .catch((error) => {
      const newUserInfo = {};
      newUserInfo.error = error.message;
      newUserInfo.success = false;
      return newUserInfo;
    });
 }

 export const signInEmailAndPassword = (email, password) => {
    const auth = getAuth();
    return signInWithEmailAndPassword(auth, email, password)
      .then((res) => {
        const newUserInfo = res.user;
        newUserInfo.error = '';
        newUserInfo.success = true;     
        return newUserInfo;
      })
      .catch((error) => {
        const newUserInfo = {};
        newUserInfo.error = error.message;
        newUserInfo.success = false;
        return newUserInfo;
      });
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

const emailVerify = () => {
  const auth = getAuth();
  sendEmailVerification(auth.currentUser)
    .then(() => {
      // Email verification sent!
      // ...
    });
}

 export const resetPassword = (email) => {
    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Password reset email sent!
        // ..
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  }
