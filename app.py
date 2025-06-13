from flask import Flask, jsonify, request, send_from_directory, render_template
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix
import json
import os

app = Flask(__name__, static_folder='.', static_url_path='')

DATA_FILE = 'Agriculture.csv'

# Load dataset once
data = pd.read_csv(DATA_FILE)

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/styles.css')
def styles():
    return send_from_directory('.', 'styles.css')

@app.route('/script.js')
def script():
    return send_from_directory('.', 'script.js')

@app.route('/api/data')
def get_data():
    # Return dataset as JSON
    return data.to_json(orient='records')

@app.route('/api/model_metrics')
def model_metrics():
    # Prepare data
    X = data.drop(['label'], axis=1)
    y = data['label']
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0)

    # Train model
    model = LogisticRegression(max_iter=1000)
    model.fit(X_train, y_train)

    # Predict and evaluate
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    cm = confusion_matrix(y_test, y_pred)
    cm_list = cm.tolist()

    return jsonify({
        'accuracy': accuracy,
        'confusion_matrix': cm_list,
        'labels': list(model.classes_)
    })

@app.route('/api/predict', methods=['POST'])
def predict():
    features = request.json
    # Validate input features keys
    expected_features = ['N','P','K','temperature','humidity','ph','rainfall']
    if not all(k in features for k in expected_features):
        return jsonify({'error': 'Missing features'}), 400

    X = data.drop(['label'], axis=1)
    y = data['label']
    model = LogisticRegression(max_iter=1000)
    model.fit(X, y)

    input_data = np.array([[features[k] for k in expected_features]])
    prediction = model.predict(input_data)[0]

    return jsonify({'prediction': prediction})

if __name__ == '__main__':
    app.run(debug=True)
