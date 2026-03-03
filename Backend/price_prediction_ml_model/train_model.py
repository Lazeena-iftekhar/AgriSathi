import pandas as pd
import pickle

from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error

# Load dataset
df = pd.read_csv("dataset.csv")

# Keep required columns
df = df[["STATE", "Commodity", "Modal_Price"]]
df = df.dropna()

# Convert price to numeric
df["Modal_Price"] = pd.to_numeric(df["Modal_Price"], errors="coerce")
df = df.dropna()

# Encode categorical variables
state_encoder = LabelEncoder()
commodity_encoder = LabelEncoder()

df["STATE_encoded"] = state_encoder.fit_transform(df["STATE"])
df["Commodity_encoded"] = commodity_encoder.fit_transform(df["Commodity"])

# Define features (X) and label (y)
X = df[["STATE_encoded", "Commodity_encoded"]]
y = df["Modal_Price"]

# Split data (80% train, 20% test)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Create model
model = RandomForestRegressor(n_estimators=100, random_state=42)

# Train model
model.fit(X_train, y_train)

# Predict on test data
y_pred = model.predict(X_test)

# Evaluate model
mae = mean_absolute_error(y_test, y_pred)

print("Model trained successfully!")
print("Mean Absolute Error:", mae)

# Save model and encoders
pickle.dump(model, open("price_model.pkl", "wb"))
pickle.dump(state_encoder, open("state_encoder.pkl", "wb"))
pickle.dump(commodity_encoder, open("commodity_encoder.pkl", "wb"))

print("Model and encoders saved successfully!")