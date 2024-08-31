import React from 'react';

const ContactPage = () => {
  return <div className="flex justify-center items-center bg-white h-screen">
    <div className="flex-grid items-center justify-center h-screen">
      <div className="flex justify-center items-center text-5xl font-thin py-10">Contact Us</div>
      <iframe 
        src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FChloeCherryBoutique&width=340&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
        width="340" 
        height="500" 
        className="border-none"
        allowFullScreen={true} 
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        title="Facebook Page Plugin for Chloe Cherry Boutique"
      ></iframe>
      
    </div>  
  </div>;
};

export default ContactPage;
