import { useDispatch } from 'react-redux';
import { deleteReview } from '../../store/reviews';
import { useModal } from '../../context/Modal';
import { fetchSpotDetails } from '../../store/spots'; // need this to refresh page automatically 
import { useParams } from 'react-router-dom';
import './ConfirmDeleteReviewModal.css'; 

function ConfirmDeleteReviewModal({ reviewId }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const { spotId } = useParams(); 
    

    const handleConfirm = async () => {
        await dispatch(deleteReview(reviewId));
        await dispatch(fetchSpotDetails(spotId)); // refresh spot details
        closeModal(); // Closes the modal after deleting
    };

    return (
        <div className="confirm-delete-modal">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this review?</p>
            <div className="modal-buttons">
                <button onClick={handleConfirm} className="confirm">Yes (Delete Review)</button>
                <button onClick={closeModal} className="cancel">No (Keep Review)</button>
            </div>
        </div>
    );
}

export default ConfirmDeleteReviewModal;