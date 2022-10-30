// react
import { useEffect, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";

import { error, forgot, login, register, useAuth } from "../Firebase";
import { application, network, release, routeUser, url } from "../App";

// css
import "../style/AccountPages.css"

export function AccountIndex() {
    const currentUser = useAuth(null);
    const [loggedIn, setLoggedIn] = useState()

    useEffect(() => {
        console.info(currentUser)
        if (currentUser && currentUser !== null) {setLoggedIn(1)}
        if (currentUser === null) {setLoggedIn(0)}
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
            <title>{page} | {application} | {network}</title>
            <meta name="description" content={page + " for an " + release + " " + application + " account. | A website for listing all of xcwalker's projects | " + url} />
        </Helmet>
        <section className="accounts">
            <div className="container">
                {currentUser && urlParams.get("from") && <Navigate to={urlParams.get("from")} />}
                {currentUser && <Navigate to={'/'+ routeUser + '/' + currentUser.uid} />}
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
            <title>{page} | {application} | {network}</title>
            <meta name="description" content={page + " for an " + release + " " + application + " account. | A website for listing all of xcwalker's projects | " + url} />
        </Helmet>
        <section className="accounts">
            <div className="container">
                {currentUser && <Navigate to={'/'+ routeUser + '/' + currentUser.uid} />}
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
            <title>{page} | {application} | {network}</title>
            <meta name="description" content={page + " for an " + release + " " + application + " account. | A website for listing all of xcwalker's projects | " + url} />
        </Helmet>
        <section className="accounts">
            <div className="container">
                {currentUser && <Navigate to={'/'+ routeUser + '/' + currentUser.uid} />}
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

// other
function Background() {
    return <div className="background">
        <div className="item" />
        <div className="item" />
        <div className="item" />
        <div className="item" />
    </div>
}