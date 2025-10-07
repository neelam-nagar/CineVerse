# Movie Review Analysis API

This API provides endpoints to analyze movie reviews, including **sentiment analysis** and **hate speech detection**. It is built using Python and Flask.

---

## Features

- **Health Check**: Verify that the API is running.  
- **Sentiment Analysis**: Predict whether a review is positive, negative, or neutral, optionally using star ratings.  
- **Hate Speech Detection**: Detect if a review contains hate speech.

---

## Requirements

- Python 3.10+  
- `pip`  

All dependencies are listed in `requirements.txt`.

---

## Setup and Run

1. Open a terminal/command prompt.
2. Create a virtual environment:

   ```bash
   python -m venv .venv
   ```

3. Activate the virtual environment:

   - **Windows**:

     ```bash
     .venv\Scripts\activate
     ```

   - **Mac/Linux**:

     ```bash
     source .venv/bin/activate
     ```

4. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

5. Start the API:

   ```bash
   python app.py
   ```

6. Open another terminal or use Postman to send requests.

---

## Endpoints

### 1. Home

* **URL:** `/`
* **Method:** GET
* **Description:** Returns a welcome message.

**Example:**

```bash
curl -X GET http://127.0.0.1:5000/
```

### 2. Health Check

* **URL:** `/health`
* **Method:** GET
* **Description:** Checks if the API is running.

**Example:**

```bash
curl -X GET http://127.0.0.1:5000/health
```

### 3. Predict Sentiment

* **URL:** `/predict_sentiment`
* **Method:** POST
* **Content-Type:** application/json
* **Request Body:**

```json
{
    "review": "The movie was amazing and well directed!",
    "stars": 5
}
```

* **Response Format:**

```json
{
    "prediction": "Positive" | "Negative",
    "confidence": {
        "negative": float,
        "positive": float
    },
    "review": "<original review text>",
    "stars": <star rating>
}
```

**Example:**

```bash
curl -X POST http://127.0.0.1:5000/predict_sentiment \
     -H "Content-Type: application/json" \
     -d '{"review": "The movie was amazing and well directed!", "stars": 5}'
```

### 4. Predict Hate Speech

* **URL:** `/predict_hate_speech`
* **Method:** POST
* **Content-Type:** application/json
* **Request Body:**

```json
{
    "review": "the fucking retard just gave them the best ammunition possible"
}
```

* **Response Format:**

```json
{
    "prediction": "Hate" | "Not Hate",
    "confidence": {
        "Not hate": float,
        "Hate": float
    },
    "review": "<original review text>"
}
```

**Example:**

```bash
curl -X POST http://127.0.0.1:5000/predict_hate_speech \
     -H "Content-Type: application/json" \
     -d '{"review": "the fucking retard just gave them the best ammunition possible"}'
```
---

## Notes

- Ensure your virtual environment is active before running the API.  
- You can use **Postman** or **curl** to test endpoints.  
- The `stars` field is optional in sentiment analysis, but including it may improve prediction accuracy.

---

## License

This project is licensed under the MIT License.