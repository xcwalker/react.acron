import { url } from "../App"
import { LogoXCWalker } from "../components/Logo"
import { logout } from "../Firebase";

import "../style/homepage.css"

export function Homepage() {
    async function handleSignout() {
        try {
            await logout();
        } catch {
            alert("Error!");
        }
    }
    return <>
    <button onClick={handleSignout}>(TEMP) signOut</button>
        <Hero />
    </>
}

function Hero() {
    return <section className="hero">
        <div className="container">
            <div className="foreground">
                <LogoXCWalker />
                <h1>DEVELOPMENT</h1>
                <span>{url}</span>
            </div>
            <div className="background">

            </div>
        </div>
    </section>
}