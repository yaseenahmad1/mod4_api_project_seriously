import { useSelector } from 'react-redux';
import { useEffect } from 'react';

function ManageReviews() {
  const user = useSelector(state => state.session.user);

  useEffect(() => {
    // Dispatch thunk to fetch user's reviews here
  }, []);

  return (
    <div>
      <h1>Manage Your Reviews</h1>
      {/* Render reviews here */}
    </div>
  );
}

export default ManageReviews;