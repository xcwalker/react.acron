import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { routeAbout, routeAccount, routeDev, routePost, routePostNew, routeTree, routeUser } from "../App";
import { useAuth } from "../Firebase";

import "../style/sidebar.css"

export function Sidebar() {
    const currentUser = useAuth();
    const [photoURL, setPhotoURL] = useState("https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png");

    useEffect(() => {
        if (!currentUser) return
        if (!currentUser.photoURL) { setPhotoURL("https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png") }
        if (currentUser.photoURL) { setPhotoURL(currentUser.photoURL) }
    }, [currentUser])

    return <>
        {currentUser && <menu>
            <div className="container">
                <ul className="upper">
                    <Link to="/" className="link material-symbols-outlined">home</Link>
                    <Link to="/search" className="link material-symbols-outlined">search</Link>
                    <Link to={routePost} className="link material-symbols-outlined">dynamic_feed</Link>
                    <Link to={routePost + "/" + routePostNew} className="link material-symbols-outlined">post_add</Link>
                    <Link to={routeTree + "/dashboard"} className="link material-symbols-outlined">account_tree</Link>
                    <Link to={routeDev + "/dashboard"} className="link material-symbols-outlined">dashboard</Link>
                    </ul>
                <ul className="lower">
                    <Link to={routeAbout} className="link material-symbols-outlined">help</Link>
                    <Link to={routeDev + "/" + currentUser.uid} className="link material-symbols-outlined">webhook</Link>
                    <Link to={routeUser + "/" + currentUser.uid} className="avatar" >
                        <img src={photoURL} alt="Avatar" className="avatar" />
                    </Link>
                    <Link to={routeAccount + "/edit"} className="link material-symbols-outlined">settings</Link>
                </ul>
            </div>
        </menu>}
    </>
}