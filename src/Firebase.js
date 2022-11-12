// imports
import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile, sendPasswordResetEmail } from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { collection, deleteDoc, doc, getDoc, getDocs, getFirestore, query, setDoc, updateDoc, where } from "firebase/firestore";
import toast from "react-hot-toast";
import { toastStyle_error, toastStyle_success } from "./App";

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
        .then(() => {
            toast('User Registered!', {
                icon: 'check_circle',
                style: toastStyle_success,
            });
        })
        .catch(err => {
            error = err;
            toast('User Registering Error!', {
                icon: 'error',
                style: toastStyle_error,
            });
        })
}

export function profileInitial(currentUser) {
    setDoc(doc(db, "users", currentUser.uid), {
        about: {
            firstname: "John",
            lastname: "Doe",
            displayname: "Anonymous",
        },
        settings: {
            showUserLinks: true,
            showUserTrees: true,
            showOrganization: false
        },
        info: {
            joined: currentUser.metadata.createdAt,
        },
        images: {
            headerURL: "https://images.unsplash.com/photo-1646974708582-3dced57e0a25?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8",
            photoURL: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
        }
    }).then(() => {
        toast('User Setup!', {
            icon: 'check_circle',
            style: toastStyle_success,
        });
    }).catch(err => {
        error = err
        toast('User Set Up Error!', {
            icon: 'error',
            style: toastStyle_error,
        });
    })
}

export function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            toast('Logged In!', {
                icon: 'check_circle',
                style: toastStyle_success,
            });
        })
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
            toast('Login Error!', {
                icon: 'error',
                style: toastStyle_error,
            });
        })
}

export function logout() {
    return signOut(auth)
        .then(() => {
            toast('Logged Out!', {
                icon: 'check_circle',
                style: toastStyle_success,
            });
        })
        .catch(err => {
            error = err;
            toast('Logout Error!', {
                icon: 'error',
                style: toastStyle_error,
            });
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
    if (fileEXT !== "jpg" && fileEXT !== "jpeg" && fileEXT !== "png" && fileEXT !== "apng" && fileEXT !== "webp" && fileEXT !== "gif") {
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
            "images.photoURL": photoURL
        })
    } catch (e) {
        console.error("Error adding document (pPU): ", e);
        toast('Error Updating User Profile Picture!', {
            icon: 'error',
            style: toastStyle_error,
        });
        if (setLoading) setLoading(false);
        return
    }

    if (setLoading) setLoading(false);
    toast('Updated User Profile Picture!', {
        icon: 'check_circle',
        style: toastStyle_success,
    });
}

export async function uploadHeaderBackgroundPicture(file, currentUser, setLoading) {
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
            "images.headerURL": photoURL
        })
    } catch (e) {
        console.error("Error adding document (pBU): ", e);
        toast('Error Updating User Background!', {
            icon: 'error',
            style: toastStyle_error,
        });
        if (setLoading) setLoading(false);
        return
    }

    if (setLoading) setLoading(false);
    toast('Updated User Background!', {
        icon: 'check_circle',
        style: toastStyle_success,
    });
}

