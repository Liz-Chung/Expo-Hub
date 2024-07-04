import React, { useEffect, ReactNode } from 'react';
import { useRecoilState } from 'recoil';
import { authState } from '../../expos/recoil/items';
import { useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [auth, setAuth] = useRecoilState(authState);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuth({ token });
    } else {
      setAuth(null);
    }
  }, [setAuth, navigate]);

  return (
    <div>
      {children}
    </div>
  );
};

export default Layout;