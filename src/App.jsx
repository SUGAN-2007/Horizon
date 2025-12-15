import { Route, Routes } from "react-router-dom";
import { useState, useEffect } from 'react';
import Home from "./Pages/Home";
import Shop from "./Pages/Shop";
import Notfound from "./Pages/Notfound";
import Description from "./Pages/Description";
import Contact from "./Pages/Contact";
import './css/App.css'

function App() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([])
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(
                    "https://api-com.up.railway.app/api/clothes"
                );
                const data = await res.json();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
        // fetch('https://fakestoreapi.com/products')
        //     .then(res => res.json())
        //     .then(data => setProducts(data))
    }, []);
    return (
        <Routes>
            <Route path="/" element={<Home products={products} cart={cart} setCart={setCart} />} />
            <Route path="/Shop" element={<Shop products={products} cart={cart} setCart={setCart} />} />
            <Route path="/Contact" element={<Contact />} />
            <Route path="/clothes/:id" element={<Description cart={cart} setCart={setCart} />} />
            <Route path="*" element={<Notfound />} />
        </Routes>
    );
}

export default App;
