import { forwardRef, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import ReactMarkdown from "react-markdown";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import { application, network, routeUser, url } from "../App";
import { claimTree, deleteTree, getTreeInfo, getUserInfo, getUsersOwnTrees, getUsersTrees, searchTrees, updateTree, useAuth } from "../Firebase";

import "../style/TreePages.css"
import { Error403 } from "./ErrorPages";

export function TreeSearch() {
    const currentUser = useAuth();

    const [searchLoading, setSearchLoading] = useState(false);
    const [searchResults, setSearchResults] = useState();
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get("q"))
    const [canClaim, setCanClaim] = useState(false)
    const [claimed, setClaimed] = useState(false)

    useEffect(() => {
        if (!searchParams.get("q")) return
        searchTrees(searchParams.get("q"), setSearchLoading)
            .then(res => {
                console.info(res)
                setSearchResults(res)
                if (res.some(e => e.id === searchParams.get("q"))) return
                setCanClaim(true)
            })
    }, [searchParams])

    // Search Existing Trees
    // Using:
    // User Displayname && Firstname && Lastname
    // Tree Id
    // Tree Title
    // Tree Statement
    // Tree Links
    // Show if TreeID is unclimaed

    const handleSearch = (e) => {
        e.preventDefault();

        let updatedSearchParams = new URLSearchParams(searchParams.toString());
        updatedSearchParams.set('q', searchQuery);
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

    return <>
        <section className="treeSearch">
            <div className="container">
                <form className="header" onSubmit={handleSearch}>
                    <div className="search-box">
                        <input type="search" name="" id="" value={searchQuery} onChange={handleSearchUpdate} />
                        <button type="submit" disabled={searchLoading || !searchQuery}>Search</button>
                    </div>
                </form>
                <div className="results">
                    {!searchResults && !canClaim && <>
                        <span className="no-results">Let's Search For Something...</span>
                    </>}
                    {searchResults && <ul>
                        {canClaim && <button className="search-item" onClick={handleTreeClaim}>
                            <h3>Claim?</h3>
                            <span>/{searchParams.get("q")}</span>
                            <TreeSearchItemBackground />
                            {claimed && <Navigate to={"./" + searchParams.get("q")} />}
                        </button>}
                        {searchResults.map((result, index) => {
                            return <Link to={"./" + result.id} key={index} className="search-item">
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
                                <TreeSearchItemBackground />
                            </Link>
                        })}
                    </ul>}
                </div>
            </div>
        </section>
    </>
}

export function TreeForward() {
    return <Navigate to="./dashboard" />
}

function TreeSearchItemBackground() {
    return <div className="background">
        <div className="item" />
        <div className="item" />
        <div className="item" />
        <div className="item" />
    </div>
}

export function TreeIndex() {
    const params = useParams();
    const currentUser = useAuth();
    const [tree, setTree] = useState();
    const [treeLinks, setTreeLinks] = useState();
    const [user, setUser] = useState();
    const [reload, setReload] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getTreeInfo(params.id).then(res => {
            setTree(res)

            setLoading(false)
            setReload(0)
        })
    }, [params.id, reload])

    useEffect(() => {
        if (!tree) return
        if (tree.settings.useOringinalUserLinks === true) {
            getUserInfo(tree.originalUser).then(res => {
                setUser(res)
                setTreeLinks(res.links)
            })
        }
        if (tree.settings.useOringinalUserLinks !== true) {
            setTreeLinks(tree.links)
        }
    }, [tree])

    function claimTreeClick() {
        claimTree(params.id, currentUser, setLoading, setReload)
    }

    const handleDelete = (e) => {
        e.preventDefault();
        deleteTree(params.id, setReload)
    }

    // useEffect(() => {
    //     if (!currentUser) return
    //     getUsersTrees(currentUser, setLoading).then(res => {
    //     })
    // }, [currentUser])

    // if (!clamied)
    // offer to claim tree

    // if (clamied)
    // load tree

    return <>
        {!loading && <>
            {tree && <>
                <Helmet>
                    <title>{tree.title + " | tree | " + application + " | " + network}</title>
                    <meta name="description" content={tree.title + " | tree | A website for listing all of xcwalker's projects | " + url} />
                </Helmet>
                <section className="tree">
                    <div className="container">
                        {tree.headerImage && <div className="header">
                            <img src="tree.headerImage" alt="" />
                        </div>}
                        {!tree.headerImage && <div className="spacer" />}
                        <div className="main">
                            <div className="sidebar">
                                <div className="sidebar-item info">
                                    <h2>{tree.title}</h2>
                                    <span>/{params.id}</span>
                                </div>
                                {tree.description && <ReactMarkdown className="sidebar-item markdown">
                                    {tree.description}
                                </ReactMarkdown>}
                                {user && tree.settings.showOriginalUser === true && <Link to={"/" + routeUser + "/" + tree.originalUser} className="sidebar-item user">
                                    <span className="material-symbols-outlined open">open_in_new</span>
                                    <div className="avatar">
                                        <img src={user.images.photoURL} alt="" />
                                    </div>
                                    <div className="content">
                                        <h2>{user.about.firstname} {user.about.lastname}</h2>
                                        <span>{user.about.displayname}</span>
                                    </div>
                                </Link>}
                                {tree.settings.showAuthedUser && tree.useOringinalUserLinks !== true && <div className="sidebar-item">
                                    <h3>Contributors</h3>
                                    <div className="authedUsers">
                                        {tree.authedUser.map((user, index) => {
                                            return <AuthedUser userID={user} key={index} />
                                        })}
                                    </div>
                                </div>}
                                {currentUser && <>
                                    {tree.authedUser.includes(currentUser.uid) && <div className="sidebar-item controls">
                                        <Link to="./edit">Edit</Link>
                                        {tree.originalUser === currentUser.uid && <button onClick={handleDelete}>Delete</button>}
                                    </div>}
                                </>}
                            </div>
                            <div className="mainbar">
                                <div className="links">
                                    <ul>
                                        {tree.settings.useOringinalUserLinks === true && treeLinks && <>
                                            {treeLinks && <span>User Has No Links</span>}
                                            {treeLinks[0] && treeLinks.map((link, index) => {
                                                if (link.includes("https://") || link.includes("http://")) {
                                                    return <a key={index} href={link}>
                                                        <img className="favicon" src={"https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=" + link + "/post&size=50"} alt="" />
                                                        <span className="title">{link}</span>
                                                    </a>
                                                }
                                                if (!link.includes("https://") && !link.includes("http://")) {
                                                    return <a key={index} href={"https://" + link}>
                                                        <img className="favicon" src={"https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://" + link + "/post&size=50"} alt="" />
                                                        <span className="title">{link}</span>
                                                    </a>
                                                }
                                                return <></>
                                            })}
                                        </>}
                                        {tree.settings.useOringinalUserLinks !== true && <>
                                            {treeLinks && treeLinks.map((link, index) => {
                                                if (link.url.includes("https://") || link.url.includes("http://")) {
                                                    return <a key={index} href={link.url}>
                                                        {link.imageURL && <img className="favicon" src={link.imageURL} alt="" />}
                                                        {!link.imageURL && <img className="favicon" src={"https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=" + link.url + "/post&size=50"} alt="" />}
                                                        <div>
                                                            <span className="title">{link.title}</span>
                                                            <span className="url">{link.url}</span>
                                                        </div>
                                                    </a>
                                                }
                                                if (!link.url.includes("https://") && !link.url.includes("http://")) {
                                                    return <a key={index} href={"https://" + link.url}>
                                                        {link.imageURL && <img className="favicon" src={link.imageURL} alt="" />}
                                                        {!link.imageURL && <img className="favicon" src={"https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=" + link.url + "/post&size=50"} alt="" />}
                                                        <div>
                                                            <span className="title">{link.title}</span>
                                                            <span className="url">{link.url}</span>
                                                        </div>
                                                    </a>
                                                }
                                                return <></>
                                            })}
                                        </>}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </>}
            {!tree && <>
                <Helmet>
                    <title>{params.id + "Unowned | tree | " + application + " | " + network}</title>
                    <meta name="description" content={params.id + " | Unowned tree | A website for listing all of xcwalker's projects | " + url} />
                </Helmet>
                <h1>unowned</h1>
                <button onClick={claimTreeClick}>Claim</button>
            </>}
        </>
        }
    </>
}

