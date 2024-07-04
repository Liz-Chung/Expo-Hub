import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Exhibitions } from '../../expos/recoil/items';
import LoginModal from '../../modals/loginModal';
import styles from './WishlistsPage.module.css';

interface WishlistProps {
  favorites: Exhibitions[];
  setFavorites: React.Dispatch<React.SetStateAction<Exhibitions[]>>;
}

export default function WishlistsPage(props: WishlistProps) {
  const [showModal, setShowModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => !!localStorage.getItem('token'));
  const navigate = useNavigate();

  const handleRemove = (expo: Exhibitions) => {
    const updatedFavorites = props.favorites.filter((fav) => fav.exhibition_id !== expo.exhibition_id);
    props.setFavorites(updatedFavorites);
  };

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(props.favorites));
  }, [props.favorites]);

  useEffect(() => {
    const handleStorageChange = () => {
      const loggedIn = !!localStorage.getItem('token');
      setIsLoggedIn(loggedIn);

      if (!loggedIn) {
        setShowModal(true);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    if (!isLoggedIn) {
      setShowModal(true);
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isLoggedIn]);

  const handleLogin = () => {
    setShowModal(false);
    navigate('/login');
  };

  return (
    <div className='wrapper'>
      <section className={styles.pageContainer}>
        {!isLoggedIn ? (
          <LoginModal 
            isOpen={showModal} 
            onClose={() => setShowModal(false)} 
            onLogin={handleLogin} 
          />
        ) : (
          <div className={styles.wishlistContainer}>
            {props.favorites.length > 0 ? (
              <>
                {props.favorites.map((expo: Exhibitions) => {
                  return (
                    <div className={styles.productContainer} key={expo.exhibition_id}>
                      <div className={styles.productBox}>
                        <Link to={`/expo/${expo.exhibition_id}`}>
                          <figure className={styles.imgContainer}>
                            <img className={styles.img} src={expo.image_url} alt="itemImg" />
                          </figure>
                        </Link>
                        <div className={styles.cardBox}>
                          <h2>
                            <Link to={`/expo/${expo.exhibition_id}`} className="title-bold-28">
                              {expo.name}
                            </Link>
                          </h2>
                          <p className="text-regular-18">
                            <span className='title-bold-18'>Location: </span> {expo.location}
                          </p>
                          <p className="text-regular-18">
                            <span className='title-bold-18'>Duration: </span> {expo.start_date} ~ {expo.end_date}
                          </p>
                          <div className={styles.btnGroup}>
                            <button
                              className="btn-main"
                              onClick={() => handleRemove(expo)}
                              style={{
                                borderRadius: '10px',
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <div>
                <h1 className="text-medium-24">Your wishlist is empty.</h1>
                <Link to="/">
                  <button className="btn-main" style={{ marginTop: '3.5rem' }}>
                    Start Exploring
                  </button>
                </Link>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
