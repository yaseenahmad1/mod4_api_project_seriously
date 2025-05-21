import { csrfFetch } from "./csrf"; // this brings in a special version of fetch that includes CSRFtokens to help protect your app from CSRF attacks

// Action 
const SET_REVIEWS = 'reviews/SET_REVIEWS'; 

const setReviews = (reviews) => ({
    type: SET_REVIEWS,
    reviews
}); 

// Action for adding a review
const ADD_REVIEW = 'reviews/ADD_REVIEW';

const addReview = (review) => ({
    type: ADD_REVIEW,
    review // OUR PAYLOAD 
}); 

// Add action for deleting a review 
const DELETE_REVIEW = 'reviews/DELETE_REVIEW';

const deleteReviewAction = (reviewId) => ({
    type: DELETE_REVIEW,
    reviewId // making sure we delete the correct review  
})

// Thunk action to fetch reviews based off a spot's id 
export const fetchSpotReviews = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`); // implementing the api endpoint for our fetch request 

    if (res.ok) { // if our repsonse is valid
        const data = await res.json(); // convert out response into json format and store new format in data variable
        dispatch(setReviews(data.Reviews)); 
        return data.Reviews;
    } else {
        const err = await res.json(); 
        throw err; 
    }
}; 

// Now we will implement our postReview feature which will allow us to access our backend route so we start with thunk 
export const postReview = (spotId, reviewData) => async (dispatch) => { // thunk action will take in a spotId and reviewData (an object of review and stars) 
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, { // this sends the POST request to our backend with the review data 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData)
    });
  
    if (res.ok) {               // if the response is successful... 
      const newReview = await res.json();   // we parse the response as JSON 
      dispatch(addReview(newReview)); // implement the addReview action 
      return newReview;         // and return the new review so our componenet can react to it (pun intended)
    } else {
      const error = await res.json();   // if we encounter an error, our componenet will be able to ctach and show error message 
      throw error;
    }
  };

// frontend/src/store/reviews.js (example)
export const deleteReview = (reviewId) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, { // fetching our backend route 
      method: 'DELETE',
    });
  
    if (response.ok) {
      dispatch(deleteReviewAction(reviewId));
      return null; // no error
    } else {
      const error = await response.json();
      return error;
    }
  };

// Reducer 
const reviewsReducer = (state = {}, action) => {
    switch (action.type) {
        case SET_REVIEWS: {
            const newState = {};
            action.reviews.forEach(review => {
                newState[review.id] = review;
            });
        return newState;
        }
        case ADD_REVIEW: {
            return {
                ...state,
                [action.review.id] : action.review
            }
        }
        case DELETE_REVIEW: {
            // create a copy of the state
            const newState = { ...state }; // spread the state in an object 
            // Remove the review by ID
            delete newState[action.reviewId]; // use the delete method to act on the Id of the review
            return newState;  // return the new state where review has been deleted 
        }
    default:
        return state;
    }
};


export default reviewsReducer; 