export function TreeDashboard() {
    const currentUser = useAuth();
    const [loading, setLoading] = useState();
    const [userTrees, setUserTrees] = useState();
    const [userOwnTrees, setUserOwnTrees] = useState();

    useEffect(() => {
        if (!currentUser) return
        getUsersTrees(currentUser, setLoading)
            .then(res => {
                setUserTrees(res)
            })
        getUsersOwnTrees(currentUser, setLoading)
            .then(res => {
                setUserOwnTrees(res)
            })
    }, [currentUser])

    return <>
        {!loading && currentUser && <section className="treeUser">
            <div className="container">
                {userOwnTrees &&
                    <div className="owner">
                        <h2>Owner</h2> <ul>
                            {userOwnTrees.map((tree, index) => {
                                return <Link to={"../" + tree.id} key={index} className="search-item">
                                    <h3>{tree.data.title}</h3>
                                    <span>/{tree.id}</span>
                                    {!tree.data.images?.backgroundURL && <TreeSearchItemBackground />}
                                    {tree.data.images?.backgroundURL && <img src={tree.data.images.backgroundURL} alt="" />}
                                </Link>
                            })}
                        </ul>
                    </div>}
                {userTrees && <div className="contributor">
                    <h2>Contributor</h2>
                    <ul>
                        {userTrees.map((tree, index) => {
                            return <Link to={"../" + tree.id} key={index} className="search-item">
                                <h3>{tree.data.title}</h3>
                                <span>/{tree.id}</span>
                                {!tree.data.images?.backgroundURL && <TreeSearchItemBackground />}
                                {tree.data.images?.backgroundURL && <img src={tree.data.images.backgroundURL} alt="" />}
                            </Link>
                        })}
                    </ul>
                </div>}
            </div>
        </section>}
    </>
}

