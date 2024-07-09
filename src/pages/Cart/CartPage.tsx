import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Exhibitions } from '../../expos/recoil/items';
import styles from './CartPage.module.css';

interface CartProps {
  cart: Exhibitions[];
  setCart: React.Dispatch<React.SetStateAction<Exhibitions[]>>;
}

export default function CartPage(props: CartProps): React.ReactElement {
  let totalPrice = 0;

  const handleCount = (expo: Exhibitions, type: string) => {
    type === 'minus' ? (expo.quantity -= 1) : (expo.quantity += 1);

    const found = expo;
    const idx = props.cart.indexOf(found);
    const newCartItem = {
      ...expo,
      quantity: expo.quantity,
    };
    props.setCart([...props.cart.slice(0, idx), newCartItem, ...props.cart.slice(idx + 1)]);

    if (expo.quantity === 0) {
      props.setCart([...props.cart.slice(0, idx), ...props.cart.slice(idx + 1)]);
    }
  };

  useEffect(() => {
    localStorage.setItem('expos', JSON.stringify(props.cart));
  }, [props.cart]);

  props.cart.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });

  const formatter = new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return (
    <>
      <div className='wrapper'>
        <section className={styles.pageContainer}>
          <div className={styles.cartContainer}>
            {props.cart.length > 0 ? (
              <>
                {props.cart.map((expo: Exhibitions) => {
                  return (
                    <div className={styles.productContainer} key={expo.exhibition_id}>
                      <div className={styles.productBox}>
                        <Link to={`/expo/${expo.exhibition_id}`}>
                          <figure className={styles.imgContainer}>
                            <img className={styles.img} src={expo.image_url} alt="itemImg" />
                          </figure>
                        </Link>
                        <div className={styles.cardBox}>
                          <h2>
                            <Link to={`/expo/${expo.exhibition_id}`} className={styles.expoName}>
                              {expo.name}
                            </Link>
                          </h2>
                          <p className={styles.price}>
                            <strong>Price: </strong> {formatter.format(expo.price * expo.quantity)}
                          </p>
                          <p className={styles.visitDate}>
                            <strong>Visit Date:</strong> {expo.selectedVisitDate ? new Date(expo.selectedVisitDate).toLocaleDateString() : 'Not selected'}
                          </p>
                          <div className={styles.btnGroup}>
                            <button
                              className={styles.btnMain2}
                              onClick={() => handleCount(expo, 'minus')}
                              style={{
                                borderTopRightRadius: '0',
                                borderBottomRightRadius: '0',
                              }}
                            >
                              -
                            </button>
                            <button className={styles.btnGhost}>
                              {expo.quantity}
                            </button>
                            <button
                              className={styles.btnMain2}
                              onClick={() => handleCount(expo, 'plus')}
                              style={{
                                borderTopLeftRadius: '0',
                                borderBottomLeftRadius: '0',
                              }}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className={styles.priceBox}>
                  <span>Total : {formatter.format(totalPrice)}</span>
                  <button className={styles.btnMain}>
                    Pay Now
                  </button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <h1 className="text-medium-24">Your cart is empty.</h1>
                  <Link to="/">
                    <button className="btn-main" style={{ marginTop: '3.5rem' }}>
                      Start Exploring
                    </button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </>
  );
}