import styles from './SideNav.module.css';
import React from 'react';
import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { Link, useNavigate } from 'react-router-dom';
import useModal from '../../hooks/useModal';
import SearchModal from 'modals/SearchModal';
import { sections, authState } from '../../expos/recoil/items';
import LogoutModal from '../../modals/logoutModal'

export default function SideNav(): React.ReactElement {
  const { isOpen, toggle } = useModal();
  const navigate = useNavigate();
  const [auth, setAuth] = useRecoilState(authState);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false);
  const [logoutMessage, setLogoutMessage] = useState<string | null>(null);

  if (isOpen)
    document.body.style.cssText = `
    max-height: 100vh!important;
    overflow: hidden;`;
  else document.body.style.cssText = '';

  const handleLogout = () => {
    const currentPath = window.location.pathname + window.location.search;
    localStorage.setItem('lastVisitedPage', currentPath);
    setAuth(null);
    localStorage.removeItem('token');
    setLogoutMessage('Logout successful!');
    setTimeout(() => {
      setLogoutMessage(null);
    }, 3000);
  };

  const openModal = () => {
    setIsLogoutModalOpen(true);
  };

  const closeModal = () => {
    setIsLogoutModalOpen(false);
  };

  const confirmLogout = () => {
    handleLogout();
    closeModal();
  };

  return (
    <>
      <label className={`${styles.label} ${styles.menu}`} onClick={toggle}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          className="bi bi-list"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
          />
        </svg>
      </label>
      <SearchModal isOpen={isOpen} toggle={toggle} background={'black'}>
        <div className={styles.sideNavContainer}>
          <ul className={styles.sideNavItems}>
            {sections.map((section, idx) => {
              return (
                <li className={styles.sideNavItem} key={idx}>
                  <Link className="text-bold-16" to={`/${section.path}`}>
                    {section.displayName}
                  </Link>
                </li>
              );
            })}
          {auth ? (
            <div className={styles.loginButtonContainer} onClick={openModal}>
              <div className={styles.loginButton}>
                <span>
                  logout
                </span>
                <span className="text-bold-16">Logout</span>
              </div>
            </div>
          ) : (
            <div className={styles.loginButtonContainer} onClick={() => navigate('/login')}>
              <div className={styles.loginButton}>
                <span className={`material-symbols-outlined ${styles.loginIcon}`}>
                  account_circle
                </span>
                <span className="text-bold-16">Login</span>
              </div>
            </div>
          )}
          </ul>
        </div>
      </SearchModal>
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={closeModal}
        onConfirm={confirmLogout}
        message="Are you sure you want to log out?"
      />
      {logoutMessage && (
        <>
          <div className={styles.logoutMessage}>
            {logoutMessage}
          </div>
          <div className={styles.overlay}></div>
        </>
      )}
    </>
  );
}