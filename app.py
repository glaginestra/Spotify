from flask import Flask, request, jsonify
import requests
import base64
from dotenv import load_dotenv
import os

load_dotenv()  # Carga las variables del .env

app = Flask(__name__)

CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
REDIRECT_URI = os.getenv("REDIRECT_URI")

@app.route("/get_token", methods=["POST"])
def get_token():
    code = request.json.get("code")
    if not code:
        return jsonify({"error": "No code provided"}), 400

    auth_header = base64.b64encode(f"{CLIENT_ID}:{CLIENT_SECRET}".encode()).decode()
    
    data = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": REDIRECT_URI
    }
    
    headers = {
        "Authorization": f"Basic {auth_header}",
        "Content-Type": "application/x-www-form-urlencoded"
    }
    
    response = requests.post("https://accounts.spotify.com/api/token", data=data, headers=headers)
    return jsonify(response.json())

if __name__ == "__main__":
    app.run(port=5000)
