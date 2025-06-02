// Importing React's useState hook to manage component state
import { useState } from 'react';
// Importing useDispatch hook to dispatch Redux actions
import { useDispatch } from 'react-redux';
// Importing our thunk that will POST a new review to the backend
import { postReview } from '../../store/reviews';
// import our useModal to access the closemodal feature 
import { useModal } from '../../context/Modal';
import './PostReviewModal.css';

// Functional React component, receives spotId and closeModal function as props
function PostReviewModal({ spotId, onClose }) {
  const dispatch = useDispatch(); // Hook to dispatch Redux actions

  // Local state to track review text
  const [review, setReview] = useState('');

  // Local state to track selected star rating (1–5)
  const [stars, setStars] = useState(0);

  // Local state to track hovered star for visual highlight effect
  const [hoveredStars, setHoveredStars] = useState(0);

  // Local state to store and show any validation or server errors
  const [errors, setErrors] = useState([]);

  // Grabbing our closeModal feature from our import 
  const { closeModal } = useModal(); 

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();         // Prevent page reload
    setErrors([]);              // Clear previous errors

    try {
      // Dispatch the thunk to post the review, passing spotId and the form data
      await dispatch(postReview(spotId, { review, stars })).then(closeModal); 
    } catch (res) {
      // If server responds with errors, update the errors array in state
      if (res.errors) setErrors(res.errors);
    }
  };

  // JSX that renders the form
  return (
    <form onSubmit={handleSubmit} className="review-form">
      <h2>How was your stay?</h2>

      {/* Show list of errors if any */}
      <ul className='review-error-message'>
        {errors.map((err, idx) => <li key={idx}>{err}</li>)}
      </ul>

      {/* Textarea for review input */}
      <textarea
        placeholder="Leave your review here..."
        value={review}
        onChange={(e) => setReview(e.target.value)} // Updates `review` state on typing
        required
      />

      {/* Star rating UI */}
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (   // Loop through 1–5 to render stars
          <span
            key={star}  // Unique key for React
            // Conditional class: solid star if selected or hovered, otherwise outline
            className={star <= (hoveredStars || stars) ? "star filled" : "star"}
            onMouseEnter={() => setHoveredStars(star)}  // Highlight stars on hover
            onMouseLeave={() => setHoveredStars(0)}     // Remove highlight on hover out
            onClick={() => setStars(star)}              // Set stars on click
          >
            ★
            </span>
        ))}
        <span className='star-label'>Stars</span> {/* Show selected rating number */}
      </div>

      {/* Submit button, disabled unless review is at least 10 chars and 1+ stars selected */}
      <button onClick={onClose} type="submit" disabled={review.length < 10 || stars < 1}>
        Submit Your Review
      </button>
    </form>
  );
}

export default PostReviewModal; // Exporting component for use elsewhere
