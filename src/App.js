// Page Setup
import "./style/page-setup.css"
import "./style/transitions.css"
import "./style/variables.css"

// React
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from "react-router-dom";
import { Helmet } from 'react-helmet';
import { useEffect } from 'react';

// Pages && Components
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { Homepage } from './pages/Homepage';
import { Error404 } from './pages/ErrorPages';
import { AccountIndex, AccountForgot, AccountLogin, AccountRegister, AccountEdit } from "./pages/AccountPages";
import { UserIndex, UserIndexProfile, UserProfile, UserProfileEdit } from "./pages/UserPages";
import { TreeSearch, TreeIndex, TreeEdit, TreeDashboard } from "./pages/TreePages";
import { Toaster } from "react-hot-toast";
import { Feed, FeedNewPost, FeedViewPost, FeedViewPostComment } from "./pages/FeedPages";
import { Sidebar } from "./components/Sidebar";

function App() {
  return (<>
    <Helmet>
      <title>{application} | {network}</title>
      <meta name="description" content={"A website for listing all of xcwalker's projects | " + url} />
    </Helmet>
    <Router>
      <ScrollToTop />
      <Navbar />
      <Sidebar />
      <Toaster
        position="top-left"
        reverseOrder={true}
        containerStyle={{
          top: 62,
          left: "min(40px, max(4vw, 10px))"
        }}
      />
      <main>
        <Routes>
          {/* Home */}
          <Route path='/' element={<Homepage />} />
          {/* Accounts */}
          <Route path={routeAccount}>
            <Route index element={<AccountIndex />} />
            <Route path='login' element={<AccountLogin />} />
            <Route path='register' element={<AccountRegister />} />
            <Route path='forgot' element={<AccountForgot />} />
            <Route path='edit' element={<AccountEdit />} />
          </Route>
          {/* Trees */}
          <Route path={routeTree}>
            <Route index element={<TreeSearch />} />
            <Route path='dashboard' element={<TreeDashboard />} />
            <Route path=':id'>
              <Route index element={<TreeIndex />} />
              <Route path='edit' element={<TreeEdit />} />
            </Route>
          </Route>
          {/* Signed In */}
          <Route path={routeUser}>
            <Route index element={<UserIndex />} />
            <Route path='edit' element={<UserIndexProfile />} />
            <Route path=':id'>
              <Route index element={<UserProfile />} />
              <Route path='edit' element={<UserProfileEdit />} />
            </Route>
          </Route>
          {/* post(s) */}
          <Route path={routePost} >
            <Route index element={<Feed />} />
            <Route path={routePostNew} element={<FeedNewPost />} />
            <Route path=':postID' element={<FeedViewPost />} >
              <Route path=':commentID' element={<FeedViewPostComment />} />
            </Route>
          </Route>
          {/* 404 */}
          <Route path='*' element={<Error404 />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  </>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default App;

export const application = "code"
export const network = "xcwalker"
export const release = "dev"
export const url = application + "." + network + "." + release

export const contactEmail = "contact@" + network + "." + release
export const contactEmailMainDev = "xander@" + network + "." + release
export const discordServer = "https://discord.gg/rjd7Spr"

export const routeAbout = "about"
export const routeAccount = "account"
export const routeUser = "user"
export const routeDev = "developer"
export const routeTree = "tree"
export const routePost = "feed"
export const routePostNew = "post"

export const toastStyle_default = {
  borderRadius: '5px',
  background: 'var(--background-color-300)',
  color: 'var(--foreground-color-300)',
  fontWeight: '600',
}
export const toastStyle_error = {
  borderRadius: '5px',
  background: 'var(--form-color-invalid-opac)',
  border: '2px solid var(--form-color-invalid)',
  color: 'var(--foreground-color-300)',
  fontWeight: '600',
}
export const toastStyle_success = {
  borderRadius: '5px',
  background: 'var(--form-color-valid-opac)',
  border: '2px solid var(--form-color-valid)',
  color: 'var(--foreground-color-300)',
  fontWeight: '600',
}