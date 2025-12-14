import Footer from "../Components/Footer";
import Nav from "../Components/Nav";
import Popular from "../Components/Popular";
import Poster from "../Components/Poster";
function Home({products,cart,setCart}) {
  return (
    <div>
      <Nav cart={cart} setCart={setCart}/>
      <Poster />
      <Popular products={products} cart={cart} setCart={setCart}/>
      <Footer />
    </div>
  );
}

export default Home;