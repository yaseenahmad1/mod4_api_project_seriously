// frontend/src/App.jsx
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation';
import * as sessionActions from './store/session';
import SpotsList from './components/SpotsList/SpotsList';
import SpotDetails from './components/SpotDetails/SpotDetails'; 
import CreateSpotForm from './components/CreateSpotForm/CreateSpotForm';
import ManageReviews from './components/Manage/ManageReviews';
import ManageSpots from './components/Manage/ManageSpots';
import UpdateSpot from './components/UpdateSpot/UpdateSpot';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <SpotsList />
      }, 
      {
        path: '/spots/:spotId', 
        element: <SpotDetails />
      }, 
      {
        path: 'spots/new',
        element: <CreateSpotForm />
      },
      {
        path: '/spots/current',
        element: <ManageSpots />
      },
      {
        path: '/reviews/current',
        element: <ManageReviews />
      },
      {
        path: 'spots/:spotId/edit',
        element: <UpdateSpot />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;