export async function updateUserInfo(arg, currentUser, setLoading) {
    if (setLoading) setLoading(true);

    if (arg.info.gender === undefined) { arg.info.gender = "" }
    if (arg.info.pronouns === undefined) { arg.info.pronouns = "" }
    if (arg.info.location === undefined) { arg.info.location = "" }
    if (arg.links === undefined) { arg.links = [] }

    if (arg.settings.showUserLinks === undefined) { arg.settings.showUserLinks = true }
    if (arg.settings.showUserTrees === undefined) { arg.settings.showUserTrees = true }
    if (arg.settings.showOrganization === undefined) { arg.settings.showOrganization = false }

    updateProfile(currentUser, { displayName: arg.displayname });
    try {
        await updateDoc(doc(db, "users", currentUser.uid), {
            about: {
                firstname: arg.firstname,
                lastname: arg.lastname,
                displayname: arg.displayname,
                statement: arg.statement,
            },
            info: {
                gender: arg.info.gender,
                pronouns: arg.info.pronouns,
                location: arg.info.location,
                joined: arg.info.joined,
            },
            settings: {
                showUserLinks: arg.settings.showUserLinks,
                showUserTrees: arg.settings.showUserTrees,
                showOrganization: arg.settings.showOrganization
            },
            links: arg.links
        })
    } catch (e) {
        console.error("Error adding document (dN): ", e);
        toast('Error Updating User!', {
            icon: 'error',
            style: toastStyle_error,
        });
        if (setLoading) setLoading(false);
        return
    }

    toast('Updated User!', {
        icon: 'check_circle',
        style: toastStyle_success,
    });
    if (setLoading) setLoading(false);
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
    if (setLoading) { setLoading(true) }

    if (treeID.endsWith("%20") || treeID.endsWith(" ")) {
        console.error("Error claiming tree (tE): ", "Can't claim trees ending in space")
        toast('Error Claiming Tree!', {
            icon: 'error',
            style: toastStyle_error,
        });
        if (setLoading) { setLoading(false) }
        return
    }

    if (treeID.includes("%20%20") || treeID.includes("  ")) {
        console.error("Error claiming tree (tE): ", "Can't claim trees containing consecutive spaces")
        toast('Error Claiming Tree!', {
            icon: 'error',
            style: toastStyle_error,
        });
        if (setLoading) { setLoading(false) }
        return
    }

    setDoc(doc(db, "trees", treeID), {
        title: treeID,
        originalUser: currentUser.uid,
        authedUser: [currentUser.uid],
        settings: {
            useOriginalUserLinks: true,
            showOriginalUser: true,
            showAuthedUser: true,
        }
    }).then(() => {
    }).catch(err => {
        console.error("Error claiming tree (tE): ", err);
        toast('Error Claiming Tree!', {
            icon: 'error',
            style: toastStyle_error,
        });
        setLoading(false);
        return
    })
    if (setLoading) { setLoading(false) }
    if (setReload) { setReload(1) }

    toast('Tree Claimed!', {
        icon: 'check_circle',
        style: toastStyle_success,
    });
}

export async function getTreeInfo(treeID) {
    try {
        const docSnap = await getDoc(doc(db, "trees", treeID));
        return docSnap.data();
    } catch (e) {
        console.error("Error getting tree (tE): ", e);
        toast('Error Getting Tree!', {
            icon: 'error',
            style: toastStyle_error,
        });
        return
    }
}

export async function deleteTree(treeID, setReload) {

    await deleteDoc(doc(db, "trees", treeID))
        .then(() => {
            toast('Tree Deleted!', {
                icon: 'check_circle',
                style: toastStyle_success,
            });
        })
        .catch(err => {
            console.error("Error Deleting Tree", err)
            toast('Error Deleting Tree!', {
                icon: 'error',
                style: toastStyle_error,
            });
        })

    if (setReload) { setReload(3) }
}

export async function updateTree(treeID, currentUser, setLoading, setReload, originalUserID, treeArr) {
    setLoading(true);

    if (treeArr.title === "") { treeArr.title = treeID }
    if (treeArr.authedUser === []) { treeArr.authedUser = [originalUserID] }
    if (!treeArr.authedUser.includes(originalUserID)) { treeArr.authedUser.push(originalUserID) }
    if (treeArr.links === undefined) { treeArr.links = [] }
    if (treeArr.description === undefined) { treeArr.description = "" }

    try {
        await updateDoc(doc(db, "trees", treeID), {
            title: treeArr.title,
            description: treeArr.description,
            authedUser: treeArr.authedUser,
            links: treeArr.links,
            settings: treeArr.settings,
        })
    } catch (e) {
        console.error("Error updating tree (tE): ", e);
        toast('Error Updating Tree!', {
            icon: 'error',
            style: toastStyle_error,
        });
        setLoading(false);
        return
    }

    setReload(1);
    setLoading(false);

    toast('Tree Updated!', {
        icon: 'check_circle',
        style: toastStyle_success,
    });
}

export async function getUsersOwnTrees(currentUser, setLoading) {
    setLoading(true)

    let arr = [];

    const q = query(collection(db, "trees"), where("originalUser", "==", currentUser.uid));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        arr.push({ id: doc.id, data: doc.data() });
    });

    setLoading(false)
    return arr
}

export async function getUsersTrees(currentUser, setLoading) {
    setLoading(true)

    let arr = [];

    const q = query(collection(db, "trees"), where("authedUser", "array-contains", currentUser.uid));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        arr.push({ id: doc.id, data: doc.data() });
    });

    setLoading(false)
    return arr
}

export async function searchTrees(q, setLoading) {
    setLoading(true)

    let arr = [];

    const querySnapshot = await getDocs(collection(db, "trees"));
    querySnapshot.forEach((doc) => {
        if (!doc.data().title.includes(q) && !(doc.data().description && doc.data().description.includes(q)) && !doc.id.includes(q)) return
        arr.push({ id: doc.id, data: doc.data() });
    });

    setLoading(false)
    return arr
}