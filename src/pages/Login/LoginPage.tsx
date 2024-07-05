import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../config/firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const REST_API_KEY = 'e1a40f06e94a1042ec86ee834e50b8a6';
  const REDIRECT_URI = 'https://expo-hub.vercel.app/kakaologin';
  const link = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) {
      const loginWithEmailPassword = async () => {
        try {
          if (isSigningUp) {
            await createUserWithEmailAndPassword(auth, email, password);
            setIsLoading(false);
            navigate('/signupSuccess');
          } else {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const token = await userCredential.user.getIdToken();
            localStorage.setItem('token', token);
            setIsLoading(false);
            navigate('/loginSuccess');
          }
        } catch (error: any) {
          setIsLoading(false);
          if (error.code === 'auth/email-already-in-use') {
            setMessage('This email is already registered. Please log in.');
          } else {
            setMessage(error.message);
          }
        }
      };

      loginWithEmailPassword();
    }
  }, [isLoading, isSigningUp, email, password, navigate]);

  const handleLogin = () => {
    setIsLoading(true);
    setIsSigningUp(false);
  };

  const handleSignup = () => {
    setIsLoading(true);
    setIsSigningUp(true);
  };

  const loginHandler = () => {
    window.location.href = link;
  };

  return (
    <div className={styles.loginContainer}>
      {isLoading ? (
        <div className={styles.textBox}>
          <h1 className={styles.title}>{isSigningUp ? 'Signing up...' : 'Logging in...'}</h1>
        </div>
      ) : (
        <>
          <h2 className={styles.loginTitle}>Welcome to Exhibitions!</h2>
          {message && <p className={styles.errorMessage}>{message}</p>}
          <input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />
          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
          <div className={styles.buttonContainer}>
            <button onClick={handleLogin} className={styles.loginButton}>
              Log in
            </button>
            <button type='button' onClick={loginHandler} className={styles.kakaoLoginButton}>
              Login with Kakao
            </button>
            <button onClick={handleSignup} className={styles.signupButton}>
              Sign up
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default LoginPage;
