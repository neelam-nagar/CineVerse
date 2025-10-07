import pickle
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.base import BaseEstimator, TransformerMixin
from scipy.sparse import hstack, csr_matrix
from sklearn.preprocessing import StandardScaler
import warnings
import re
import string

warnings.filterwarnings("ignore")

class FeatureCombiner(BaseEstimator, TransformerMixin):
    """Combine text features with star ratings using controlled weighting"""
    def __init__(self, star_weight=0.0048):
        self.star_weight = star_weight
        self.text_vectorizer = TfidfVectorizer(
            max_features=50000,
            ngram_range=(1, 2),
            min_df=2,
            max_df=0.95,
            sublinear_tf=True
        )
        self.scaler = StandardScaler(with_mean=False)  # keep sparse compatible
        self.fitted = True

    def fit(self, X, y=None):
        texts = [item[0] for item in X]
        stars = np.array([item[1] for item in X]).reshape(-1, 1)

        self.text_vectorizer.fit(texts)
        self.scaler.fit(stars)

        self.fitted = True
        return self

    def transform(self, X):
        if not self.fitted:
            raise ValueError("Must fit the transformer before transform")
        texts = [item[0] for item in X]
        stars = np.array([item[1] for item in X]).reshape(-1, 1)

        text_features = self.text_vectorizer.transform(texts)  # sparse
        star_features = self.scaler.transform(stars) * self.star_weight
        star_sparse = csr_matrix(star_features)

        return hstack([text_features, star_sparse], format="csr")

STOPWORDS = {
    "a","about","above","after","again","against","all","am","an","and","any","are",
    "arent","as","at","be","because","been","before","being","below","between","both",
    "but","by","cant","cannot","could","couldnt","did","didnt","do","does","doesnt",
    "doing","dont","down","during","each","few","for","from","further","had","hadnt",
    "has","hasnt","have","havent","having","he","hed","hell","hes","her","here",
    "heres","hers","herself","him","himself","his","how","hows","i","id","ill","im",
    "ive","if","in","into","is","isnt","it","its","itself","lets","me","more","most",
    "mustnt","my","myself","no","nor","not","of","off","on","once","only","or",
    "other","ought","our","ours","ourselves","out","over","own","same","shant","she",
    "shed","shell","shes","should","shouldnt","so","some","such","than","that","thats",
    "the","their","theirs","them","themselves","then","there","theres","these","they",
    "theyd","theyll","theyre","theyve","this","those","through","to","too","under",
    "until","up","very","was","wasnt","we","wed","well","were","weve","were","werent",
    "what","whats","when","whens","where","wheres","which","while","who","whos","whom",
    "why","whys","with","wont","would","wouldnt","you","youd","youll","youre","youve",
    "your","yours","yourself","yourselves"
}

def clean_text(text):
    text = text.lower()                                                 # 1. Lowercase
    text = re.sub(r'<.*?>', '', text)                                   # 2. Remove HTML tags
    text = re.sub(r'\d+', '', text)                                     # 3. Remove numbers
    text = text.translate(str.maketrans('', '', string.punctuation))    # 4. Remove punctuation
    tokens = text.split()                                               # 5. Tokenize (split by space)
    tokens = [word for word in tokens if word not in STOPWORDS]         # 6. Remove stopwords
    text = " ".join(tokens)                                             # 7. Join back
    return text

def predict_sentiment(model_data, review_text, star_rating):
    """Helper for single prediction"""
    text = clean_text(review_text)
    prob = model_data.predict_proba([(text, star_rating)])[0]
    prediction = model_data.predict([(text, star_rating)])[0]

    return {
        'prediction': 'Positive' if prediction == 1 else 'Negative',
        'confidence': {
            'negative': float(prob[0]),
            'positive': float(prob[1])
        },
        'review': review_text,
        'stars': star_rating
    }

class CustomUnpickler(pickle.Unpickler):
    def find_class(self, module, name):
        if name == 'FeatureCombiner':
            return FeatureCombiner
        return super().find_class(module, name)

def load_model_with_custom_unpickler(file_path):
    with open(file_path, 'rb') as f:
        unpickler = CustomUnpickler(f)
        return unpickler.load()

# Load the model
try:
    model_data = load_model_with_custom_unpickler("resources/models/Sentiment Model.pkl")
    print("Model loaded successfully with custom unpickler!")
except Exception as e:
    print(f"Error loading model: {e}")
    model_data = None