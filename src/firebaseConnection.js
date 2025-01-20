import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'; 
import { getAuth } from 'firebase/auth';



const firebaseConfig = {
    apiKey: "AIzaSyCDyjfwfiK-m4Z2ycmGqtLyvmyNA73rF3c",
    authDomain: "teste-curso-2443b.firebaseapp.com",
    projectId: "teste-curso-2443b",
    storageBucket: "teste-curso-2443b.firebasestorage.app",
    messagingSenderId: "1058615848277",
    appId: "1:1058615848277:web:b0cddb152cf2604963d3dc",
    measurementId: "G-G4ZL3TM4FE"
  };

  const firebaseApp = initializeApp(firebaseConfig);

  const db = getFirestore(firebaseApp);

  const auth = getAuth(firebaseApp);

  export { db, auth };