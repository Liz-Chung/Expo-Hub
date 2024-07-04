import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SignupSuccess.module.css';

const SignupSuccess = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prevCountdown => prevCountdown - 1);
    }, 1000);

    const timer = setTimeout(() => {
      navigate('/login');
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div className='wrapper'>
      <section className={styles.pageContainer}>
        <div className={styles.textBox}>
          <h1 className={styles.title}>Signup Successful!</h1>
          <p className={styles.text}>You will be redirected to the login page in <span className={styles.countDownText}>{countdown}</span> seconds...</p>
        </div>
      </section>
    </div>
  );
};

export default SignupSuccess;
