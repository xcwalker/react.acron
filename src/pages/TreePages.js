import { forwardRef, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import ReactMarkdown from "react-markdown";
import { Link, useParams } from "react-router-dom";
import { application, network, routeUser } from "../App";
import { claimTree, getTreeInfo, getUserInfo, getUsersTrees, updateTree, useAuth } from "../Firebase";

import "../style/TreePages.css"
import { Error403 } from "./ErrorPages";

export function TreeSearch() {
    // Search Existing Trees
    // Using:
    // User Displayname && Firstname && Lastname
    // Tree Id
    // Tree Title
    // Tree Statement
    // Tree Links
    // Show if TreeID is unclimaed
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
            if (res !== undefined) {
                setTree(res)
            }
            setLoading(false)
            setReload(0)
        })
    }, [params.id, reload])

    useEffect(() => {
        if (!tree) return
        if (tree.useOringinalUserLinks === true) {
            getUserInfo(tree.originalUser).then(res => {
                setUser(res)
                setTreeLinks(res.links)
                // console.info(res.links)
            })
        }
        if (tree.useOringinalUserLinks !== true) {
            setTreeLinks(tree.links)
            console.info(tree.links)
        }
    }, [tree])

    function claimTreeClick() {
        claimTree(params.id, currentUser, setLoading, setReload)
    }

    // useEffect(() => {
    //     if (!currentUser) return
    //     getUsersTrees(currentUser, setLoading).then(res => {
    //         console.log(res)
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
                    <meta name="description" content="{tree.title} | tree | A website for listing all of xcwalker's projects | {url}" />
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
                                {user && tree.showOriginalUser === true && <Link to={"/" + routeUser + "/" + tree.originalUser} className="sidebar-item user">
                                    <span className="material-symbols-outlined open">open_in_new</span>
                                    <div className="avatar">
                                        <img src={user.photoURL} alt="" />
                                    </div>
                                    <div className="content">
                                        <h2>{user.firstname} {user.lastname}</h2>
                                        <span>{user.displayname}</span>
                                    </div>
                                </Link>}
                                {tree.showAuthedUser && tree.useOringinalUserLinks !== true && <div className="sidebar-item">
                                    <h3>Contributors</h3>
                                    <div className="authedUsers">
                                        {tree.authedUser.map((user, index) => {
                                            return <AuthedUser userID={user} key={index} />
                                        })}
                                    </div>
                                </div>}
                            </div>
                            <div className="mainbar">
                                <div className="links">
                                    <ul>
                                        {tree.useOringinalUserLinks === true && <>
                                            {treeLinks && treeLinks.map((link, index) => {
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
                                        {tree.useOringinalUserLinks !== true && <>
                                            {treeLinks && treeLinks.map((link, index) => {
                                                console.log(link)
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
                    <meta name="description" content="{params.id} | Unowned tree | A website for listing all of xcwalker's projects | {url}" />
                </Helmet>
                <h1>unowned</h1>
                <button onClick={claimTreeClick}>Claim</button>
            </>}
        </>
        }
    </>
}

export function TreeDashboard() {
    // Lists your trees
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
    const [user, setUser] = useState();
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
                setShowAuthedUser(res.showAuthedUser)
                setShowOringinalUserLinks(res.useOringinalUserLinks)
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

    useEffect(() => {
        if (!tree) return
        if (tree.useOringinalUserLinks === true) {
            getUserInfo(tree.originalUser).then(res => {
                setUser(res)
            })
        }
    }, [tree])

    function handleSubmit(e) {
        e.preventDefault()
        if (!tree || !currentUser) return
        console.log(treeLinks)
        updateTree(params.id, currentUser, setLoading, setReload, tree.originalUser, {
            title: title,
            description: description,
            useOringinalUserLinks: showOringinalUserLinks,
            showOriginalUser: showOriginalUser,
            showAuthedUser: showAuthedUser,
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
        list[index] = {url: e.target.value, title: obj.title, imageURL: obj.imageURL};
        setTreeLinks(list);
    };

    const handleLinkTitleChange = (e, index) => {
        e.preventDefault();
        const list = [...treeLinks];
        const obj = list[index]
        list[index] = {url: obj.url, title: e.target.value, imageURL: obj.imageURL};
        setTreeLinks(list);
    };

    const handleLinkImageUrlChange = (e, index) => {
        e.preventDefault();
        const list = [...treeLinks];
        const obj = list[index]
        list[index] = {url: obj.url, title: obj.title, imageURL: e.target.value};
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

        setTreeLinks([...treeLinks, { title: "", url: "", imageURL: "" }]);
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
                                {tree.description && <textarea className="sidebar-item markdown" value={description} onChange={handleDescriptionChange} />}
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
                                                        {console.log(link)}
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
                                            <button onClick={handleLinkAdd}>Add</button>
                                        </>}
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
            // console.info(res)
        })
    }, [userID])

    return <>
        {!loading && <Link to={"/" + routeUser + "/" + userID}>
            <span className="material-symbols-outlined open">open_in_new</span>
            <div className="avatar">
                <img src={user.photoURL} alt="" />
            </div>
            <div className="content">
                <span className="type-1">{user.firstname}</span>
                <span className="type-2">{user.displayname}</span>
            </div>
        </Link>}
    </>
})