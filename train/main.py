from flask import Flask, jsonify
from app_train import train_model  # Import the train_model function from your script

app = Flask(__name__)

@app.route('/train', methods=['POST'])  # Use a POST request to trigger the training
def train():
    try:
        results = train_model()
        return jsonify({"status": "success", "results": str(results)}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
