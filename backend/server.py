from flask import Flask, request
from flask_cors import CORS
import base64
import requests
from dotenv import load_dotenv
import os
import b2sdk.v2 as b2
from urls import list_objects_browsable_url, get_b2_resource, upload_file, product_list
from database import insert_data, fetch_data
from io import BytesIO

app = Flask(__name__)
CORS(app)  
load_dotenv()
path = os.environ.get("OPENAI_API_KEY")
endpoint = os.getenv("ENDPOINT")
application_key_id = os.getenv("B2_KEY_ID")
application_key = os.getenv("B2_APPLICATION_KEY")
bucket_name = os.getenv("BUCKET")

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
            "text": '''Give this jewelry a name and description and the text with the grams and size, and mm, only json. If either of these is not present return null in the appropriate field"
                "name": "name",
                "description": "description",
                "weight": float,
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
    return "HOME"


@app.route("/products", methods=["GET", "POST", "OPTIONS"])
def products():
    image_path = "./assets/chain-link.jpg"
    prod_list = image_class(encode_image(image_path))
    product_list = {"name": prod_list, "price": 200, "image": "image file"}
    return product_list

@app.route("/productlist", methods=["GET", "POST", "OPTIONS"])
def list():
    products = fetch_data()
    app.logger.warning(f'name:{products}')
    return products


@app.route("/addproduct", methods=["GET", "POST"])
def addproduct():
    
    name = request.form.get('name')
    description = request.form.get('description')
    weight = request.form.get('weight')
    price = request.form.get('price')
    image = request.files.get('image')
    size = request.form.get('size')
    mm = request.form.get('mm')
    app.logger.warning(f'name:{name} description:{description} weight:{weight} price:{price} image:{image.filename}')

    image_data = BytesIO(image.read())
    
    # Example function call to upload file
    b2_rw = get_b2_resource(endpoint, application_key_id, application_key)
    response = upload_file(bucket_name, image_data, b2_rw, image.filename)
    app.logger.warning(f'------------------------products:{response}')

    image_link = product_list(endpoint, application_key_id,application_key,bucket_name)[-1].replace(' ','+')
    app.logger.warning(f'products:{image_link}')

    form = {
       "name": name, 
       "description": description, 
       "weight":weight, 
       "price":price, 
       "size":size, 
       "mm":mm,
       "image":image_link
       }

    insert_data(form)
    # Log basic info (excluding file contents for security)
    app.logger.warning(f'name:{image_link}')
    
    # Convert image to BytesIO


    return response

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