/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext<any>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    console.log(storedUserId, "userid");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (userId) {
        setIsLoading(true);
        try {
          const response = await axios.get(
            `http://localhost:3001/api/wishlist/${userId}`
          );

          setWishlist(response.data || []);
          console.log(response.data, "form context");
        } catch (error) {
          console.error("Error fetching wishlist:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setWishlist([]);
        setIsLoading(false);
      }
    };

    fetchWishlist();
  }, [userId]);

  const addToWishlist = async (productId: string) => {
    if (wishlist.includes(productId)) {
      console.log("This product is already in your wishlist!");
      return;
    }
    try {
      await axios.post("http://localhost:3001/api/wishlist", {
        userId,
        productId,
      });
      setWishlist((prevWishlist) => [...prevWishlist, productId]);
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      await axios.delete(`http://localhost:/api/wishlist/${userId}`, {
        data: { productId },
      });
      setWishlist((prevWishlist) =>
        prevWishlist.filter((id) => id !== productId)
      );
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        userId,
        setUserId,
        wishlist,
        isLoading,
        addToWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
