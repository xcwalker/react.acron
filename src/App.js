// Page Setup
import "./style/page-setup.css"
import "./style/transitions.css"
import "./style/variables.css"

// React
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import { Helmet } from 'react-helmet';

// Pages && Components
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { Homepage } from './pages/Homepage';
import { Error404 } from './pages/ErrorPages';
import { AccountIndex, Forgot, Login, Register } from "./pages/AccountPages";
import { UserProfile, UserProfileEdit } from "./pages/UserPages";

function App() {
  return (<>
    <Helmet>
      <title>{application} | {network}</title>
      <meta name="description" content="A website for listing all of xcwalker's projects | {url}" />
    </Helmet>
    <Router>
      <Navbar />
      <main>
        <Routes>
          {/* Home */}
          <Route path='/' element={<Homepage />} />
          {/* Accounts */}
          <Route path={routeUser}>
            <Route index element={<AccountIndex />} />
            <Route path='login' element={<Login />} />
            <Route path='register' element={<Register />} />
            <Route path='forgot' element={<Forgot />} />
          </Route>
          {/* Trees */}
          <Route path='tree'>
              {/* <Route index element={<UserProfile />} /> */}
            <Route path=':id'>
              {/* <Route index element={<UserProfile />} />
              <Route path='edit' element={<UserProfileEdit />} /> */}
            </Route>
          </Route>
          {/* Signed In */}
          <Route path='user'>
            {/* <Route index element={<UserIndex />} />
            <Route path='edit' element={<UserIndexProfile />} /> */}
            <Route path=':id'>
              <Route index element={<UserProfile />} />
              <Route path='edit' element={<UserProfileEdit />} />
            </Route>
          </Route>
          {/* post(s) */}
          {/* <Route path='post'>
          <Route index element={<NewPost />} />
          <Route path=':postID' element={<Post />} />
        </Route>
        <Route path='feed' element={<Feed />} /> */}
          {/* 404 */}
          <Route path='*' element={<Error404 />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  </>
  );
}

export default App;

export const application = "code"
export const network = "xcwalker"
export const release = "dev"
export const url = application + "." + network + "." + release

export const contactEmail = "contact@" + network + "." + release
export const contactEmailMainDev = "xander@" + network + "." + release
export const discordServer = "https://discord.gg/rjd7Spr"

export const routeUser = "account"
export const routeDev = "developer"