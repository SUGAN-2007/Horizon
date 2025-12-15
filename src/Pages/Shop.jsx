
import Nav from "../Components/Nav";
import Cart from "../Components/Cart";
import Footer from "../Components/Footer";
function Shop({products,cart,setCart}) {
    return (
        <>
            <Nav cart={cart} setCart={setCart} products={products}/>
            <Cart num={60} products={products} cart={cart} setCart={setCart}/>
            <Footer />
        </>
    );
}
export default Shop;