import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Products from './pages/Products';
import OrderHistory from './pages/OrderHistory';
import PlaceOrder from './pages/PlaceOrder';
import VendorDashboard from './pages/VendorDashboard';
import ProductDetail from "./pages/ProductDetail";
import API from './api';

const App = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const res = await API.get('/auth/me');
      setUser(res.data);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => { fetchUser(); }, []);

  const handleLogout = async () => {
    await API.post('/auth/logout');
    setUser(null);
    navigate('/');
  };

  return (
    <>
      <NavBar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home user={user} />} />
         <Route path="/products" element={<Products />} />
         <Route path="/orders" element={<OrderHistory />} />
         <Route path="/place-order/:productId" element={<PlaceOrder />} />
          <Route path="/product/:productId" element={<ProductDetail />} />  
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
         <Route path="/vendor" element={
    // simple guard
    user?.role === 'vendor' ? <VendorDashboard /> : <Home user={user} />
  } />
      </Routes>
    </>
  );
};

export default App;
