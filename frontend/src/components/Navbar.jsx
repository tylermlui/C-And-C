import React from 'react';
import { Link } from 'react-router-dom';
import logo from "../assets/NavLogo.png";
const Navbar = () => {
  return (
    <div className='grid grid-cols-5 py-5 text-white border-b border-white bg-[#C79999]'>
      <Link to="/contact" className="flex items-center justify-center text-2xl font-light">Contact</Link>
      <Link to="/products" className="flex items-center justify-center text-2xl font-light">Products</Link>
      <Link to="/">
        <div className="flex items-center justify-center col-span-1">
          <img src={logo} alt="C&C" className="h-10" />
        </div>
      </Link>
      <Link to="/live" className="flex items-center justify-center text-2xl font-light">Live</Link>
      <Link to="/cart" className="flex items-center justify-center text-2xl font-light">Cart</Link>
    </div>
  );
};

export default Navbar;
