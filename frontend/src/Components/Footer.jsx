import { useState } from 'react';
import '../css/Footer.css';
import Toast from './toast';
function Footer() {
    const [foot, setFoot] = useState("");
    const [showToast, setShowToast] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        formData.append("access_key", "eb176316-471d-4570-9bfe-29e31185c371");
        formData.append("subject", "New Newsletter Subscription");
        formData.append("from_name", "E-com Newsletter");

        try {
            const res = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (data.success) {
                setShowToast(true);
                setFoot("");
                setTimeout(() => setShowToast(false), 5000);
            } else {
                console.error("Web3Forms Error:", data);
            }
        } catch (error) {
            console.error("Submission Error:", error);
        }
    };

    return (
        <>
            <hr />
            <div className="foot">
                <div className="foot-left">
                    <h2> Join the club</h2>
                    <p>Get the deals and early access</p>
                </div>
                <div className='foot-right'>
                    <form onSubmit={handleSubmit} className="foot-form">
                        <div className="input-wrapper">
                            <input
                                type="email"
                                name="email"
                                value={foot}
                                onChange={(e) => setFoot(e.target.value)}
                                placeholder="Email address"
                                required
                            />
                            <button type="submit" className="foot-btn">
                                &rarr;
                            </button>
                        </div>
                    </form>
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