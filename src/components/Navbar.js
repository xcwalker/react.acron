// react
import { Link } from "react-router-dom";
import { useAuth } from "../Firebase";
import { useEffect, useState } from "react";

// custom
import { LogoXCWalker } from "./Logo";
import { routeAccount, routePost, routePostNew, routeUser, toastStyle_success } from "../App";

// css
import "../style/navbar.css"

export function Navbar() {
    const currentUser = useAuth();
    const [photoURL, setPhotoURL] = useState("https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png");

    useEffect(() => {
        if (!currentUser) return
        if (!currentUser.photoURL) {setPhotoURL("https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png")}
        if (currentUser.photoURL) {setPhotoURL(currentUser.photoURL)}
    }, [currentUser])

    let navScrollLastKnown = 0;
    const navScroll = () => {
        document.addEventListener("scroll", e => {
            if (window.scrollY > navScrollLastKnown) {
                document.body.classList.remove("scrolledUp")
            } else if (window.scrollY < navScrollLastKnown) {
                document.body.classList.add("scrolledUp")
            }
            navScrollLastKnown = window.scrollY;

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
                            <Link to={routeAccount + "/register"}>Register</Link>
                            <Link className="alt" to={routeAccount + "/login"}>Login</Link>
                        </>}
                        {currentUser && <>
                            <Link to={routePost + "/" + routePostNew}>Post</Link>
                        </>}
                    </ul>
                </nav>
                {currentUser && <Link to={routeUser + "/" + currentUser.uid} className="avatar" >
                    <img src={photoURL} alt="Avatar" className="avatar" />
                </Link>}
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