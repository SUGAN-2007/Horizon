import Cart from "./Cart";

function Popular({products,cart,setCart}) {
    return (
        <>
            <p className="fea-pro">Featured products</p>
            <Cart num={10} products={products} cart={cart}  setCart={setCart}/>
        </>
    )
}

export default Popular;