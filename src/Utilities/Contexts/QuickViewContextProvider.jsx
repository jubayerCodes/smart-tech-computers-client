"use client";
import React, { createContext, useEffect, useState } from "react";

export const QuickViewContext = createContext({});

const QuickViewContextProvider = ({ children }) => {
  const [product, setProduct] = useState({});

  return (
    <QuickViewContext.Provider value={{ product, setProduct }}>
      {children}
    </QuickViewContext.Provider>
  );
};

export default QuickViewContextProvider;
