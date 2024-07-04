import React from 'react';
import styles from './reviewSubmit.module.css';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Review Submitted!</h2>
        <p>Your review has been submitted successfully.</p>
        <button className="btn-main" onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

export default SuccessModal;
