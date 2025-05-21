import { useDispatch } from 'react-redux';
import { deleteReview } from '../../store/reviews';
import { useModal } from '../../context/Modal';
import './ConfirmDeleteReviewModal.css'; 

function ConfirmDeleteReviewModal({ reviewId, onClose }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    

    const handleConfirm = async () => {
        await dispatch(deleteReview(reviewId))
        .then(closeModal); // Closes the modal after deleting
    };

    return (
        <div className="confirm-delete-modal">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this review?</p>
            <div className="modal-buttons">
                <button onClick={handleConfirm} className="confirm">Yes (Delete Review)</button>
                <button onClick={onClose} className="cancel">No (Keep Review)</button>
            </div>
        </div>
    );
}

export default ConfirmDeleteReviewModal;