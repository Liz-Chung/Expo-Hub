import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

export default function NotFound() {

  return (
    <div className='wrapper'>
      <section className={styles.pageContainer}>
        <div className={styles.textBox}>
          <h1 className={styles.title}>404</h1>
          <p className={styles.text}>Page not found</p>
          <Link to="/">
            <button className="btn-main">Back to Home</button>
          </Link>
        </div>
      </section>
    </div>
  );
}
