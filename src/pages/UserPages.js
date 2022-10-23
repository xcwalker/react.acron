import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, Navigate, useParams } from "react-router-dom";
import ReactMarkdown from 'react-markdown'
import { application, network, routeAccount, routeUser } from "../App";
import { getUserInfo, logout, profileInitial, updateDisplayName, updateFirstName, updateGender, updateLastName, updateLinks, updateLocation, updatePronouns, updateStatement, uploadProfileBackgroundPicture, uploadProfilePicture, useAuth } from "../Firebase";

import "../style/UserPages.css"
import { Error403, Error404 } from "./ErrorPages";

export function UserIndex() {
    const currentUser = useAuth(null);
    const [loggedIn, setLoggedIn] = useState()

    useEffect(() => {
        if (currentUser && currentUser !== null) {setLoggedIn(1)}
        if (currentUser === null) {setLoggedIn(0)}
    }, [currentUser])

    return <>
        {loggedIn === 1 && <>
            <Navigate to={"/" + routeUser + "/" + currentUser.uid} />
        </>}
        {loggedIn === 0 && <>
            <Navigate to={"/" + routeAccount + "/login?from=/" + routeUser} />
        </>}
    </>
}

export function UserIndexProfile() {    
    const currentUser = useAuth(null);
    const [loggedIn, setLoggedIn] = useState()

    useEffect(() => {
        console.log(currentUser)
        if (currentUser && currentUser !== null) {setLoggedIn(1)}
        if (currentUser === null) {setLoggedIn(0)}
    }, [currentUser])

    return <>
        {loggedIn === 1 && <>
            <Navigate to={"/" + routeUser + "/" + currentUser.uid + "/edit"} />
        </>}
        {loggedIn === 0 && <>
            <Navigate to={"/" + routeAccount + "/login?from=/" + routeUser + "/edit"} />
        </>}
    </>
}

