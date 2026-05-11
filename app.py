from flask import Flask, render_template, request, jsonify

import pickle

# Load trained model
model = pickle.load(open("spam_model.pkl", "rb"))

# Load vectorizer
vectorizer = pickle.load(open("vectorizer.pkl", "rb"))

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():

    message = request.json["message"]

    transformed_message = vectorizer.transform([message])

    prediction = model.predict(transformed_message)[0]

    probabilities = model.predict_proba(transformed_message)[0]
    confidence = max(probabilities) * 100

    suspicious_words = [
        "free", "win", "winner", "won", "click", "urgent",
        "claim", "prize", "cash", "offer", "limited", "account",
        "compromised", "buy now"
    ]

    found_words = []

    for word in suspicious_words:
        if word.lower() in message.lower():
            found_words.append(word)

    return jsonify({
        "prediction": prediction,
        "confidence": round(confidence, 2),
        "keywords": found_words
    })

if __name__ == "__main__":
    app.run(debug=True)