import { useEffect, useState, useCallback, useMemo } from "react"
import { Link, Navigate, useParams } from "react-router-dom"
import { Helmet } from "react-helmet"
import { toast } from "react-hot-toast"
import ReactMarkdown from 'react-markdown'
import SimpleMdeReact from "react-simplemde-editor"
import { createPost, getPost, getUserInfo, useAuth } from "../Firebase"
import { application, routeAbout, routeAccount, separator } from "../App"

import "easymde/dist/easymde.min.css";
import "../style/feed/new.css"
import "../style/feed/new-update.css"
import "../style/feed/new-article.css"
import "../style/feed/new-ballot.css"

import "../style/feed/post.css"
import "../style/feed/post-update.css"
import "../style/feed/post-article.css"
import { Error } from "./ErrorPages"
import remarkGfm from "remark-gfm"

export function Feed() {
    useEffect(() => {
        document.documentElement.setAttribute("data-current-page", "feed")
    }, [])

    return <>Feed</>
}
// function FeedPost() {}
export function FeedNewPost() {
    const currentUser = useAuth(null);

    const [loading, setLoading] = useState();
    const [postID, setPostID] = useState(undefined);

    const [user, setUser] = useState();
    const [type, setType] = useState("update");
    const [visibility, setVisibility] = useState("everyone");

    const [text, setText] = useState("");
    const [ballots, setBallots] = useState([]);
    const [imageFiles, setImageFiles] = useState(undefined)
    const [imageURLS, setImageURLS] = useState([""])

    useEffect(() => {
        document.documentElement.setAttribute("data-current-page", "feed new post")
    }, [])

    useEffect(() => {
        if (currentUser === null || currentUser === undefined) return

        getUserInfo(currentUser.uid).then(res => {
            if (res !== undefined) {
                setUser(res);
            }
        })
    }, [currentUser])

    const handlePillOpen = (e) => {
        if (e.currentTarget.parentElement.classList.contains("open")) {
            e.currentTarget.parentElement.classList.remove("open")
        } else {
            e.currentTarget.parentElement.classList.add("open")
        }
    }

    const handleTypeChange = (e, type) => {
        setType(type)
        e.currentTarget.parentElement.parentElement.classList.remove("open")
    }

    const handleVisibilityChange = (e, visibility) => {
        setVisibility(visibility)
        e.currentTarget.parentElement.parentElement.classList.remove("open")
    }

    const handleTextChange = (e,) => {
        setText(e.currentTarget.value)
    }

    const onChange = useCallback((value) => {
        setText(value);
    }, []);

    const editorOptions = useMemo(() => {
        return {
            autoDownloadFontAwesome: false,
            toolbar: ["bold", "italic", "strikethrough", "|", "heading", "heading-2", "heading-3", "|", "quote", "unordered-list", "ordered-list", "|", "link", "image", "table", "|", "fullscreen"],
        };
    }, []);

    const handleBallotText = (e, index) => {
        e.preventDefault();
        const list = [...ballots];
        const obj = list[index]
        obj.text = e.target.value;
        list[index] = obj;
        setBallots(list);
    };

    const handleBallotRemove = (index) => {
        const list = [...ballots];
        list.splice(index, 1);
        setBallots(list);
    };

    const handleBallotAdd = (e) => {
        e.preventDefault();

        if (!ballots) { setBallots([{ text: "" }]) }
        if (ballots) { setBallots([...ballots, { text: "" }]) };
    };

    const uploadPost = () => {
        const upload = createPost({
            type: type,
            content: text,
            ballots: ballots,
        }, {
            visibility: visibility,
        }, imageFiles, currentUser, setLoading)

        toast.promise(upload, {
            loading: 'Uploading!',
            success: 'Post Created!',
            error: 'Error!',
        }, {
            id: "Post-Upload",
            className: "toast-item",
            position: "bottom-center",
        });

        upload.then(res => {
            setPostID(res.id)
        })
    }

    return <>
        {postID && <Navigate to={"../" + postID} />}
        {currentUser === null && <Navigate to={"/" + routeAccount + "/login"} />}
        {currentUser && currentUser !== null && user && <section className="feed new">
            <div className="container">
                <ol className="pills">
                    <div className="pill dropdown">
                        <button className="visible" onClick={handlePillOpen} title="Post Type" >
                            {type === "update" && <>
                                <span className="material-symbols-outlined icon">update</span>
                                <span className="title">Update</span>
                            </>}
                            {type === "article" && <>
                                <span className="material-symbols-outlined icon">article</span>
                                <span className="title">Article</span>
                            </>}
                            {type === "ballot" && <>
                                <span className="material-symbols-outlined icon">ballot</span>
                                <span className="title">Ballot</span>
                            </>}
                            <span className="material-symbols-outlined arrow">arrow_drop_down</span>
                        </button>
                        <ul className="selector">
                            {type !== "update" && <button onClick={(e) => handleTypeChange(e, "update")}>
                                <span className="material-symbols-outlined icon">update</span>
                                <span className="title">Update</span>
                            </button>}
                            {type !== "article" && <button onClick={(e) => handleTypeChange(e, "article")}>
                                <span className="material-symbols-outlined icon">article</span>
                                <span className="title">Article</span>
                            </button>}
                            {type !== "ballot" && <button onClick={(e) => handleTypeChange(e, "ballot")}>
                                <span className="material-symbols-outlined icon">ballot</span>
                                <span className="title">Ballot</span>
                            </button>}
                        </ul>
                    </div>
                    <div className="pill dropdown">
                        <button className="visible" onClick={handlePillOpen} title="Visibility" >
                            {visibility === "everyone" && <>
                                <span className="material-symbols-outlined icon">visibility</span>
                                <span className="title">Everyone</span>
                            </>}
                            {visibility === "followers" && <>
                                <span className="material-symbols-outlined icon">visibility_off</span>
                                <span className="title">Followers</span>
                            </>}
                            {visibility === "hidden" && <>
                                <span className="material-symbols-outlined icon">disabled_visible</span>
                                <span className="title">Myself</span>
                            </>}
                            <span className="material-symbols-outlined arrow">arrow_drop_down</span>
                        </button>
                        <ul className="selector">
                            {visibility !== "everyone" && <button onClick={(e) => handleVisibilityChange(e, "everyone")}>
                                <span className="material-symbols-outlined icon">visibility</span>
                                <span className="title">Everyone</span>
                            </button>}
                            {visibility !== "followers" && <button onClick={(e) => handleVisibilityChange(e, "followers")}>
                                <span className="material-symbols-outlined icon">visibility_off</span>
                                <span className="title">Followers</span>
                            </button>}
                            {visibility !== "hidden" && <button onClick={(e) => handleVisibilityChange(e, "hidden")}>
                                <span className="material-symbols-outlined icon">disabled_visible</span>
                                <span className="title">Myself</span>
                            </button>}
                        </ul>
                    </div>
                </ol>
                {type === "update" && <>
                    <Helmet>
                        <title>{"Post an Update " + separator + " " + application}</title>
                    </Helmet>
                    <div className="update">
                        <div className="left">
                            <img src={currentUser.photoURL} alt="" className="profilePicture" />
                        </div>
                        <div className="right">
                            <textarea required onInput={(e) => { e.currentTarget.style.height = ""; e.currentTarget.style.height = (e.currentTarget.scrollHeight + 15) + "px" }} placeholder={"Let's update the people, " + user.about.firstname + "!"} onChange={handleTextChange} value={text}></textarea>
                            <button type="submit" disabled={loading || text === ""} data-loading={loading} onClick={uploadPost}>
                                <span className="material-symbols-outlined">
                                    {!loading && "send"}
                                    {loading && "cached"}
                                </span>
                            </button>
                        </div>
                    </div>
                </>}
                {type === "article" && <>
                    <Helmet>
                        <title>{"Post an Article " + separator + " " + application}</title>
                    </Helmet>
                    <div className="article">
                        <SimpleMdeReact
                            className="article-editor"
                            onChange={onChange}
                            value={text}
                            options={editorOptions}
                            placeholder={"What would you like to articulate, " + user.about.firstname + "?"}
                        />
                        <button type="submit" disabled={loading || text === ""} data-loading={loading} onClick={uploadPost}>
                            <span className="material-symbols-outlined">
                                {!loading && "send"}
                                {loading && "cached"}
                            </span>
                        </button>
                    </div>
                </>}
                {type === "ballot" && <>
                    <Helmet>
                        <title>{"Post a Ballot " + separator + " " + application}</title>
                    </Helmet>
                    <form className="ballot" onSubmit={uploadPost}>
                        <div className="left">
                            <img src={currentUser.photoURL} alt="" className="profilePicture" />
                        </div>
                        <div className="right">
                            <div className="container">
                                <textarea required onInput={(e) => { e.currentTarget.style.height = ""; e.currentTarget.style.height = (e.currentTarget.scrollHeight + 15) + "px" }} placeholder={"Let's open the ballot, " + user.about.firstname + "!"} onChange={handleTextChange} value={text}></textarea>
                            </div>
                            {ballots.length !== 0 && <ul>
                                {ballots.map((ballot, index) => (
                                    <li key={index}>
                                        <input type="text" name={"link-title" + index} id={"link-title" + index} value={ballot.text} placeholder={"Option: " + (index + 1)} onChange={(e) => handleBallotText(e, index)} required autoComplete="off" />
                                        <button onClick={() => handleBallotRemove(index)} type="remove" ><span class="material-symbols-outlined">remove</span></button>
                                    </li>
                                ))}
                            </ul>}
                            <div className="side-by-side">
                                <button type="add" onClick={handleBallotAdd}>
                                    <span className="material-symbols-outlined">add</span>
                                    Add Ballot
                                </button>
                                <button type="submit" disabled={loading || text === "" || ballots.length === 0} data-loading={loading}>
                                    <span className="material-symbols-outlined">
                                        {!loading && "send"}
                                        {loading && "cached"}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </form>
                </>}
                <div className="links">
                    {type === "update" && <>
                        <Link to={"/" + routeAbout + "/markdown?format=update"}>Markdown for Updates</Link>
                    </>}
                    {type === "article" && <>
                        <Link to={"/" + routeAbout + "/markdown?format=article"}>Markdown for Articles</Link>
                    </>}
                    {type === "ballot" && <>
                        <Link to={"/" + routeAbout + "/markdown?format=ballot"}>Markdown for Ballots</Link>
                    </>}
                </div>
            </div>
        </section>
        }
    </>
}

