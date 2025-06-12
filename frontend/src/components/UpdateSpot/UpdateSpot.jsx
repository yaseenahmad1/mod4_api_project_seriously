import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchSpotDetails, updateSpot } from '../../store/spots';
import './UpdateSpot.css';

function UpdateSpot() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const spot = useSelector(state => state.spots[spotId]); // this function helps us pinpoint the spot that we will be changing its state

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [country, setCountry] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(''); // keep as string for controlled input
  const [lat, setLat] = useState(''); // optional fields as strings
  const [lng, setLng] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [image2, setImage2] = useState('');
  const [image3, setImage3] = useState('');
  const [image4, setImage4] = useState('');
  const [image5, setImage5] = useState('');
  const [errors, setErrors] = useState({});


  useEffect(() => {                     // our useEffect function connects to our thunk function to fetch the data in our backend database 
    dispatch(fetchSpotDetails(spotId));
  }, [dispatch, spotId]);

  useEffect(() => {
    if (spot) { // if our spot exists then
        setAddress(spot.address || ''); // set the address to the spot address that was entered or leave it as an empty string for all textbox fields
        setCity(spot.city || '');
        setStateName(spot.state || '');
        setCountry(spot.country || '');
        setName(spot.name || '');
        setDescription(spot.description || '');
        setPrice(spot.price || '');
        setLat(spot.lat || '');
        setLng(spot.lng || '');

        // because our backend gives us our spotimages back as an array of objects with id, url, and preview as keys we have to map through them to extract the url of each one 
        // since our backend api route "includes" SpotImage, it becomes the key in the JSON response so we access the images by dot method but because Sequelize pluralizes our model name we use its plural form for access 
        const spotImages = spot.SpotImages || []; // we access the values of our spotImages or set it to an empty array if there is nothing 

        let previewUrl = ''; // assign our preview url as an empty string for now until it is assigned in our .map function 
        let otherImageUrls = []; // we will assign the rest of the images that are not previewable as an empty string

        // now we will loop through each image where preview is true set to previewImage where preview is false set to otherImages
        spotImages.map(image => {
            if (image.preview) {
                previewUrl = image.url; // if preview is true, it is the preview image and we access that url of that image that we map over
            } else {
                otherImageUrls.push(image.url); // otherwise it is the other images and we will push those into our empty array that we assigned earlier
            }
        }); 

        // Now we will set the image states 
        setPreviewImage(previewUrl|| ''); // so now our useState will set the preview image to that first image
        // the rest are in a new array which we will assign in order to each image  
        setImage2(otherImageUrls[0] || '');
        setImage3(otherImageUrls[1] || '');
        setImage4(otherImageUrls[2] || '');
        setImage5(otherImageUrls[3] || '');
    }
  }, [spot]); // placing our spot variable at the end of our useEffect function because useEffect onlu runs after the spot has changed. 

  if (!spot) return <p>Loading...</p>; // if a spot is not located return a loading sign (perhaps add a setTimeout async function that eventually registers an error)

  // Helper function to check image URL endings
  function isValidImageURL(url) {
    return (
      url.endsWith('.jpg') ||
      url.endsWith('.jpeg') ||
      url.endsWith('.png') ||
      url.endsWith('.JPG') ||
      url.endsWith('.JPEG') ||
      url.endsWith('.PNG')
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // we need to ensure that when the user updates their spot that error validations are handled for empty fields or not sufficient inputs
    const newErrors = {}; // we assign an empty object to store any errors we envounter 

    // taken from createspotform.jsx 
    if (!country) newErrors.country = 'Country is required';
    if (!address) newErrors.address = 'Address is required';
    if (!city) newErrors.city = 'City is required';
    if (!stateName) newErrors.state = 'State is required';
    if (!name) newErrors.name = 'Name is required';
    if (!description) newErrors.description = 'Description needs a minimum of 30 characters';
    if (!price || isNaN(price)) newErrors.price = 'Price must be a number';

    // lat and lng are optional, but if provided must be numbers
    if (lat && isNaN(lat)) newErrors.lat = 'Latitude must be a number';
    if (lng && isNaN(lng)) newErrors.lng = 'Longitude must be a number';

    if (!previewImage) {
      newErrors.previewImage = 'Preview image is required';
    } else if (!isValidImageURL(previewImage)) {
      newErrors.previewImage = 'Preview image must end in .jpg, .jpeg, or .png';
    }

    // Validate optional images if provided
    if (image2 && !isValidImageURL(image2)) {
      newErrors.image2 = 'Image must end in .jpg, .jpeg, or .png';
    }
    if (image3 && !isValidImageURL(image3)) {
      newErrors.image3 = 'Image must end in .jpg, .jpeg, or .png';
    }
    if (image4 && !isValidImageURL(image4)) {
      newErrors.image4 = 'Image must end in .jpg, .jpeg, or .png';
    }
    if (image5 && !isValidImageURL(image5)) {
      newErrors.image5 = 'Image must end in .jpg, .jpeg, or .png';
    }

    if (Object.keys(newErrors).length > 0) { // if our errors exist in our object 
        setErrors(newErrors);    // then we use our useState and
        return; // stop execution if validation fails
      }


    const updatedData = {
        id: spotId,
        address,
        city, 
        state: stateName,
        country,
        name,
        description,
        price,
        lat: lat ? parseFloat(lat) : null, // turned this from simply lat into a conditonal that if we have lat parse it as a decimal or leave it as null
        lng: lng ? parseFloat(lng) : null, // same principle applies here 
        previewImage,
        image2,
        image3,
        image4,
        image5
    }; 

    const updatedSpot = await dispatch(updateSpot(updatedData)); // we then use our updateSpot function from out thunk in our Redux store and assign it to a new variable
    if (updatedSpot?.id) navigate(`/spots/${updatedSpot.id}`); // we use a conditional to say if that updateSpot has been edited then we navigate to the spot's id where the changes should be refelcrted
  }

//   const handleSubmit = async (spotData) => {
//     const updatedSpot = await dispatch(updateSpot(spotId, spotData));
//     if (updatedSpot?.id) navigate(`/spots/${updatedSpot.id}`);
//     return updatedSpot;
//   };

return (
    <div className='form-page'>
    <form onSubmit={handleSubmit}>
        <div className='section-one'>
      <h2 className='update-form-text'>Update Your Spot</h2>
      <h3 className='update-titles'>Where&apos;s your place located?</h3>
      <p className='update-paragraph'>Guests will only get your exact address once they booked a reservation</p>

      <label className='update-label'>
        Country
        <input value={country} onChange={(e) => setCountry(e.target.value)} />
        {errors.country && <p className="error">{errors.country}</p>}
      </label>

      <label className='update-label'>
        Street Address
        <input value={address} onChange={(e) => setAddress(e.target.value)} />
        {errors.address && <p className="error">{errors.address}</p>}
      </label>

      <label className='update-label'>
        City
        <input value={city} onChange={(e) => setCity(e.target.value)} />
        {errors.city && <p className="error">{errors.city}</p>}
      </label>

      <label className='update-label'>
        State
        <input value={stateName} onChange={(e) => setStateName(e.target.value)} />
        {errors.stateName && <p className="error">{errors.stateName}</p>}
      </label>

      <label className='update-label'>
        Latitude
        <input type="number" value={lat} onChange={(e) => setLat(e.target.value)} />
        {errors.lat && <p className="error">{errors.lat}</p>}
      </label>

      <label className='update-label'>
        Longitude
        <input type="number" value={lng} onChange={(e) => setLng(e.target.value)} />
        {errors.lng && <p className="error">{errors.lng}</p>}
      </label>
      </div>

      <hr></hr>

      <h3 className='update-titles'>Desribe your place to guests</h3>
      <p className='update-paragraph'>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>

      <label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        {errors.description && <p className="error">{errors.description}</p>}
      </label>

      <h3 className='update-titles'>Create a title for your spot</h3>
      <p className='update-paragraph'>Catch guests&apos; attention with a spot title that highlights what makes your place special</p>

      <label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        {errors.name && <p className="error">{errors.name}</p>}
      </label>

      <h3 className='update-titles'>Set a base price for your spot</h3>
      <p className='update-paragraph'>Competitive pricing can help your listing </p>

      <label>$</label>
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        {errors.number && <p className="error">{errors.number}</p>}


      <hr></hr>

      <h3 className='update-titles'>Liven up your spot with photos</h3>
      <p className='update-paragraph'>Submit a link to at least one photo to publish your spot.</p>

      <label>
        <input
          type="text"
          placeholder="Preview Image URL"
          value={previewImage}
          onChange={(e) => setPreviewImage(e.target.value)}
        />
        {errors.previewImage && <p className="error">{errors.previewImage}</p>}
      </label>

      <label>
        <input
          type="text"
          placeholder="Preview Image URL"
          value={image2}
          onChange={(e) => setImage2(e.target.value)}
        />
        {errors.image2 && <p className="error">{errors.image2}</p>}
      </label>

      <label>
        <input
          type="text"
          placeholder="Preview Image URL"
          value={image3}
          onChange={(e) => setImage3(e.target.value)}
        />
        {errors.image3 && <p className="error">{errors.image3}</p>}
      </label>

      <label>
        <input
          type="text"
          placeholder="Preview Image URL"
          value={image4}
          onChange={(e) => setImage4(e.target.value)}
        />
        {errors.image4 && <p className="error">{errors.image4}</p>}
      </label>

      <label>
        <input
          type="text"
          placeholder="Preview Image URL"
          value={image5}
          onChange={(e) => setImage5(e.target.value)}
        />
        {errors.image5 && <p className="error">{errors.image5}</p>}
      </label>
      
      <hr></hr>

      <button type="submit" className='update-form-button'>Update Spot</button>
    </form>
    </div>
  );
}


export default UpdateSpot;
