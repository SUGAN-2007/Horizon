import { Link } from 'react-router-dom'
import '../css/Notfound.css'
function Notfound() {
    return (
        <div className="notfound">
            <div className='not'>
                <h1>The page is not found</h1>
                <Link to={'/Shop'}><button>Continue shopping</button></Link>
            </div>
        </div>
    )
}
export default Notfound