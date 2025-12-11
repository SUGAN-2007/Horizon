import '../css/toast.css'
function Toast({message}) {
    return (

        <div className="toast-fixed">
            <span className="toast-icon">✔</span>
            <p className="toast-text">{message}</p>
        </div>

    )
}
export default Toast