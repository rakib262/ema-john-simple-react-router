import React, { useEffect, useState } from 'react';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import { addToDb } from '../../utilities/fakedb';
import './Shop.css';
import useCart from '../../hooks/useCart';
import { Link } from 'react-router-dom';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useCart(products);
    const [displayProducts, setDisplayProducts] = useState([]);

    useEffect(() => {
        fetch('https://thawing-depths-48281.herokuapp.com/products')
        .then(res => res.json())
        .then(data => {
            console.log(data);
            setProducts(data);
            setDisplayProducts(data);
        })
        
    },[])

    const handleAddToCart = (product) => {
        const newCart = [...cart, product];
        setCart(newCart);
        addToDb(product.key); 
    }


    const handleSearch = event => {
        const searchText = event.target.value;

        const matchedProducts = products.filter(product => product.name.toLowerCase().includes(searchText.toLowerCase()));

        setDisplayProducts(matchedProducts);
    }

    return (
        <>
        <div className="search-container">
            <input
                type="text"
                onChange={handleSearch}
                placeholder="Search Product" />
        </div>

        <div className="shop-container">
            <div className="product-container">
                {
                    products.map(product => <Product
                        key={product.key}
                        product={product}
                        handleAddToCart={handleAddToCart}
                    >
                    </Product>)
                }
            </div>
            <div className="cart-container">
                <Cart cart={cart}>
                    <Link to="/review">
                        <button className="btn-regular">Review Order</button>
                    </Link>
                </Cart>
            </div>
        </div>

        </>
    );
};

export default Shop;