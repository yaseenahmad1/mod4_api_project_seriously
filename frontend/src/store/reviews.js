import { csrfFetch } from "./csrf"; // this brings in a special version of fetch that includes CSRFtokens to help protect your app from CSRF attacks

// Action 
const SET_REVIEWS = 'reviews/SET_REVIEWS'; 

const setReviews = (reviews) => ({
    type: SET_REVIEWS,
    reviews
}); 

// Thunk action to fetch reviews based off a spot's id 
export const fetchSpotReviews = (spotId) => async (dispatch) => {
    const res = await fetch(`/api/spots/${spotId}/reviews`); // implementing the api endpoint for our fetch request 

    if (res.ok) { // if our repsonse is valid
        const data = await res.json(); // convert out response into json format and store new format in data variable
        dispatch(setReviews(data.Reviews)); 
        return data.Reviews;
    } else {
        const err = await res.json(); 
        throw err; 
    }
}; 


// Reducer 
const reviewsReducer = (state = {}, action) => {
    switch (action.type) {
        case SET_REVIEWS:
            const newState = {};
            action.reviews.forEach(review => {
                newState[review.id] = review;
            });
        return newState;
    default:
        return state;
    }
};

export default reviewsReducer; 