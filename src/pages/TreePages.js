import { forwardRef, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import ReactMarkdown from "react-markdown";
import { Link, Navigate, useParams } from "react-router-dom";
import { application, network, routeUser, separator, url } from "../App";
import { claimTree, deleteTree, getTreeInfo, getUserInfo, getUsersOwnTrees, getUsersTrees, updateTree, uploadTreeHeader, useAuth } from "../Firebase";

import "../style/TreePages.css"
import { Error403 } from "./ErrorPages";

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
        document.documentElement.setAttribute("data-current-page", "tree")
    }, [])

    useEffect(() => {
        getTreeInfo(params.id).then(res => {
            setTree(res)

            setLoading(false)
            setReload(0)
        })
    }, [params.id, reload])

    useEffect(() => {
        if (!tree) return
        if (tree.settings.useOriginalUserLinks === true) {
            getUserInfo(tree.originalUser).then(res => {
                setUser(res)
                setTreeLinks(res.links)
            })
        }
        if (tree.settings.useOriginalUserLinks !== true) {
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

    // if (!claimed)
    // offer to claim tree

    // if (claimed)
    // load tree

    return <>
        {!loading && <>
            {tree && <>
                <Helmet>
                    <title>{tree.title + " " + separator + " tree " + separator + " " + application + " " + separator + " " + network}</title>
                    <meta name="description" content={tree.title + " " + separator + " tree" + separator + "A website for listing all of xcwalker's projects" + separator + " " + url} />
                </Helmet>
                <section className="tree">
                    <div className="container">
                        {tree.images?.headerURL && <div className="header">
                            {tree.images?.headerURL?.split(".").pop().split("?")[0] === "webm" && <video className="background" src={tree.images?.headerURL} alt="" autoPlay muted loop ></video>}
                            {tree.images?.headerURL?.split(".").pop().split("?")[0] !== "webm" && <img className="background" src={tree.images?.headerURL} alt=""></img>}
                        </div>}
                        {!tree.images?.headerURL && !currentUser && <div className="spacer" />}
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
                                {tree.settings.showAuthedUser && tree.useOriginalUserLinks !== true && <div className="sidebar-item">
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
                                        {tree.settings.useOriginalUserLinks === true && treeLinks !== undefined && <>
                                            {treeLinks[0] === undefined && <span>User Has No Links</span>}
                                            {treeLinks[0] !== undefined && treeLinks?.map((link, index) => {
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
                                        {tree.settings.useOriginalUserLinks !== true && <>
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
                    <title>{params.id + "Unowned " + separator + " tree " + separator + " " + application + " " + separator + " " + network}</title>
                    <meta name="description" content={params.id + " " + separator + " Unowned tree " + separator + " A website for listing all of xcwalker's projects " + separator + " " + url} />
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
        document.documentElement.setAttribute("data-current-page", "tree dashboard")
    }, [])

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
                                    {!tree.data.images?.headerURL && <TreeSearchItemBackground />}
                                {tree.data.images?.headerURL && <>
                                    {tree.data.images?.headerURL?.split(".").pop().split("?")[0] === "webm" && <video src={tree.data.images?.headerURL} alt="" autoPlay muted loop ></video>}
                                    {tree.data.images?.headerURL?.split(".").pop().split("?")[0] !== "webm" && <img src={tree.data.images?.headerURL} alt=""></img>}
                                </>}
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
                                {!tree.data.images?.headerURL && <TreeSearchItemBackground />}
                                {tree.data.images?.headerURL && <>
                                    {tree.data.images?.headerURL?.split(".").pop().split("?")[0] === "webm" && <video src={tree.data.images?.headerURL} alt="" autoPlay muted loop ></video>}
                                    {tree.data.images?.headerURL?.split(".").pop().split("?")[0] !== "webm" && <img src={tree.data.images?.headerURL} alt=""></img>}
                                </>}
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
    const [headerPictureFile, setHeaderPictureFile] = useState();
    const [headerPictureURL, setHeaderPictureURL] = useState();
    const [authedUser, setAuthedUser] = useState();
    const [showOriginalUser, setShowOriginalUser] = useState(true);
    const [showAuthedUser, setShowAuthedUser] = useState(true);
    const [showOriginalUserLinks, setShowOriginalUserLinks] = useState(true);
    const [reload, setReload] = useState(0);
    const [loading, setLoading] = useState(true);
    const [canView, setCanView] = useState(false);
    
    useEffect(() => {
        document.documentElement.setAttribute("data-current-page", "tree")
    }, [])

    useEffect(() => {
        getTreeInfo(params.id).then(res => {
            if (res !== undefined) {
                setTree(res)
                setTitle(res.title)
                setDescription(res.description)
                setAuthedUser(res.authedUser)
                setShowAuthedUser(res.settings.showAuthedUser)
                if (res.settings.useOriginalUserLinks !== undefined) {
                    setShowOriginalUserLinks(res.settings.useOriginalUserLinks)
                }
                if (!res.showOriginalUserLinks) { setTreeLinks(res.links) }
                if (res.images?.headerURL) { setHeaderPictureURL(res.images.headerURL) }
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
                useOriginalUserLinks: showOriginalUserLinks,
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

    const handleShowOriginalUserChange = (e) => {
        setShowOriginalUser(e.target.checked)
    };

    const handleShowOriginalUserLinksChange = (e) => {
        setShowOriginalUserLinks(e.target.checked)
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
        if (showOriginalUserLinks) {
            console.error("Cannot add to links while showing current user links.")
            alert("Cannot add to links while showing current user links.")
            return
        }
        if (showOriginalUserLinks) return

        if (!treeLinks) { setTreeLinks([""]) }
        if (treeLinks) { setTreeLinks([...treeLinks, { title: "", url: "", imageURL: "" }]) };
    };

    const handleHeaderChange = (e) => {
        e.preventDefault();
        setHeaderPictureFile(e.target.files[0])
    }

    const handleHeaderSave = (e) => {
        e.preventDefault();
        uploadTreeHeader(headerPictureFile, params.id, setLoading)
    }

    useEffect(() => {
        if (!headerPictureFile) return

        // create the preview
        const objectUrl = URL.createObjectURL(headerPictureFile)
        setHeaderPictureURL(objectUrl)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [headerPictureFile])

    return <>
        {!loading && <>
            {canView && tree && <>
                {console.log(tree.images?.headerURL)}
                <section className="tree">
                    <form className="container" onSubmit={handleSubmit}>
                        {headerPictureURL && <div className="header">
                            {headerPictureURL?.split(".").pop().split("?")[0] === "webm" && <video className="background" src={headerPictureURL} alt="" autoPlay muted loop ></video>}
                            {headerPictureURL?.split(".").pop().split("?")[0] !== "webm" && <img className="background" src={headerPictureURL} alt=""></img>}
                        </div>}
                        {!headerPictureURL && <div className="spacer" />}
                        <div className="main">
                            <div className="sidebar">
                                <div className="sidebar-item info">
                                    <input type="text" value={title} onChange={handleTitleChange}></input>
                                </div>
                                <textarea className="sidebar-item markdown" value={description} onChange={handleDescriptionChange} />
                                <div className="sidebar-item">
                                    <label htmlFor="profilePicture">Profile Picture</label>
                                    <div >
                                        <input type="file" id="profilePicture" onChange={handleHeaderChange} accept=".jpg, .jpeg, .png, .apng, .webp, .webm, .gif" />
                                        <button onClick={handleHeaderSave} disabled={!headerPictureFile || loading}>Update</button>
                                    </div>
                                </div>
                                <div className="sidebar-item">
                                    <label htmlFor="showAuthedUser">showAuthedUser</label>
                                    <input type="checkbox" name="showAuthedUser" id="showAuthedUser" checked={showAuthedUser} onChange={handleShowAuthedUserChange} />
                                    <label htmlFor="showOriginalUser">showOriginalUser</label>
                                    <input type="checkbox" name="showOriginalUser" id="showOriginalUser" checked={showOriginalUser} onChange={handleShowOriginalUserChange} />
                                    <label htmlFor="showOriginalUserLinks">showOriginalUserLinks</label>
                                    <input type="checkbox" name="showOriginalUserLinks" id="showOriginalUserLinks" checked={showOriginalUserLinks} onChange={handleShowOriginalUserLinksChange} />
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
                                                    <input type="url" name={"link-imageURL" + index} id={"link-ImageURL" + index} value={link.imageURL} onChange={(e) => handleLinkImageUrlChange(e, index)} autoComplete="off" />
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