import React from 'react';
import useProducts from '../../hooks/useProducts';

const Inventory = () => {
    const [products] = useProducts();
    const handleAddProduct = () => {
        fetch('https://thawing-depths-48281.herokuapp.com/addProduct', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(products)
        })
        
    }
    return (
        <div>
            <form action="">
                <p><span>Name: </span><input type="text" /></p>
                <p><span>Price: </span><input type="text" /></p>
                <p><span>Quantity: </span><input type="text" /></p>
                <p><span>Product Image: </span><input type="file" /></p>
                <button onClick={handleAddProduct}>Add Product</button>
            </form>
        </div>
    );
};

export default Inventory;