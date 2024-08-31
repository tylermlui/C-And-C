import os
from supabase import create_client, Client

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

def fetch_data():
    response = supabase.table("products").select("*").execute()
    return response.data

def insert_data(products):
    def convert_empty_to_none(value):
        if value == '' or value is None:
            return None
        try:
            # Attempt to convert to float if possible
            return float(value)
        except ValueError:
            # If conversion fails, return None
            return None

    data_to_insert = {
        "name": products.get("name"),
        "description": products.get("description"),
        "weight": convert_empty_to_none(products.get("weight")),
        "price": convert_empty_to_none(products.get("price")),
        "size": convert_empty_to_none(products.get("size")),
        "mm": convert_empty_to_none(products.get("mm")),
        "image": products.get("image")
    }

    # Debugging statement
    print(f"Inserting data: {data_to_insert}")

    response = (
        supabase.table("products")
        .insert(data_to_insert)
        .execute()
    )

    # Debugging statement
    print(f"Response: {response}")

    return "Data inserted"