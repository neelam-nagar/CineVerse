import pickle

try:
    tfidf = pickle.load(open('resources/models/HS tfidf.pkl', 'rb'))
    model = pickle.load(open('resources/models/HS model.pkl', 'rb'))
except Exception as e:
    tfidf = None
    model = None
    print(f"Error loading model or vectorizer: {e}")

def predict_hate_speech(text):
    text_vector = tfidf.transform([text])
    prob = model.predict_proba(text_vector)
    return {
        'prediction': 'Hate' if prob[0][1] >= 0.7 else 'Not Hate',
        'confidence': {
            'Not hate': float(prob[0][0]),
            'Hate': float(prob[0][1])
        },
        'review': text
    }