import { Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import Home from "./Pages/Home";
import Shop from "./Pages/Shop";
import Notfound from "./Pages/Notfound";
import Description from "./Pages/Description";
import Contact from "./Pages/Contact";
import Profile from "./Pages/Profile";
import { useUser } from "./context/UserContext";
import './css/App.css'

function App() {
    const [products, setProducts] = useState([]);
    const { user, loading, isAdmin, setShowLogin } = useUser();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/products/");
                const data = await res.json();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, []);

    if (loading) return null;

    return (
        <Routes>
            <Route path="/" element={<Home products={products} />} />
            <Route path="/Shop" element={<Shop products={products} />} />
            <Route path="/Contact" element={<Contact />} />
            <Route path="/Profile" element={user ? <Profile products={products} /> : <ProtectedRoute user={user} setShowLogin={setShowLogin} />} />
            <Route path="/clothes/:id" element={<Description products={products} />} />
            {isAdmin && user && <Route path="/Admin" element={<div>Admin Page Template</div>} />}
            <Route path="*" element={<Notfound />} />
        </Routes>
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
