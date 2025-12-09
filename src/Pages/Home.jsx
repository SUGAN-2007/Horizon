import Footer from "../Components/Footer";
import Nav from "../Components/Nav";
import Popular from "../Components/Popular";
import Poster from "../Components/Poster";
function Home({products}) {
  return (
    <div>
      <Nav />
      <Poster />
      <Popular products={products}/>
      <Footer />
    </div>
  );
}

export default Home;