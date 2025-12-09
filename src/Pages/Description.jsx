import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Nav from "../Components/Nav";
function Description() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        fetch(`https://api.escuelajs.co/api/v1/products/${id}`)
            .then(res => res.json())
            .then(data => setProduct(data));
    }, [id]);

    if (!product) return <p>Loading...</p>;

    return (
        <>
            <Nav />
            <h1>{product.title}</h1>
            <p>{product.description}</p>
            <img src={product.images[0]} alt={product.title} />
            <p>${product.price}</p>
        </>
    );
}

export default Description;
