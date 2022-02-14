import React from 'react';
import { useForm } from 'react-hook-form';
import { useContext } from 'react/cjs/react.development';
import { userContext } from '../../App';
import { getStoredCart } from '../../utilities/fakedb';

import './shipment.css';

const Shipment = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [loggedInUser, setLoggedInUser] = useContext(userContext);
    
    const onSubmit = data => {
        const savedCart = getStoredCart();
        const productDetails = {...loggedInUser, products: savedCart, shipping: data, orderTime: new Date()}
        fetch('https://thawing-depths-48281.herokuapp.com/addOrder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productDetails)
        })
        .then(res => res.json())
        .then(data => {
            if(data){
                alert('order placed successfully')
            }
        })
    };
    console.log(watch("example"));

    return (
        
        <form className="ship-form" onSubmit={handleSubmit(onSubmit)}>
            
            <input defaultValue={loggedInUser.name} {...register("name", { required: true })} placeholder="Enter Your Name"/>
            {errors.name && <span className="error">Name is required</span>}

            <input defaultValue={loggedInUser.email} {...register("email", { required: true })} placeholder="Enter Your Email"/>
            {errors.email && <span className="error">Email is required</span>}

            <input {...register("address", { required: true })} placeholder="Enter Your Address"/>
            {errors.address && <span className="error">Address is required</span>}

            <input {...register("phone", { required: true })} placeholder="Enter Your Phone Number"/>
            {errors.phone && <span className="error">Phone Number is required</span>}
            
            <input type="submit" />

        </form>
  );
};

export default Shipment;
