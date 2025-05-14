"use client"
import { CartContext } from '@/Utilities/Contexts/CartContextProvider';
import { usePathname } from 'next/navigation';
import React, { useContext, useEffect } from 'react';
import "./FloatingCart.css"
import { BsCartDash } from "react-icons/bs";
import { FaShoppingCart } from 'react-icons/fa';

const FloatingCart = () => {
    
    const {cart} = useContext(CartContext)

      const path = usePathname();
    
    
      useEffect(() => {
    
        if (path.startsWith("/dashboard")) {
          return;
        }
    
        // Function to update the progress bar
        function updateFloatingCart() {
          const floatingCartContainer = document.querySelector(".floating-cart");
    
          if (window.pageYOffset > 100) {
            floatingCartContainer.classList.add("visible");
          } else {
            floatingCartContainer.classList.remove("visible");
          }
        }
    
        
        // Update progress initially
        updateFloatingCart();
    
        // Attach event listeners
        window.addEventListener("scroll", () => {
            updateFloatingCart();
        });
    
        window.addEventListener("resize", () => {
            updateFloatingCart();
        });
    
        // Cleanup function to remove event listeners
        return () => {
          window.removeEventListener("scroll", updateFloatingCart);
        };
      }, []);
    
      if (path.startsWith("/dashboard")) {
        return;
      }

    const toggleCart = () => {
        const cartSidebar = document.getElementById("cartSidebar");
        const overlay = document.getElementById("overlay_cart");
        cartSidebar.classList.toggle("active");
        overlay.classList.toggle("active");
      };

    return (
        <div className='floating-cart'>
            <div className="floating-cart-icon">
                <a
                    className="icon cart_icon cart_button"
                    onClick={() => toggleCart()}
                >
                <FaShoppingCart />
                <span>{cart?.length}</span>
                </a>
            </div>
        </div>
    );
};

export default FloatingCart;