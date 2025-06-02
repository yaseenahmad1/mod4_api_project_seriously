import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupFormModal.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  // we need to ensure that the sign up button is disabled until the specifics of the text inputs are met 
  // create a variable that holds these conditions and pass them into our button tag below
  const isDisabled = 
  !email ||               // if there is no email or..
  !username || username.length < 4 || // there is no username or if the characters or less than 4 and etc 
  !firstName ||
  !lastName || 
  !password || password.length < 6 || 
  !confirmPassword;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data?.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  return (
    <>
      <div className='form-page'>
      <h1 className='sign-up-text'>Sign Up</h1>
      <form className='sign-up-form' onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="text"
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        {errors.email && <p className='error-message'>{errors.email}</p>}
        <label>
          Username
          <input
            type="text"
            placeholder='Username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        {errors.username && <p className='error-message'>{errors.username}</p>}
        <label>
          First Name
          <input
            type="text"
            placeholder='First Name'
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </label>
        {errors.firstName && <p className='error-message'>{errors.firstName}</p>}
        <label>
          Last Name
          <input
            type="text"
            placeholder='Last Name'
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </label>
        {errors.lastName && <p className='error-message'>{errors.lastName}</p>}
        <label>
          Password
          <input
            type="password"
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {errors.password && <p className='error-message'>{errors.password}</p>}
        <label>
          Confirm Password
          <input
            type="password"
            placeholder='Confirm Password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </label>
        {errors.confirmPassword && (
          <p className='error-message'>{errors.confirmPassword}</p>
        )}
        <button type="submit" disabled={isDisabled}>Sign Up</button>
      </form>
      </div>
    </>
  );
}

export default SignupFormModal;