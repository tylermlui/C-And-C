from flask import Flask, jsonify
from flask_cors import CORS
app = Flask(__name__)
CORS(app)  

@app.route("/")
def hello():
    return "Hello, World!"

@app.route("/products", methods=["GET", "POST", "OPTIONS"])
def products():
    product_list = {"name": "bracelet", "price": 200, "image": "image file"}
    return jsonify(product_list)