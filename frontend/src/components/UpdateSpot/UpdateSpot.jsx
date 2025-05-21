import CreateSpotForm from '../CreateSpotForm/CreateSpotForm';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { updateSpot } from '../../store/spots';

function UpdateSpot() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const spot = useSelector(state => state.spots[spotId]);

  useEffect(() => {
    dispatch(getSpotById(spotId));
  }, [dispatch, spotId]);

  if (!spot) return <p>Loading...</p>;

  const handleSubmit = async (spotData) => {
    const updatedSpot = await dispatch(updateSpot(spotId, spotData));
    if (updatedSpot?.id) navigate(`/spots/${updatedSpot.id}`);
    return updatedSpot;
  };

  return <CreateSpotForm formType="Update" spot={spot} onSubmit={handleSubmit} />;
}

export default UpdateSpot;
