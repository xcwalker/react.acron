import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, Navigate, useParams } from "react-router-dom";
import ReactMarkdown from 'react-markdown'
import { application, network, routeAccount, routeUser, routeDev, routeTree, url, separator } from "../App";
import { getUserInfo, getUsersOwnTrees, logout, profileInitial, updateUserInfo, uploadHeaderBackgroundPicture, uploadProfilePicture, useAuth } from "../Firebase";

import { FastAverageColor } from 'fast-average-color';

import "../style/UserPages.css"
import { Error403, Error404 } from "./ErrorPages";

export function UserIndex() {
    const currentUser = useAuth(null);
    const [loggedIn, setLoggedIn] = useState()

    useEffect(() => {
        if (currentUser && currentUser !== null) { setLoggedIn(1) }
        if (currentUser === null) { setLoggedIn(0) }
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
        if (currentUser && currentUser !== null) { setLoggedIn(1) }
        if (currentUser === null) { setLoggedIn(0) }
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
    const [currentUserDetails, setCurrentUserDetails] = useState({});
    const [treeLoading, setTreeLoading] = useState();
    const [reload, setReload] = useState(0);
    const [date, setDate] = useState();
    const [trees, setTrees] = useState();
    const [error, setError] = useState();

    const image = document.querySelector('section.user .container .header img.background');
    useEffect(() => {
        if (!image) return
        const fac = new FastAverageColor();
        const container = document.querySelector('section.user .container')

        fac.getColorAsync(image, { mode: "speed", algorithm: "simple" })
            .then(color => {
                container.style.setProperty("--auto-color-simple", color.rgba);
                container.style.setProperty("--auto-color-simple-faded", "rgba(" + color.value[0] + ", " + color.value[1] + ", " + color.value[2] + ", 0.2)");
                console.info(color)
            })
            .catch(e => {
                console.log(e);
            });

        fac.getColorAsync(image, { mode: "speed", algorithm: "dominant" })
            .then(color => {
                container.style.setProperty("--auto-color-dominant", color.rgba);

                container.style.setProperty("--auto-color-dominant-text", color.isDark ? 'var(--dnu-light-color-200)' : 'var(--dnu-dark-color-200)');
                container.style.setProperty("--auto-color-dominant-text-alt", color.isDark ? 'var(--dnu-light-color-300)' : 'var(--dnu-dark-color-300)');
                console.info(color)
            })
            .catch(e => {
                console.log(e);
            });
    }, [image, user])

    useEffect(() => {
        document.body.classList.remove("navHidden")
        document.documentElement.setAttribute("data-current-page", "user")
    }, [])

    useEffect(() => {
        getUserInfo(params.id).then(res => {
            if (res !== undefined) {
                setUser(res);
                setDate(new Date(Number(res.info.joined)))
            }
            if (res === undefined) {
                setReload(1)
            }
        })
    }, [params.id, reload])

    useEffect(() => {
        if (currentUser?.uid === params.id) {
            document.documentElement.setAttribute("data-current-page", "user current")
        }
        if (currentUser?.uid === params.id && reload === 1) {
            profileInitial(currentUser)
            setReload(0)
        }
        if (currentUser?.uid !== params.id && reload === 1) {
            setError(404)
        }
    }, [currentUser, params.id, reload])

    useEffect(() => {
        if (!currentUser) return
        getUserInfo(currentUser.uid)
            .then(res => {
                setCurrentUserDetails(res)
            })
        getUsersOwnTrees(currentUser, setTreeLoading)
            .then(res => {
                setTrees(res)
            })
    }, [currentUser])

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
                <title>{user.about.displayname + " " + separator + " " + application + " " + separator + " " + network}</title>
                <meta name="description" content={user.about.displayname + " " + separator + " " + application + " " + separator + " A website for listing all of xcwalker's projects " + separator + " " + url} />
            </Helmet>
            <section className="user">
                <div className="container">
                    <div className="header">
                        {user.images.headerURL?.split(".").pop().split("?")[0] === "webm" && <video className="background" src={user.images.headerURL} alt="" autoPlay muted loop crossOrigin="anonymous" ></video>}
                        {user.images.headerURL?.split(".").pop().split("?")[0] !== "webm" && <img className="background" src={user.images.headerURL} alt="" crossOrigin="anonymous" ></img>}
                    </div>
                    <div className="main">
                        <div className="sidebar">
                            <div className="sidebar-item user">
                                <div className="avatar">
                                    <img src={user.images.photoURL} alt="" />
                                </div>
                                <div className="content">
                                    <h2>{user.about.firstname} {user.about.lastname}</h2>
                                    <span>{user.about.displayname}</span>
                                </div>
                            </div>
                            {(user.organization?.name === currentUserDetails?.organization?.name || user.settings?.showOrganization) && user.organization?.name && user.organization?.roles && <div className="sidebar-item roles">
                                <h3>{user.organization.name}</h3>
                                <ul>
                                    {user.organization.roles.map((role, index) => {
                                        return <Link to={"/" + routeDev + "/" + params.id} key={index} >
                                            {role}
                                        </Link>
                                    })}
                                </ul>
                            </div>}
                            {user.about.statement && <ReactMarkdown className="sidebar-item markdown">
                                {user.about.statement}
                            </ReactMarkdown>}
                            <div className="sidebar-item">
                                <ul>
                                    {user.info.gender && <li>
                                        {user.info.gender && (user.info.gender !== "male" && user.info.gender !== "female" && user.info.gender !== "transgender") && <>
                                            <span className="material-symbols-outlined">wc</span>
                                            <span>{user.info.gender}</span>
                                        </>}
                                        {(user.info.gender === "male" || user.info.gender === "female" || user.info.gender === "transgender") && <>
                                            <span className="material-symbols-outlined">{user.info.gender}</span>
                                            <span>{user.info.gender}</span>
                                        </>}
                                        <span className="identifier">Gender</span>
                                    </li>}
                                    {user.info.pronouns && <li>
                                        <svg width="24" height="24" viewBox="0 0 40 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="12" cy="26.2803" r="10" stroke="currentColor" strokeWidth="4" />
                                            <circle cx="28" cy="26.2803" r="10" stroke="currentColor" strokeWidth="4" />
                                            <circle cx="20" cy="12.2002" r="10" stroke="currentColor" strokeWidth="4" />
                                        </svg>
                                        <span>{user.info.pronouns}</span>
                                        <span className="identifier">Pronouns</span>
                                    </li>}
                                    {user.info.location && <li>
                                        <span className="material-symbols-outlined">map</span>
                                        <span>{user.info.location}</span>
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
                            {!treeLoading && user.links && user?.links[0] && (currentUser?.uid === params.id || user.settings.showUserLinks) && <div className="sidebar-item links">
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
                            {trees && trees[0] && user.settings.showUserTrees === true && <div className="sidebar-item trees">
                                {trees.map((tree, index) => {
                                    return <Link key={index} to={"/" + routeTree + "/" + tree.id}>/{tree.id}</Link>
                                })}
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
    const [linkList, setLinkList] = useState([]);

    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [displayname, setDisplayname] = useState("");
    const [statement, setStatement] = useState("");
    const [gender, setGender] = useState("");
    const [pronouns, setPronouns] = useState("");
    const [location, setLocation] = useState("");
    const [profilePicture, setProfilePicture] = useState();
    const [profilePictureFile, setProfilePictureFile] = useState();
    const [headerPicture, setHeaderPicture] = useState();
    const [headerPictureFile, setHeaderPictureFile] = useState();

    const displayNameRef = useRef();
    const firstNameRef = useRef();
    const lastNameRef = useRef();
    const statementRef = useRef();

    useEffect(() => {
        document.documentElement.setAttribute("data-current-page", "user edit")
    }, [])

    useEffect(() => {
        getUserInfo(params.id).then(res => {
            if (res !== undefined) {
                setUser(res);

                setFirstname(res.about.firstname)
                setLastname(res.about.lastname)
                setDisplayname(res.about.displayname)
                setStatement(res.about.statement)
                setGender(res.info.gender)
                setPronouns(res.info.pronouns)
                setLocation(res.info.location)
                setLinkList(res.links)
                setProfilePicture(res.images.photoURL)
                setHeaderPicture(res.images.headerURL)
            }
        })
    }, [params.id])

    const handleFirstNChange = (e) => {
        e.preventDefault();
        setFirstname(firstNameRef.current.value);
    };

    const handleLastNChange = (e) => {
        e.preventDefault();
        setLastname(lastNameRef.current.value);
    };

    const handleDisplayNChange = (e) => {
        e.preventDefault();
        setDisplayname(displayNameRef.current.value);
    };

    const handleStatementChange = (e) => {
        e.preventDefault();
        setStatement(statementRef.current.value);
    };

    const handleGenderChange = (e) => {
        e.preventDefault();
        setGender(e.target.value);
    };

    const handlePronounsChange = (e) => {
        e.preventDefault();
        setPronouns(e.target.value);
    };

    const handleLocationChange = (e) => {
        e.preventDefault();
        setLocation(e.target.value);
    };

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
        if (!linkList) { setLinkList([""]) };
        if (linkList) { setLinkList([...linkList, ""]) };
    };

    const handleProfilePictureChange = (e) => {
        e.preventDefault();
        setProfilePictureFile(e.target.files[0])
    }

    function handleProfilePictureClick(e) {
        e.preventDefault();
        uploadProfilePicture(profilePictureFile, currentUser, setLoading)
    }

    const handleHeaderPictureChange = (e) => {
        e.preventDefault();
        setHeaderPictureFile(e.target.files[0])
    }

    function handleHeaderPictureClick(e) {
        e.preventDefault();
        uploadHeaderBackgroundPicture(headerPictureFile, currentUser, setLoading)
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
        if (!headerPictureFile) return

        // create the preview
        const objectUrl = URL.createObjectURL(headerPictureFile)
        setHeaderPicture(objectUrl)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [headerPictureFile])

    function handleSubmit(e) {
        e.preventDefault();
        updateUserInfo({
            firstname: firstname,
            lastname: lastname,
            displayname: displayname,
            statement: statement,
            info: {
                gender: gender,
                pronouns: pronouns,
                location: location,
                joined: user.info.joined,
            },
            links: linkList
        }, currentUser, setLoading)
    }

    return <>
        {currentUser && <>
            {params.id !== currentUser.uid && <Error403 />}
            {user && params.id === currentUser.uid && <>
                <Helmet>
                    <title>{user.about?.displayname + " on " + application + " " + separator + " " + network}</title>
                    <meta name="description" content={user.about?.firstname + " " + user.about?.lastname + " " + separator + " A website for listing all of xcwalker's projects " + separator + " " + url} />
                </Helmet>
                <section className="user">
                    <div className="container">
                        <div className="header">
                            {headerPicture?.split(".").pop().split("?")[0] === "webm" && <video className="background" src={headerPicture} alt="" autoPlay muted loop ></video>}
                            {headerPicture?.split(".").pop().split("?")[0] !== "webm" && <img className="background" src={headerPicture} alt=""></img>}
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
                                    <label htmlFor="headerPicture">Header Picture</label>
                                    <form action="" onSubmit={handleHeaderPictureClick}>
                                        <input type="file" id="headerPicture" onChange={handleHeaderPictureChange} accept=".jpg, .jpeg, .png, .apng, .webp, .webm, .gif" />
                                        <button type="submit" disabled={!headerPictureFile || loading}>Update</button>
                                    </form>
                                </div>
                                <form action="" onSubmit={handleSubmit}>
                                    <div className="sidebar-item">
                                        <label htmlFor="firstname">Firstname</label>
                                        <div>
                                            <input type="text" name="firstname" ref={firstNameRef} id="firstname" value={firstname} onChange={handleFirstNChange} autoComplete="off" required />
                                        </div>
                                        <label htmlFor="lastname">Lastname</label>
                                        <div>
                                            <input type="text" name="lastname" ref={lastNameRef} id="lastname" value={lastname} onChange={handleLastNChange} autoComplete="off" required />
                                        </div>
                                        <label htmlFor="displayname">Displayname</label>
                                        <div>
                                            <input type="text" name="displayname" ref={displayNameRef} id="displayname" value={displayname} onChange={handleDisplayNChange} autoComplete="off" required />
                                        </div>
                                    </div>
                                    <div className="sidebar-item">
                                        <div>
                                            <textarea name="statement" id="statement" ref={statementRef} cols="30" rows="10" value={statement} onChange={handleStatementChange} autoComplete="off"></textarea>
                                        </div>
                                    </div>
                                    <div className="sidebar-item">
                                        <ul>
                                            <li>
                                                <span className="material-symbols-outlined">wc</span>
                                                <div className="content">
                                                    <label htmlFor="gender">Gender</label>
                                                    <div>
                                                        <input type="text" name="gender" onChange={handleGenderChange} id="gender" value={gender} autoComplete="off" />
                                                    </div>
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
                                                    <div>
                                                        <input type="text" name="pronouns" onChange={handlePronounsChange} id="pronouns" value={pronouns} autoComplete="off" />
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <span className="material-symbols-outlined">map</span>
                                                <div className="content">
                                                    <label htmlFor="location">Location</label>
                                                    <div>
                                                        <input type="text" name="location" onChange={handleLocationChange} id="location" value={location} autoComplete="off" />
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="sidebar-item">
                                        <ul>
                                            {linkList && linkList.map((link, index) => (
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
                                            </div>
                                        </ul>
                                    </div>
                                    <div className="sidebar-item">
                                        <button disabled={loading} type="submit">Submit</button>
                                    </div>
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