import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaInstagram,
  FaPinterest,
  FaTwitterSquare,
} from "react-icons/fa";


const Footer = () => {


  return (
    <footer className="bg-gray-900 text-gray-200 py-10">
      <div className="max-w-7xl mx-auto px-4 md:flex md:justify-between gap-10">

        {/* Logo & Info */}
        <div className="mb-6 md:mb-0">
          <Link to="/">
            {/* <img src="/Ekart.png" alt="Ekart" className="w-32 mb-4" /> */}
            <h1 className="text-xl font-bold">☕ Coffee</h1>
          </Link>
          <p className="text-sm">
            Powering your world with the best in Electronics.
          </p>
          <p className="text-sm mt-2">
            123 Electronics St, Style City, NY 10001
          </p>
          <p className="text-sm">Email: support@ekart.com</p>
          <p className="text-sm">Phone: (123) 456-7890</p>
        </div>

        {/* Customer Service */}
        <div className="mb-6 md:mb-0">
          <h3 className="text-xl font-semibold mb-3">Customer Service</h3>
          <ul className="space-y-2 text-sm">
            <li>Contact Us</li>
            <li>Shipping & Returns</li>
            <li>FAQs</li>
            <li>Order Tracking</li>
            <li>Size Guide</li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="mb-6 md:mb-0">
          <h3 className="text-xl font-semibold mb-3">Follow Us</h3>
          <div className="flex gap-4 text-2xl text-pink-500">
            <FaFacebook />
            <FaInstagram />
            <FaPinterest />
            <FaTwitterSquare />
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Stay in the Loop</h3>
          <p className="text-sm mb-3">
            Subscribe to get special offers, free giveaways, and more.
          </p>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="Your email address"
              className="w-full p-2 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-50"
            />
            <button
              type="submit"
              className="bg-pink-600 text-white px-4 rounded-md hover:bg-pink-700"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-8 border-t border-gray-700 pt-6 text-center text-sm">
        <p>
          &copy; {new Date().getFullYear()}{" "}
          <span className="text-pink-600">EKart</span>. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

