import '../css/Skeleton.css';

const Skeleton = () => {
    return (
        <div className="skeleton-page">
            <div className="skeleton-nav"></div>
            <div className="skeleton-container">
                <div className="skeleton-hero"></div>
                <div className="skeleton-grid">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="skeleton-card">
                            <div className="skeleton-img"></div>
                            <div className="skeleton-line short"></div>
                            <div className="skeleton-line"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Skeleton;
