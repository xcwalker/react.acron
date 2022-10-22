import { url } from "../App"
import { LogoXCWalker } from "../components/Logo"
import { logout, useAuth } from "../Firebase";

import "../style/homepage.css"

export function Homepage() {
    const currentUser = useAuth();

    async function handleSignout() {
        try {
            await logout();
        } catch {
            alert("Error!");
        }
    }

    return <>
        <Hero />
        {currentUser && <button onClick={handleSignout}>(TEMP) signOut</button>}
    </>
}

function Hero() {
    return <>
        <section className="hero">
            <div className="container">
                <LogoXCWalker />
                <h1>DEVELOPMENT</h1>
                <span>{url}</span>
            </div>
            <HeroBackground />
        </section>
        <section className="">
            <div className="container"></div>
        </section>
    </>
}

function HeroBackground() {
    return <div className="background">
        <div className="item" />
        <div className="item" />
        <div className="item" />
        <div className="item" />
    </div>
}