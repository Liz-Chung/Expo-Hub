import React from 'react';
import styles from './loginModal.module.css';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Please Log In</h2>
        <p className={styles.modalText}>You need to be logged in to add items to your wishlists.</p>
        <div className={styles.modalActions}>
          <button className={styles.loginButton} onClick={onLogin}>
            Log In
          </button>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
