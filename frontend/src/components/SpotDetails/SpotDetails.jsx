import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpotDetails } from '../../store/spots';

function SpotDetails() {
    const { spotId } = useParams();
    const dispatch = useDispatch();

    const spot = useSelector(state => state.spots[+spotId] || {});

    useEffect(() => {
        if (spotId) {
            console.log("Dispatching fetchSpotDetails with id:", spotId);
            dispatch(fetchSpotDetails(spotId));
        }
    }, [dispatch, spotId]);

    if (!spot.id) return <div>Loading...</div>;

    console.log("Spot from Redux:", spot);

    const { name, city, state, country, price, avgStarRating, description } = spot;

    console.log("Redux spots:", useSelector(state => state.spots));
    console.log("Looking for spotId:", spotId);
    console.log("Spot details:", spot);

    return (
        <div>
            <h1>{name}</h1>
            <p>{description}</p>
            <p>{city}, {state}, {country}</p>
            <p>Price: ${price}</p>
            <p>Rating: {avgStarRating} stars</p>
            {/* Add image rendering below if needed */}
        </div>
    );
}

export default SpotDetails;