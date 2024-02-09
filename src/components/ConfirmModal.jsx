// ConfirmModal.js
import React from 'react';
import Modal from 'react-modal';

const ConfirmModal = ({ isOpen, onClose, onConfirm }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Confirm Delete"
        >
            <div>
                <p>Are you sure you want to delete this review?</p>
                <button onClick={onConfirm}>Yes, delete</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </Modal>
    );
};

export default ConfirmModal;
