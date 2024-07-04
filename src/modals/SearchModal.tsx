import { ReactNode } from 'react';
import styles from './SearchModal.module.css';

interface ModalType {
  children?: ReactNode;
  isOpen: boolean;
  toggle: () => void;
  background?: string;
}

export default function SearchModal({ children, isOpen, toggle, background }: ModalType) {
  return (
    <>
      {isOpen && (
        <div
          className={background ? styles.modalOverlayBlack : styles.modalOverlay}
          onClick={toggle}
        >
          {children}
        </div>
      )}
    </>
  );
}
