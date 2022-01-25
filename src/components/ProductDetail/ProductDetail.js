import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';

const ProductDetail = () => {
    const {productkey} = useParams();
    const [product, setProduct] = useState({})
    console.log(product)
    useEffect(() => {
        const url = `https://raw.githubusercontent.com/ProgrammingHero1/ema-john-simple-resources/master/fakeData/products.JSON/${productkey}`
        fetch(url)
        .then(res => res.json())
        .then(data => setProduct(data))
    },[])
    return (
        <div>
            <h1>This is produck {productkey}</h1>
            <h1>{product.name}</h1>
        </div>
    );
};

export default ProductDetail;