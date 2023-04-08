import { useRef } from "react";
import { forwardRef, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { toast } from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import { application, routeUser, separator, url } from "../App";
import { claimTree, deleteTree, getTreeInfo, getUserInfo, getUsersOwnTrees, getUsersTrees, updateTree, useAuth } from "../Firebase";

import "../style/TreePages.css"
import { Error } from "./ErrorPages";

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
    const [searchParams, setSearchParams] = useSearchParams();
    const [tree, setTree] = useState();
    const [treeLinks, setTreeLinks] = useState();
    const [user, setUser] = useState();
    const [reload, setReload] = useState(0);
    const [loading, setLoading] = useState(true);
    const [viewState, setViewState] = useState(searchParams.get("view"))


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

                if (res.settings.showUserLinks === false) {
                    setTreeLinks([])
                } else {
                    setTreeLinks(res.links)
                }
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

    const setView = (view) => {
        setViewState(view)

        let updatedSearchParams = new URLSearchParams(searchParams.toString());
        updatedSearchParams.set('view', view);
        setSearchParams(updatedSearchParams.toString());
        Event.preventDefault();
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
                    <title>{tree.title + " " + separator + " tree " + separator + " " + application}</title>
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
                                {tree.images?.iconURL && <div className="sidebar-item info-icon">
                                    <h2>{tree.title}</h2>
                                    <span>/{params.id}</span>
                                    {tree.images?.iconURL?.split(".").pop().split("?")[0] === "webm" && <video src={tree.images?.iconURL} alt="" autoPlay muted loop ></video>}
                                    {tree.images?.iconURL?.split(".").pop().split("?")[0] !== "webm" && <img src={tree.images?.iconURL} alt=""></img>}
                                </div>}
                                {!tree.images?.iconURL && <div className="sidebar-item info">
                                    <h2>{tree.title}</h2>
                                    <span>/{params.id}</span>
                                </div>}

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
                                <div className="controls">
                                    <div className="set">
                                        {viewState === "grid" && <span className="material-symbols-outlined active">grid_view</span>}
                                        {viewState !== "grid" && <button onClick={() => { setView("grid") }}><span className="material-symbols-outlined">grid_view</span></button>}
                                        {(!viewState || viewState === "list") && <span className="material-symbols-outlined active">view_list</span>}
                                        {(viewState && viewState !== "list") && <button onClick={(e) => { setView("list") }}><span className="material-symbols-outlined">view_list</span></button>}
                                        {viewState === "carousel" && <span className="material-symbols-outlined active">view_carousel</span>}
                                        {viewState !== "carousel" && <button onClick={() => { setView("carousel") }}><span className="material-symbols-outlined">view_carousel</span></button>}
                                    </div>
                                </div>
                                {(!viewState || viewState === "list") && <div className="list" />}
                                {viewState === "carousel" && <div className="carousel" />}
                                {viewState === "grid" && <div className="grid" />}
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
                    <title>{params.id + "Unowned " + separator + " tree " + separator + " " + application}</title>
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
                                    {!tree.data.images?.iconURL && <TreeSearchItemBackground />}
                                    {tree.data.images?.iconURL && <>
                                        {tree.data.images?.iconURL?.split(".").pop().split("?")[0] === "webm" && <video src={tree.data.images?.iconURL} alt="" autoPlay muted loop ></video>}
                                        {tree.data.images?.iconURL?.split(".").pop().split("?")[0] !== "webm" && <img src={tree.data.images?.iconURL} alt=""></img>}
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
                                {!tree.data.images?.iconURL && <TreeSearchItemBackground />}
                                {tree.data.images?.iconURL && <>
                                    {tree.data.images?.iconURL?.split(".").pop().split("?")[0] === "webm" && <video src={tree.data.images?.iconURL} alt="" autoPlay muted loop ></video>}
                                    {tree.data.images?.iconURL?.split(".").pop().split("?")[0] !== "webm" && <img src={tree.data.images?.iconURL} alt=""></img>}
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
    const currentUser = useAuth(null);
    const [tree, setTree] = useState();
    const [treeLinks, setTreeLinks] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [headerPictureFile, setHeaderPictureFile] = useState();
    const [headerPictureURL, setHeaderPictureURL] = useState();
    const [iconPictureFile, setIconPictureFile] = useState();
    const [iconPictureURL, setIconPictureURL] = useState();
    const [authedUsers, setAuthedUsers] = useState();
    const [contributors, setContributors] = useState();
    const [showOriginalUser, setShowOriginalUser] = useState(true);
    const [showAuthedUser, setShowAuthedUser] = useState(true);
    const [showOriginalUserLinks, setShowOriginalUserLinks] = useState(true);
    const [reload, setReload] = useState(0);
    const [loading, setLoading] = useState(true);
    const [updated, setUpdated] = useState(false);
    const [canView, setCanView] = useState();

    const contributorNewRef = useRef();

    useEffect(() => {
        document.documentElement.setAttribute("data-current-page", "tree")
    }, [])

    useEffect(() => {
        getTreeInfo(params.id).then(res => {
            if (res !== undefined) {
                setTree(res)
                setTitle(res.title)
                setDescription(res.description)
                setAuthedUsers(res.authedUser)
                setContributors(res.authedUser)
                setShowAuthedUser(res.settings.showAuthedUser)
                if (res.settings.useOriginalUserLinks !== undefined) {
                    setShowOriginalUserLinks(res.settings.useOriginalUserLinks)
                }
                if (!res.showOriginalUserLinks) { setTreeLinks(res.links) }
                if (res.images?.headerURL) { setHeaderPictureURL(res.images.headerURL) }
                if (res.images?.iconURL) { setIconPictureURL(res.images.iconURL) }
            }
            setLoading(false)
            setReload(0)
        })
    }, [params.id, reload])

    useEffect(() => {
        if (currentUser === undefined || currentUser === null || !authedUsers) return
        if (authedUsers.includes(currentUser.uid)) { setCanView(true) } else { setCanView(false) }
    }, [currentUser, authedUsers])

    function handleSubmit(e) {
        e.preventDefault()
        if (!tree || !currentUser) return
        console.log(treeLinks)
        const update = updateTree(params.id, currentUser, setLoading, tree.originalUser, {
            title: title,
            description: description,
            settings: {
                useOriginalUserLinks: showOriginalUserLinks,
                showOriginalUser: showOriginalUser,
                showAuthedUser: showAuthedUser,
            },
            authedUser: contributors,
            images: {
                headerURL: headerPictureURL,
                iconURL: iconPictureURL,
            },
            links: treeLinks
        }, headerPictureFile, iconPictureFile)

        toast.promise(update, {
            loading: 'Uploading',
            success: 'Update Complete',
            error: 'Error Updating',
        }, {
            className: "toast-item",
            position: "bottom-center",
        });

        update.then(() => {
            setUpdated(true)
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
            setShowOriginalUserLinks(false)
            toast.success("No longer using creator's links", {
                className: "toast-item",
                position: "bottom-center",
            })

        }

        if (!treeLinks) { setTreeLinks([""]) }
        if (treeLinks) { setTreeLinks([...treeLinks, { title: "", url: "", imageURL: "" }]) };
    };

    const handleContributorRemove = (index) => {
        const list = [...contributors];
        list.splice(index, 1);
        setContributors(list);
    };

    const handleContributorsAdd = (e) => {
        e.preventDefault();

        if (contributors.includes(contributorNewRef.current.value)) {
            contributorNewRef.current.value = "";
            toast.error("User already added.", {
                className: "toast-item",
                position: "bottom-center",
            })
            return
        }

        if (contributorNewRef.current.value === "") {
            contributorNewRef.current.value = "";
            toast.error("User ID not stated.", {
                className: "toast-item",
                position: "bottom-center",
            })
            return
        }

        if (!contributors) { setContributors([contributorNewRef.current.value]) };
        if (contributors) { setContributors([...contributors, contributorNewRef.current.value]) };

        contributorNewRef.current.value = ""
    };

    const handleHeaderChange = (e) => {
        e.preventDefault();
        setHeaderPictureFile(e.target.files[0])
    }

    const handleIconChange = (e) => {
        e.preventDefault();
        setIconPictureFile(e.target.files[0])
    }

    useEffect(() => {
        if (!headerPictureFile) return

        // create the preview
        const objectUrl = URL.createObjectURL(headerPictureFile)
        setHeaderPictureURL(objectUrl)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [headerPictureFile])

    useEffect(() => {
        if (!iconPictureFile) return

        // create the preview
        const objectUrl = URL.createObjectURL(iconPictureFile)
        setIconPictureURL(objectUrl)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [iconPictureFile])

    return <>
        {updated && <Navigate to="../" />}
        {!loading && <>
            {canView === true && tree && <>
                <Helmet>
                    <title>{"Edit /" + params.id + " " + separator + " " + application}</title>
                </Helmet>
                <section className="tree edit">
                    <form className="container" onSubmit={handleSubmit}>
                        {headerPictureURL && <div className="header">
                            {headerPictureURL?.split(".").pop().split("?")[0] === "webm" && <video className="background" src={headerPictureURL} alt="" autoPlay muted loop ></video>}
                            {headerPictureURL?.split(".").pop().split("?")[0] !== "webm" && <img className="background" src={headerPictureURL} alt=""></img>}
                        </div>}
                        {!headerPictureURL && <div className="spacer" />}
                        <div className="main">
                            <div className="sidebar">
                                {iconPictureURL && <div className="sidebar-item icon">
                                    {iconPictureURL?.split(".").pop().split("?")[0] === "webm" && <video className="background" src={iconPictureURL} alt="" autoPlay muted loop ></video>}
                                    {iconPictureURL?.split(".").pop().split("?")[0] !== "webm" && <img className="background" src={iconPictureURL} alt=""></img>}
                                </div>}
                                <input className="sidebar-item title" type="text" value={title} required onChange={handleTitleChange} placeholder="Title"></input>
                                <textarea className="sidebar-item markdown" value={description} onChange={handleDescriptionChange} placeholder="Description" />
                                <div className="sidebar-item images">
                                    <label type="file" htmlFor="headerPicture">Upload Header Picture</label>
                                    <input type="file" id="headerPicture" onChange={handleHeaderChange} accept=".jpg, .jpeg, .png, .apng, .webp, .webm, .gif" />
                                    <label type="file" htmlFor="iconPicture">Upload Icon Picture</label>
                                    <input type="file" id="iconPicture" onChange={handleIconChange} accept=".jpg, .jpeg, .png, .apng, .webp, .webm, .gif" />
                                </div>
                                <div className="sidebar-item settings">
                                    <fieldset>
                                        <input type="checkbox" name="showAuthedUser" id="showAuthedUser" checked={showAuthedUser} onChange={handleShowAuthedUserChange} />
                                        <label htmlFor="showAuthedUser">Show Contributors</label>
                                    </fieldset>
                                    <fieldset>
                                        <input type="checkbox" name="showOriginalUser" id="showOriginalUser" checked={showOriginalUser} onChange={handleShowOriginalUserChange} />
                                        <label htmlFor="showOriginalUser">Show Creator</label>
                                    </fieldset>
                                    <fieldset>
                                        <input type="checkbox" name="showOriginalUserLinks" id="showOriginalUserLinks" checked={showOriginalUserLinks} onChange={handleShowOriginalUserLinksChange} />
                                        <label htmlFor="showOriginalUserLinks">Use Creator's Links</label>
                                    </fieldset>
                                </div>
                                <div className="sidebar-item contributors">
                                    {contributors && <div className="authedUsers">
                                        {contributors.map((user, index) => {
                                            return <button onClick={() => handleContributorRemove(index)} key={index}>
                                                <Contributor userID={user} />
                                            </button>
                                        })}
                                    </div>}
                                    <input type="text" name="contributorNew" id="contributorNew" ref={contributorNewRef} placeholder="User ID" />
                                    <button onClick={handleContributorsAdd} type="add">Add Contributor</button>
                                </div>
                                <button className="sidebar-item submit" type="submit">Save</button>
                            </div>
                            <div className="mainbar">
                                <div className="links">
                                    <ul>
                                        {treeLinks && <>
                                            {treeLinks.map((link, index) => (
                                                <li key={index}>
                                                    <fieldset>
                                                        <fieldset type="text">
                                                            <label htmlFor={"link-title" + index}>Name:</label>
                                                            <input type="text" name={"link-title" + index} id={"link-title" + index} value={link.title} onChange={(e) => handleLinkTitleChange(e, index)} required autoComplete="off" />
                                                        </fieldset>
                                                        <fieldset type="text">
                                                            <label htmlFor={"link" + index}>URL:</label>
                                                            <input type="url" name={"link" + index} id={"link" + index} value={link.url} onChange={(e) => handleLinkChange(e, index)} required autoComplete="off" />
                                                        </fieldset>
                                                        <fieldset type="text">
                                                            <label htmlFor={"link-imageURL" + index}>ImageURL:</label>
                                                            <input type="url" name={"link-imageURL" + index} id={"link-imageURL" + index} value={link.imageURL} onChange={(e) => handleLinkImageUrlChange(e, index)} autoComplete="off" />
                                                        </fieldset>
                                                    </fieldset>
                                                    <button onClick={() => handleLinkRemove(index)} type="remove" ><span class="material-symbols-outlined">close</span></button>
                                                </li>
                                            ))}
                                        </>}
                                        <button onClick={handleLinkAdd} type="add">Add</button>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </form>
                </section>
            </>}
            {!canView && <Error code="403" message="Forbidden" />}
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

const Contributor = forwardRef(({ userID }, ref) => {
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();

    useEffect(() => {
        getUserInfo(userID).then(res => {
            if (res === undefined) {
                setError({ code: 404, title: "User Not Found" })
                return
            } else {
                setUser(res)
            }
            setLoading(false)
        })
    }, [userID])

    return <>
        {loading && error && <>
            <span className="material-symbols-outlined open">close</span>
            <div className="content">
                <span className="type-1">{error.code}</span>
                <span className="type-2">{error.title}</span>
            </div>

        </>}
        {!loading && <>
            <span className="material-symbols-outlined open">close</span>
            <div className="avatar">
                <img src={user.images.photoURL} alt="" />
            </div>
            <div className="content">
                <span className="type-1">{user.about.firstname} {user.about.lastname}</span>
                <span className="type-2">{user.about.displayname}</span>
            </div>
        </>}
    </>
})