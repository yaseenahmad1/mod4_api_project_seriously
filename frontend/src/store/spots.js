import { csrfFetch } from "./csrf"; // this brings in a special version of fetch that includes CSRFtokens to help protect your app from CSRF attacks

const LOAD_SPOTS = 'spots/LOAD_SPOTS'; // this is for our landing page
const LOAD_SPOT_DETAILS = 'spots/LOAD_SPOT_DETAILS'; // this is for our spot details 
const ADD_SPOT = 'spots/ADD_SPOT'; // this is for our create a spot form 
const UPLOAD_SPOTIMAGE = 'spots/UPLOAD_SPOTIMAGE'; // this is for our spot form to add an image or even for edit a spot
const LOAD_USER_SPOTS = 'spots/LOAD_USER_SPOTS'; // action set for loading user's spots
const REMOVE_SPOT = 'spots/REMOVE_SPOT'; // action set to delete a spot based on id
const UPDATE_SPOT = ''

// Think of the payload (which is the data) as the response body 
// Think of thunk action as just functions returning functions (closure) retrieving backend data
// Reducer takes the thunk action and updates the state based on the actions the thunk dispatched to it 

const loadSpots = (spots) => ({
    type: LOAD_SPOTS,
    spots
});
// This function creates an action object 
// type tells the reducer what kind of action this is
// spots is the actual data (the payload). 

const loadSpotDetails = (spot) => ({
    type: LOAD_SPOT_DETAILS,
    spot
}); 

const loadUserSpots = (spots) => ({
    type: LOAD_USER_SPOTS,
    spots
});

// Get all spots for the current user
export const getCurrentUserSpots = () => async (dispatch) => { // creating an async function that will fetch all the spots associated with the logged in user
    const res = await csrfFetch('/api/spots/current');
  
    if (res.ok) {   // if response is successful 
      const data = await res.json(); // we convert our data into json readable format and then dispatch our function 
      dispatch(loadUserSpots(data.Spots)); 
      return data.Spots;
    } else {
      const error = await res.json();
      throw error;
    }
  };

// ^ we will then add this to our reducer down below 

// Action object that tells reducer what kind of action is occuring 
export const addSpot = (spot) => ({
    type: ADD_SPOT,
    spot
});


// Implement Thunk Action (Async)
export const fetchSpots = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots'); // calling our backend and storing it in a variable
    if (!response.ok) {
        // throw an error
        return; 
    }
    const data = await response.json();             // parse the response into json format
    dispatch(loadSpots(data.Spots));                // Send spots to reducer 
};

// ^ This be our thunk which is an asynchronous function that 
// makes a GET request to /api/spots using csrfFetch
// waits for the response 
// extracts the .Spots array from the JSON 
// Dispatches the loadSpots action with that array to update Redux 

// Implement Thunk Action (Async) for our spot details page based on which spot we click on 
export const fetchSpotDetails = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`) // here we use backticks because the url is dynamic unlike the static one above. note to self: VERY IMPORTANT! Missed this detail. 
    if (res.ok) {   // if our response was successful 
        const data = await res.json(); // then we convert our response into json format and store it inside a variable
        dispatch(loadSpotDetails(data)); // we then dispatch the action to update the Redux state with spots details  
    }
}; 

// Thunk to create a spot
export const createSpot = (spotData) => async (dispatch) => {
    const res = await csrfFetch('/api/spots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(spotData)
    });

    if (res.ok) {
        const newSpot = await res.json(); 
        dispatch({ type: ADD_SPOT, spot: newSpot });
        return newSpot;
    } else {
        const error = await res.json();
        return Promise.reject(error); 
    }
}; 

// Thunk to upload a spot image
export const uploadSpotImage = (spotId, imageData) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/images`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(imageData)
    });
  
    if (res.ok) {
      const newImage = await res.json();
      dispatch({
        type: UPLOAD_SPOTIMAGE,
        spotId,
        image: newImage
      });
      return newImage;
    } else {
      const error = await res.json();
      return Promise.reject(error);
    }
  };

  // creating our update spot function to provide to our reducer and component 
  export const updateSpot = (spotData) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotData.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(spotData)
    });
  
    if (res.ok) {
      const updatedSpot = await res.json();
      dispatch({ type: ADD_SPOT, spot: updatedSpot }); // reuse ADD_SPOT to update
      return updatedSpot;
    } else {
      const error = await res.json();
      return Promise.reject(error);
    }
  };

  export const removeSpot = (spotId) => ({
    type: REMOVE_SPOT,
    spotId
  });

  export const deleteSpot = (spotId) => async dispatch => {
    const res = await fetch(`/api/spots/${spotId}`, {
      method: 'DELETE'
    });
  
    if (res.ok) {
      dispatch(removeSpot(spotId));
    } else {
      const data = await res.json();
      throw new Error(data.message || 'Failed to delete spot');
    }
  };

const initialState = {};  // Start the initial state as an empty object with no spots loaded yet

// REDUCER FUNCTION 
// This reducer function is responsible to manage the state of all spots in Redux
// It listens for specific actions and updates the Redux state accoridngly 
const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_SPOTS: {
            // If we are loading a list of spots on our landing page, then we turn the array into an object with the spotid as they key
            const newState = {};
            action.spots.forEach(spot => {
                newState[spot.id] = spot;
            });
            return newState;
        }

        case LOAD_SPOT_DETAILS: 
        // If we are loading details for a single spot which is our spot details page
            return {
                ...state, // spread the existing state and add the spot by id 
                [action.spot.id]: action.spot
            }; 

        case ADD_SPOT: {
            return {
                ...state, [action.spot.id]: action.spot
            };
        }

        case UPLOAD_SPOTIMAGE: {
            const spotId = action.spotId;
            const newImage = action.image;
          
            return {
              ...state,
              [spotId]: {
                ...state[spotId],
                SpotImages: [...(state[spotId].SpotImages || []), newImage]
              }
            };
        }

        case LOAD_USER_SPOTS: {
            const newState = {};
            action.spots.forEach(spot => {
                newState[spot.id] = spot;
            }); 
            return newState; 
        }

        case REMOVE_SPOT: {
            const newState = { ...state };
            delete newState[action.spotId];
            return newState;
        }
        default: // if the action is not recognized, return the current state unchanged 
            return state;
    }
}

// This function listens for actions sent to the Redux store and returns the new state based on what happened. 

// When it sees the action type LOAD_SPOTS, it: 
// Creates a new object 
// Loops through the array of spots
// Stores each spot in the object using the spot's ID as the key

// That way, our Redux state looks like:
// {
//   1: { id: 1, name: "Cabin", city: "Denver", ... },
//   2: { id: 2, name: "Loft", city: "Seattle", ... }
// }
// This format is easier for quick lookups.

export default spotsReducer; 