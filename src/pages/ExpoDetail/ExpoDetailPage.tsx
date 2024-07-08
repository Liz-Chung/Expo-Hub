import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { Exhibitions, userList, reviewList, Users, NormalizedReviews } from '../../expos/recoil/items';
import { DayPicker } from 'react-day-picker';
import LoginModal from '../../modals/loginModal';
import { AverageStarRating, IndividualStarRating } from '../../components/Utill/StarRating';
import 'react-day-picker/dist/style.css';
import './CustomDaypicker.css';
import styles from './ExpoDetailPage.module.css';

interface CartProps {
  cart: Exhibitions[];
  setCart: React.Dispatch<React.SetStateAction<any[]>>;
  favorites: Exhibitions[];
  setFavorites: React.Dispatch<React.SetStateAction<Exhibitions[]>>;
}

interface LocationState {
  newReview?: NormalizedReviews;
}

export default function ExpoDetailPage(props: CartProps): React.ReactElement {
  const { id: exhibition_id } = useParams<{ id: string }>();
  const location = useLocation();
  const state = location.state as LocationState;
  const [itemInfo, setItemInfo] = useState<Exhibitions | null>(null);
  const [activeTab, setActiveTab] = useState<'information' | 'reviews'>('information');
  const [visitDate, setVisitDate] = useState<Date | undefined>(undefined);
  const [ticketQuantity, setTicketQuantity] = useState<number>(1);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => !!localStorage.getItem('token'));
  const [loading, setLoading] = useState<boolean>(true);

  const users = useRecoilValue(userList);
  const [reviews, setReviews] = useState<NormalizedReviews[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const getItemInfo = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_MOCKUP_EXPO_API}/api/exhibitions/${exhibition_id}`);
        if (isMounted) {
          setItemInfo(response.data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    if (exhibition_id) {
      getItemInfo();
    }

    return () => {
      isMounted = false;
    };
  }, [exhibition_id]);

  useEffect(() => {
    const handleTokenChange = () => {
      setIsLoggedIn(!!localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleTokenChange);

    return () => {
      window.removeEventListener('storage', handleTokenChange);
    };
  }, []);

  useEffect(() => {
    if (activeTab === 'reviews') {
      const fetchReviews = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_MOCKUP_EXPO_API}/api/reviews`);
          setReviews(response.data.filter((review: NormalizedReviews) => review.exhibition_id === parseInt(exhibition_id!)));
        } catch (error) {
          console.error('Error fetching reviews:', error);
        }
      };
      fetchReviews();
    }
  }, [activeTab, exhibition_id]);

  useEffect(() => {
    if (state?.newReview) {
      setReviews((prevReviews) => [...prevReviews, state.newReview!]);
      setActiveTab('reviews');
    }
  }, [state]);

  const handleCartItems = (cartItemInfo: Exhibitions) => {
    if (!visitDate) {
      setErrorMessage('Please select a visit date before booking.');
      return;
    }

    if (isNaN(cartItemInfo.quantity)) {
      cartItemInfo.quantity = 0;
    }
    cartItemInfo.quantity += 1;

    const newCartItem = {
      ...cartItemInfo,
      quantity: ticketQuantity,
      selectedVisitDate: visitDate,
    };

    const found = props.cart.find((el) => el.exhibition_id === newCartItem.exhibition_id);
    if (found) setQuantity(cartItemInfo.exhibition_id, cartItemInfo.quantity);
    else props.setCart([...props.cart, newCartItem]);

    navigate('/cart');
  };

  const setQuantity = (id: number, quantity: number) => {
    const found = props.cart.filter((el) => el.exhibition_id === id)[0];
    const idx = props.cart.indexOf(found);
    const newCartItem = {
      ...found,
      quantity: quantity,
    };

    console.log(newCartItem);
    props.setCart([...props.cart.slice(0, idx), newCartItem, ...props.cart.slice(idx + 1)]);
  };

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(props.cart));
  }, [props.cart]);

  const isFavorite = props.favorites.some((fav) => fav.exhibition_id === itemInfo?.exhibition_id);

  const toggleFavorite = (item: Exhibitions) => {
    const isUserLoggedIn = !!localStorage.getItem('token');
    setIsLoggedIn(isUserLoggedIn);

    if (!isUserLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }

    if (isFavorite) {
      props.setFavorites(props.favorites.filter((fav) => fav.exhibition_id !== item.exhibition_id));
    } else {
      props.setFavorites([...props.favorites, item]);
    }
  };

  const formatter = new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const startDate = itemInfo ? new Date(itemInfo.start_date) : new Date();
  const endDate = itemInfo ? new Date(itemInfo.end_date) : new Date();

  const handleLogin = () => {
    setIsLoginModalOpen(false);
    navigate('/login');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  const renderReviews = () => {
    return reviews
      .filter((review: NormalizedReviews) => review.exhibition_id === parseInt(exhibition_id!))
      .map((review: NormalizedReviews) => {
        const user = users.find((user: Users) => user.user_id.toString() === review.user_id.toString());
        return (
          <div key={review.review_id} className={styles.reviewItem}>
            <div className={styles.reviewHeader}>
              <strong className={styles.userName}>{review.user_name || user?.name}</strong>
              <IndividualStarRating
                exhibitionId={review.exhibition_id}
                userId={review.user_id.toString() || ''}
                rating={review.rating}
              />
            </div>
            <p className={styles.commentText}>{review.comment}</p>
          </div>
        );
      });
  };

  return (
    <div className='wrapper'>
      {itemInfo ? (
        <section className={styles.pageContainer}>
          <div className={styles.productContainer}>
            <figure className={styles.imgContainer}>
              <img className={styles.img} src={itemInfo.image_url} alt={itemInfo.name} />
              <div className={styles.favoritesContainer}>
                <button className={styles.favoritesButton} onClick={() => toggleFavorite(itemInfo)}>
                  <span
                    className={`${styles.favoriteIcon} ${isFavorite ? styles.favorite : styles.notFavorite}`}
                  />
                </button>
                <p>{isFavorite ? "Added to Wishlists" : "Add to Wishlists"}</p>
              </div>
            </figure>
            <div className={styles.productInfo}>
              <h2 className={styles.itemName}>{itemInfo.name}</h2>
              <br></br>
              <p className={styles.itemLocation}>Location: {itemInfo.location}</p>
              <p className={styles.itemDate}>Duration: {itemInfo.start_date} ~ {itemInfo.end_date}</p>
              <div className={styles.ratingContainer}>
                <AverageStarRating exhibitionId={parseInt(exhibition_id!)} />
              </div>
              <br></br>
              <p className={styles.price}>
                {itemInfo.price === 0 ? "Free" : `Price: ${formatter.format(itemInfo.price)}`}
              </p>
            </div>
            <div className={styles.bookingInfo}>
              <div className={styles.dateQuantityContainer}>
                <div className={styles.datePickerContainer}>
                  <label className={styles.bookingLabels}>Select Visit Date:</label>
                  <div className={styles.dayPickerBackground}>
                    <DayPicker
                      selected={visitDate}
                      onSelect={(date: Date | undefined) => setVisitDate(date)}
                      mode="single"
                      fromDate={startDate}
                      toDate={endDate}
                      defaultMonth={startDate}
                    />
                  </div>
                </div>
                <div>
                  <label className={styles.bookingLabels}>Quantity:</label>
                  <input
                    type="number"
                    value={ticketQuantity}
                    onChange={(e) => setTicketQuantity(Number(e.target.value))}
                    min="1"
                    className={styles.quantityInput}
                  />
                </div>
              </div>
              {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
              <div className={styles.ButtonContainer}>
                <button className="btn-main" onClick={() => handleCartItems(itemInfo)}>
                  Book Now
                </button>
              </div>
            </div>
          </div>
          <div className={styles.segmentContainer}>
            <button
              className={`${styles.segmentButton} ${activeTab === 'information' ? styles.active : ''}`}
              onClick={() => setActiveTab('information')}
            >
              Information
            </button>
            <button
              className={`${styles.segmentButton} ${activeTab === 'reviews' ? styles.active : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews
            </button>
          </div>
          <div className={styles.tabContent}>
            {activeTab === 'information' ? (
              <div>
                <p className={styles.description}>{itemInfo.description}</p>
                <img className={styles.fullWidthImg} src={itemInfo.image_url} alt={itemInfo.name} />
              </div>
            ) : (
              <div>
                <button className="btn-main" onClick={() => navigate(`/writeReview/${exhibition_id}`)}>
                  Write a review
                </button>
                {renderReviews()}
              </div>
            )}
          </div>
        </section>
      ) : (
        <section className={styles.pageContainer}></section>
      )}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}
