import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useDebugValue, useEffect } from "react";
import { fetchSpotDetails, fetchSpots } from "../../store/spots";
import { fetchSpotReviews } from "../../store/reviews";
import './SpotDetails.css';

function SpotDetails() {
    const { spotId } = useParams(); 
    const dispatch = useDispatch();

    const spot = useSelector(state => state.spots[spotId]); // Accessing the spot from Redux
    const reviews = useSelector(state => Object.values(state.reviews)); // reads the reviews from the redux store  

    useEffect(() => {
        dispatch(fetchSpotDetails(spotId));
        dispatch(fetchSpotReviews(spotId)); // adding the fetch reviews with the details 
    }, [dispatch, spotId]);

    if (!spot) return <div>Loading...</div>;

    const { name, city, state, country, price, avgRating, description, previewImage } = spot; 

    // const mainImage = SpotImages[0]; 
    // const sideImages = indexOf(SpotImages.length); 

    return (
        <div className="spot-details">
      <h1>{name}</h1>
      <p>{city}, {state}, {country}</p>

      <div className="spot-images">
        <img src={mainImage.url} alt="Main" className="main-image" />
        <div className="side-images">
          {sideImages.map((img, i) => (
            <img key={i} src={img.url} alt={`Side ${i}`} className="side-image" />
          ))}
        </div>
      </div>

      <div className="spot-info">
        <h2>Hosted by {Owner.firstName} {Owner.lastName}</h2>
        <p>{description}</p>
        <div className="reserve-box">
          <p>${price} night</p>
          <p>⭐ {avgRating ?? 'New'}</p>
          <button onClick={() => alert("Feature coming soon")}>Reserve</button>
        </div>
      </div>

      <div className="reviews">
        {/* Later insert your ReviewsList component here */}
      </div>
    </div>
  );
}

export default SpotDetails; 