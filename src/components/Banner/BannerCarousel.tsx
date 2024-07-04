import React from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import { Link } from 'react-router-dom';
import styles from './BannerCarousel.module.css';

export default function BannerCarousel(): React.ReactElement {
  return (
    <Carousel
      autoPlay={true}
      infiniteLoop={true}
      useKeyboardArrows={true}
      swipeable={false}
      dynamicHeight={false}
      showStatus={false}
      showThumbs={false}
    >
      <Link to="/" className={styles.carouselContainer}>
        <img src="images/banner1.png" alt="banner1" />
        <div className={styles.overlay}></div>
        <div className={styles.desContainer}>
          <div className={styles.des}>
            {/* <h2 className="title-bold-30">Modern Innovations</h2>
            <p className="text-bold-16 mtb">Incheon Tech Park</p>
            <p className="text-bold-12 mtb">2024.12.01~2024.12.31</p> */}
          </div>
        </div>
      </Link>
      <Link to="/" className={styles.carouselContainer}>
        <img src="images/banner2.png" alt="banner2" />
        <div className={styles.overlay}></div>
        <div className={styles.desContainer}>
          <div className={styles.des}>
            {/* <h2 className="title-bold-30">Innovative Technologies Fair</h2>
            <p className="text-bold-16 mtb">Jeju Art Museum</p>
            <p className="text-bold-12 mtb">2024.12.01~2024.12.31</p> */}
          </div>
        </div>
      </Link>
      <Link to="/" className={styles.carouselContainer}>
        <img src="images/banner3.png" alt="banner3" />
        <div className={styles.overlay}></div>
        <div className={styles.desContainer}>
          <div className={styles.des}>
            {/* <h2 className="title-bold-30">Traditional Korean Art</h2>
            <p className="text-bold-16 mtb">Jeonju Hanok Village</p>
            <p className="text-bold-12 mtb">2024.11.01~2024.11.31</p> */}
          </div>
        </div>
      </Link>
    </Carousel>
    
  );
}
