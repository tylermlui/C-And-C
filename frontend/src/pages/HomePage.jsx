import React from 'react';
import MyImage from '../assets/home-page-logo.png';

const HomePage = () => {
  return(
  <header className="flex justify-center items-center bg-[#C79999] h-screen">
    <img src={MyImage} alt="Home Page Logo">
    </img>
  </header>) 
  
};

export default HomePage;
