// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCXZBoMMKtwriVXiedELlxldyVdGv_s3sA",
  authDomain: "codeinelive.firebaseapp.com",
  projectId: "codeinelive",
  storageBucket: "codeinelive.appspot.com",
  messagingSenderId: "427981584062",
  appId: "1:427981584062:web:5ae2c257521ff6dc4490ef",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export default app;
