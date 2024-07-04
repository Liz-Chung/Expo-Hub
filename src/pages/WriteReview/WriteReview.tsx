import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { collection, addDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../../config/firebaseConfig';
import { userList } from '../../expos/recoil/items';
import { UserStarRating } from '../../components/Utill/StarRating';
import LoginModal from '../../modals/loginModal';
import SubmitModal from '../../modals/reviewSubmit';
import styles from './WriteReivew.module.css';

const WriteReviewPage = () => {
  const { id: exhibition_id } = useParams<{ id: string }>();
  const users = useRecoilValue(userList);
  const navigate = useNavigate();
  const [reviewText, setReviewText] = useState('');
  const [starRating, setStarRating] = useState<number>(0);
  const [userName, setUserName] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setIsModalOpen(true);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user) {
      setErrorMessage('You need to be logged in to submit a review.');
      return;
    }

    try {
      const newReview = {
        exhibition_id: parseInt(exhibition_id!),
        user_id: user.uid,
        user_name: userName,
        comment: reviewText,
        rating: starRating,
        timestamp: new Date(),
      };
      
      await addDoc(collection(db, "reviews"), newReview);
      setIsSubmitModalOpen(true);
    } catch (error) {
      setErrorMessage('Error submitting the review. Please try again.');
    }
  };

  const handleLogin = () => {
    setIsModalOpen(false);
    navigate('/login');
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleSubmitModalClose = () => {
    setIsSubmitModalOpen(false);
    const newReview = { 
      exhibition_id: parseInt(exhibition_id!), 
      user_id: user.uid, 
      user_name: userName, 
      comment: reviewText, 
      rating: starRating 
    };
    navigate(`/expo/${exhibition_id}?tab=reviews`, { state: { newReview } });
  };

  return (
    <div className='wrapper'>
      <section className={styles.pageContainer}>
        <div className={styles.formContainer}>
          <h1 className={styles.title}>Write a Review</h1>
          <form onSubmit={handleSubmit}>
            <div className={styles.nickContainer}>
              <label className={styles.nicknamelabel}>Nickname:</label>            
              <textarea
                className={styles.nicknameArea}
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>
            <div className={styles.ratingContainer}>
              <label className={styles.ratingLabel}>Rating:</label>
              <div className={styles.starRating}>
                <UserStarRating
                  rating={starRating}
                  onRate={setStarRating}
                />
              </div>
            </div>
            <label className={styles.label}>Comment:</label>
            <textarea
              className={styles.textArea}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              required
            />
            {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
            <button type="submit" className="btn-main">Submit Review</button>
          </form>
        </div>
      </section>
      <LoginModal
        isOpen={isModalOpen}
        onClose={handleClose}
        onLogin={handleLogin}
      />
      <SubmitModal
        isOpen={isSubmitModalOpen}
        onClose={handleSubmitModalClose}
      />
    </div>
  );
};

export default WriteReviewPage;
