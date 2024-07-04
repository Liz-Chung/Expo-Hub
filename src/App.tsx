import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import './App.css';
import ScrollToTop from './components/Utill/ScrollToTop';
import { RecoilRoot, useRecoilState } from 'recoil';
import { loadingState } from './expos/recoil/loadingState';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { Exhibitions } from './expos/recoil/items';
import MainPage from './pages/Main/MainPage';
import ExpoDetailPage from './pages/ExpoDetail/ExpoDetailPage';
import CartPage from './pages/Cart/CartPage';
import WishlistsPage from './pages/Wishlists/WishlistsPage';
import NotFound from './pages/NotFound/NotFound';
import LoginPage from './pages/Login/LoginPage';
import Redirection from './pages/Redirection/Redirection';
import LoginSuccess from './pages/LoginSuccess/LoginSuccessPage';
import SignupSuccess from './pages/SignupSuccess/SignupSuccess';
import WriteReview from './pages/WriteReview/WriteReview';
import MyReviewPage from './pages/MyReview/MyReview';
import LoadingPage from './pages/Loading/Loading';

function App() {
  const expos = localStorage.getItem('expos');
  const [cart, setCart] = useState<Exhibitions[]>(expos ? JSON.parse(expos) : []);
  const savedFavorites = localStorage.getItem('favorites');
  const [favorites, setFavorites] = useState<Exhibitions[]>(savedFavorites ? JSON.parse(savedFavorites) : []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  return (
    <RecoilRoot>
      <BrowserRouter>
        <ScrollToTop />
        <Header cart={cart} favorites={favorites} setFavorites={setFavorites} />
        <Layout>
          <Suspense fallback={<LoadingPage />}>
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route
                path="/expo/:id"
                element={<ExpoDetailPage cart={cart} setCart={setCart} favorites={favorites} setFavorites={setFavorites} />}
              />
              <Route path="/cart" element={<CartPage cart={cart} setCart={setCart} />} />
              <Route path="/wishlists" element={<WishlistsPage favorites={favorites} setFavorites={setFavorites} />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path='/kakaologin' element={<Redirection />} />
              <Route path="/loginSuccess" element={<LoginSuccess />} />
              <Route path="/signupSuccess" element={<SignupSuccess />} />
              <Route path="/writeReview/:id" element={<WriteReview />} />
              <Route path="/myReviews" element={<MyReviewPage />} />
              <Route path="/*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Layout>
        <Footer />
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;