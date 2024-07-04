import React from 'react';
import styles from './logoutModal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <p>{message}</p>
        <div className={styles.modalActions}>
          <button className={styles.modalButton} onClick={onConfirm}>Confirm</button>
          <button className={styles.modalButton} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
