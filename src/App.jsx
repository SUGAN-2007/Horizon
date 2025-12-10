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
    useEffect(() => {
        // const fetchProducts = async () => {
        //     try {
        //         const res = await fetch(
        //             "https://api.escuelajs.co/api/v1/categories/1/products"
        //         );
        //         const data = await res.json();
        //         setProducts(data);
        //     } catch (error) {
        //         console.error("Error fetching products:", error);
        //     }
        // };
        // fetchProducts();
        fetch('https://fakestoreapi.com/products')
            .then(res => res.json())
            .then(data => setProducts(data))
    }, []);
    return (
        <Routes>
            <Route path="/" element={<Home products={products} />} />
            <Route path="/Shop" element={<Shop products={products} />} />
            <Route path="/Contact" element={<Contact />} />
            {/* <Route path="/product/:id" element={<Description />} /> */}
            <Route path="*" element={<Notfound/>}/>
        </Routes>
    );
}

export default App;
