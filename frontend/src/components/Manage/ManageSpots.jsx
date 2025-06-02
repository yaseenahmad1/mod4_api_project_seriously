import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUserSpots } from '../../store/spots';
import DeleteSpotModal from './DeleteSpotModal';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import { Link } from 'react-router-dom';
import './ManageSpots.css';

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
      <h1 className='manage-spots-title'>Manage Your Spots</h1>
      <Link to="/spots/new">
        <button className='manage-spot-button'>Create a New Spot</button>
      </Link>

      
      <div className='spots-grid'>
        {userSpots.map(spot => (
          <div key={spot.id} className='spot-tile'>
            <h3>{spot.name}</h3>
            <img src={spot.previewImage} alt={spot.name} className='spot-image' />
            <p>{spot.city}, {spot.state}</p>
            <p>${spot.price} / night</p>
            <Link to={`/spots/${spot.id}/edit`}>
              <button className='update-button'>Update</button>
            </Link> {/* Use the Modal Button here */}
            <OpenModalButton
                buttonText="Delete" 
                modalComponent={<DeleteSpotModal spotId={spot.id} />}
                className='delete-button'
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageSpots;
