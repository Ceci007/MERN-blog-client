import { initializeApp } from "firebase/app"; 
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA5f6W0sWwal8ZsClzuxjo97DH5lYtt7wI",
  authDomain: "blog-website-fceb1.firebaseapp.com",
  projectId: "blog-website-fceb1",
  storageBucket: "blog-website-fceb1.firebasestorage.app",
  messagingSenderId: "648666757418",
  appId: "1:648666757418:web:95559e876e697e386ac653"
};

const app = initializeApp(firebaseConfig);

// Google Auth

const provider = new GoogleAuthProvider();

const auth = getAuth();

export const authWithGoogle = async () => {
  let user = null;

  await signInWithPopup(auth, provider)
  .then((result) => {
    user = result.user;
  }).catch((err) => {
    console.log(err);
  })

  return user;
}