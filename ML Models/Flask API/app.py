from flask import Flask, request, jsonify
from resources.Sentiment_model import predict_sentiment, model_data
from resources.Hate_speech_model import predict_hate_speech, model

app = Flask(__name__)

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "message": "Sentiment Analysis API",
        "version": "1.0.0",
        "endpoints": {
            "predict sentiment": "/predict_sentiment",
            "predict hate speech": "/predict_hate_speech",
            "health": "/health"
        }
    })

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "sentiment_model_loaded": model_data is not None,
        "hate_speech_model_loaded": model is not None
    })

@app.route('/predict_sentiment', methods=['POST'])
def sentiment():
    try:
        data = request.get_json()
        review = data.get("review", "")
        stars = data.get("stars", 0)

        result = predict_sentiment(model_data, review, stars)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/predict_hate_speech', methods=['POST'])
def hate_speech():
    try:
        data = request.get_json()
        review = data.get("review", "")

        result = predict_hate_speech(review)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
if __name__ == '__main__':
    app.run(debug=True)
