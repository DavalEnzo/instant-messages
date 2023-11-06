import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

export default function firebase (){
    const firebaseConfig = {

        apiKey: process.env.REACT_APP_FIREBASE_KEY,

        authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,

        databaseURL: process.env.REACT_APP_FIREBASE_DATABASE,

        projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,

        storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,

        messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,

        appId: process.env.REACT_APP_FIREBASE_APP_ID,

    };

    const app = initializeApp(firebaseConfig);

    return getDatabase(app);
}
