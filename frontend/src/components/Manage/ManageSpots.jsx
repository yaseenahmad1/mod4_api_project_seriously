import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUserSpots } from '../../store/spots';
import DeleteSpotModal from './DeleteSpotModal';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import { Link } from 'react-router-dom';

function ManageSpots() {
  const dispatch = useDispatch();

  const user = useSelector(state => state.session.user);
  const userSpots = useSelector(state => Object.values(state.spots));

  useEffect(() => {
    if (user) {
    dispatch(getCurrentUserSpots());
  }
 }, [dispatch, user]);

  if (!user) return null; // if there is no user return null or wait for our user csrf restore
  if (!userSpots.length) return <p>No spots found</p>;
  
  return (
    <div>
      <h1>Manage Your Spots</h1>
      <Link to="/spots/new">
        <button>Create a New Spot</button>
      </Link>
      <ul>
        {userSpots.map(spot => (
          <li key={spot.id}>
            <h3>{spot.name}</h3>
            <img src={spot.previewImage} alt={spot.name} style={{ width: '200px' }} />
            <p>{spot.city}, {spot.state}</p>
            <p>${spot.price} / night</p>
            <Link to={`/spots/${spot.id}/edit`}>
              <button>Update</button>
            </Link> {/* Use the Modal Button here */}
            <OpenModalButton
                buttonText="Delete" 
                modalComponent={<DeleteSpotModal spotId={spot.id} />}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageSpots;
