import Cart from "./Cart";

function Popular({products}) {
    return (
        <>
            <p className="fea-pro">Featured products</p>
            <Cart num={10} products={products} />
        </>
    )
}

export default Popular;