import { useRecoilValue } from 'recoil';
import { averageRatingData, individualRatingData } from '../../expos/recoil/items';
import styles from './StarRating.module.css'

interface StarRateProps {
  rate: number;
}

const StarRate: React.FC<StarRateProps> = ({ rate }) => {
  return (
    <div className={styles.starRating}>
      {[...Array(5)].map((_, idx) => {
        const percentage = Math.min(Math.max(rate - idx, 0), 1) * 100;
        return (
          <div key={idx} className={styles.star}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className={styles.starBase}
            >
              <defs>
                <clipPath id={`starClip-${idx}`}>
                  <rect x="0" y="0" width={`${percentage}%`} height="100%" />
                </clipPath>
              </defs>
              <polygon
                points="12,1 15,9 24,9 17,14 19,22 12,17 5,22 7,14 0,9 9,9"
                className={styles.starBackground}
              />
              <polygon
                points="12,1 15,9 24,9 17,14 19,22 12,17 5,22 7,14 0,9 9,9"
                className={styles.starForeground}
                style={{ clipPath: `url(#starClip-${idx})` }}
              />
            </svg>
          </div>
        );
      })}
    </div>
  );
};

const StarRate2: React.FC<StarRateProps> = ({ rate }) => {
  console.log("StarRate2 rate:", rate); 
  return (
    <div className={styles.starRating}>
      {[...Array(5)].map((_, idx) => {
        if (rate >= idx + 1) {
          return (
            <span key={idx} className={styles.starFilled}>★</span>
          );
        } else {
          return (
            <span key={idx} className={styles.starEmpty}>★</span>
          );
        }
      })}
    </div>
  );
};

interface AverageStarRatingProps {
  exhibitionId: number;
}

const AverageStarRating: React.FC<AverageStarRatingProps> = ({ exhibitionId }) => {
  const averageRatings = useRecoilValue(averageRatingData);
  const ratingData = averageRatings[exhibitionId];

  if (!ratingData) {
    return <p>No ratings available</p>;
  }

  return (
    <div className={styles.ratingContainer}>
      <StarRate rate={ratingData.averageRating} />
      <div>{ratingData.averageRating.toFixed(1)} / {ratingData.count} ratings</div>
    </div>
  );
};

interface IndividualStarRatingProps {
  exhibitionId: number;
  userId: string;
  rating?: number;
}

const IndividualStarRating: React.FC<IndividualStarRatingProps> = ({ exhibitionId, userId, rating }) => {
  const individualRatings = useRecoilValue(individualRatingData);
  const userReview = individualRatings[exhibitionId]?.[userId];

  const userRating = rating ?? userReview?.rating;

  if (!userRating) {
    return <p>No rating available for this user</p>;
  }

  return (
    <div className={styles.ratingContainer2}>
      <StarRate2 rate={userRating} />
    </div>
  );
};


interface UserStarRatingProps {
  rating: number;
  onRate: (rating: number) => void;
}

const UserStarRating: React.FC<UserStarRatingProps> = ({ rating, onRate }) => {
  const handleRatingChange = (newRating: number) => {
    onRate(newRating);
  };

  return (
    <div className={styles.starRating}>
      {[...Array(5)].map((_, idx) => (
        <span
          key={idx}
          className={idx < rating ? styles.starFilled : styles.starEmpty}
          onClick={() => handleRatingChange(idx + 1)}
          style={{ cursor: 'pointer' }}
        >
          ★
        </span>
      ))}
    </div>
  );
};
export { StarRate, StarRate2, AverageStarRating, IndividualStarRating, UserStarRating };