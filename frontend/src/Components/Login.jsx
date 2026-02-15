import '../css/Login.css'
function Login() {
    return (
        <>
            <div className="popup-container">
                <div className="popup-box">
                    <h2 className='pop-head'>Account</h2>
                    <button className='pop-log'>Login/Sign up</button>
                    {/* <div className='pop-buttons'>
                        <button className='pop-ord'><img src="/nav/cart.png" alt="" />Orders</button>
                        <button className='pop-pro'><img src="/nav/profile.png" alt="" />Profile</button>
                    </div> */}
                </div>
            </div>
        </>
    )
}
export default Login