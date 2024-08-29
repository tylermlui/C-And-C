import React from 'react';

const Navbar = () => {
  return (
    <div className='grid grid-cols-5 py-5 text-white border-b border-white bg-[#C79999]'>
        <div className="flex items-center justify-center text-2xl font-light">Contact</div>
        <div className="flex items-center justify-center text-2xl font-light">Products</div>
        <div></div>
        <div className="flex items-center justify-center text-2xl font-light">Live</div>
        <div className="flex items-center justify-center text-2xl font-light">Cart</div>
    </div>
  );
};

export default Navbar;