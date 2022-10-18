// react
import { Link } from "react-router-dom";
import { useAuth } from "../Firebase";

// custom
import { LogoXCWalker } from "./Logo";
import { routeUser } from "../App";

// css
import "../style/navbar.css"

export function Navbar() {
    const currentUser = useAuth();

    const navScroll = () => {
        document.addEventListener("scroll", e => {
            if (document.body.getBoundingClientRect().top >= 0) {
                document.body.classList.remove("scrolled")
            } else if (document.body.getBoundingClientRect().top < 0) {
                console.log(document.body.getBoundingClientRect().top)
                document.body.classList.add("scrolled")
            }
        })
    }

    return <header onLoad={navScroll()}>
        <div className="container">
            <LogoXCWalker />
            <div className="nav">
                <nav>
                    <ul>
                        <Link to="/">Home</Link>
                        {!currentUser && <>
                            <Link to={routeUser + "/login"}>Login</Link>
                            <Link to={routeUser + "/register"}>Register</Link>
                        </>}
                        {currentUser && <>
                            <Link to={"user/" + currentUser.uid}>Profile</Link>
                        </>}
                    </ul>
                </nav>
                <div></div>
            </div>
        </div>
    </header>
}