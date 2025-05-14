"use client"

import React, { createContext, useEffect, useState } from 'react';

export const PlaceOrderContext = createContext({})

const PlaceOrderContextProvider = ({ children }) => {

    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        const orderDetails = JSON.parse(localStorage.getItem("order"))

        setOrder(orderDetails)
        setLoading(false)
    }, [])

    const placeOrder = (orderDetails) => {
        localStorage.setItem("order", JSON.stringify(orderDetails))
        setOrder(orderDetails)
    }


    const removeOrder = () => {
        localStorage.removeItem("order")
        setOrder(null)
    }

    const value = {
        placeOrder,
        order,
        setOrder,
        removeOrder,
        loading
    }

    return (
        <PlaceOrderContext.Provider value={value}>
            {children}
        </PlaceOrderContext.Provider>
    );
};

export default PlaceOrderContextProvider;