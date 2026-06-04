import pandas as pd
import pickle
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import numpy as np

# LOAD DATA
df1 = pd.read_csv("dataset1.csv")
df2 = pd.read_csv("dataset2.csv")

# Rename columns
df1 = df1.rename(columns={
    "State": "State",
    "District": "District",
    "Market": "Market",
    "Commodity": "Commodity",
    "Modal_Price": "Modal_Price",
    "Arrival_Date": "Date"
})

df2 = df2.rename(columns={
    "STATE": "State",
    "District Name": "District",
    "Market Name": "Market",
    "Commodity": "Commodity",
    "Modal_Price": "Modal_Price",
    "Price Date": "Date"
})

# Merge
df = pd.concat([df1, df2], ignore_index=True)

# Keep required columns
df = df[["State", "District", "Market", "Commodity", "Modal_Price", "Date"]]


# CLEAN DATA
df["District"] = df["District"].fillna("Unknown")
df["Market"] = df["Market"].fillna("Unknown")

# Clean text
for col in ["State", "District", "Market", "Commodity"]:
    df[col] = df[col].astype(str).str.strip().str.title()

# Convert price
df["Modal_Price"] = pd.to_numeric(df["Modal_Price"], errors="coerce")

# Convert Date
df["Date"] = pd.to_datetime(df["Date"], errors="coerce", dayfirst=True)

# Drop missing
df = df.dropna(subset=["Modal_Price", "Date"])

# =========================
# FEATURE ENGINEERING
# =========================
df["month"] = df["Date"].dt.month
df["year"] = df["Date"].dt.year

# =========================
# ENCODING
# =========================
state_enc = LabelEncoder()
district_enc = LabelEncoder()
market_enc = LabelEncoder()
crop_enc = LabelEncoder()

df["state"] = state_enc.fit_transform(df["State"])
df["district"] = district_enc.fit_transform(df["District"])
df["market"] = market_enc.fit_transform(df["Market"])
df["crop"] = crop_enc.fit_transform(df["Commodity"])

# =========================
# FEATURES & TARGET
# =========================
X = df[["state", "district", "market", "crop", "month", "year"]]
y = df["Modal_Price"]

# =========================
# TRAIN TEST SPLIT (🔥 IMPORTANT)
# =========================
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# =========================
# MODEL (Random Forest)
# =========================
model = RandomForestRegressor(
    n_estimators=100,
    max_depth=15,
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)

# =========================
# EVALUATION
# =========================
y_pred = model.predict(X_test)

mae = mean_absolute_error(y_test, y_pred)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
r2 = r2_score(y_test, y_pred)

print("\n📊 IMPROVED MODEL PERFORMANCE:")
print("MAE:", round(mae, 2))
print("RMSE:", round(rmse, 2))
print("R2 Score:", round(r2, 4))

# =========================
# SAVE MODEL (same names → backend safe ✅)
# =========================
pickle.dump(model, open("price_model.pkl", "wb"))
pickle.dump(state_enc, open("state_encoder.pkl", "wb"))
pickle.dump(district_enc, open("district_encoder.pkl", "wb"))
pickle.dump(market_enc, open("market_encoder.pkl", "wb"))
pickle.dump(crop_enc, open("commodity_encoder.pkl", "wb"))

print("\n💾 Model & encoders saved successfully!")