import React, { useState, useEffect } from 'react';

interface JewelryData {
  name: string;
  description: string;
  weight: number | null;
  price: number | null;
  mm: number | null;
  size: number | null;
  image: string; // Make sure to include image URL in the type
}

const ImageGallery = () => {
  const [products, setProducts] = useState<JewelryData[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/productlist", {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*"
      }
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched data:', data);

        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error('Expected an array of products');
        }
      })
      .catch((error) => console.log('Error fetching data:', error));
  }, []);


  return (
    <div>
      <h1 className="flex justify-center items-center text-2xl font-light">Products</h1>
      <div className="flex justify-center items-center bg-white h-screen text-2xl font-light">
        {products.length > 0 ? (
          products.map((product, index) => (
            <div key={index} style={{ width: '300px', height: 'auto', margin: '10px' }}>
              <img
                src={product.image}
                alt={`Image ${index}`}
                style={{ width: '100%', height: 'auto'}}
              />
              <p>{product.name}</p>
              <p>{product.description}</p>
              <p>Weight (grams): {product.weight}</p>
              <p>{product.mm}mm</p>
              <p>Size: {product.size}</p>
              <p>{product.price}</p>

            </div>
          ))
        ) : (
          <p>No images to display</p>
        )}
      </div>
    </div>
  );
};

export default ImageGallery;
