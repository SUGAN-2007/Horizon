import { useState, useEffect } from "react";
import "../css/Search.css";

function Search({ setSrch}) {
    const [query, setQuery] = useState("");
    const [products, setProducts] = useState([]);

    // Fetch ONCE
    useEffect(() => {
        fetch("https://fakestoreapi.com/products")
            .then((res) => res.json())
            .then((data) => setProducts(data));
    }, []);

    // Filter products by title
    const results = products.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
    );

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
                                <img src={item.image} alt={item.title} />
                                <div>
                                    <p className="s-title">{item.title}</p>
                                    <p className="s-price">${item.price}</p>
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
