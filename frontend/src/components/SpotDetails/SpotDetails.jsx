import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpotDetails } from '../../store/spots';
import { fetchSpotReviews } from '../../store/reviews'; // importing the thunk 
import './SpotDetails.css';

function SpotDetails() {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const [mainImage, setMainImage] = useState(null);

    const spot = useSelector(state => state.spots[+spotId] || {});
    const reviews = useSelector(state => Object.values(state.reviews)); // convert the object to array 

    useEffect(() => {
        if (spotId) {
            dispatch(fetchSpotDetails(spotId));
            dispatch(fetchSpotReviews(spotId)); // also fetch the reviews as well as the details of a spot
        }
    }, [dispatch, spotId]);

    if (!spot.id || !spot.SpotImages) return <div>Loading...</div>;

    const {
        name,
        city,
        state,
        country,
        price,
        avgStarRating,
        numReviews,
        description,
        SpotImages,
        Owner
    } = spot;

    const previewImage = SpotImages.find(img => img.preview) || SpotImages[0];

    return (
        <>
        <div className="spot-details">
            <h1>{name}</h1>
            <p>{city}, {state}, {country}</p>

            {/* Image Display */}
            <div className="images-section">
    <div className="main-image-wrapper">
        <img
            className="main-image"
            src={mainImage || previewImage?.url}
            alt="Main Spot"
        />
    </div>
    <div className="thumbnails">
        {SpotImages.filter(img => img.url !== (mainImage || previewImage?.url)).map((img, i) => (
            <img
                key={i}
                src={img.url}
                alt={`Thumbnail ${i}`}
                className="thumbnail"
                onClick={() => setMainImage(img.url)}
            />
        ))}
    </div>
</div>

            {/* Owner & Description */}
            <div className="spot-info">
                <h2>Hosted by {Owner?.firstName} {Owner?.lastName}</h2>
                <p>{description}</p>
            </div>

            {/* Price + Ratings */}
            <div className="booking-box">
                <p><strong>${price}</strong> night</p>
                <p>⭐ {avgStarRating} · {numReviews} review{numReviews !== 1 && 's'}</p>
            </div>
        </div>

        <hr className='line-break' />

        <div className="reviews-section">
        <h3>
        ★ {avgStarRating} · {numReviews} review{numReviews !== 1 && 's'} 
        </h3>
        {reviews.length === 0 ? (
            <p>Be the first to post a review!</p>
        ) : (
            reviews.map(review => (
                <div key={review.id} className="review-tile">
                    <p><strong>{review.User?.firstName}</strong></p>
                    <p>{new Date(review.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
                    <p>{review.review}</p>
                </div>
            ))
        )}
        </div>
        </>
    );
}

export default SpotDetails;