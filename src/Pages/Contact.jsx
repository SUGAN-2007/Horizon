import { useState } from "react";
import Nav from "../Components/Nav";
import Footer from "../Components/Footer";
import "../css/Contact.css";

function Contact() {
    const [toast, setToast] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        formData.append("access_key", "eb176316-471d-4570-9bfe-29e31185c371");

        const res = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();

        if (data.success) {
            setToast(true);
            e.target.reset();

            setTimeout(() => {
                setToast(false);
            }, 2500);
        } else {
            console.error("Error:", data);
        }
    };

    return (
        <>
            <Nav />

            {toast && (
                <div className="toast-bottom">
                    <span className="toast-icon">✔</span>
                    <p className="toast-text">Email sent successfully!</p>
                </div>
            )}

            <div className="contact-container">
                <h1>Contact</h1>
                <p className="contact-subtext">
                    Have a question, comment, or concern? Let us know and we will get in touch with you as soon as possible.
                </p>

                <form className="contact-form" onSubmit={handleSubmit}>
                    <div className="row">
                        <input type="text" name="name" placeholder="Name" required />
                        <input type="email" name="email" placeholder="Email" required />
                    </div>

                    <input type="text" name="phone" placeholder="Phone" required />

                    <textarea name="message" placeholder="Comment" rows="6" required></textarea>

                    <button type="submit" className="submit-btn">Submit</button>
                </form>
            </div>
            <Footer/>
        </>
    );
}

export default Contact;
