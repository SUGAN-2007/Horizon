import ProductGrid from './ProductGrid';
import '../css/ProductGrid.css'

function Popular({ products }) {
    return (
        <>
            <p className="fea-pro">Featured products</p>
            <ProductGrid num={10} products={products.filter((product) => product.category === 'feature')} />
        </>
    );
}

export default Popular;