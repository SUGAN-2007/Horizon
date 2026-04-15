import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Login from './Login';
import Addtocart from './CartSidebar';
import Search from './Search';
import OrderTracker from './OrderTracker';
import Notifications from './Notifications';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import '../css/Nav.css';

function Nav({ products }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [opencart, setOpencart] = useState(false);
    const [srch, setSrch] = useState(false);
    const [showTracker, setShowTracker] = useState(false);
    const [showNotif, setShowNotif] = useState(false);
    const { cart } = useCart();
    const { user, showLogin, setShowLogin, isAdmin } = useUser();

    // Scroll and Visibility States
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    // Hide Nav whenever an overlay is open
    useEffect(() => {
        if (opencart || srch || showTracker) {
            setIsVisible(false);
        } else {
            setIsVisible(true);
        }
    }, [opencart, srch, showTracker]);

    useEffect(() => {
        const handleScroll = () => {
            if (opencart || srch || showTracker) return;
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false); // Hide on scroll down
            } else {
                setIsVisible(true); // Show on scroll up
            }
            setLastScrollY(currentScrollY);
        };

        const handleMouseMove = (e) => {
            if (opencart || srch || showTracker) return;
            if (e.clientY < 50) setIsVisible(true);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [lastScrollY]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setSrch(false);
                setShowLogin(false);
                setOpencart(false);
                setShowTracker(false);
                setShowNotif(false);
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
        setShowNotif(false);
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
            <nav className={`nav ${!isVisible ? 'nav-hidden' : ''} ${lastScrollY > 50 ? 'nav-scrolled' : ''}`}>
                <div className='nav-head'>
                    <Link to="/" className="nav-header">Horizon</Link>
                    <Link to="/Shop" className="nav-shop">Shop</Link>
                    <Link to="/Contact" className="nav-contact">Contact</Link>
                    {isAdmin && <Link to="/Admin" className="nav-admin">Admin</Link>}
                </div>
                <div className='nav-img'>
                    <a title="Notifications" onClick={() => {
                        setShowNotif(true);
                        setSrch(false);
                        setOpencart(false);
                        setShowTracker(false);
                    }}>
                        <div className='notif-icon-wrapper' style={{ position: 'relative' }}>
                            <svg className="nav-icon-svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#757575" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                        </div>
                    </a>
                    <a title="Track Order" onClick={() => {
                        if (!user) { setShowLogin(true); return; }
                        setShowTracker(true);
                        setSrch(false);
                        setOpencart(false);
                    }}>
                        <svg className="nav-icon-svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#757575" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                    </a>
                    <a onClick={() => {
                        setSrch(true);
                        setShowLogin(false);
                        setShowTracker(false);
                    }}>
                        <svg className="nav-icon-svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#757575" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </a>
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
                            <svg className="nav-icon-svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#757575" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                            {cart.length > 0 && <span className='cart-count'>{cart.length}</span>}
                        </div>
                    </a>
                    <a onClick={handleProfileClick}>
                        <svg className="nav-icon-svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#757575" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    </a>
                </div>
            </nav>
            {showLogin && <Login />}
            {opencart && <Addtocart opencart={opencart} setOpencart={setOpencart} />}
            {srch && <Search setSrch={setSrch} products={products} />}
            {showTracker && <OrderTracker isOpen={showTracker} onClose={() => setShowTracker(false)} />}
            {showNotif && <Notifications setOpen={setShowNotif} />}
        </>
    );
}
export default Nav;