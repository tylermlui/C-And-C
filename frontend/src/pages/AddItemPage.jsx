import React, { useState } from 'react';

function AddItem() {
    const [form, setFormData] = useState({name: 'Necklace',description: 'Beautiful necklace', weight: '20oz', price: '200'})
    const [url, setUrl] = useState('')
    const [image, setImage] = useState('')
    const [generate, setGenerate] = useState('')
    
    function handleSubmit(event) {
        event.preventDefault();
        
        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('description', form.description);
        formData.append('weight', form.weight);
        formData.append('price', form.price);
        formData.append('image', image);  
    
        fetch("http://localhost:5000/addproduct", {
            method: "POST",
            body: formData  
        })
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
          ...form,
          [name]: value,
        });
      };

    async function generateImage(event){
        event.preventDefault();
        console.log("correct")
        const imageData = new FormData();
        imageData.append('image', image)
        
        await fetch("http://localhost:5000/generate", {
            method: "POST",
            body: imageData
        })
        .then(response => response.text())
        .then(data => {const generated = data.replace(/^```json|```$/g, '')
            const json_string = JSON.parse(generated)
            console.log(json_string);
            console.log(json_string.name)
            setFormData({
                name : json_string.name,
                description : json_string.description,
                weight : json_string.weight,
                price : json_string.price
            })
        })
        .catch(error => console.error('Error:', error));
    }

    const handleImageChange = (event) =>{
        setGenerate("Generate Details")
        const file = event.target.files[0];
        if (file) {
            const fileUrl = URL.createObjectURL(file);
            setImage(file);
            setUrl(fileUrl);
    
            console.log('File:', url);
            console.log('File URL:', image);
        } else {
            console.log('No file selected');
        }
    }


    return (
        <form onSubmit={handleSubmit}>
        <div>
        <div>
            <label>Image:</label>
            <input
                type="file"
                onChange={handleImageChange}
            />
                <img src={url} />
        </div>
        <div>
          <button 
            type="button"
            onClick={generateImage}
            >
            {generate}
          </button>
        </div>
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
          <button type="submit">Submit</button>
        </div>
      </form>
    );
}

export default AddItem;
