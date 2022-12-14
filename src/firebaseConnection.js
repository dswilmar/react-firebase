import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAE79hR52mUw-IoqE_bl0P24yX_BaJj_iE",
    authDomain: "curso-e4131.firebaseapp.com",
    projectId: "curso-e4131",
    storageBucket: "curso-e4131.appspot.com",
    messagingSenderId: "435190182598",
    appId: "1:435190182598:web:870f57d0e94e783388ddc7",
    measurementId: "G-XM61G293BW"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export { db };