import Cart from './Cart';
import '../css/Cart.css'

function Popular({ products , cart, setCart }) {

    return (
        <>
           <p className="fea-pro">Featured products</p>
            <Cart num={10} products={products.filter((products) => products.category === 'feature')} cart={cart}  setCart={setCart}/>
        </>
    );
}

export default Popular;