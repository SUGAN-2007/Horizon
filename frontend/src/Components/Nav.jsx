import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Login from './Login';
import Addtocart from './CartSidebar';
import Search from './Search';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import '../css/Nav.css';

function Nav({ products }) {
    const navigate = useNavigate();
    const [opencart, setOpencart] = useState(false);
    const [srch, setSrch] = useState(false)
    const { cart } = useCart();
    const { user, showLogin, setShowLogin } = useUser();

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setSrch(false);
                setShowLogin(false);
                setOpencart(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [setShowLogin]);

    const handleProfileClick = () => {
        if (!user) {
            setShowLogin(true);
        } else {
            navigate('/Profile');
            setShowLogin(false);
            setSrch(false);
            setOpencart(false);
        }
    };

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
                        setShowLogin(false)
                    }}><img src="/nav/search.png" alt="" /></a>
                    <a onClick={() => {
                        if (!user) {
                            setShowLogin(true);
                            setSrch(false);
                            setOpencart(false);
                            return;
                        }
                        setOpencart(prev => !prev);
                        setShowLogin(false);
                        setSrch(false);
                    }}>
                        <div className='cart-icon-wrapper' style={{ position: 'relative' }}>
                            <img className='nav-cart' src="/nav/cart.png" alt="Cart" />
                            {cart.length > 0 && <span className='cart-count'>{cart.length}</span>}
                        </div>
                    </a>
                    <a onClick={handleProfileClick}>
                        <img className='nav-pro' src="/nav/profile.png" alt="Profile" /></a>
                </div>
            </nav>
            {showLogin && <Login />}
            {opencart && <Addtocart opencart={opencart} setOpencart={setOpencart} />}
            {srch && <Search setSrch={setSrch} products={products} />}
        </>
    );
}
export default Nav;