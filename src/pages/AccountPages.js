// react
import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet";

import { error, forgot, getUserInfo, login, register, updateUserInfo, uploadHeaderBackgroundPicture, uploadProfilePicture, useAuth } from "../Firebase";
import { application, network, release, routeUser, separator, url } from "../App";

// css
import "../style/AccountPages.css"
import ReactMarkdown from "react-markdown";

export function AccountIndex() {
    const currentUser = useAuth(null);
    const [loggedIn, setLoggedIn] = useState()

    useEffect(() => {
        console.info(currentUser)
        if (currentUser && currentUser !== null) { setLoggedIn(1) }
        if (currentUser === null) { setLoggedIn(0) }
    }, [currentUser])

    return <>
        {loggedIn === 1 && <>
            <Navigate to={"./edit"} />
        </>}
        {loggedIn === 0 && <>
            <Navigate to={"./login"} />
        </>}
    </>
}

export function AccountLogin() {
    const urlParams = new URLSearchParams(window.location.search);

    const [loading, setLoading] = useState(false);
    const currentUser = useAuth();

    const emailRef = useRef();
    const passwordRef = useRef();

    const page = "Login"

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        await login(emailRef.current.value, passwordRef.current.value);
        setLoading(false);
    }

    return <>
        <Helmet>
            <title>{page} {separator} {application} {separator} {network}</title>
            <meta name="description" content={page + " for an " + release + " " + application + " account. " + separator + " A website for listing all of xcwalker's projects " + separator + " " + url} />
        </Helmet>
        <section className="accounts">
            <div className="container">
                {currentUser && urlParams.get("from") && <Navigate to={urlParams.get("from")} />}
                {currentUser && <Navigate to={'/' + routeUser + '/' + currentUser.uid} />}
                <form action="" onSubmit={handleSubmit}>
                    <h2>{page}</h2>
                    {error && <div className="error">Error: {error}</div>}
                    <div className="group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" ref={emailRef} placeholder={"example@" + url} pattern="[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?" required />
                    </div>
                    <div className="group">
                        <label htmlFor="password">Password <Link className="forgot" to={"../forgot"}>Forgot Password</Link></label>
                        <input type="password" id="password" ref={passwordRef} placeholder='password' pattern="^(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$" required />
                    </div>
                    <button disabled={loading || currentUser} type="submit">{page}</button>
                </form>
            </div>
            <Link to="../register">Create An Account</Link>
            <Background />
        </section>
    </>
}

export function AccountRegister() {
    const [loading, setLoading] = useState(false);
    const currentUser = useAuth();

    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordCheckRef = useRef();

    const page = "Register"

    async function HandleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        await register(emailRef.current.value, passwordRef.current.value);
        setLoading(false);
    }

    return <>
        <Helmet>
            <title>{page} {separator} {application} {separator} {network}</title>
            <meta name="description" content={page + " for an " + release + " " + application + " account. " + separator + " A website for listing all of xcwalker's projects " + separator + " " + url} />
        </Helmet>
        <section className="accounts">
            <div className="container">
                {currentUser && <Navigate to={"../setup"} />}
                <form action="" onSubmit={HandleSubmit}>
                    <h2>{page}</h2>
                    {error && <div className="error">Error: {error}</div>}
                    <div className="group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" ref={emailRef} placeholder={"example@" + url} pattern="[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?" required />
                    </div>
                    <div className="group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" ref={passwordRef} placeholder='password' pattern="^(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$" required />
                    </div>
                    <div className="group">
                        <label htmlFor="passwordCheck">Password Confirmation</label>
                        <input type="password" id="passwordCheck" ref={passwordCheckRef} placeholder='password' pattern="^(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$" required />
                    </div>
                    <button disabled={loading || currentUser} type="submit">{page}</button>
                </form>
            </div>
            <Link to="../login">Log Into An Account</Link>
            <Background />
        </section>
    </>
}

export function AccountForgot() {

    const [loading, setLoading] = useState(false);
    const currentUser = useAuth();

    const emailRef = useRef();

    const page = "Forgot Password"

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        await forgot(emailRef.current.value);
        setLoading(false);
    }

    return <>
        <Helmet>
            <title>{page} {separator} {application} {separator} {network}</title>
            <meta name="description" content={page + " for an " + release + " " + application + " account. " + separator + " A website for listing all of xcwalker's projects " + separator + " " + url} />
        </Helmet>
        <section className="accounts">
            <div className="container">
                {currentUser && <Navigate to={'/' + routeUser + '/' + currentUser.uid} />}
                <form action="" onSubmit={handleSubmit}>
                    <h2>{page}</h2>
                    {error && <div className="error">Error: {error}</div>}
                    <div className="group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" ref={emailRef} placeholder={"example@" + url} pattern="[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?" required />
                    </div>
                    <button disabled={loading || currentUser} type="submit">{page}</button>
                </form>
            </div>
            <Link to="../login">Log Into An Account</Link>
            <Background />
        </section>
    </>
}

