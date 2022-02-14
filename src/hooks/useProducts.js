import { useEffect } from "react";
import { useState } from "react"

const useProducts = () => {
    const [products, setProducts] = useState([]);
    useEffect(() => {
        fetch('https://thawing-depths-48281.herokuapp.com/products')
            .then(res => res.json())
            .then(data => {
                console.log(data)
                setProducts(data)
            });
    }, []);
    return [products, setProducts];
}

export default useProducts;