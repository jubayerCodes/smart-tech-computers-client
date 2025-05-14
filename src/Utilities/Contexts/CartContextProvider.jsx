"use client";
import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
export const CartContext = createContext({});

const CartContextProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    const updateCart = () => {
      const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(cartItems);
    };

    updateCart(); // Initial load

    const interval = setInterval(updateCart, 1000); // Poll every second

    return () => clearInterval(interval);
  }, []);

  const subTotal = cart?.reduce(
    (accumulator, cartItem) =>
      accumulator + cartItem?.price * cartItem?.quantity,
    0
  );

  const grandTotal = subTotal - discount;

  const addToCart = (item) => {
    const existingItem = cart.find(
      (cartItem) => cartItem?.productID === item?.productID
    );

    if (existingItem) {
      const newCart = cart?.filter(
        (cartItem) => cartItem?.productID !== item?.productID
      );

      localStorage.setItem("cart", JSON.stringify([...newCart, item]));
      setCart([item, ...newCart]);

      toast?.error("Product already added");
      return;
    }

    localStorage.setItem("cart", JSON.stringify([...cart, item]));
    setCart([item, ...cart]);

    toast?.success("Product added to cart");
  };

  const removeFromCart = (id) => {
    const deletedCart = cart?.filter((item) => item?.productID !== id);

    localStorage.setItem("cart", JSON.stringify(deletedCart));
    setCart(deletedCart);
  };

  const increaseQuantity = (id) => {
    const existingItem = cart.find((cartItem) => cartItem?.productID === id);

    if (existingItem) {
      const index = cart.indexOf(existingItem);
      const newCart = [...cart];

      existingItem.quantity = existingItem?.quantity + 1;

      newCart[index] = existingItem;

      localStorage.setItem("cart", JSON.stringify([...newCart]));
      setCart([...newCart]);
      return;
    }
  };

  const decreaseQuantity = (id) => {
    const existingItem = cart.find((cartItem) => cartItem?.productID === id);

    if (existingItem) {
      const index = cart.indexOf(existingItem);
      const newCart = [...cart];

      if (existingItem.quantity > 1) {
        existingItem.quantity = existingItem?.quantity - 1;
      }

      newCart[index] = existingItem;

      localStorage.setItem("cart", JSON.stringify([...newCart]));
      setCart([...newCart]);
      return;
    }
  };

  const removeCart = () => {
    localStorage.removeItem("cart");
    setCart([]);
  };

  const directAddToCart = async (productID, stock) => {
    if (!stock) {
      return toast.error("Out of stock!");
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API}/api/v1/product-details/${productID}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const product = response?.data?.data;

    const cartItem = {
      productID: productID,
      productName: product?.productID?.productName,
      price: product?.productID?.discountPrice || product?.productID?.price,
      productImg: product?.productID?.productImg,
      subCategory: product?.productID?.subCategoryID?.subCategoryName,
      quantity: 1,
    };

    if (product?.color?.length) {
      cartItem.color = product?.color[0];
    }

    addToCart(cartItem);
  };

  const value = {
    cart,
    setCart,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    subTotal: subTotal,
    grandTotal: grandTotal,
    removeCart,
    directAddToCart,
    discount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContextProvider;
