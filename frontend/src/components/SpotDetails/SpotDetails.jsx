import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpotDetails } from '../../store/spots';
import { fetchSpotReviews } from '../../store/reviews'; // importing the thunk 
// import { deleteReview } from '../../store/reviews'; // adding our delete review thunk in our spot details page
import './SpotDetails.css';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import PostReviewModal from '../PostReviewModal/PostReviewModal';
import ConfirmDeleteReviewModal from '../ConfirmDeleteReviewModal/ConfirmDeleteReviewModal';

function SpotDetails() {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const [mainImage, setMainImage] = useState(null); // Main image shown on the left in larger view 

    // Here we utitlize our useSelector to get spot details and reviews from our redux store 
    const spot = useSelector(state => state.spots[+spotId] || {});
    const reviews = useSelector(state => Object.values(state.reviews)); // convert the object to array 
    // we need to make sure the recent reviews are the top of the page by using created at descding order 

    // We will get current logged in user from session slice to ensure proper webpage functionality 
    const user = useSelector(state => state.session.user); 

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

    // We will define owner and review capability
    const isOwner = user && Owner && user.id === Owner.id; // this will result in a true boolean if current user owns the spot
    let userHasReviewed = false; // we will start this boolean as false first to assume a review has not been made
    if (user) { // if user is logged in
        const reviewByUser = reviews.find(review => review.userId === user.id); // .find is searching through our array and returns the first review where condition is turned true
        if (reviewByUser) { // If found this will hold that and implement the change 
            userHasReviewed = true; // the boolean changes if a review is found by that user 
        }

    }

    return (
        <>
        <div className="spot-details">
            <h1>{name}</h1>
            <p>{city}, {state}, {country}</p>

            {/* ---------- Image Display Section ---------- */}
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

            {/* ---------- Spot Info Section ---------- */}
            <div className="spot-info">
                <h2>Hosted by {Owner?.firstName} {Owner?.lastName}</h2>
                <p>{description}</p>
            </div>

            {/* ---------- Price + Ratings ---------- */}
            <div className="booking-box">
                <p><strong>${price}</strong> night</p>
                <p>⭐ {avgStarRating} · {numReviews} review{numReviews !== 1 && 's'}</p>
                <button>Reserve</button>
            </div>
        </div>

        <hr className="line-break" />

        {/* ---------- Reviews Section ---------- */}
        <div className="reviews-section">
            <h3>
                ★ {avgStarRating} · {numReviews} review{numReviews !== 1 && 's'}
            </h3>

            {/* Show Post Review button only if: user is logged in, NOT the owner, and hasn’t reviewed */}
            {user && !isOwner && !userHasReviewed && (
                <OpenModalButton
                    buttonText="Post Your Review"
                    modalComponent={<PostReviewModal spotId={spot.id} />}
                />
            )}

            {/* Show 'New' if no reviews and not owner */}
            {reviews.length === 0 && !isOwner && <p>New</p>}

            {/* ---------- List of Reviews ---------- */}
            {reviews.length > 0 && reviews
            .slice()// backend tweak did not work so we will use .slice to copy the array and avoid mutating original array and sort for ordering 
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // if b.createdAt is more recent than a.createdAt then b comes before a so we get most recent to old reviews 
            .map(review => { 
                const isReviewOwner = user && user.id === review.userId;

                return (
                    <div key={review.id} className="review-tile">
                    <p><strong>{review.User?.firstName}</strong></p>
                    <p>{new Date(review.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
                    <p>{review.review}</p>

                    {isReviewOwner && (
                        <OpenModalButton
                        buttonText="Delete"
                        modalComponent={(closeModal) => (
                            <ConfirmDeleteReviewModal
                            reviewId={review.id}
                            onClose={closeModal}
                            />
                        )}
                        />
                    )}
                    </div>
                );
            })}
        </div>
        </>
    );
}

export default SpotDetails;