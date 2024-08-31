import React from 'react';

const AboutPage = () => {
  return (
<div className="flex items-center justify-center h-screen">
  <iframe 
    src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FChloeCherryBoutique&tabs=timeline&width=340&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
    width="340" 
    height="500" 
    className="border-none"
    allowFullScreen={true} 
    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
    title="Facebook Page Plugin for Chloe Cherry Boutique"
  ></iframe>
</div>
  )
};

export default AboutPage;
