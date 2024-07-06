import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Redirection.module.css'

const Redirection = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get('code');

    if (code) {
      axios.post('https://expo-hub.vercel.app/kakaologin', { code })
        .then(response => {
          localStorage.setItem('token', response.data.token);
          navigate('/loginSuccess');
        })
        .catch(error => {
          console.error('Error logging in with Kakao:', error);
        });
    } else {
      console.error('Authorization code not found in URL.');
    }
  }, [navigate]);

  return (
    <div className='wrapper'>
      <section className={styles.pageContainer}>
        <div className={styles.textBox}>
          <h1 className={styles.title}>Logging in...</h1>
        </div>
      </section>
    </div>
  );
};

export default Redirection;
