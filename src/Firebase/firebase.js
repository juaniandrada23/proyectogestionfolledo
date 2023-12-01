import { initializeApp } from "firebase/app";
import {getStorage} from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyCex_g4-hwGUo5wvzIlWUCH9ae2T_96cbY",
  authDomain: "folledoapp.firebaseapp.com",
  projectId: "folledoapp",
  storageBucket: "folledoapp.appspot.com",
  messagingSenderId: "310229340429",
  appId: "1:310229340429:web:3083ba08b38d204364a044"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)