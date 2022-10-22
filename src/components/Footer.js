import { LogoXCWalker } from "./Logo"

import "../style/footer.css"
import {
    application,
    network,
    release,
    contactEmail,
    contactEmailMainDev,
    discordServer,
    routeUser,
    routeDev
} from "../App"

import { Link } from "react-router-dom"
import { useAuth } from "../Firebase";

export function Footer() {
    const currentUser = useAuth();

    return <footer>
        <div className="container">
            <div className="row">
                <div className="column">
                    <LogoXCWalker />
                    <div className="divider" />
                    <div className="sect" >
                        <span className="release">{release}</span>
                        <span className="application">{application}</span>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="column">
                    <div className="divider" />
                    <h3>Copyright</h3>
                    <div className="content">
                        <p>Copyright © 2022 <span>{network}</span>.
                            <br />
                            All rights reserved.
                        </p>
                    </div>
                    <div className="divider" />
                </div>
                <div className="column">
                    <div className="divider" />
                    <h3>Accounts</h3>
                    <div className="content">
                        {/* conditional (if !user)*/}
                        {!currentUser && <>
                            <Link aria-label="login" to={routeUser + "/login"}>Login</Link>
                            <Link aria-label="register" to={routeUser + "/register"}>Register</Link>
                            <Link aria-label="forgot password" to={routeUser + "/forgot"}>Forgot Password</Link>
                        </>}
                        {/* conditional (if user)*/}
                        {currentUser && <>
                            <Link aria-label="your profile" to={"user/" + currentUser.uid}>Profile</Link>
                        </>}
                    </div>
                    <div className="divider" />
                </div>
                {currentUser && <>
                    <div className="column">
                        <div className="divider" />
                        <h3>Developer</h3>
                        <div className="content">
                            {/* conditional (if !dev && user)*/}
                            <Link aria-label="Developer Register" to={routeDev + "/register"}>DevReg™</Link>
                            {/* conditional (if dev)*/}
                            <Link aria-label="Developer Dashboard" to={routeDev + "/dashboard"}>DevDash™</Link>
                            <Link aria-label="Developer Profile" to={routeDev + currentUser.uid}>DevPro™</Link>
                            <Link aria-label="Developer Post" to={routeDev + "/post"}>DevPost™</Link>
                            <Link aria-label="Developer Board" to={routeDev + "/board"}>DevBoard™</Link>
                            {/* conditional (if coreDev)*/}
                            <Link aria-label="Developer Applications" to={routeDev + "/applications"}>DevApps™</Link>
                        </div>
                        <div className="divider" />
                    </div>
                </>}
                <div className="column">
                    <div className="divider" />
                    <h3>About</h3>
                    <div className="content">

                    </div>
                    <div className="divider" />
                </div>
                <div className="column">
                    <div className="divider" />
                    <h3>Contact</h3>
                    <div className="content">
                        <a aria-label="Contact xcwalker by Email" href={"mailto:" + contactEmail}>{contactEmail}</a>
                        <a aria-label="Contact Xander by Email" href={"mailto:" + contactEmailMainDev}>{contactEmailMainDev}</a>
                        <a aria-label="xcwalker discord server" href={discordServer}>Discord Server</a>
                    </div>
                    <div className="divider" />
                </div>
            </div>
        </div>
    </footer >
}