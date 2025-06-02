// frontend/src/components/Navigation/Navigation.jsx

import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
   <header className='main-header'> 
      <div className='left-nav'>
        <NavLink to="/">
          <img src="/images/logo.svg" alt="Zen Den Logo" className='website-logo' />
        </NavLink>
      </div>

      <div className='center-slogan'>Find Your Happy Place.</div>

      {isLoaded && (
        <>
        {/* we only want to show this button when user logs in hence the navlink*/}
        <div className='right-nav'>
        { sessionUser && (
        <NavLink to='/spots/new' className="create-spot-button">Create a New Spot</NavLink>
        )}
          <ProfileButton user={sessionUser} />
        </div>
        </>
      )}
    </header>
  );
}

export default Navigation;