import { useState } from "react";
import Nav from "../Components/Nav";
import ProductGrid from "../Components/ProductGrid";
import Footer from "../Components/Footer";
import "../css/Shop.css";

function Shop({ products }) {
    const [category, setCategory] = useState("All");

    const filteredProducts = category === "All"
        ? products
        : products.filter(p => p.category?.toLowerCase() === category.toLowerCase());

    const categories = ["All", "Mens", "Womens"];

    return (
        <div className="shop-page">
            <Nav products={products} />

            <div className="shop-header">
                <h1>Browse Collection</h1>
                <div className="category-filters">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`filter-btn ${category === cat ? "active" : ""}`}
                            onClick={() => setCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <ProductGrid num={60} products={filteredProducts} />

            {filteredProducts.length === 0 && (
                <div className="empty-shop">
                    <p>No products found in this category.</p>
                </div>
            )}

            <Footer />
        </div>
    );
}

export default Shop;