import React, { useState } from 'react';

function AddItem() {
    const [form, setFormData] = useState({name: 'Necklace',description: 'Beautiful necklace', weight: '20oz', price: '200', image: 'Image/path/here' })
    function handleSubmit(event) {
        event.preventDefault()
        fetch("http://localhost:5000/addproduct", {
            method: "POST",
            headers : {    'Accept': 'application/json',
              'Content-Type': 'application/json',
              "Access-Control-Allow-Origin":"*",
              "Access-Control-Allow-Headers": "*",
              "Access-Control-Allow-Methods": "*"},
            body: JSON.stringify({
              name: form.name,
              description: form.description,
              weight: form.weight,
              price: form.price,
              image: form.image,
            })
          
          })
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
          ...form,
          [name]: value,
        });
      };

    return (
        <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Description:</label>
          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Weight:</label>
          <input
            type="text"
            name="weight"
            value={form.weight}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="text"
            name="price"
            value={form.price}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Image:</label>
          <input
            type="text"
            name="image"
            value={form.image}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    );
}

export default AddItem;
