import Nav from "../Components/Nav";
import ProductGrid from "../Components/ProductGrid";
import Footer from "../Components/Footer";

function Shop({ products }) {
    return (
        <>
            <Nav products={products} />
            <ProductGrid num={60} products={products} />
            <Footer />
        </>
    );
}

export default Shop;