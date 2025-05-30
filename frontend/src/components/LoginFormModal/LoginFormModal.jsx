// frontend/src/components/LoginFormModal/LoginFormModal.jsx

import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginFormModal.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  return (
    <>
      <div className="form-page">
      <h1 className='log-in-text'>Log In</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <label className='input-label'>
          Username or Email
          <input
            type="text"
            className='input-field'
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label className='input-label'>
          Password
          <input
            type="password"
            className='input-field'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.credential && (
          <p className='error-message'>{errors.credential}</p>
        )}
        <button 
        type="submit"
        className='submit-button'
        disabled={credential.length < 4 || password.length < 6} /* Per requirements we need to create a feature on the button that remains disabled unless the conditions are met so our user credential and password have restrictions as to how short the length of characters can be*/
        >Log In</button>
        <a
        href="#"
        className='demo-user'
        onClick={() => 
          dispatch(sessionActions.login({ credential: 'Demo-lition', password: 'password'}))
          .then(closeModal)}> {/* Using the handleSubmit logic provided to us above we tweak the code to hardcode Demo-lition's credentials so that we have an automatic signin button */}
          Demo User</a> {/* It would be nice to create a "remember me" checkbox so that when the user who signs in clicks that this button will turn into their automatic sign in */}
      </form>
      </div>
    </>
  );
}

export default LoginFormModal;