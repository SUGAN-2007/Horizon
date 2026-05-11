import { Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Home from "./Pages/Home";
import Shop from "./Pages/Shop";
import Notfound from "./Pages/Notfound";
import Description from "./Pages/Description";
import Contact from "./Pages/Contact";
import Profile from "./Pages/Profile";
import Checkout from "./Pages/Checkout";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import ResetPassword from "./Pages/ResetPassword";
import { useUser } from "./context/UserContext.jsx";
import ScrollToTop from "./Components/ScrollToTop";
import Skeleton from "./Components/Skeleton";
import './css/App.css'

function App() {
    const [products, setProducts] = useState([]);
    const { user, loading, isAdmin, setShowLogin } = useUser();

    useEffect(() => {
        const fetchProducts = async () => {
            const { data } = await supabase.from('products').select('*');
            if (data) setProducts(data);
        };
        fetchProducts();
    }, []);

    if (loading) return <Skeleton />;

    return (
        <>
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<Home products={products} />} />
                <Route path="/Shop" element={<Shop products={products} />} />
                <Route path="/Contact" element={<Contact />} />
                <Route path="/Profile" element={user ? <Profile products={products} /> : <ProtectedRoute user={user} setShowLogin={setShowLogin} />} />
                <Route path="/clothes/:id" element={<Description products={products} />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/Admin" element={isAdmin && user ? <AdminDashboard /> : <Navigate to="/" />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="*" element={<Notfound />} />
            </Routes>
        </>
    );
}

const ProtectedRoute = ({ user, setShowLogin }) => {
    useEffect(() => {
        if (!user) {
            setShowLogin(true);
        }
    }, [user, setShowLogin]);
    return <Navigate to="/" />;
};

export default App;
