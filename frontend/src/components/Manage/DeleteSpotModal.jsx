// frontend/src/components/Spots/DeleteSpotModal.jsx
import { useDispatch } from 'react-redux';
import { deleteSpot } from '../../store/spots';
import { useModal } from '../../context/Modal';

function DeleteSpotModal({ spotId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = async () => {
    await dispatch(deleteSpot(spotId));
    closeModal();
  };

  return (
    <div className="delete-modal">
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to remove this spot?</p>
      <div className="delete-buttons">
        <button onClick={handleDelete} className="confirm-delete">Yes (Delete Spot)</button>
        <button onClick={closeModal} className="cancel-delete">No (Keep Spot)</button>
      </div>
    </div>
  );
}

export default DeleteSpotModal;
