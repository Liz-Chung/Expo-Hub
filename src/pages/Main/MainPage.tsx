import React from 'react';
import BannerCarousel from '../../components/Banner/BannerCarousel';
import Expo from '../../components/Expo/Expo';
import styles from './MainPage.module.css';

export default function MainPage() {
  return (
    <div className="wrapper">
      <BannerCarousel />
      <section className={styles.productsContainer}>
        <Expo />
      </section>
    </div>
  );
}
