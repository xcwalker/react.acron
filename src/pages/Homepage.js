import { useEffect, useState } from "react";
import { url } from "../App"
import { LogoXCWalker } from "../components/Logo"
import { getUserInfo, useAuth } from "../Firebase";

import "../style/HomePage.css"

export function Homepage() {
    const currentUser = useAuth();

    return <>
        {/* not logged in */}
        {!currentUser && <>
            <Hero />
        </>}

        {/* logged in */}
        {currentUser && <>
            <UserHero />
        </>}
    </>
}

// not logged in
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

// logged in


function UserHero() {
    const currentUser = useAuth();
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState({});

    useEffect(() => {
        if (!currentUser) return
        getUserInfo(currentUser.uid).then(res => {
            if (!res) return
            setUser(res);
            setLoading(false)
            console.info(res)
        })
    }, [currentUser])

    return <>
        {!loading && <>
            <section className="hero user">
                <div className="container">
                    <LogoXCWalker />
                    <h1>Welcome Back</h1>
                    <span>{user.about.firstname} {user.about.lastname} | {user.about.displayname}</span>
                </div>
                <HeroBackground />
            </section>
            <section className="">
                <div className="container"></div>
            </section>
        </>}
    </>
}

// other
function HeroBackground() {
    return <div className="background">
        <div className="item" />
        <div className="item" />
        <div className="item" />
        <div className="item" />
    </div>
}