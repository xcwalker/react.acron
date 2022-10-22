// react
import { useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";

import { error, forgot, login, register, useAuth } from "../Firebase";
import { application, network, release, url } from "../App";

// css
import "../style/AccountPages.css"

export function AccountIndex() {
    const currentUser = useAuth();
    // if user
    // Navigate => profile
    if (currentUser) { return <Navigate to={'/user/' + currentUser.uid} /> }

    // if !user
    // Navigate => login
    if (!currentUser) { return <Navigate to="./login" /> }
}

export function Login() {
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
            <meta name="description" content="{page} for an {release} {application} account. | A website for listing all of xcwalker's projects | {url}" />
        </Helmet>
        <section className="accounts">
            <div className="container">
                {currentUser && <Navigate to={'/user/' + currentUser.uid} />}
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

export function Register() {
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
            <meta name="description" content="{page} for an {release} {application} account. | A website for listing all of xcwalker's projects | {url}" />
        </Helmet>
        <section className="accounts">
            <div className="container">
                {currentUser && <Navigate to={'/user/' + currentUser.uid} />}
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

export function Forgot() {

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
            <meta name="description" content="{page} for an {release} {application} account. | A website for listing all of xcwalker's projects | {url}" />
        </Helmet>
        <section className="accounts">
            <div className="container">
                {currentUser && <Navigate to={'/user/' + currentUser.uid} />}
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

function Background() {
    return <div className="background">
        <div className="item" />
        <div className="item" />
        <div className="item" />
        <div className="item" />
    </div>
}