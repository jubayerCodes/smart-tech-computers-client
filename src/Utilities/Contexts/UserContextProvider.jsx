"use client";
import React, { createContext, useEffect, useState } from "react";

export const UserContext = createContext({});

const UserContextProvider = ({ children }) => {
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [userID, setUserID] = useState("");
  const [existingUserID, setExistingUserID] = useState(null);

  useEffect(() => {
    setExistingUserID(localStorage.getItem("userID"));
    setIsLoading(false);

    if (userID === null) {
      localStorage.removeItem("userID");
      setExistingUserID(null)
      setIsLoading(false);
    } else if (userID !== "" && userID !== null) {
      localStorage.setItem("userID", userID);
      setExistingUserID(userID)
      setIsLoading(false);
    }
  }, [userID]);

  useEffect(()=>{
    console.log(existingUserID);
  }, [existingUserID])


  if (isLoading) {
    return <></>;
  }

  return (
    <UserContext.Provider
      value={{ userEmail, setUserEmail, userID, setUserID, existingUserID, isLoading }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
