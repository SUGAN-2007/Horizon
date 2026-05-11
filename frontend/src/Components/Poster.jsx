import { useNavigate } from 'react-router-dom';
import '../css/Poster.css'

function Poster() {
    const navigate = useNavigate();
    return (
        <div className="poster-container">
            <img className="poster" src="/poster/poster.jpg" alt="Poster" />
            <div className="poster-content">
                <h1 className='pos-head'>Redefine Your Style. <br />Own the <span>Horizon</span>.</h1>
                <p className='pos-des'>Horizon is a forward-driven clothing brand built for people who don’t settle. Clean, modern, and trend-aware pieces that feel fresh today.</p>
            </div>
        </div>
    )
}
export default Poster;