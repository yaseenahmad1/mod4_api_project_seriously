import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createSpot } from '../../store/spots';

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
  const [price, setPrice] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');

  const [errors, setErrors] = useState({});

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
    if (!lat || isNaN(lat)) newErrors.lat = 'Latitude must be a number';
    if (!lng || isNaN(lng)) newErrors.lng = 'Longitude must be a number';

    if (Object.keys(newErrors).length) {
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
      lat: parseFloat(lat),
      lng: parseFloat(lng)
    };

    try {
      const newSpot = await dispatch(createSpot(spotData));
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
        <div>
          <label>Address</label>
          <input type="text" value={address} onChange={e => setAddress(e.target.value)} />
          {errors.address && <p className="error">{errors.address}</p>}
        </div>

        <div>
          <label>City</label>
          <input type="text" value={city} onChange={e => setCity(e.target.value)} />
          {errors.city && <p className="error">{errors.city}</p>}
        </div>

        <div>
          <label>State</label>
          <input type="text" value={stateName} onChange={e => setStateName(e.target.value)} />
          {errors.state && <p className="error">{errors.state}</p>}
        </div>

        <div>
          <label>Country</label>
          <input type="text" value={country} onChange={e => setCountry(e.target.value)} />
          {errors.country && <p className="error">{errors.country}</p>}
        </div>

        <div>
          <label>Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>

        <div>
          <label>Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} />
          {errors.description && <p className="error">{errors.description}</p>}
        </div>

        <div>
          <label>Price per night (USD)</label>
          <input type="number" value={price} onChange={e => setPrice(e.target.value)} />
          {errors.price && <p className="error">{errors.price}</p>}
        </div>

        <div>
          <label>Latitude</label>
          <input type="number" value={lat} onChange={e => setLat(e.target.value)} />
          {errors.lat && <p className="error">{errors.lat}</p>}
        </div>

        <div>
          <label>Longitude</label>
          <input type="number" value={lng} onChange={e => setLng(e.target.value)} />
          {errors.lng && <p className="error">{errors.lng}</p>}
        </div>

        <button type="submit">Create Spot</button>
      </form>
    </div>
  );
};

export default CreateSpotForm;