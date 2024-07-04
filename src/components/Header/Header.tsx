import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { sections, Exhibitions, authState } from '../../expos/recoil/items';
import SearchProduct from '../SearchExpo/SearchExpo';
import SideNav from '../SideNav/SideNav';
import LogoutModal from '../../modals/logoutModal'
import styles from './Header.module.css';

interface PropsType {
  cart: Exhibitions[];
  favorites: Exhibitions[];
  setFavorites: React.Dispatch<React.SetStateAction<Exhibitions[]>>;
}

export default function Header(props: PropsType) {
  const navigate = useNavigate();
  const [searchToggle, setSearchToggle] = useState<boolean>(false);
  const [auth, setAuth] = useRecoilState(authState);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false);
  const [logoutMessage, setLogoutMessage] = useState<string | null>(null);
  let cartCount = 0;

  if (props.cart !== null) {
    props.cart.forEach((item: Exhibitions) => {
      cartCount += item.quantity || 0;
    });
  }

  const handleLogout = () => {
    const currentPath = window.location.pathname + window.location.search;
    localStorage.setItem('lastVisitedPage', currentPath);
    setAuth(null);
    localStorage.removeItem('token');
    setLogoutMessage('Logout successful!');
    setTimeout(() => {
      setLogoutMessage(null);
    }, 2000);
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
    <div className={styles.navContainer}>
      <div className={styles.nav}>
        <SideNav />
        <div
          className={searchToggle ? `${styles.none} ${styles.titleBox} ` : styles.titleBox}
          onClick={() => navigate('/')}
        >
          <h1 className={styles.title}>ExpoHub</h1>
        </div>
        <div className={`${styles.navCategory}`}>
          {sections.map((section, idx) => (
            <span
              key={idx}
              onClick={() => navigate(`/${section.path}`)}
              className={styles.category}
            >
              {section.displayName}
            </span>
          ))}
        </div>
        <div className={styles.flex}>
          <div className={styles.searchBox}>
            <SearchProduct searchToggle={searchToggle} setSearchToggle={setSearchToggle} />
          </div>
          <div className={`${styles.label} ${styles.commonHoverEffect}`} onClick={() => navigate('/cart')}>
            <span className="material-symbols-outlined">
              shopping_bag
            </span>
            {cartCount >= 0 && <span className={styles.cartCount}>{cartCount}</span>}
          </div>
          {auth ? (
            <div className={`${styles.label} ${styles.commonHoverEffect} ${styles.hideOnSmallScreen}`} onClick={openModal}>
              <span className="material-symbols-outlined">
                logout
              </span>
            </div>
          ) : (
            <div className={`${styles.label} ${styles.commonHoverEffect} ${styles.hideOnSmallScreen}`} onClick={() => navigate('/login')}>
              <span className="material-symbols-outlined">
                account_circle
              </span>
            </div>
          )}
        </div>
      </div>
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
    </div>
  );
}
