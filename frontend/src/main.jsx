import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import './index.css';
import configureStore from './store';
import { restoreCSRF, csrfFetch } from './store/csrf';
import * as sessionActions from './store/session'; // Added this line from PHASE 1 
import { Modal, ModalProvider } from './context/Modal';

const store = configureStore();
// add this line 
// if (process.env.NODE_ENV !== 'production') {
//   window.store = store;
// }

if (import.meta.env.MODE !== 'production') {
  restoreCSRF();

  window.csrfFetch = csrfFetch;
  window.store = store;
  window.sessionActions = sessionActions; // Added this line from PHASE 1 
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ModalProvider>
    <Provider store={store}>
      <App />
      <Modal />
    </Provider>
  </ModalProvider>
  </React.StrictMode>
);
