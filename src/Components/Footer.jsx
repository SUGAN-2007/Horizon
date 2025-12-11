import { useState } from 'react';
import '../css/Footer.css';
import Toast from './toast';
function Footer() {
    const [showToast, setShowToast] = useState(false);
    return (
        <>
            <hr />
            <div className="foot">
                <div className="foot-left">
                    <h2> Join the club</h2>
                    <p>Get the deals and early access</p>
                </div>
                <div className='foot-right'>
                    <input type="email" onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            setShowToast(true);
                            setTimeout(() => setShowToast(false), 5000);
                        }
                    }} placeholder="Email address" />
                </div>
            </div>
            <hr />
            <footer>
                <div className='copy' id='#foot'>
                    <p>@ 2025 Horizon</p>
                </div>
                <div className='socials'>
                    <img src="/footer/face.png" alt="" />
                    <img src="/footer/insta.png" alt="" />
                    <img src="/footer/x.png" alt="" />
                    <img src="/footer/mes.png" alt="" />
                </div>
            </footer>
            {showToast && <Toast message={"Joined Successfully."} />}

        </>
    );
}
export default Footer;