export function TreeEdit() {
    const params = useParams();
    const currentUser = useAuth();
    const [tree, setTree] = useState();
    const [treeLinks, setTreeLinks] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [authedUser, setAuthedUser] = useState();
    const [showOriginalUser, setShowOriginalUser] = useState(true);
    const [showAuthedUser, setShowAuthedUser] = useState(true);
    const [showOringinalUserLinks, setShowOringinalUserLinks] = useState(true);
    const [reload, setReload] = useState(0);
    const [loading, setLoading] = useState(true);
    const [canView, setCanView] = useState(false);

    useEffect(() => {
        getTreeInfo(params.id).then(res => {
            if (res !== undefined) {
                setTree(res)
                setTitle(res.title)
                setDescription(res.description)
                setAuthedUser(res.authedUser)
                setShowAuthedUser(res.settings.showAuthedUser)
                setShowOringinalUserLinks(res.settings.useOringinalUserLinks)
                if (!res.showOringinalUserLinks) { setTreeLinks(res.links) }
            }
            setLoading(false)
            setReload(0)
        })
    }, [params.id, reload])

    useEffect(() => {
        if (!currentUser || !authedUser) return
        if (authedUser.includes(currentUser.uid)) { setCanView(true) }
    }, [currentUser, authedUser])

    function handleSubmit(e) {
        e.preventDefault()
        if (!tree || !currentUser) return
        updateTree(params.id, currentUser, setLoading, setReload, tree.originalUser, {
            title: title,
            description: description,
            settings: {
                useOringinalUserLinks: showOringinalUserLinks,
                showOriginalUser: showOriginalUser,
                showAuthedUser: showAuthedUser,
            },
            authedUser: [],
            links: treeLinks
        })
    }

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleShowAuthedUserChange = (e) => {
        setShowAuthedUser(e.target.checked);
    };

    const handleShowOringinalUserChange = (e) => {
        setShowOriginalUser(e.target.checked)
    };

    const handleShowOringinalUserLinksChange = (e) => {
        setShowOringinalUserLinks(e.target.checked)
    };

    const handleLinkChange = (e, index) => {
        e.preventDefault();
        const list = [...treeLinks];
        const obj = list[index]
        obj.url = e.target.value;
        list[index] = obj;
        setTreeLinks(list);
    };

    const handleLinkTitleChange = (e, index) => {
        e.preventDefault();
        const list = [...treeLinks];
        const obj = list[index]
        obj.title = e.target.value;
        list[index] = obj;
        setTreeLinks(list);
    };

    const handleLinkImageUrlChange = (e, index) => {
        e.preventDefault();
        const list = [...treeLinks];
        const obj = list[index]
        obj.imageURL = e.target.value;
        list[index] = obj;
        setTreeLinks(list);
    };

    const handleLinkRemove = (index) => {
        const list = [...treeLinks];
        list.splice(index, 1);
        setTreeLinks(list);
    };

    const handleLinkAdd = (e) => {
        e.preventDefault();
        if (showOringinalUserLinks) {
            console.error("Cannot add to links while showing current user links.")
            alert("Cannot add to links while showing current user links.")
            return
        }
        if (showOringinalUserLinks) return

        if (!treeLinks) { setTreeLinks([""]) }
        if (treeLinks) { setTreeLinks([...treeLinks, { title: "", url: "", imageURL: "" }]) };
    };


    return <>
        {!loading && <>
            {canView && tree && <>
                <section className="tree">
                    <form className="container" onSubmit={handleSubmit}>
                        {tree.headerImage && <div className="header">
                            <img src="tree.headerImage" alt="" />
                        </div>}
                        {!tree.headerImage && <div className="spacer" />}
                        <div className="main">
                            <div className="sidebar">
                                <div className="sidebar-item info">
                                    <input type="text" value={title} onChange={handleTitleChange}></input>
                                </div>
                                <textarea className="sidebar-item markdown" value={description} onChange={handleDescriptionChange} />
                                <div className="sidebar-item">
                                    <label htmlFor="showAuthedUser">showAuthedUser</label>
                                    <input type="checkbox" name="showAuthedUser" id="showAuthedUser" checked={showAuthedUser} onChange={handleShowAuthedUserChange} />
                                    <label htmlFor="showOriginalUser">showOriginalUser</label>
                                    <input type="checkbox" name="showOriginalUser" id="showOriginalUser" checked={showOriginalUser} onChange={handleShowOringinalUserChange} />
                                    <label htmlFor="showOringinalUserLinks">showOringinalUserLinks</label>
                                    <input type="checkbox" name="showOringinalUserLinks" id="showOringinalUserLinks" checked={showOringinalUserLinks} onChange={handleShowOringinalUserLinksChange} />
                                </div>
                                <div className="sidebar-item">
                                    <button type="submit">Submit</button>
                                </div>
                            </div>
                            <div className="mainbar">
                                <div className="links">
                                    <ul>
                                        {treeLinks && <>
                                            {treeLinks.map((link, index) => (
                                                <li key={index}>
                                                    <label htmlFor={"link-title" + index}>Title</label>
                                                    <input type="text" name={"link-title" + index} id={"link-title" + index} value={link.title} onChange={(e) => handleLinkTitleChange(e, index)} required autoComplete="off" />
                                                    <label htmlFor={"link" + index}>URL</label>
                                                    <div className="content-2">
                                                        <input type="url" name={"link" + index} id={"link" + index} value={link.url} onChange={(e) => handleLinkChange(e, index)} required autoComplete="off" />
                                                        <button onClick={() => handleLinkRemove(index)}>Remove</button>
                                                    </div>
                                                    <label htmlFor={"link-imageURL" + index}>ImageURL</label>
                                                    <input type="url" name={"link-imageURL" + index} id={"link-ImageURL" + index} value={link.imageURL} onChange={(e) => handleLinkImageUrlChange(e, index)} required autoComplete="off" />
                                                </li>
                                            ))}
                                        </>}
                                        <button onClick={handleLinkAdd}>Add</button>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </form>
                </section>
            </>}
            {!canView && <Error403 />}
        </>
        }
    </>
}

const AuthedUser = forwardRef(({ userID }, ref) => {
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUserInfo(userID).then(res => {
            if (res === undefined) return
            setUser(res)
            setLoading(false)
        })
    }, [userID])

    return <>
        {!loading && <Link to={"/" + routeUser + "/" + userID}>
            <span className="material-symbols-outlined open">open_in_new</span>
            <div className="avatar">
                <img src={user.images.photoURL} alt="" />
            </div>
            <div className="content">
                <span className="type-1">{user.about.firstname}</span>
                <span className="type-2">{user.about.displayname}</span>
            </div>
        </Link>}
    </>
})