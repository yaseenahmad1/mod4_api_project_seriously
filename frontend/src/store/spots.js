import { csrfFetch } from "./csrf"; // this brings in a special version of fetch that includes CSRFtokens to help protect your app from CSRF attacks

const LOAD_SPOTS = 'spots/LOAD_SPOTS'; 

// This is just a constant to avoid typos
// It names the action we'll use to tell the reducer: "Hey! Load the spots into state"

const loadSpots = (spots) => ({
    type: LOAD_SPOTS,
    spots
}); 

// This function creates an action object 
// type tells the reducer what kind of action this is
// spots is the actual data (the payload). 

// Implement Thunk Action (Async)
export const fetchSpots = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots'); // calling our backend and storing it in a variable
    const data = await response.json();             // parse the response into json format
    dispatch(loadSpots(data.Spots));                // Send spots to reducer 
};

// ^ This be our thunk which is an asynchronous function that 
// makes a GET request to /api/spots using csrfFetch
// waits for the response 
// extracts the .Spots array from the JSON 
// Dispatches the loadSpots action with that array to update Redux 

const intialState = {};  // Start the initial state as an empty object with no spots loaded yet

// REDUCER FUNCTION 

export default function spotsReducer(state = intialState, action) {
    switch (action.type) {
        case LOAD_SPOTS:
            const newState = {};
            action.spots.forEach(spot => {
                newState[spot.id] = spot;
            });
            return newState;
            default:
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