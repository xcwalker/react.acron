import { useEffect } from "react"

export function Feed() {
    useEffect(() => {
        document.documentElement.setAttribute("data-current-page", "feed")
    }, [])

    return <>Feed</>
}
function FeedPost() { }
export function FeedNewPost() {
    useEffect(() => {
        document.documentElement.setAttribute("data-current-page", "feed new post")
    }, [])
    return <>FeedNewPost</>
}
export function FeedViewPost() {
    useEffect(() => {
        document.documentElement.setAttribute("data-current-page", "feed post")
    }, [])
    return <>FeedViewPost</>
}
export function FeedViewPostComment() {
    useEffect(() => {
        document.documentElement.setAttribute("data-current-page", "feed comment")
    }, [])
    return <>FeedViewPostComment</>
}