// css
import { Link } from 'react-router-dom';
import { routeDev, routeUser } from '../App';
import { useAuth } from '../Firebase';
import '../style/ErrorPages.css';

export function Error403() {
  const currentUser = useAuth();

  const errorCode = "403"
  const errorMessage = "Forbidden"

  return <section className='errorPage'>
    <div className='container'>
      <span className='code'>{errorCode}</span>
      <h2>{errorMessage}</h2>
      <div className='actions'>
        <Link to="/">Home</Link>
        {currentUser && <Link to={"user/" + currentUser.uid}>Profile</Link>}
        {!currentUser && <Link to={routeUser + "/login"}>Login</Link>}
      </div>
      {currentUser && <Link to={routeDev + "/dashboard"}>DevDash™</Link>}
    </div>
    <Background errorCode={errorCode} errorMessage={errorMessage} />
  </section>
}

export function Error404() {
  const currentUser = useAuth();

  const errorCode = "404"
  const errorMessage = "Page Not Found"

  return <section className='errorPage'>
    <div className='container'>
      <span className='code'>{errorCode}</span>
      <h2>{errorMessage}</h2>
      <div className='actions'>
        <Link to="/">Home</Link>
        {currentUser && <Link to={"user/" + currentUser.uid}>Profile</Link>}
        {!currentUser && <Link to={routeUser + "/login"}>Login</Link>}
      </div>
      {currentUser && <Link to={routeDev + "/dashboard"}>DevDash™</Link>}
    </div>
    <Background errorCode={errorCode} errorMessage={errorMessage} />
  </section>
}

function Background(props) {
  return <div className='background'>
    <div className="item" />
    <div className="item" />
    <div className="item" />
    <div className="item" />
    <span className='bigCode'>{props.errorCode}</span>
  </div>
}