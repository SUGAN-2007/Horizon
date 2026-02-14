import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/search.css";

function Search({ setSrch, products = [] }) {
    const [query, setQuery] = useState("");
    const navigate = useNavigate()

    const normalizedQuery = query.toLowerCase().trim();
    const results = useMemo(() => {
        if (!normalizedQuery) return [];
        return products.filter((item) => {
            const words = item.title.toLowerCase().split(/\s+/);
            return words.some(word => word.startsWith(normalizedQuery));
        });
    }, [products, normalizedQuery]);


    return (
        <>
            <div className="search-overlay" onClick={() => setSrch(false)} />

            <div className="search-box">
                <div className="search-head">
                    <input
                        type="text"
                        placeholder="Search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        autoFocus
                    />
                    <button className="close-btn" onClick={() => setSrch(false)}>×</button>
                </div>

                <div className="results">
                    {query === "" ? (
                        <p className="placeholder">Start typing to search…</p>
                    ) : results.length === 0 ? (
                        <p className="not-found">No items found</p>
                    ) : (
                        results.map((item) => (
                            <div className="search-item" key={item.id}>
                                <img onClick={() => {
                                    navigate(`/clothes/${item.id}`);
                                    setSrch(false);
                                }} src={item.image} alt={item.title} />
                                <div>
                                    <p onClick={() => {
                                        navigate(`/clothes/${item.id}`);
                                        setSrch(false);
                                    }} className="s-title">{item.title}</p>
                                    <p className="s-price">{item.price}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}

export default Search;
