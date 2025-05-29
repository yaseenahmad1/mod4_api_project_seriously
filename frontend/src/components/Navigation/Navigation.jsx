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
        <div className='right-nav'>
          <ProfileButton user={sessionUser} />
        </div>

        {/* Now we only want to show this button when user logs in */}
        { sessionUser && (
          <div className='right-nav'>
            <NavLink to='/spots/new' className="create-spot-button">Create a Spot</NavLink>
          </div>
        )}
        </>
      )}
    </header>
  );
}

export default Navigation;