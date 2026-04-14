import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Login from './Login';
import Addtocart from './CartSidebar';
import Search from './Search';
import OrderTracker from './OrderTracker';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import '../css/Nav.css';

function Nav({ products }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [opencart, setOpencart] = useState(false);
    const [srch, setSrch] = useState(false);
    const [showTracker, setShowTracker] = useState(false);
    const { cart } = useCart();
    const { user, showLogin, setShowLogin, isAdmin } = useUser();

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setSrch(false);
                setShowLogin(false);
                setOpencart(false);
                setShowTracker(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [setShowLogin]);

    // Close all overlays on route change
    useEffect(() => {
        setSrch(false);
        setShowLogin(false);
        setOpencart(false);
        setShowTracker(false);
    }, [location.pathname]);

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
                    {isAdmin && <Link to="/Admin" className="nav-admin">Admin</Link>}
                </div>
                <div className='nav-img'>
                    <a title="Track Order" onClick={() => {
                        if (!user) { setShowLogin(true); return; }
                        setShowTracker(true);
                        setSrch(false);
                        setOpencart(false);
                    }}>
                        <img className='nav-delivery' src="/nav/delievery.png" alt="Track" />
                    </a>
                    <a onClick={() => {
                        setSrch(true);
                        setShowLogin(false);
                        setShowTracker(false);
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
            {showTracker && <OrderTracker isOpen={showTracker} onClose={() => setShowTracker(false)} />}
        </>
    );
}
export default Nav;