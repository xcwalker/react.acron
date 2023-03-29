import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, Navigate, useParams } from "react-router-dom";
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { application, network, routeAccount, routeUser, routeDev, routeTree, url, separator } from "../App";
import { getUserInfo, getUsersOwnTrees, logout, profileInitial, updateUserInfo, uploadHeaderBackgroundPicture, uploadProfilePicture, useAuth } from "../Firebase";

import "../style/user/index.css"
import "../style/user/edit.css"
import { Error403, Error404 } from "./ErrorPages";
import { toast } from "react-hot-toast";

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
                            {user.about.statement && <ReactMarkdown className="sidebar-item markdown" remarkPlugins={[remarkGfm]}>
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

    const handleHeaderPictureChange = (e) => {
        e.preventDefault();
        setHeaderPictureFile(e.target.files[0])
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
        const update = updateUserInfo({
            about: {
                firstname: firstname,
                lastname: lastname,
                displayname: displayname,
                statement: statement,
            },
            info: {
                gender: gender,
                pronouns: pronouns,
                location: location,
                joined: user.info.joined,
            },
            links: linkList
        }, currentUser, setLoading)

        toast.promise(update, {
            loading: 'Uploading',
            success: 'Update Complete',
            error: 'Error Updating',
        }, {
            className: "toast-item",
            position: "bottom-center",
        });
    }

    return <>
        {currentUser && <>
            {params.id !== currentUser.uid && <Error403 />}
            {user && params.id === currentUser.uid && <>
                <Helmet>
                    <title>{user.about?.displayname + " on " + application + " " + separator + " " + network}</title>
                    <meta name="description" content={user.about?.firstname + " " + user.about?.lastname + " " + separator + " A website for listing all of xcwalker's projects " + separator + " " + url} />
                </Helmet>
                <section className="user edit">
                    <div className="container">
                        <div className="header">
                            {headerPicture?.split(".").pop().split("?")[0] === "webm" && <video className="background" src={headerPicture} alt="" autoPlay muted loop ></video>}
                            {headerPicture?.split(".").pop().split("?")[0] !== "webm" && <img className="background" src={headerPicture} alt=""></img>}
                        </div>
                        <form action="" className="main" onSubmit={handleSubmit}>
                            <div className="item user">
                                <div className="avatar">
                                    <img src={profilePicture} alt="" />
                                </div>
                                <div className="content">
                                    <span className="large"><label htmlFor="firstname">{firstname}</label> <label htmlFor="lastname">{lastname}</label></span>
                                    <label htmlFor="displayname">{displayname}</label>
                                </div>
                            </div>
                            <div className="item images">
                                <label type="file" htmlFor="profilePicture">Upload Profile Picture</label>
                                <input type="file" id="profilePicture" onChange={handleProfilePictureChange} accept=".jpg, .jpeg, .png, .apng, .webp, .webm, .gif" />
                                <label type="file" htmlFor="headerPicture">Upload Header Picture</label>
                                <input type="file" id="headerPicture" onChange={handleHeaderPictureChange} accept=".jpg, .jpeg, .png, .apng, .webp, .webm, .gif" />
                            </div>
                            <div className="item names">
                                <fieldset>
                                    <label htmlFor="firstname">Firstname</label>
                                    <input type="text" name="firstname" ref={firstNameRef} id="firstname" value={firstname} onChange={handleFirstNChange} autoComplete="off" required />
                                </fieldset>
                                <fieldset>
                                    <label htmlFor="lastname">Lastname</label>
                                    <input type="text" name="lastname" ref={lastNameRef} id="lastname" value={lastname} onChange={handleLastNChange} autoComplete="off" required />
                                </fieldset>
                                <fieldset>
                                    <label htmlFor="displayname">Displayname</label>
                                    <input type="text" name="displayname" ref={displayNameRef} id="displayname" value={displayname} onChange={handleDisplayNChange} autoComplete="off" required />
                                </fieldset>
                            </div>
                            <textarea name="statement" className="item markdown" id="statement" ref={statementRef} value={statement} onChange={handleStatementChange} autoComplete="off"></textarea>
                            <div className="item info">
                                <ul>
                                    <li>
                                        <label htmlFor="gender"><span className="material-symbols-outlined" title="Gender">wc</span></label>
                                        <input type="text" name="gender" onChange={handleGenderChange} id="gender" value={gender} autoComplete="off" placeholder="Gender" title="Gender" />
                                    </li>
                                    <li>
                                        <label htmlFor="pronouns" title="Pronouns">
                                            <svg width="24" height="24" viewBox="0 0 40 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="12" cy="26.2803" r="10" stroke="currentColor" strokeWidth="4" />
                                                <circle cx="28" cy="26.2803" r="10" stroke="currentColor" strokeWidth="4" />
                                                <circle cx="20" cy="12.2002" r="10" stroke="currentColor" strokeWidth="4" />
                                            </svg>
                                        </label>
                                        <input type="text" name="pronouns" onChange={handlePronounsChange} id="pronouns" value={pronouns} autoComplete="off" placeholder="Pronouns" title="Pronouns" />
                                    </li>
                                    <li>
                                        <label htmlFor="location"><span className="material-symbols-outlined" title="Location">map</span></label>
                                        <input type="text" name="location" onChange={handleLocationChange} id="location" value={location} autoComplete="off" placeholder="Location" title="Location" />
                                    </li>
                                </ul>
                            </div>
                            <div className="item links">
                                <ul>
                                    {linkList && linkList.map((link, index) => (
                                        <li key={index}>
                                            <input type="url" name={"link" + index} id={"link" + index} value={link} onChange={(e) => handleLinkChange(e, index)} required autoComplete="off" placeholder="https://www.example.com" />
                                            <button onClick={() => handleLinkRemove(index)} type="remove"><span class="material-symbols-outlined">close</span></button>
                                        </li>
                                    ))}
                                    <button onClick={handleLinkAdd} type="add">Add Link</button>
                                </ul>
                            </div>
                            <button disabled={loading} className="item" type="submit">Save</button>
                        </form>
                    </div>
                </section>
            </>}
        </>
        }
    </>
}