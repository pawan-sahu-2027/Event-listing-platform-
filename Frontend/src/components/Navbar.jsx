import {
  House,
  Info,
  LayoutDashboard,
  MessageCircleMore,
  Store,
  StoreIcon,
} from "lucide-react";
// import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { useDispatch, useSelector } from "react-redux";
// import { getUser, clearUser } from "../redux/userSlice"; 
import { getUser, clearUser } from "../redux/userSlice";
import React, { useEffect } from "react";
const Navbar = () => {
  const dispatch = useDispatch();
  console.log(`clearUser): ${clearUser}`);
  const user = useSelector((state) => state.user.user);
  

  // console.log("user in navbar", user);
  useEffect(() => {
    dispatch(getUser());
  }, []);
  return (
    <header className="w-full sticky top-0 z-20">
      <div className="bg-[url('/coffee-beans.webp')] bg-cover bg-center">
        <div className="bg-black/50">
          <nav className="max-w-7xl mx-auto px-4 py-4 text-white">
            {/* 🔥 Top Row (Mobile) */}
            <div className="flex justify-between items-center md:hidden">
              <h1 className="text-xl font-bold">☕ Coffee</h1>

              {user ? (
                <Button
                  onClick={() => {
                    dispatch(clearUser());

                      console.log("Before:", localStorage.getItem("AccessToken"));
                  }}
                  className="bg-red-500 text-white"
                >
                  Logout
                </Button>
              ) : (
                <Link to="/login">
                  <Button className="bg-gradient-to-tl from-blue-600 to-purple-600 text-white">
                    Login
                  </Button>
                </Link>
              )}
            </div>

            {/* 🔥 Bottom Row (Mobile) */}
            <div className="flex justify-between items-center mt-3 md:hidden text-sm">
              <Link to="/" className="flex flex-col items-center gap-1">
                <House size={18} />
                <span>Home</span>
              </Link>

              <Link className="flex flex-col items-center gap-1">
                <MessageCircleMore size={18} />
                <span>Chat</span>
              </Link>

              <Link className="flex flex-col items-center gap-1">
                <Store size={18} />
                <span>Products</span>
              </Link>

              <Link className="flex flex-col items-center gap-1">
                <Info size={18} />
                <span>About</span>
              </Link>
    
            </div>

            {/* 🔥 Desktop Layout */}
            <div className="hidden md:flex justify-between items-center">
              {/* Logo */}
              <h1 className="text-3xl md:text-4xl font-bold">☕ Coffee</h1>

              {/* Nav Items */}
              <div className="flex gap-6">
                <Link
                  to="/"
                  className="flex items-center gap-2 hover:text-yellow-300"
                >
                  <House size={20} /> Home
                </Link>

                <Link className="flex items-center gap-2 hover:text-yellow-300">
                  <MessageCircleMore size={20} /> Chat
                </Link>

                <Link className="flex items-center gap-2 hover:text-yellow-300">
                  <StoreIcon size={20} /> Products
                </Link>

                <Link className="flex items-center gap-2 hover:text-yellow-300">
                  <Info size={20} /> About
                </Link>

                <Link
                  to="/admin/add-event"
                  className="flex items-center gap-2 hover:text-yellow-300"
                >
                  <LayoutDashboard size={20} /> Dashboard
                </Link>
              </div>
              {user ? (
                <Button
                  onClick={() => {
                    console.log("Before:", localStorage.getItem("AccessToken"));
                    dispatch(clearUser());
                    console.log("After:", localStorage.getItem("AccessToken"));
                  }}
                  className="bg-red-500 text-white"
                >
                  Logout
                </Button>
              ) : (
                <Link to="/login">
                  <Button className="bg-gradient-to-tl from-blue-600 to-purple-600 text-white">
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
