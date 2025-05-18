// frontend/src/components/Navigation/Navigation.jsx

import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      {isLoaded && (
        <>
        <li>
          <ProfileButton user={sessionUser} />
        </li>

        {/* Now we only want to show this button when user logs in */}
        { sessionUser && (
          <li>
            <NavLink to='/spots/new' className="create-spot-button">Create a Spot</NavLink>
          </li>
        )}
        </>
      )}
    </ul>
  );
}

export default Navigation;