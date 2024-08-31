import React, { useState } from 'react';

interface JewelryData {
  name: string;
  description: string;
  weight: number | null;
  price: number | null;
  mm: number | null;
  size: number | null;
}

function AddItem() {
    const [form, setFormData] = useState<JewelryData>({name: '',description: '', weight: null, price: null, mm: null, size: null})
    const [url, setUrl] = useState('')
    const [image, setImage] = useState<File | null>(null);
    const [generate, setGenerate] = useState('')
    const [spinner, setSpinner] = useState(false);    

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        
        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('description', form.description);
        formData.append('grams', form.weight?.toString() || '');
        formData.append('price', form.price?.toString() || '');
        formData.append('mm', form.mm?.toString() || '');
        formData.append('image', image || '');  
    
        fetch("http://localhost:5000/addproduct", {
            method: "POST",
            body: formData  
        })
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData({
          ...form,
          [name]: value,
        });
      };

    async function generateImage(event: React.MouseEvent<HTMLButtonElement>){
        event.preventDefault();
        setSpinner(true);
        const imageData = new FormData();
        imageData.append('image', image || '')
        
        await fetch("http://localhost:5000/generate", {
            method: "POST",
            body: imageData
        })
        .then(response => response.text())
        .then(data => {const generated_text = data.replace(/^```json|```$/g, '')
            setSpinner(false);
            const json_string = JSON.parse(generated_text)
            console.log(json_string);
            console.log(json_string.name)
            setFormData({
                name : json_string.name,
                description : json_string.description,
                weight : json_string.grams,
                price : json_string.price,
                mm : json_string.mm,
                size: json_string.size
            })
        })
        .catch(error => console.error('Error:', error));
    }

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) =>{
        setGenerate("Generate Details")
        const file = event.target.files?.[0];
        if (file) {
            const fileUrl = URL.createObjectURL(file);
            setImage(file);
            setUrl(fileUrl);
    
            console.log('File:', file);
            console.log('File URL:', fileUrl);
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
            {spinner && (
        <p>Generating...</p>
        )}
          </button>
        </div>
          <label>Name: </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Description: </label>
          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Weight: </label>
          <input
            type="text"
            name="weight"
            value={form.weight || ''}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Size: </label>
          <input
            type="text"
            name="size"
            value={form.size || ''}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>mm: </label>
          <input
            type="text"
            name="mm"
            value={form.mm || ''}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Price: </label>
          <input
            type="text"
            name="price"
            value={form.price || ''}
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
