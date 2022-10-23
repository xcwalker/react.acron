// imports
import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile, sendPasswordResetEmail } from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { arrayUnion, collection, doc, getDoc, getDocs, getFirestore, query, setDoc, updateDoc, where } from "firebase/firestore";

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
const storage = getStorage();
const db = getFirestore(app);

// functions
export function register(email, password) {
    return createUserWithEmailAndPassword(auth, email, password)
        .catch(err => {
            error = err;
        })
}

export function profileInitial(currentUser) {
    setDoc(doc(db, "users", currentUser.uid), {
        firstname: "John",
        lastname: "Doe",
        displayname: "Anonymous",
        joinedat: currentUser.metadata.createdAt,
        photoBackgroundURL: "https://www.tpctax.com/wp-content/uploads/2017/05/services-background-placeholder.jpg",
        photoURL: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
    }).catch(err => {
        error = err
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

// Storage
export async function uploadProfilePicture(file, currentUser, setLoading) {
    const fileEXT = file.name.split(".").pop();
    if (fileEXT !== "jpg" && fileEXT !== "jpeg" && fileEXT !== "png" && fileEXT !== "apng" && fileEXT !== "webp" && fileEXT !== "webm" && fileEXT !== "gif") {
        console.error("Unsupported Format");
        alert("Unsupported Format (" + fileEXT + ")")
        return
    }
    const fileRef = ref(storage, "images/profile/" + currentUser.uid + '.' + fileEXT);

    if (setLoading) setLoading(true);

    await uploadBytes(fileRef, file);
    const photoURL = await getDownloadURL(fileRef);

    updateProfile(currentUser, { photoURL });
    try {
        await updateDoc(doc(db, "users", currentUser.uid), {
            photoURL: photoURL
        })
    } catch (e) {
        console.error("Error adding document (pPU): ", e);
    }

    if (setLoading) setLoading(false);
    alert("Avatar changed, refresh page to view changes.");
}

export async function uploadProfileBackgroundPicture(file, currentUser, setLoading) {
    const fileEXT = file.name.split(".").pop();
    if (fileEXT !== "jpg" && fileEXT !== "jpeg" && fileEXT !== "png" && fileEXT !== "apng" && fileEXT !== "webp" && fileEXT !== "webm" && fileEXT !== "gif") {
        console.error("Unsupported Format");
        alert("Unsupported Format")
        return
    }
    const fileRef = ref(storage, "images/profile/" + currentUser.uid + '-background.' + fileEXT);

    if (setLoading) setLoading(true);

    await uploadBytes(fileRef, file);
    const photoURL = await getDownloadURL(fileRef);

    try {
        await updateDoc(doc(db, "users", currentUser.uid), {
            photoBackgroundURL: photoURL
        })
    } catch (e) {
        console.error("Error adding document (pBU): ", e);
    }

    if (setLoading) setLoading(false);
    alert("Background changed, refresh page to view changes.");
}

export async function updateDisplayName(displayName, currentUser, setLoading) {
    if (setLoading) setLoading(true);

    updateProfile(currentUser, { displayName });
    try {
        await updateDoc(doc(db, "users", currentUser.uid), {
            displayname: displayName
        })
    } catch (e) {
        console.error("Error adding document (dN): ", e);
    }

    if (setLoading) setLoading(false);
    alert("Display name changed, refresh page to view changes.");
}

export async function updateFirstName(firstName, currentUser, setLoading) {
    if (setLoading) setLoading(true);

    try {
        await updateDoc(doc(db, "users", currentUser.uid), {
            firstname: firstName
        })
    } catch (e) {
        console.error("Error adding document (fN): ", e);
    }

    if (setLoading) setLoading(false);
    alert("First name changed, refresh page to view changes.");
}

export async function updateLastName(lastName, currentUser, setLoading) {
    if (setLoading) setLoading(true);

    try {
        await updateDoc(doc(db, "users", currentUser.uid), {
            lastname: lastName
        })
    } catch (e) {
        console.error("Error adding document (lN): ", e);
    }

    if (setLoading) setLoading(false);
    alert("Last name changed, refresh page to view changes.");
}

export async function updateGender(gender, currentUser, setLoading) {
    if (setLoading) setLoading(true);

    try {
        await updateDoc(doc(db, "users", currentUser.uid), {
            gender: gender
        })
    } catch (e) {
        console.error("Error adding document (lN): ", e);
    }

    if (setLoading) setLoading(false);
    alert("Gender changed, refresh page to view changes.");
}

export async function updatePronouns(pronouns, currentUser, setLoading) {
    if (setLoading) setLoading(true);

    try {
        await updateDoc(doc(db, "users", currentUser.uid), {
            pronouns: pronouns
        })
    } catch (e) {
        console.error("Error adding document (lN): ", e);
    }

    if (setLoading) setLoading(false);
    alert("Pronouns changed, refresh page to view changes.");
}

export async function updateLocation(location, currentUser, setLoading) {
    if (setLoading) setLoading(true);

    try {
        await updateDoc(doc(db, "users", currentUser.uid), {
            location: location
        })
    } catch (e) {
        console.error("Error adding document (lN): ", e);
    }

    if (setLoading) setLoading(false);
    alert("Location changed, refresh page to view changes.");
}

export async function updateStatement(statement, currentUser, setLoading) {
    if (setLoading) setLoading(true);

    try {
        await updateDoc(doc(db, "users", currentUser.uid), {
            statement: statement
        })
    } catch (e) {
        console.error("Error adding document (lN): ", e);
    }

    if (setLoading) setLoading(false);
    alert("Statement changed, refresh page to view changes.");
}

export async function updateLinks(links, currentUser, setLoading) {
    if (setLoading) setLoading(true);

    try {
        await updateDoc(doc(db, "users", currentUser.uid), {
            links: links
        })
    } catch (e) {
        console.error("Error adding document (lN): ", e);
    }

    if (setLoading) setLoading(false);
    alert("Links changed, refresh page to view changes.");
}

export async function getUserInfo(userID) {
    try {
        const docSnap = await getDoc(doc(db, "users", userID));
        return docSnap.data();
    } catch (e) {
        console.error("Error getting user: ", e);
    }
}

export async function claimTree(treeID, currentUser, setLoading, setReload) {
    setLoading(true)
    setDoc(doc(db, "trees", treeID), {
        title: treeID,
        useOringinalUserLinks: true,
        originalUser: currentUser.uid,
        showOriginalUser: true,
        authedUser: [currentUser.uid]
    }).then(() => {
        updateDoc(doc(db, "users", currentUser.uid), {
            trees: arrayUnion(treeID)
        })
    }).catch(err => {
        error = err
    })
    setLoading(false)
    setReload(1)
}

export async function getUsersTrees(currentUser, setLoading) {
    setLoading(true)

    let arr = [];

    const q = query(collection(db, "trees"), where("authedUser", "array-contains", currentUser.uid));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        arr.push({id: doc.id, data: doc.data()});
    });

    setLoading(false)
    return arr
}

export async function getTreeInfo(treeID) {
    try {
        const docSnap = await getDoc(doc(db, "trees", treeID));
        return docSnap.data();
    } catch (e) {
        console.error("Error getting tree: ", e);
    }
}

export async function updateTree(treeID, currentUser, setLoading, setReload, originalUserID, treeArr) {
    setLoading(true);

    if (treeArr.title === "") {treeArr.title = treeID}
    if (treeArr.authedUser === []) {treeArr.authedUser = [originalUserID]}
    if (!treeArr.authedUser.includes(originalUserID)) {treeArr.authedUser.push(originalUserID)}
    if (treeArr.links === undefined) {treeArr.links = []}

    try {
        await updateDoc(doc(db, "trees", treeID), {
            title: treeArr.title,
            description: treeArr.description,
            useOringinalUserLinks: treeArr.useOringinalUserLinks,
            showOriginalUser: treeArr.showOriginalUser,
            showAuthedUser: treeArr.showAuthedUser,
            authedUser: treeArr.authedUser,
            links: treeArr.links
        })
    } catch (e) {
        console.error("Error adding document (lN): ", e);
    }

    setReload(1);
    setLoading(false);
    alert("Links changed, refresh page to view changes.");
}