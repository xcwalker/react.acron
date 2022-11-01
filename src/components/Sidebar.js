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
                <div className="container">
                    <ul className="upper">
                        <Link to="/" className="link material-symbols-outlined" data-hover-text="Home" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>home</Link>
                        <Link to={routeSearch} className="link material-symbols-outlined" data-hover-text="Search" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>search</Link>
                        <Link to={routePost} className="link material-symbols-outlined" data-hover-text="Feed" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>dynamic_feed</Link>
                        <Link to={routePost + "/" + routePostNew} className="link material-symbols-outlined" data-hover-text="New Post" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>post_add</Link>
                        <Link to={routeTree + "/dashboard"} className="link material-symbols-outlined" data-hover-text="TreeDash™" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>account_tree</Link>
                        <Link to={routeDev + "/dashboard"} className="link material-symbols-outlined" data-hover-text="DevDash™" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>dashboard</Link>
                    </ul>
                    <ul className="lower">
                        <Link to={routeAbout} className="link material-symbols-outlined"data-hover-text="Help" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>help</Link>
                        <Link to={routeDev + "/" + currentUser.uid} className="link material-symbols-outlined" data-hover-text="DevPro™" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>webhook</Link>
                        <Link to={routeUser + "/" + currentUser.uid} className="avatar" data-hover-text="Profile" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                            <img src={photoURL} alt="Avatar" className="avatar" data-hover-text="Profile" />
                        </Link>
                        <Link to={routeAccount + "/edit"} className="link alt material-symbols-outlined"data-hover-text="Settings" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>settings</Link>
                    </ul>
                </div>
            </menu>
            <tooltip>
                <div className="container">
                    {toolTip && <>
                    <span style={{top: toolTip.top, right: document.body.clientWidth - toolTip.left + 10}} className="tooltip">{toolTip.text}</span>
                    </>}
                </div>
            </tooltip>
        </>}
    </>
}