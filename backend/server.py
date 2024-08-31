from flask import Flask, request
from flask_cors import CORS
import base64
import requests
from dotenv import load_dotenv
import os
import b2sdk.v2 as b2
from urls import list_objects_browsable_url, get_b2_resource, upload_file, product_list
from database import insert_product_db, fetch_all_db_products
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
    products = fetch_all_db_products()
    app.logger.warning(f'name:{products}')
    return products


@app.route("/addproduct", methods=["GET", "POST"])
def addproduct():
    try:
        # Getting all fields from POST request
        name = request.form.get('name')
        description = request.form.get('description')
        weight = request.form.get('weight')
        price = request.form.get('price')
        image = request.files.get('image')
        size = request.form.get('size')
        mm = request.form.get('mm')
        app.logger.warning(f'name:{name} description:{description} weight:{weight} price:{price} image:{image.filename}')
        
        # Read image data
        image_data = BytesIO(image.read())
        
        try:
            # Establishing a connection to B2
            b2_connection = get_b2_resource(endpoint, application_key_id, application_key)
            response = upload_file(bucket_name, image_data, b2_connection, image.filename) # Uploading file to bucket
            app.logger.warning(f'File upload response: {response}')
        except Exception as e:
            app.logger.error(f"Error uploading file to B2: {e}")
            return f"Failed to upload image: {e}", 500
        
        try:
            # Getting the bucket
            bucket = b2_connection.Bucket(bucket_name)
            all_bucket_objects = bucket.objects.all()
            
            # Creating a list of products with links and last modified dates
            product_list = []
            for obj in all_bucket_objects:
                url = f"{endpoint}/{bucket.name}/{obj.key}"
                product_list.append({
                    'link': url,
                    'last_modified': obj.last_modified
                })
            
            # Finding the most recent image link
            most_recent_image_link = max(product_list, key=lambda x: x['last_modified'])
            adjusted_image_link = most_recent_image_link['link'].replace(' ', '+')
            app.logger.warning(f'Most recent image link: {adjusted_image_link}')
        except Exception as e:
            app.logger.error(f"Error retrieving or processing bucket objects: {e}")
            return f"Failed to retrieve image link: {e}", 500
        
        # Creating product details for the database
        product_details = {
            "name": name,
            "description": description,
            "weight": weight,
            "price": price,
            "size": size,
            "mm": mm,
            "image": adjusted_image_link
        }

        try:
            insert_product_db(product_details)  # Insert product details into the database
            app.logger.warning(f'Product inserted into database: {adjusted_image_link}')
        except Exception as e:
            app.logger.error(f"Error inserting product into database: {e}")
            return f"Failed to insert product into database: {e}", 500

        return response
    except Exception as e:
        app.logger.error(f"General error in addproduct: {e}")
        return f"Failed to process the request: {e}", 500

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