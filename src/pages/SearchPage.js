import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { routeTree } from "../App";
import { claimTree, searchTrees, useAuth } from "../Firebase";

import "../style/search.css"

export function SearchPage() {
    const currentUser = useAuth();

    const [searchLoading, setSearchLoading] = useState(false);
    const [searchResults, setSearchResults] = useState();
    const [searchParams, setSearchParams] = useSearchParams();
    const [viewState, setViewState] = useState(searchParams.get("view"))
    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
    const [canClaim, setCanClaim] = useState(false)
    const [claimed, setClaimed] = useState(false)
    const [placeholders, setPlaceholders] = useState()
    const [placeholdersRunning, setPlaceholdersRunning] = useState(false)
    const [placeholder, setPlaceholder] = useState("")

    useEffect(() => {
        document.documentElement.setAttribute("data-current-page", "search")
    }, [])

    useEffect(() => {
        fetch("https://raw.githubusercontent.com/baliw/words/master/adjectives.json")
            .then((response) => response.json())
            .then((data) => setPlaceholders(data));
    }, [])

    useEffect(() => {
        setCanClaim(false)
        setSearchResults(undefined)
        if (!searchParams.get("q")) return
        searchTrees(searchParams.get("q"), setSearchLoading)
            .then(res => {
                setSearchResults(res)
                if (res.some(e => e.id === searchParams.get("q"))) return
                setCanClaim(true)
            })
    }, [searchParams])

    useEffect(() => {
        if (!placeholders) return
        if (placeholdersRunning) return

        setPlaceholdersRunning(true);
        let placeholderStr = ""
        let placeholderCompleteStr = ""
        let placeholderState = "adding"
        let placeholderHold = 0;

        let delay = 200;

        function timeout() {
            setTimeout(function () {
                if (placeholderStr === "") {
                    placeholderState = "adding"
                    function newString() {
                        var str = placeholders[Math.floor(Math.random() * placeholders.length) - 1] + "...";

                        if (str !== placeholderCompleteStr) {
                            placeholderCompleteStr = str;
                            return;
                        } else {
                            newString();
                        }
                    }

                    newString();
                    placeholderStr = placeholderCompleteStr.substring(0, 1)
                }

                if (placeholderStr !== "" && placeholderState === "adding") {
                    if (placeholderStr.length === placeholderCompleteStr.length) {
                        placeholderHold++;
                        if (placeholderHold === 4) {
                            placeholderHold = 0;
                            placeholderState = "removing"
                        }
                    }
                    if (placeholderStr.length !== placeholderCompleteStr.length) {
                        delay = 200
                        placeholderStr = placeholderCompleteStr.substring(0, placeholderStr.length + 1)
                    }
                }

                if (placeholderStr !== "" && placeholderState === "removing") {
                    if (placeholderStr.length === 0) {
                        placeholderState = "adding"
                    }
                    if (placeholderStr.length !== 0) {
                        delay = 50
                        placeholderStr = placeholderCompleteStr.substring(0, placeholderStr.length - 1)
                    }
                }

                setPlaceholder(placeholderStr)

                timeout();
            }, delay);
        }

        timeout();
    }, [placeholders, placeholdersRunning])

    // Search Existing Trees
    // Using:
    // User Displayname && Firstname && Lastname
    // Tree Id
    // Tree Title
    // Tree Statement
    // Tree Links
    // Show if TreeID is unclaimed

    const handleSearch = (e) => {
        e.preventDefault();

        let updatedSearchParams = new URLSearchParams(searchParams.toString());

        if (!searchQuery.endsWith(" ")) {
            updatedSearchParams.set('q', searchQuery);
        }
        if (searchQuery.endsWith(" ")) {
            let searchQueryStr = searchQuery;

            for (let i; i <= searchQueryStr; i++) {
                if (searchQueryStr.endsWith(" ")) {
                    searchQueryStr.substring(0, searchQueryStr.length - 1)
                }
            }

            updatedSearchParams.set('q', searchQueryStr);
        }

        setSearchParams(updatedSearchParams.toString());
    }

    const handleSearchUpdate = (e) => {
        setSearchQuery(e.target.value)
    }

    const handleTreeClaim = (e) => {
        claimTree(searchParams.get("q"), currentUser)
            .then(() => {
                setClaimed(true)
            })
    }

    const setView = (view) => {
        setViewState(view)

        let updatedSearchParams = new URLSearchParams(searchParams.toString());
        updatedSearchParams.set('view', view);
        setSearchParams(updatedSearchParams.toString());
        Event.preventDefault();
    }

    return <>
        <section className="search">
            <div className="container">
                {!searchResults && !canClaim && <div className="no-results">
                    <h1>Let's Search For Something</h1>
                    <form action="" onSubmit={handleSearch} className="searchBar">
                        <input type="search" name="" id="" value={searchQuery} placeholder={placeholder} onChange={handleSearchUpdate} />
                        <button type="submit" disabled={searchLoading || !searchQuery}>Search</button>
                    </form>
                </div>}
                {(searchResults || canClaim) && <div className="results">
                    <div className="header">
                        <form onSubmit={handleSearch} className="searchBar">
                            <input type="search" name="" id="" value={searchQuery} placeholder={placeholder} onChange={handleSearchUpdate} />
                            <button type="submit" disabled={searchLoading || !searchQuery}>Search</button>
                        </form>
                        <div className="controls">
                            <div className="set">
                                {(!viewState || viewState === "grid") && <span className="material-symbols-outlined active">grid_view</span>}
                                {(viewState && viewState !== "grid") && <button onClick={(e) => { setView("grid") }}><span className="material-symbols-outlined">grid_view</span></button>}
                                {viewState === "list" && <span className="material-symbols-outlined active">view_list</span>}
                                {viewState !== "list" && <button onClick={() => { setView("list") }}><span className="material-symbols-outlined">view_list</span></button>}
                                {viewState === "carousel" && <span className="material-symbols-outlined active">view_carousel</span>}
                                {viewState !== "carousel" && <button onClick={() => { setView("carousel") }}><span className="material-symbols-outlined">view_carousel</span></button>}
                            </div>
                        </div>
                    </div>
                    <div className="content" data-view={viewState}>
                        {searchResults && <ul>
                            {(!viewState || viewState === "grid") && <>
                                {canClaim && <button className="search-item" onClick={handleTreeClaim}>
                                    <h3>Claim?</h3>
                                    <span>/{searchParams.get("q")}</span>
                                    <ItemBackground />
                                    {claimed && <Navigate to={"../" + routeTree + "/" + searchParams.get("q")} />}
                                </button>}
                                {searchResults.map((result, index) => {
                                    return <Link to={"../" + routeTree + "/" + result.id} key={index} className="search-item">
                                        {result.data.originalUser === currentUser.uid && <>
                                            <span className="material-symbols-outlined">person</span>
                                            <span className="hover">Owner</span>
                                        </>}
                                        {result.data.originalUser !== currentUser.uid && result.data.authedUser.includes(currentUser.uid) && <>
                                            <span className="material-symbols-outlined">group</span>
                                            <span className="hover">Contributor</span>
                                        </>}
                                        <h3>{result.data.title}</h3>
                                        <span>/{result.id}</span>
                                        {!result.data.images?.iconURL && <ItemBackground />}
                                        {result.data.images?.iconURL && <>
                                            {result.data.images?.iconURL?.split(".").pop().split("?")[0] === "webm" && <video src={result.data.images?.iconURL} alt="" autoPlay muted loop ></video>}
                                            {result.data.images?.iconURL?.split(".").pop().split("?")[0] !== "webm" && <img src={result.data.images?.iconURL} alt=""></img>}
                                        </>}
                                    </Link>
                                })}
                            </>}
                            {viewState === "list" && <>
                                {canClaim && <div className="search-item" onClick={handleTreeClaim}>
                                    <div className="preview">
                                        <h3>Claim?</h3>
                                        <span>/{searchParams.get("q")}</span>
                                        <ItemBackground />
                                    </div>
                                    <div className="info">
                                        <h3>{searchParams.get("q")} is Unclaimed.</h3>
                                        <ReactMarkdown>Lat's make it your...</ReactMarkdown>
                                        <button Click={handleTreeClaim} >Claim It!</button>
                                    </div>
                                    {claimed && <Navigate to={"../" + routeTree + "/" + searchParams.get("q")} />}
                                </div>}
                                {searchResults.map((result, index) => {
                                    return <div key={index} className="search-item">
                                        <div className="preview">
                                            {result.data.originalUser === currentUser.uid && <>
                                                <span className="material-symbols-outlined">person</span>
                                                <span className="hover">Owner</span>
                                            </>}
                                            {result.data.originalUser !== currentUser.uid && result.data.authedUser.includes(currentUser.uid) && <>
                                                <span className="material-symbols-outlined">group</span>
                                                <span className="hover">Contributor</span>
                                            </>}
                                            <h3>{result.data.title}</h3>
                                            <span>/{result.id}</span>
                                            {!result.data.images?.backgroundURL && <ItemBackground />}
                                            {result.data.images?.backgroundURL && <img src={result.data.images.backgroundURL} alt="" />}
                                        </div>
                                        <div className="info">
                                            <h3>{result.data.title}</h3>
                                            <ReactMarkdown>{result.data.description}</ReactMarkdown>
                                            <Link to={"../" + routeTree + "/" + result.id} >View Tree</Link>
                                        </div>
                                    </div>
                                })}
                            </>}
                        </ul>}
                    </div>
                </div>}
            </div>
        </section>
    </>
}

function ItemBackground() {
    return <div className="background">
        <div className="item" />
        <div className="item" />
        <div className="item" />
        <div className="item" />
    </div>
}