export function UserProfile() {
    const params = useParams();
    const currentUser = useAuth();
    const [user, setUser] = useState();
    const [reload, setReload] = useState(0);
    const [date, setDate] = useState();
    const [error, setError] = useState();

    useEffect(() => {
        getUserInfo(params.id).then(res => {
            if (res !== undefined) {
                setUser(res);
                setDate(new Date(Number(res.joinedat)))
            }
            if (res === undefined) {
                setReload(1)
            }
            // console.log(res)
        })
    }, [params.id, reload])

    useEffect(() => {
        if (currentUser?.uid === params.id && reload === 1) {
            profileInitial(currentUser)
            setReload(0)
        }
        if (currentUser?.uid !== params.id && reload === 1) {
            setError(404)
        }
    }, [currentUser, params.id, reload])

    async function handleSignout() {
        try {
            await logout();
        } catch {
            alert("Error!");
        }
    }

    return <>
        {user && <>
            <Helmet>
                <title>{user.displayname + " | user | " + application + " | " + network}</title>
                <meta name="description" content="A website for listing all of xcwalker's projects | {url}" />
            </Helmet>
            <section className="user">
                <div className="container">
                    <div className="header">
                        <img className="background" src={user.photoBackgroundURL} alt=""></img>

                        <div className="socials"></div>
                    </div>
                    <div className="main">
                        <div className="sidebar">
                            <div className="sidebar-item user">
                                <div className="avatar">
                                    <img src={user.photoURL} alt="" />
                                </div>
                                <div className="content">
                                    <h2>{user.firstname} {user.lastname}</h2>
                                    <span>{user.displayname}</span>
                                </div>
                            </div>
                            {user.statement && <ReactMarkdown className="sidebar-item markdown">
                                {user.statement}
                            </ReactMarkdown>}
                            <div className="sidebar-item">
                                <ul>
                                    {user.gender && <li>
                                        {user.gender && (user.gender !== "male" && user.gender !== "female" && user.gender !== "transgender") && <>
                                            <span className="material-symbols-outlined">wc</span>
                                            <span>{user.gender}</span>
                                        </>}
                                        {(user.gender === "male" || user.gender === "female" || user.gender === "transgender") && <>
                                            <span className="material-symbols-outlined">{user.gender}</span>
                                            <span>{user.gender}</span>
                                        </>}
                                        <span className="identifier">Gender</span>
                                    </li>}
                                    {user.pronouns && <li>
                                        <svg width="24" height="24" viewBox="0 0 40 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="12" cy="26.2803" r="10" stroke="currentColor" strokeWidth="4" />
                                            <circle cx="28" cy="26.2803" r="10" stroke="currentColor" strokeWidth="4" />
                                            <circle cx="20" cy="12.2002" r="10" stroke="currentColor" strokeWidth="4" />
                                        </svg>
                                        <span>{user.pronouns}</span>
                                        <span className="identifier">Pronouns</span>
                                    </li>}
                                    {user.location && <li>
                                        <span className="material-symbols-outlined">map</span>
                                        <span>{user.location}</span>
                                        <span className="identifier">Location</span>
                                    </li>}
                                    <li>
                                        <span className="material-symbols-outlined">schedule</span>
                                        {date && <span>{date?.getFullYear()}-{Number(date?.getMonth()) + 1}-{date?.getDate()}</span>}
                                        {!date && <span>XXXX-XX-XX</span>}
                                        <span className="identifier">Join Date</span>
                                    </li>
                                </ul>
                            </div>
                            {user.links && <div className="sidebar-item links">
                                <ul>
                                    {user.links.map((link, index) => {
                                        if (link.includes("https://") || link.includes("http://")) {
                                            return <li key={index}>
                                                <a href={link}>
                                                    <img src={"https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=" + link + "/post&size=24"} alt="" />
                                                </a>
                                            </li>
                                        }
                                        if (!link.includes("https://") && !link.includes("http://")) {
                                            return <li key={index}>
                                                <a href={"https://" + link}>
                                                    <img src={"https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://" + link + "/post&size=24"} alt="" />
                                                </a>
                                            </li>
                                        }
                                        return <></>
                                    })}
                                </ul>
                            </div>}
                            {currentUser && <>
                                {currentUser.uid === params.id && <div className="sidebar-item controls">
                                    <Link to="./edit">Edit</Link>
                                    <button onClick={handleSignout}>Logout</button>
                                </div>}
                            </>}
                        </div>
                        <div className="mainbar"></div>
                    </div>
                </div>
            </section>
        </>}
        {error === 404 && <Error404 />}
    </>
}

