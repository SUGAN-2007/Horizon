import { useState } from 'react';
import Nav from "../Components/Nav";
import Cart from "../Components/Cart";
import Footer from "../Components/Footer";
function Shop({products}) {
    const [cart, setCart] = useState([])
    return (
        <>
            <Nav cart={cart} setCart={setCart}/>
            <Cart num={20} products={products} cart={cart} setCart={setCart}/>
            <Footer />
        </>
    );
}
export default Shop;