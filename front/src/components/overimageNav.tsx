/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useUser } from "@/Context/userContext";
import React, { useEffect, useState } from "react";
import { HiOutlineArrowPath } from "react-icons/hi2";
import { IoSearchOutline } from "react-icons/io5";
import { PiHeartFill, PiHeartThin } from "react-icons/pi";

interface OverImageNavProps {
  productId: string;
  isInWishlistPage?: boolean;
}

const OverImageNav: React.FC<OverImageNavProps> = ({
  productId,
  isInWishlistPage = false,
}) => {
  const { wishlist, addToWishlist, removeFromWishlist, isLoading } = useUser();

  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    const found = wishlist.some(
      (wishlistProduct: any) => wishlistProduct.productId === productId
    );
    setIsInWishlist(found);
  }, [wishlist, productId]);

  if (isLoading) {
    return <div>Loading wishlist...</div>;
  }

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();

    // Optimistically update the heart icon
    setIsInWishlist(!isInWishlist);

    try {
      if (isInWishlist) {
        await removeFromWishlist(productId);
        console.log("Removing from wishlist:", productId);
      } else {
        await addToWishlist(productId);
        console.log("Adding to wishlist:", productId);
      }
    } catch (error) {
      // Revert the UI change in case of an API failure
      setIsInWishlist(isInWishlist);
      console.error("Error updating wishlist:", error);
    }
  };

  return (
    <div className="absolute top-2 right-[-50px] flex flex-col gap-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-[-60px] transition-all duration-1000">
      {isInWishlistPage ? (
        <div className="h-[35px] w-[30px]" />
      ) : (
        <div className="relative bg-white rounded-full p-2 cursor-pointer group">
          <div onClick={handleWishlistToggle} className="cursor-pointer">
            {isInWishlist ? (
              <PiHeartFill className="text-red-600" size={24} />
            ) : (
              <PiHeartThin className="text-gray-600" size={24} />
            )}
          </div>
          <span className="absolute left-[-100px] top-1/2 transform -translate-y-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-0 hover:opacity-100 transition-all duration-300">
            {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
          </span>
        </div>
      )}

      <div className="relative bg-white rounded-full p-2 cursor-pointer group">
        <IoSearchOutline className="text-black" size={20} />
        <span className="absolute left-[-100px] top-1/2 transform -translate-y-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-0 hover:opacity-100 transition-all duration-300">
          Quick View
        </span>
      </div>

      <div className="relative bg-white rounded-full p-2 cursor-pointer group">
        <HiOutlineArrowPath className="text-black" size={20} />
        <span className="absolute left-[-100px] top-1/2 transform -translate-y-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-0 hover:opacity-100 transition-all duration-300">
          Compare
        </span>
      </div>
    </div>
  );
};

export default OverImageNav;
