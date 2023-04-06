// css
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { routeDev, routeAccount, url, application, separator, routeUser } from '../App';
import { useAuth } from '../Firebase';
import '../style/ErrorPages.css';

export function Error(props) {
  const currentUser = useAuth();

  return <>
    <Helmet>
      <title>{props.code} {separator} {props.message} {separator} {application}</title>
      <meta name="description" content={props.code + " " + props.message + " " + separator + " A website for listing all of xcwalker's projects " + separator + " " + url} />
    </Helmet>
    <section className='errorPage'>
      <div className='container'>
        <span className='code'>{props.code}</span>
        <h2>{props.message}</h2>
        <div className='actions'>
          <Link to="/">Home</Link>
          {currentUser && <Link to={"/" + routeUser + "/" + currentUser.uid}>Profile</Link>}
          {!currentUser && <Link to={"/" + routeAccount + "/login"}>Login</Link>}
        </div>
        {currentUser && <Link to={routeDev + "/dashboard"}>DevDash™</Link>}
      </div>
      <Background errorCode={props.code} errorMessage={props.message} />
    </section>
  </>
}

function Background(props) {
  return <div className='background'>
    <div className="item i1" />
    <div className="item i2" />
    <span className='bigCode'>{props.code}</span>
    <div className="item i3" />
    <div className="item i4" />
  </div>
}