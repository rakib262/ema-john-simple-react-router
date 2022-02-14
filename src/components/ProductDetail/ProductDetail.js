import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';

const ProductDetail = () => {
    const {productkey} = useParams();
    const [product, setProduct] = useState({})
    console.log(product)
    useEffect(() => {
        const url = `https://thawing-depths-48281.herokuapp.com/product/${productkey}`
        fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            setProduct(data)
            
        })
    },[productkey])
    return (
        <div>
            <h1>This is product {productkey}</h1>
            <h1>{product.name}</h1>
        </div>
    );
};

export default ProductDetail;