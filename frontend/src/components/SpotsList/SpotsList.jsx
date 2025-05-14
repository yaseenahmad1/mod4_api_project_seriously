// First, we will need to import the necessary tools to export this piece of code 

import { useEffect } from "react"; // This will let us run code when the component first loads or mounts (componenetDidMount)
import { useDispatch, useSelector } from "react-redux"; // This will allow us to interact with our global state. 
// useDispatch allows us to send actions to fetch our spots
// useSelector lets us read the data from the Redux store  (to get list of all the spots)
import { fetchSpots } from '../../store/spots.js'; // This imports the Redux thunk action generated in this file 
// fetchSpots will be an async function that makes a GET request to the backend and puts the data in the Redux store 
import './SpotsList.css'; // import the css styling into this file which will then be attached to App

function SpotsList() { // function name defines our React component named 'SpotsList'

    const dispatch = useDispatch(); // Now we can use dispatch() inside the componenet to send actions

    const spots = useSelector(state => Object.values(state.spots)); // this will read the state.spots object from the Redux store 
    // The Object.values() turns the object into an array of spot values, which is easier to use than .map (literally just extracting the values and not the keys)

    useEffect(() => { 
        dispatch(fetchSpots()); // this will run the fetchSpots() once when the component mounts
    }, [dispatch]); // the [dispatch] is a dependency array - it ensures the effect runs only if dispatch changes (which it never does here)
    // this will call our backend API (/api/spots), then stores the results in Redux

    return ( <div className="spots-grid"> {/* this is our JSX render block when returns the actual HTML to show in the browser */}
            {/* Everything inside here is what the user will now see */}
            {spots.map(spot => ( // This will loop over every spot in the list (the array from Object.values())
            // For each spot, it will create a card div with its details
            // Via Requirements page we will present the information like so : 
                <div key={spot.id} className="spot-tile"> 
                    <img 
                        src={spot.previewImage !== 'No preview image available' ? spot.previewImage : '/default-image.jpg'}
                        alt={spot.name}
                        className="spot-image"
                    />
                    <div className="spots-info">
                        <div className="spot-location">{spot.city}, {spot.state}</div>
                        <div className="spot-price">${spot.price} / night</div>
                        <div className="spot-rating">{spot.avgRating ?? 'New'}</div> { /* The ?? is what is called a 'nullish coalescer' which returns the right-hand value only if the left-hand valie is null or undefined */}
                    </div> 
                </div>
            ))}
    </div>
    );
}

export default SpotsList; // Make the component available to use in other files 

// UNDERSTANDING THE PROBLEM/DEVISING A PLAN : 

// The User will hit the '/' route 
// SpotsList componenet mounts and runs useEffect
// useEffect calls dispatch(fetchSpots())
// fetchSpots() is a thunk that makes a GET request to your backend at /api/spots and store the response in state.spots
// useSelector() grabs the spots from the store 
// You map over those spots and render them on the screen 