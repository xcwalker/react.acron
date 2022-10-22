// react
import { Link } from "react-router-dom";
import { useAuth } from "../Firebase";
import { useEffect, useState } from "react";

// custom
import { LogoXCWalker } from "./Logo";
import { routeUser } from "../App";

// css
import "../style/navbar.css"

export function Navbar() {
    const currentUser = useAuth();
    const [photoURL, setPhotoURL] = useState("https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png");

    useEffect(() => {
        if (!currentUser) return
        setPhotoURL(currentUser.photoURL)
    }, [currentUser])

    const navScroll = () => {
        document.addEventListener("scroll", e => {
            if (document.body.getBoundingClientRect().top >= 0) {
                document.body.classList.remove("scrolled")
            } else if (document.body.getBoundingClientRect().top < 0) {
                // console.log(document.body.getBoundingClientRect().top)
                document.body.classList.add("scrolled")
            }
        })
    }

    // showNav
    const showMenu = (vis) => {
        var menu = document.querySelector("section.menu");

        console.log("showMenu Click")

        if (menu != null) {
            if (menu.classList.contains("visible")) {
                menu.classList.remove("visible")
            } else if (!menu.classList.contains("visible")) {
                menu.classList.add("visible")
            }

            if (vis === false) {
                menu.classList.remove("visible")
            }
        } else {
            console.error("Menu == Null")
        }
    }

    return <header onLoad={navScroll()}>
        <div className="container">
            <LogoXCWalker />
            <div className="nav">
                <nav>
                    <ul>
                        <Link to="/">Home</Link>
                        {!currentUser && <>
                            <Link to={routeUser + "/register"}>Register</Link>
                            <Link className="alt" to={routeUser + "/login"}>Login</Link>
                        </>}
                        {currentUser && <>
                            <Link to={"user/" + currentUser.uid}>Profile</Link>
                        </>}
                    </ul>
                </nav>
                {currentUser && <button className="avatar" onClick={() => { showMenu() }} onBlur={() => { showMenu(false) }}>
                    <img src={photoURL} alt="Avatar" className="avatar" />
                </button>}
            </div>
        </div>
    </header>
}

export function Menu() {
    return <section className="menu">
        <div className="container">
            <ul>
                {/* <a></a> */}
            </ul>
            {/* <a className="logout">Logout</a> */}
        </div>
    </section>
}