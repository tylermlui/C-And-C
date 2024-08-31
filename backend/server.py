from flask import Flask, request
from flask_cors import CORS
import base64
import requests
from dotenv import load_dotenv
import os
import logging

app = Flask(__name__)
CORS(app)  
load_dotenv()
path = os.environ.get("OPENAI_API_KEY")


def encode_image(image_path):
  with open(image_path, "rb") as image_file:
    return base64.b64encode(image_file.read()).decode('utf-8')

def image_class(encoded_image):
    headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {path}"
    }

    payload = {
    "model": "gpt-4o-mini",
    "messages": [
        {
        "role": "user",
        "content": [
            {
            "type": "text",
            "text": '''Give this jewelry a name and description and the text with the grams and size(int), and mm, only json. If either of these is not present return null in the appropriate field"
                "name": "name",
                "description": "description",
                "grams": float,
                "mm": float
                "size":float
                '''
            },
            {
            "type": "image_url",
            "image_url": {
                "url": f"data:image/jpeg;base64,{encoded_image}"
            }
            }
        ]
        }
    ],
    "max_tokens": 300
    }

    response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload).json()
    
    try:
       return response["choices"][0]["message"]["content"]
    except KeyError:
       return "Request Error"

@app.route("/")
def hello():
    image_path = "./assets/chain-link.jpg"
    return image_class(encode_image(image_path))


@app.route("/products", methods=["GET", "POST", "OPTIONS"])
def products():
    image_path = "./assets/chain-link.jpg"
    prod_list = image_class(encode_image(image_path))
    product_list = {"name": prod_list, "price": 200, "image": "image file"}
    return product_list

@app.route("/addproduct", methods=["GET", "POST"])
def addproduct():
    name = request.form.get('name')
    description = request.form.get('description')
    weight = request.form.get('weight')
    price = request.form.get('price')
    image = request.files.get('image') 

    app.logger.warning(f'name:{name} description:{description} weight:{weight} price:{price} image:{image}')
    return "product added"

@app.route("/generate", methods=["GET", "POST"])
def generate():
    image = request.files.get('image')
    try:
        image_string = base64.b64encode(image.read()).decode('utf-8') #encoding image
        gen_string = image_class(image_string) #calling GPT for image for image
        app.logger.warning(gen_string) 
        return gen_string
    except AttributeError:
       return "error with encoding"
    except:
       return "error with GPT request"