export function AccountEdit() {
    return "hello world"
}

export function AccountSetup() {
    const currentUser = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const [start, setStart] = useState(searchParams.get("start"))
    const [username, setUsername] = useState(searchParams.get("username"))
    const [firstname, setFirstname] = useState(searchParams.get("firstname"))
    const [lastname, setLastname] = useState(searchParams.get("lastname"))
    const [gender, setGender] = useState(searchParams.get("gender"))
    const [genderCheck, setGenderCheck] = useState("")
    const [pronouns, setPronouns] = useState(searchParams.get("pronouns"))
    const [pronounsCheck, setPronounsCheck] = useState("")
    const [location, setLocation] = useState(searchParams.get("location"))
    const [locationCheck, setLocationCheck] = useState("")
    const [description, setDescription] = useState(searchParams.get("description"))
    const [descriptionCheck, setDescriptionCheck] = useState("")
    const [profilePicture, setProfilePicture] = useState(searchParams.get("profilePicture"))
    const [profilePictureURL, setProfilePictureURL] = useState("")
    const [profilePictureCheck, setProfilePictureCheck] = useState(false)
    const [headerPicture, setHeaderPicture] = useState(searchParams.get("headerPicture"))
    const [headerPictureURL, setHeaderPictureURL] = useState("")
    const [headerPictureCheck, setHeaderPictureCheck] = useState(false)
    const [loading, setLoading] = useState(false)
    const [complete, setComplete] = useState(false)

    const usernameRef = useRef();
    const firstnameRef = useRef();
    const lastnameRef = useRef();
    const genderRef = useRef();
    const pronounsRef = useRef();
    const locationRef = useRef();
    const descriptionRef = useRef();
    const imageRef = useRef();

    const page = "Account Setup"

    useEffect(() => {
        document.body.classList.add("navHidden")
    }, [])

    useEffect(() => {
        if (((profilePicture === false || profilePicture === undefined) && (headerPicture === false || headerPicture === undefined)) || currentUser === undefined) return
        getUserInfo(currentUser.uid).then(res => {
            setProfilePictureURL(res.images.photoURL);
            setHeaderPictureURL(res.images.headerURL);
        })
    }, [currentUser, profilePicture, headerPicture])

    const handleSearchUpdate = (param, query) => {
        let updatedSearchParams = new URLSearchParams(searchParams.toString());
        updatedSearchParams.set(param, query);
        setSearchParams(updatedSearchParams.toString());
    }

    const handleStart = () => {
        handleSearchUpdate("start", "false");
        setStart("false");
    }

    const handleUsername = (usernameIn) => {
        handleSearchUpdate("username", usernameIn);
        setUsername(usernameIn);
    }

    const handleFirstname = (firstnameIn) => {
        handleSearchUpdate("firstname", firstnameIn);
        setFirstname(firstnameIn);
    }

    const handleLastname = (lastnameIn) => {
        handleSearchUpdate("lastname", lastnameIn);
        setLastname(lastnameIn);
    }

    const handleGenderChange = (genderIn) => {
        setGenderCheck(genderIn);
        handleSearchUpdate("gender", genderIn);
    }

    const handlePronounsChange = (pronounsIn) => {
        setPronounsCheck(pronounsIn);
        handleSearchUpdate("pronouns", pronounsIn);
    }

    const handleLocationChange = (locationIn) => {
        setLocationCheck(locationIn);
        handleSearchUpdate("location", locationIn);
    }

    const handleInfo = (genderIn, pronounsIn, locationIn) => {
        if (genderIn === "") {
            setGender("⠀skip⠀")
        } else {
            setGender(genderIn)
        }

        if (pronounsIn === "") {
            setPronouns("⠀skip⠀")
        } else {
            setPronouns(pronounsIn)
        }

        if (locationIn === "") {
            setLocation("⠀skip⠀")
        } else {
            setLocation(locationIn)
        }
    }

    const handleDescription = (descriptionIn) => {
        if (descriptionIn === "") {
            descriptionIn = "⠀skip⠀"
        }

        handleSearchUpdate("description", descriptionIn);
        setDescription(descriptionIn);
    }

    const handleDescriptionChange = (descriptionIn) => {
        setDescriptionCheck(descriptionIn);
    }

    const handleProfilePictureChange = (e) => {
        e.preventDefault();
        if (e.target.files[0]) {
            setProfilePictureCheck(true)
        }
    }

    function handleProfilePictureClick(e) {
        e.preventDefault();
        if (e.target.files !== undefined) {
            uploadProfilePicture(e.target.files[0], currentUser, setLoading)

            handleSearchUpdate("profilePicture", "uploaded");
            setProfilePicture("uploaded");
        }

        if (e.target.files === undefined) {
            handleSearchUpdate("profilePicture", "skipped");
            setProfilePicture("skipped");
        }
    }

    const handleHeaderPictureChange = (e) => {
        e.preventDefault();
        if (e.target.files[0]) {
            setHeaderPictureCheck(true)
        }
    }

    function handleHeaderPictureClick(e) {
        e.preventDefault();
        if (e.target.files !== undefined) {
            uploadHeaderBackgroundPicture(e.target.files[0], currentUser, setLoading)

            handleSearchUpdate("headerPicture", "uploaded");
            setHeaderPicture("uploaded");
        }

        if (e.target.files === undefined) {
            handleSearchUpdate("headerPicture", "skipped");
            setHeaderPicture("skipped");
        }
    }

    function handleSave() {
        let statement = description;
        if (statement === "⠀skip⠀") {
            statement = "";
        }

        let genderIn = gender;
        if (genderIn === "⠀skip⠀") {
            genderIn = "";
        }

        let pronounsIn = pronouns;
        if (pronounsIn === "⠀skip⠀") {
            pronounsIn = "";
        }

        let locationIn = location;
        if (locationIn === "⠀skip⠀") {
            locationIn = "";
        }

        updateUserInfo({
            firstname: firstname,
            lastname: lastname,
            displayname: username,
            statement: statement,
            info: {
                gender: genderIn,
                pronouns: pronounsIn,
                location: locationIn,
                joined: currentUser.metadata.createdAt,
            },
            settings: {
                showUserLinks: true,
                showUserTrees: true,
                showOrganization: false
            },
        }, currentUser, setLoading).then(() => {
            setComplete(true)
        })
    }

    return <section className="accounts">
        <div className="container">
            {loading && <>
                <h2>Please Wait</h2>
            </>}
            {console.log(searchParams.get("firstname"), firstname)}
            {!loading && <>
                {(start === "true" || start === null) && <>
                    <form action="" onSubmit={(e) => { e.preventDefault(); handleStart() }}>
                        <h2>{page}</h2>
                        <button disabled={!currentUser} type="submit">Let's Get Started</button>
                    </form>
                </>}
                {start === "false" && username === null && <>
                    <form action="" onSubmit={(e) => { e.preventDefault(); handleUsername(usernameRef.current.value) }}>
                        <h2>What's your handle?</h2>
                        <div className="group">
                            <label htmlFor="username">Displayname</label>
                            <input type="text" id="username" ref={usernameRef} placeholder="Anonymous" required />
                        </div>
                        <button disabled={!currentUser} type="submit">Continue</button>
                    </form>
                </>}
                {start === "false" && username !== null && (firstname === null || lastname === null) && <>
                    <form action="" onSubmit={(e) => { e.preventDefault(); handleLastname(lastnameRef.current.value) }}>
                        <h2>What's your name?</h2>
                        <div className="group">
                            <label htmlFor="firstname">Firstname</label>
                            <input type="text" id="firstname" ref={firstnameRef} placeholder="John" onChange={() => { handleFirstname(firstnameRef.current.value) }} required />
                        </div>
                        <div className="group">
                            <label htmlFor="lastname">Lastname</label>
                            <input type="text" id="lastname" ref={lastnameRef} placeholder="Doe" required />
                        </div>
                        <button disabled={!currentUser} type="submit">Continue</button>
                    </form>
                </>}
                {start === "false" && username !== null && firstname !== null && lastname !== null && (gender === null || pronouns === null || location === null) && <>
                    <form action="" onSubmit={(e) => { e.preventDefault(); handleInfo(genderRef?.current?.value, pronounsRef?.current?.value, locationRef?.current?.value) }}>
                        <h2>Tell us about yourself.</h2>
                        <div className="group">
                            <label htmlFor="gender">Gender</label>
                            <input type="text" id="gender" ref={genderRef} onChange={() => { handleGenderChange(genderRef?.current?.value) }} placeholder="" />
                        </div>
                        <div className="group">
                            <label htmlFor="pronouns">Pronouns</label>
                            <input type="text" id="pronouns" ref={pronounsRef} onChange={() => { handlePronounsChange(pronounsRef?.current?.value) }} placeholder="" />
                        </div>
                        <div className="group">
                            <label htmlFor="location">Location</label>
                            <input type="text" id="location" ref={locationRef} onChange={() => { handleLocationChange(locationRef?.current?.value) }} placeholder="" />
                        </div>
                        {genderCheck === "" && pronounsCheck === "" && locationCheck === "" && <button disabled={!currentUser} type="submit">Skip</button>}
                        {(genderCheck !== "" || pronounsCheck !== "" || locationCheck !== "") && <button disabled={!currentUser} type="submit">Continue</button>}
                    </form>
                </>}
                {start === "false" && username !== null && firstname !== null && lastname !== null && gender !== null && pronouns !== null && location !== null && description === null && <>
                    <form action="" onSubmit={(e) => { e.preventDefault(); handleDescription(descriptionRef.current.value) }}>
                        <h2>Tell us about yourself.</h2>
                        <div className="group">
                            <label htmlFor="description">Description</label>
                            <textarea id="description" ref={descriptionRef} onChange={() => { handleDescriptionChange(descriptionRef?.current?.value) }} placeholder="" />
                        </div>
                        {descriptionCheck === "" && <button disabled={!currentUser} type="submit">Skip</button>}
                        {descriptionCheck !== "" && <button disabled={!currentUser} type="submit">Continue</button>}
                    </form>
                </>}
                {start === "false" && username !== null && firstname !== null && lastname !== null && gender !== null && pronouns !== null && location !== null && description !== null && profilePicture === null && <>
                    <form action="" onSubmit={handleProfilePictureClick}>
                        <h2>How about a picture?</h2>
                        <div className="group">
                            <label htmlFor="description">Profile Picture</label>
                            <input type="file" id="description" ref={imageRef} onChange={handleProfilePictureChange} placeholder="" />
                        </div>
                        {profilePictureCheck === false && <button disabled={!currentUser} type="submit">Skip</button>}
                        {profilePictureCheck === true && <button disabled={!currentUser} type="submit">Continue</button>}
                    </form>
                </>}
                {start === "false" && username !== null && firstname !== null && lastname !== null && gender !== null && pronouns !== null && location !== null && description !== null && profilePicture !== null && headerPicture === null && <>
                    <form action="" onSubmit={handleHeaderPictureClick}>
                        <h2>Let's Get A Head Start?</h2>
                        <div className="group">
                            <label htmlFor="description">Header Picture</label>
                            <input type="file" id="description" ref={imageRef} onChange={handleHeaderPictureChange} placeholder="" />
                        </div>
                        {headerPictureCheck === false && <button disabled={!currentUser} type="submit">Skip</button>}
                        {headerPictureCheck === true && <button disabled={!currentUser} type="submit">Continue</button>}
                    </form>
                </>}
                {start === "false" && username !== null && firstname !== null && lastname !== null && gender !== null && pronouns !== null && location !== null && description !== null && profilePicture !== null && headerPicture !== null && <>
                    <form action="" className="last" onSubmit={(e) => { e.preventDefault(); handleSave() }}>
                        <div className="header">
                            <img src={headerPictureURL} className="background" alt="" />
                            <img src={profilePictureURL} className="profile" alt="" />
                        </div>
                        <div className="about">
                            <h2>{firstname} {lastname}</h2>
                            <h3>{username}</h3>
                        </div>
                        <div className="info">
                            {gender !== "⠀skip⠀" && <span>{gender}</span>}
                            {gender !== "⠀skip⠀" && pronouns !== "⠀skip⠀" && <div className="separator" />}
                            {pronouns !== "⠀skip⠀" && <span>{pronouns}</span>}
                            {pronouns !== "⠀skip⠀" && location !== "⠀skip⠀" && <div className="separator" />}
                            {location !== "⠀skip⠀" && <span>{location}</span>}
                        </div>
                        {description !== "⠀skip⠀" && <ReactMarkdown>{description}</ReactMarkdown>}
                        <button disabled={!currentUser} type="submit">Save It</button>
                    </form>
                </>}
                {complete && <Navigate to={"/" + routeUser + "/" + currentUser?.uid} />}
            </>}
        </div>
        <Link to={"/" + routeUser + "/" + currentUser?.uid}>Skip Setup</Link>
        <Background />
    </section>
}

// other
function Background() {
    return <div className="background">
        <div className="item" />
        <div className="item" />
        <div className="item" />
        <div className="item" />
    </div>
}