export function UserProfileEdit() {
    const params = useParams();
    const currentUser = useAuth();
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState();
    const [linkList, setLinkList] = useState([""]);

    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [displayname, setDisplayname] = useState("");
    const [statement, setStatement] = useState("");
    const [profilePicture, setProfilePicture] = useState();
    const [profilePictureFile, setProfilePictureFile] = useState();
    const [backgroundPicture, setBackgroundPicture] = useState();
    const [backgroundPictureFile, setBackgroundPictureFile] = useState();

    const displayNameRef = useRef();
    const firstNameRef = useRef();
    const lastNameRef = useRef();
    const genderRef = useRef();
    const pronounsRef = useRef();
    const locationRef = useRef();
    const statementRef = useRef();

    useEffect(() => {
        getUserInfo(params.id).then(res => {
            if (res !== undefined) {
                setUser(res);

                setFirstname(res.firstname)
                setLastname(res.lastname)
                setDisplayname(res.displayname)
                setStatement(res.statement)
                setLinkList(res.links)
                setProfilePicture(res.photoURL)
                setBackgroundPicture(res.photoBackgroundURL)
            }
        })
    }, [params.id])

    function handleFirstNClick(e) {
        e.preventDefault();
        updateFirstName(firstname, currentUser, setLoading)
    }

    const handleFirstNChange = (e) => {
        e.preventDefault();
        setFirstname(firstNameRef.current.value);
    };

    function handleLastNClick(e) {
        e.preventDefault();
        updateLastName(lastname, currentUser, setLoading)
    }

    const handleLastNChange = (e) => {
        e.preventDefault();
        setLastname(lastNameRef.current.value);
    };

    function handleDisplayNClick(e) {
        e.preventDefault();
        updateDisplayName(displayname, currentUser, setLoading)
    }

    const handleDisplayNChange = (e) => {
        e.preventDefault();
        setDisplayname(displayNameRef.current.value);
    };

    function handleGenClick(e) {
        e.preventDefault();
        updateGender(genderRef.current.value, currentUser, setLoading)
    }

    function handleProClick(e) {
        e.preventDefault();
        updatePronouns(pronounsRef.current.value, currentUser, setLoading)
    }

    function handleLocClick(e) {
        e.preventDefault();
        updateLocation(locationRef.current.value, currentUser, setLoading)
    }

    const handleStectmentChange = (e) => {
        e.preventDefault();
        setStatement(statementRef.current.value);
    };

    function handleStatementClick(e) {
        e.preventDefault();
        updateStatement(statement, currentUser, setLoading)
    }

    const handleLinkChange = (e, index) => {
        e.preventDefault();
        const { value } = e.target;
        const list = [...linkList];
        list[index] = value;
        setLinkList(list);
    };

    const handleLinkRemove = (index) => {
        const list = [...linkList];
        list.splice(index, 1);
        setLinkList(list);
    };

    const handleLinkAdd = (e) => {
        e.preventDefault();
        setLinkList([...linkList, ""]);
    };

    function handleLinksClick(e) {
        e.preventDefault();
        updateLinks(linkList, currentUser, setLoading)
    }

    const handleProfilePictureChange = (e) => {
        e.preventDefault();
        setProfilePictureFile(e.target.files[0])
    }

    function handleProfilePictureClick(e) {
        e.preventDefault();
        uploadProfilePicture(profilePictureFile, currentUser, setLoading)
    }

    const handleBackgroundPictureChange = (e) => {
        e.preventDefault();
        setBackgroundPictureFile(e.target.files[0])
    }

    function handleBackgroundPictureClick(e) {
        e.preventDefault();
        uploadProfileBackgroundPicture(backgroundPictureFile, currentUser, setLoading)
    }

    useEffect(() => {
        if (!profilePictureFile) return

        // create the preview
        const objectUrl = URL.createObjectURL(profilePictureFile)
        setProfilePicture(objectUrl)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [profilePictureFile])

    useEffect(() => {
        if (!backgroundPictureFile) return

        // create the preview
        const objectUrl = URL.createObjectURL(backgroundPictureFile)
        setBackgroundPicture(objectUrl)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [backgroundPictureFile])

    return <>
        {currentUser && <>
            {params.id !== currentUser.uid && <Error403 />}
            {user && params.id === currentUser.uid && <>
                <Helmet>
                    <title>{user.displayname + " | user | " + application + " | " + network}</title>
                    <meta name="description" content="A website for listing all of xcwalker's projects | {url}" />
                </Helmet>
                <section className="user">
                    <div className="container">
                        <div className="header">
                            <img className="background" src={backgroundPicture} alt=""></img>
                        </div>
                        <div className="main">
                            <div className="sidebar">
                                <div className="sidebar-item">
                                    <img src={profilePicture} alt="" className="avatarPreview" />
                                </div>
                                <div className="sidebar-item">
                                    <label htmlFor="profilePicture">Profile Picture</label>
                                    <form action="" onSubmit={handleProfilePictureClick}>
                                        <input type="file" id="profilePicture" onChange={handleProfilePictureChange} accept=".jpg, .jpeg, .png, .apng, .webp, .webm, .gif" />
                                        <button type="submit" disabled={!profilePictureFile || loading}>Update</button>
                                    </form>
                                    <label htmlFor="backgroundPicture">Background Picture</label>
                                    <form action="" onSubmit={handleBackgroundPictureClick}>
                                        <input type="file" id="backgroundPicture" onChange={handleBackgroundPictureChange} accept=".jpg, .jpeg, .png, .apng, .webp, .webm, .gif" />
                                        <button type="submit" disabled={!backgroundPictureFile || loading}>Update</button>
                                    </form>
                                </div>
                                <div className="sidebar-item">
                                    <label htmlFor="firstname">Firstname</label>
                                    <form action="" onSubmit={handleFirstNClick}>
                                        <input type="text" name="firstname" ref={firstNameRef} id="firstname" value={firstname} onChange={handleFirstNChange} autoComplete="off" />
                                        <button type="submit" disabled={firstname.length === 0 || loading}>Update</button>
                                    </form>
                                    <label htmlFor="lastname">Lastname</label>
                                    <form action="" onSubmit={handleLastNClick}>
                                        <input type="text" name="lastname" ref={lastNameRef} id="lastname" value={lastname} onChange={handleLastNChange} autoComplete="off" />
                                        <button type="submit" disabled={lastname.length === 0 || loading}>Update</button>
                                    </form>
                                    <label htmlFor="displayname">Displayname</label>
                                    <form action="" onSubmit={handleDisplayNClick}>
                                        <input type="text" name="displayname" ref={displayNameRef} id="displayname" value={displayname} onChange={handleDisplayNChange} autoComplete="off" />
                                        <button type="submit" disabled={displayname.length === 0 || loading}>Update</button>
                                    </form>
                                </div>
                                <div className="sidebar-item">
                                    <form action="" className="type-2" onSubmit={handleStatementClick}>
                                        <textarea name="statement" id="statement" ref={statementRef} cols="30" rows="10" value={statement} onChange={handleStectmentChange} autoComplete="off"></textarea>
                                        <button type="submit" disabled={loading}>Update</button>
                                    </form>
                                </div>
                                <div className="sidebar-item">
                                    <ul>
                                        <li>
                                            <span className="material-symbols-outlined">wc</span>
                                            <div className="content">
                                                <label htmlFor="gender">Gender</label>
                                                <form action="" onSubmit={handleGenClick}>
                                                    <input type="text" name="gender" ref={genderRef} id="gender" placeholder={user.gender} autoComplete="off" />
                                                    <button type="submit">Update</button>
                                                </form>
                                            </div>
                                        </li>
                                        <li>
                                            <svg width="24" height="24" viewBox="0 0 40 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="12" cy="26.2803" r="10" stroke="currentColor" strokeWidth="4" />
                                                <circle cx="28" cy="26.2803" r="10" stroke="currentColor" strokeWidth="4" />
                                                <circle cx="20" cy="12.2002" r="10" stroke="currentColor" strokeWidth="4" />
                                            </svg>
                                            <div className="content">
                                                <label htmlFor="pronouns">Pronouns</label>
                                                <form action="" onSubmit={handleProClick}>
                                                    <input type="text" name="pronouns" ref={pronounsRef} id="pronouns" placeholder={user.pronouns} autoComplete="off" />
                                                    <button type="submit">Update</button>
                                                </form>
                                            </div>
                                        </li>
                                        <li>
                                            <span className="material-symbols-outlined">map</span>
                                            <div className="content">
                                                <label htmlFor="location">Location</label>
                                                <form action="" onSubmit={handleLocClick}>
                                                    <input type="text" name="location" ref={locationRef} id="location" placeholder={user.location} autoComplete="off" />
                                                    <button type="submit">Update</button>
                                                </form>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <form className="sidebar-item" onSubmit={handleLinksClick}>
                                    <ul>
                                        {linkList.map((link, index) => (
                                            <li key={index}>

                                                <label htmlFor={"link" + index}>Link</label>
                                                <div className="content-2">
                                                    <input type="url" name={"link" + index} id={"link" + index} value={link} onChange={(e) => handleLinkChange(e, index)} required autoComplete="off" />
                                                    <button onClick={() => handleLinkRemove(index)}>Remove</button>
                                                </div>
                                            </li>
                                        ))}
                                        <div className="buttons">
                                            <button onClick={handleLinkAdd}>Add</button>
                                            <button type="submit">Submit</button>
                                        </div>
                                    </ul>
                                </form>
                            </div>
                            <div className="mainbar"></div>
                        </div>
                    </div>
                </section>
            </>}
        </>}
    </>
}