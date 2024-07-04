import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { authState } from '../../expos/recoil/items';
import styles from './LoginSuccessPage.module.css';

const LoginSuccess = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);
  const setAuth = useSetRecoilState(authState);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuth({ token });
    }

    const interval = setInterval(() => {
      setCountdown(prevCountdown => prevCountdown - 1);
    }, 1000);

    const timer = setTimeout(() => {
      const lastVisitedPage = localStorage.getItem('lastVisitedPage') || '/';
      navigate(lastVisitedPage);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [navigate, setAuth]);

  return (
    <div className='wrapper'>
      <section className={styles.pageContainer}>
        <div className={styles.textBox}>
          <h1 className={styles.title}>Login Successful!</h1>
          <p className={styles.text}>You will be redirected back in <span className={styles.countDownText}>{countdown}</span> seconds...</p>
          <Link to="/">
            <button className="btn-main">Back to Home</button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LoginSuccess;

