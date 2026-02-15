import { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import Login from './Login';
import Addtocart from './Addtocart';
import Search from './Search';
import '../css/Nav.css';
function Nav({ cart, setCart, products }) {
    const [pro, setPro] = useState(false);
    const [opencart, setOpencart] = useState(false);
    const [srch, setSrch] = useState(false)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setSrch(false);
                setPro(false);
                setOpencart(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);
    return (
        <>
            <nav className="nav">
                <div className='nav-head'>
                    <Link to="/" className="nav-header">Horizon</Link>
                    <Link to="/Shop" className="nav-shop">Shop</Link>
                    <Link to="/Contact" className="nav-contact">Contact</Link>
                </div>
                <div className='nav-img'>
                    <a onClick={() => {
                        setSrch(true);
                        setPro(false)
                    }}><img src="/nav/search.png" alt="" /></a>
                    <a onClick={() => {
                        setOpencart(prev => !prev);
                        setPro(false);
                        setSrch(false);
                    }}>
                        <img className='nav-cart' src="/nav/cart.png" alt="Cart" /></a>
                    <a onClick={() => {
                        setPro(prev => !prev)
                        setSrch(false);
                    }}>
                        <img className='nav-pro' src="/nav/profile.png" alt="Profile" /></a>
                </div>
            </nav>
            {pro && <Login />}
            {opencart && <Addtocart opencart={opencart} setOpencart={setOpencart} cart={cart} setCart={setCart} />}
            {srch && <Search setSrch={setSrch} products={products} />}

        </>
    );
}
export default Nav;