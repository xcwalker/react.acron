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
                            <Link to={routeUser + "/login"}>Login</Link>
                            <Link to={routeUser + "/register"}>Register</Link>
                            <Link to={routeUser + "/forgot"}>Forgot Password</Link>
                        </>}
                        {/* conditional (if user)*/}
                        {currentUser && <>
                            <Link to={"user/" + currentUser.uid}>Profile</Link>
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
                            <Link to={routeDev + "/register"}>DevReg™</Link>
                            {/* conditional (if dev)*/}
                            <Link to={routeDev + "/dashboard"}>DevDash™</Link>
                            <Link to={routeDev + currentUser.uid}>DevPro™</Link>
                            <Link to={routeDev + "/post"}>DevPost™</Link>
                            <Link to={routeDev + "/board"}>DevBoard™</Link>
                            {/* conditional (if coreDev)*/}
                            <Link to={routeDev + "/applications"}>DevApps™</Link>
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
                        <a href={"mailto:" + contactEmail}>{contactEmail}</a>
                        <a href={"mailto:" + contactEmailMainDev}>{contactEmailMainDev}</a>
                        <a href={discordServer}>Discord Server</a>
                    </div>
                    <div className="divider" />
                </div>
            </div>
        </div>
    </footer >
}