// react
import { Link } from "react-router-dom";
import { useAuth } from "../Firebase";

// custom
import { LogoXCWalker } from "./Logo";
import { routeAccount } from "../App";

// css
import "../style/navbar.css"

export function Navbar() {
    const currentUser = useAuth();

    let navScrollLastKnown = 0;
    const navScroll = () => {
        document.addEventListener("scroll", e => {
            if (window.scrollY > navScrollLastKnown) {
                document.body.classList.remove("scrolledUp")
                navScrollLastKnown = window.scrollY;
            } else if (window.scrollY < navScrollLastKnown) {
                document.body.classList.add("scrolledUp")
                navScrollLastKnown = window.scrollY;
            }

            if (document.body.getBoundingClientRect().top >= 0) {
                document.body.classList.remove("scrolled")
            } else if (document.body.getBoundingClientRect().top < 0) {
                // console.log(document.body.getBoundingClientRect().top)
                document.body.classList.add("scrolled")
            }
        })
    }

    return <>
        {!currentUser && <header onLoad={navScroll()}>
            <div className="container">
                <LogoXCWalker />
                <div className="nav">
                    <nav>
                        <ul>
                            <Link to="/">Home</Link>
                            <Link to={routeAccount + "/register"}>Register</Link>
                            <Link className="alt" to={routeAccount + "/login"}>Login</Link>
                        </ul>
                    </nav>
                </div>
            </div>
        </header>}
    </>
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