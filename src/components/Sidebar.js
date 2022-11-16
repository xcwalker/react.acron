import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { routeAbout, routeAccount, routeDev, routePost, routePostNew, routeSearch, routeTree, routeUser } from "../App";
import { useAuth } from "../Firebase";

import "../style/sidebar.css"

export function Sidebar() {
    const currentUser = useAuth();
    const [photoURL, setPhotoURL] = useState("https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png");
    const [toolTip, setToolTip] = useState()
    const currentPage = document.documentElement.getAttribute("data-current-page");

    useEffect(() => {
        if (!document.querySelector("menu .container")) return

        document.querySelector("menu .container").querySelectorAll("a")
            .forEach(link => {
                if (link.getAttribute("data-page") === currentPage) {
                    link.setAttribute("data-current-page", "true")
                } else {
                    link.setAttribute("data-current-page", "false")
                }
            })
    }, [currentPage])

    useEffect(() => {
        document.body.classList.remove("signedIn")
        if (!currentUser) return
        if (!currentUser.photoURL) { setPhotoURL("https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png") }
        if (currentUser.photoURL) { setPhotoURL(currentUser.photoURL) }
        document.body.classList.add("signedIn")
    }, [currentUser])

    const handleMouseEnter = (e) => {
        setToolTip({
            text: e.target.getAttribute("data-hover-text"),
            top: e.target.getBoundingClientRect().top,
            left: e.target.getBoundingClientRect().left
        })
    }

    const handleMouseLeave = (e) => {
        setToolTip()
    }

    return <>
        {currentUser && <>
            <menu>
                <div className="container" tabIndex="-1">
                    <ul className="upper">
                        <Link to="/" className="link material-symbols-outlined" data-hover-text="Home" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} data-page="home">home</Link>
                        <Link to={routeSearch} className="link material-symbols-outlined" data-hover-text="Search" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} data-page="search">search</Link>
                        <Link to={routePost} className="link material-symbols-outlined" data-hover-text="Feed" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} data-page="feed">dynamic_feed</Link>
                        <Link to={routePost + "/" + routePostNew} className="link material-symbols-outlined" data-hover-text="New Post" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} data-page="feed new post">add</Link>
                        <div className="separator" />
                        <Link to={routeTree + "/dashboard"} className="link material-symbols-outlined" data-hover-text="TreeDash™" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} data-page="tree dashboard">account_tree</Link>
                        <Link to={routeDev + "/dashboard"} className="link material-symbols-outlined" data-hover-text="DevDash™" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} data-page="dev dashboard">dashboard</Link>
                    </ul>
                    <ul className="lower">
                        <Link to={routeAbout} className="link material-symbols-outlined" data-hover-text="Help" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} data-page="about">help</Link>
                        <Link to={routeDev + "/" + currentUser.uid} className="link material-symbols-outlined" data-hover-text="DevPro™" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} data-page="dev user current">webhook</Link>
                        <Link to={routeUser + "/" + currentUser.uid} className="avatar" data-hover-text="Profile" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} data-page="user current">
                            <img src={photoURL} alt="Avatar" className="avatar" data-hover-text="Profile" />
                        </Link>
                        <Link to={routeAccount + "/edit"} className="link alt material-symbols-outlined" data-hover-text="Settings" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} data-page="settings">settings</Link>
                    </ul>
                </div>
            </menu>
            <section className="sidebar-tooltip">
                <div className="container">
                    {toolTip && <>
                        <span style={{ top: toolTip.top, right: document.body.clientWidth - toolTip.left + 7.5 }} className="tooltip">{toolTip.text}</span>
                    </>}
                </div>
            </section>
        </>}
    </>
}