export function FeedEditPost() {
    useEffect(() => {
        document.documentElement.setAttribute("data-current-page", "feed edit")
    }, [])
    return <>FeedEditPost</>
}

export function FeedViewPost() {
    const currentUser = useAuth();
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const [post, setPost] = useState({});
    const [createdDate, setCreatedDate] = useState();
    const [updatedDate, setUpdatedDate] = useState();
    const [postUser, setPostUser] = useState({});
    const [postVisibility, setPostVisibility] = useState({});

    useEffect(() => {
        document.documentElement.setAttribute("data-current-page", "feed post")
    }, [])

    useEffect(() => {
        let isSubscribed = true;
        setLoading(true)

        const postPromise = getPost(params.postID);

        toast.promise(postPromise, {
            loading: 'Fetching',
            success: 'Data Received',
            error: 'Error Loading',
        }, {
            id: "Post-GetPost",
            className: "toast-item",
            position: "bottom-center",
        });

        postPromise.then(res => {
            if (res === undefined) {
                setError({ code: 404, message: "Post Not Found" })

                return
            }

            if (isSubscribed) {
                setPost(res)
                if (res.info.settings.visibility === "only me") {
                    if (currentUser.uid === post.info.user) {
                        setPostVisibility(true)
                    } else {
                        setPostVisibility(false)
                    }
                }
                if (res.info.settings.visibility === "everyone") {
                    setPostVisibility(true)
                }
                setCreatedDate(new Date(res.info.dates.createdAt.toString()))

                if (res.info.dates.updatedAt) {
                    setUpdatedDate(new Date(res.info.dates.updatedAt.toString()))
                }

                getUserInfo(res.info.user).then(resp => {
                    setPostUser(resp)
                    if (res?.info.settings.visibility === "following") {
                        if (resp?.following.includes(post.info.user)) {
                            setPostVisibility(true)
                        } else {
                            setPostVisibility(false)
                        }
                    }
                    setLoading(false)
                })
            }
        })

        return () => {
            toast.dismiss("Post-GetPost")
            isSubscribed = false
        }
    }, [params.postID])

    return <>
        {loading && error && <Error code="404" message="Post Not Found" />}
        {!loading && postVisibility === false && <Error code="403" message="Forbidden" />}
        {!loading && postVisibility && <>
            <Helmet>
                <title>{post?.data.type.toProperCase() + ' by ' + postUser?.about.displayname + ' ' + separator + ' ' + application}</title>
            </Helmet>
            <section className="feed post">
                <div className="container">
                    {post.data.type === "update" && <div className="update">
                        <div className="container">
                            <div className="left">
                                <img src={postUser.images.photoURL} alt="" className="profilePicture" />
                                <div className="controls">
                                    <Link to="./edit" type="edit">
                                        <span className="material-symbols-outlined">edit</span>
                                    </Link>
                                </div>
                            </div>
                            <div className="right">
                                <div className="content">
                                    <ReactMarkdown
                                        remarkPlugins={remarkGfm}
                                        disallowedElements={[
                                            "h1",
                                            "h2",
                                            "h3",
                                            "h4",
                                            "h5",
                                            "h6",
                                            "img",
                                            "table",
                                            "code",
                                        ]}
                                        unwrapDisallowed="true"
                                    >{post.data.content}</ReactMarkdown>
                                </div>
                            </div>
                        </div>
                        <div className="timestamp"></div>
                    </div>}
                    {post.data.type === "article" && <div className="article">
                        <div className="container">
                            <div className="left">
                                <div className="postUser">
                                    <img src={postUser.images.photoURL} alt="" className="profilePicture" />
                                    <div className="info">
                                        <span className="title">{postUser.about.firstname} {postUser.about.lastname}</span>
                                        <span className="subTitle">{postUser.about.displayname}</span>
                                    </div>
                                </div>
                                <div className="date-time">
                                    <div>
                                        {updatedDate && <span className="heading">Created On:</span>}
                                        <span className="date">{new Intl.DateTimeFormat("en-US", { month: "short" }).format(createdDate)}. {createdDate.getDate()}, {createdDate.getFullYear()}</span>
                                        <span className="time">{createdDate.getHours().addLeadingZero()}:{createdDate.getMinutes().addLeadingZero()}</span>
                                    </div>
                                    {updatedDate && <div>
                                        <span className="heading">Updated On:</span>
                                        <span className="date">{new Intl.DateTimeFormat("en-US", { month: "short" }).format(updatedDate)}. {updatedDate.getDate()}, {updatedDate.getFullYear()}</span>
                                        <span className="time">{updatedDate.getHours().addLeadingZero()}:{updatedDate.getMinutes().addLeadingZero()}</span>
                                    </div>}
                                </div>
                                <div className="controls">
                                    <Link to="./edit" type="edit">
                                        <span className="material-symbols-outlined">edit</span>
                                    </Link>
                                </div>
                            </div>
                            <div className="right">
                                <div className="content">
                                    <ReactMarkdown
                                        remarkPlugins={remarkGfm}
                                        disallowedElements={[
                                            "code",
                                        ]}
                                        unwrapDisallowed="true"
                                    >{post.data.content}</ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    </div>}
                    {post.data.type === "ballot" && <div className="ballot">
                    </div>}
                </div>
            </section>
        </>
        }
    </>
}

export function FeedViewPostComment() {
    useEffect(() => {
        document.documentElement.setAttribute("data-current-page", "feed comment")
    }, [])
    return <>FeedViewPostComment</>
}