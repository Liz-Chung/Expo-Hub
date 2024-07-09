import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../../config/firebaseConfig';
import LoginModal from '../../modals/loginModal';
import { IndividualStarRating } from '../../components/Utill/StarRating';
import styles from './MyReview.module.css';

interface Review {
  review_id: string;
  exhibition_id: number;
  user_id: string;
  comment: string;
  rating: number;
  exhibition_name: string;
  exhibition_image: string;
}

const MyReviewPage = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [user, setUser] = useState<any>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => !!localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchReviews(user.uid, isMounted);
      } else {
        setErrorMessage('You need to be logged in to view your reviews.');
        setShowModal(true);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

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

  const fetchReviews = async (userId: string, isMounted: boolean) => {
    console.log(`Fetching reviews for user ID: ${userId}`);
    try {
      const q = query(collection(db, "reviews"), where("user_id", "==", userId));
      const querySnapshot = await getDocs(q);
      console.log('Query Snapshot:', querySnapshot);
      const reviewsData = await Promise.all(querySnapshot.docs.map(async (doc) => {
        const data = doc.data() as Review;
        console.log('Review data from Firebase:', data);

        const exhibitionResponse = await fetch(`/api/exhibitions/${data.exhibition_id}`, {
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        if (!exhibitionResponse.ok) {
          throw new Error('Failed to fetch exhibition data');
        }
        const exhibitionData = await exhibitionResponse.json();
        console.log('Exhibition data from API:', exhibitionData);

        return {
          ...data,
          review_id: doc.id,
          exhibition_name: exhibitionData.name,
          exhibition_image: exhibitionData.image_url,
        } as Review;
      }));
      if (isMounted) {
        setReviews(reviewsData);
        console.log('Reviews data set:', reviewsData);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      if (isMounted) {
        setErrorMessage('Error fetching your reviews. Please try again.');
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

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
          <div className={styles.reviewlistContainer}>
            {loading ? (
              <div>Loading...</div>
            ) : (
              <>
                {reviews.length > 0 ? (
                  reviews.map((review) => {
                    return (
                      <div className={styles.productContainer} key={review.review_id}>
                        <Link to={`/Expo/${review.exhibition_id}`} className={styles.link}>
                          <div className={styles.productBox}>
                            <div className={styles.exhibitionInfo}>
                              <img className={styles.exhibitionImage} src={review.exhibition_image} alt={review.exhibition_name} />
                              <div className={styles.exhibitionName}>
                                {review.exhibition_name}
                              </div>
                            </div>
                            <div className={styles.reviewContainer}>
                              <div>
                                <IndividualStarRating 
                                  exhibitionId={review.exhibition_id}
                                  userId={review.user_id.toString() || ''}
                                />
                              </div>
                              <div className={styles.reviewComment}>
                                "{review.comment}"
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    );
                  })
                ) : (
                  <div>
                    <h1 className="text-medium-24">Your review list is empty.</h1>
                    <Link to="/">
                      <button className="btn-main" style={{ marginTop: '3.5rem' }}>
                        Start Exploring
                      </button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default MyReviewPage;
