// imports
import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile, sendPasswordResetEmail } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_AUTH_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_AUTH_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_AUTH_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_AUTH_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_AUTH_APP_ID
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const auth = getAuth();
export var error = null;
//   const storage = getStorage();
//   const db = getFirestore(app);

// functions
export function register(email, password) {
    return createUserWithEmailAndPassword(auth, email, password)
        .catch(err => {
            error = err;
        })
}

export function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
        .catch(err => {
            switch (err.code) {
                case 'auth/invalid-email':
                    error = 'Invalid Email';
                    break;

                case 'auth/invalid-password':
                    error = 'Invalid Password';
                    break;

                case 'auth/too-many-requests':
                    error = 'Too Many Requests - Reset Password';
                    break;

                default:
                    error = err.code;
                    break;
            }
        })
}

export function logout() {
    return signOut(auth)
        .catch(err => {
            error = err;
        })
}

export function forgot(email) {
    return sendPasswordResetEmail(auth, email)
        .then(() => {
            // Reset Email Sent
        })
        .catch(err => {
            switch (err.code) {
                case 'auth/user-not-found':
                    error = 'User Not Found';
                    break;

                case 'auth/too-many-requests':
                    error = 'Too Many Requests';
                    break;

                default:
                    error = err.code;
                    break;
            }
        })
}

// Custom Hook
export function useAuth(falseValue) {
    const [currentUser, setCurrentUser] = useState();

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, user => setCurrentUser(user));
        return unsub;
    }, [])

    if (currentUser === undefined && falseValue) { setCurrentUser(falseValue) }

    return currentUser;
}