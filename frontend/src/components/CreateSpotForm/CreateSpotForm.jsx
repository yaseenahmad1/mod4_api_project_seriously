import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createSpot, uploadSpotImage } from '../../store/spots';

const CreateSpotForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Controlled form fields
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

    const newErrors = {};

    if (!address) newErrors.address = 'Address is required';
    if (!city) newErrors.city = 'City is required';
    if (!stateName) newErrors.state = 'State is required';
    if (!country) newErrors.country = 'Country is required';
    if (!name) newErrors.name = 'Name is required';
    if (!description) newErrors.description = 'Description is required';
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

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const spotData = {
      address,
      city,
      state: stateName,
      country,
      name,
      description,
      price: parseFloat(price),
      lat: lat ? parseFloat(lat) : null,
      lng: lng ? parseFloat(lng) : null,
    };

    try {
      const newSpot = await dispatch(createSpot(spotData));

      await dispatch(
        uploadSpotImage(newSpot.id, {
          url: previewImage,
          preview: true,
        })
      );

      const additionalImages = [image2, image3, image4, image5].filter(
        (url) => url?.trim()
      );

      for (const imageUrl of additionalImages) {
        await dispatch(
          uploadSpotImage(newSpot.id, {
            url: imageUrl,
            preview: false,
          })
        );
      }

      navigate(`/spots/${newSpot.id}`);
    } catch (err) {
      if (err.errors) setErrors(err.errors);
      else console.error('Unexpected error:', err);
    }
  };

  return (
    <div className="create-spot-form">
      <h2>Create a New Spot</h2>

      <form onSubmit={handleSubmit}>
        <h4>Where&apos;s your place located?</h4>
        <p>Guests will only get your exact address after they book a reservation.</p>

        <input
          type="text"
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
        />
        {errors.country && <p className="error">{errors.country}</p>}
        <input
          type="text"
          placeholder="Street Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        {errors.address && <p className="error">{errors.address}</p>}
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
        {errors.city && <p className="error">{errors.city}</p>}
        <input
          type="text"
          placeholder="State"
          value={stateName}
          onChange={(e) => setStateName(e.target.value)}
          required
        />
        {errors.state && <p className="error">{errors.state}</p>}
        <input
          type="number"
          placeholder="Latitude (optional)"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
        />
        <input
          type="number"
          placeholder="Longitude (optional)"
          value={lng}
          onChange={(e) => setLng(e.target.value)}
        />

        <hr />

        <h2>Describe your place to guests</h2>
        <p>
          Mention the best features of your space, any special amenities like fast wifi or
          parking, and what you love about the neighborhood.
        </p>
        <textarea
          placeholder="Please write at least 30 characters"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <hr />

        <h2>Create a title for your spot</h2>
        <p>Catch guests&apos; attention with a spot title that highlights what makes your place special.</p>
        <input
          type="text"
          placeholder="Name of your spot"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <hr />

        <h2>Set a base price for your spot</h2>
        <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
        <label>$</label>
        <input
          type="number"
          placeholder="Price per night (USD)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <hr />

        <h2>Liven up your spot with photos</h2>
        <p>Submit a link to at least one photo to publish your spot.</p>

        <input
          type="text"
          placeholder="Preview Image URL"
          value={previewImage}
          onChange={(e) => setPreviewImage(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Image URL 2"
          value={image2}
          onChange={(e) => setImage2(e.target.value)}
        />
        <input
          type="text"
          placeholder="Image URL 3"
          value={image3}
          onChange={(e) => setImage3(e.target.value)}
        />
        <input
          type="text"
          placeholder="Image URL 4"
          value={image4}
          onChange={(e) => setImage4(e.target.value)}
        />
        <input
          type="text"
          placeholder="Image URL 5"
          value={image5}
          onChange={(e) => setImage5(e.target.value)}
        />

        <button type="submit">Create Spot</button>
      </form>
    </div>
  );
};

export default CreateSpotForm;
