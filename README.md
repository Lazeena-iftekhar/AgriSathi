### 4. 💰 Price Prediction Module

- Machine Learning–powered crop price estimation system integrated into the agricultural platform  
- Predicts expected market price based on selected **state** and **crop (commodity)**  
- Uses a trained regression model for real-time price inference  
- Performs input validation to handle unseen states or commodities  
- Ensures consistent categorical encoding using saved LabelEncoders  
- Integrated with MySQL database to store predicted prices  
- Exposed via REST API endpoint (`/predict-price`)  
- Designed as a modular AI microservice within the backend architecture  

#### 🛠 Tech Stack Used

- **Machine Learning:** Random Forest Regressor (scikit-learn)  
- **Data Processing:** Pandas, NumPy  
- **Model Serialization:** Pickle  
- **AI Microservice:** Flask  
- **Backend Integration:** Node.js, Express.js  
- **Database:** MySQL  


#### 📊 Model Workflow

1. Load agricultural market dataset  
2. Select relevant columns: `STATE`, `Commodity`, `Modal_Price`  
3. Perform data cleaning and preprocessing  
4. Encode categorical features using `LabelEncoder`  
5. Split dataset into training (80%) and testing (20%)  
6. Train Random Forest Regressor model  
7. Evaluate using Mean Absolute Error (MAE)  
8. Serialize model and encoders using Pickle  

### 6. 🌾AgriSathi AI Chatbot Module

- Full-screen, responsive AI-powered agricultural assistant integrated into the platform  
- Supports contextual conversations for crop recommendation, soil classification, plant disease detection, and price insights  
- Maintains structured chat history for context-aware AI responses  
- Markdown-supported AI replies using **ReactMarkdown**  
- Hindi voice input integration using **Web Speech API (SpeechRecognition)**  
- File upload support (images/documents) for enhanced interaction  
- Real-time communication via REST API (`/api/chat`)  

#### 🛠 Tech Stack Used

- **Frontend:** React.js, React Hooks (useState, useEffect, useRef), CSS, ReactMarkdown  
- **Voice Processing:** Web Speech API  
- **Backend:** Node.js, Express.js (REST API Integration)  
- **AI Layer:** Google Gemini API (LLM-based conversational model integration)  


## 🚀 How to Run the Project

---

### 1️⃣ Environment Configuration

Create a `.env` file inside the `backend` folder.

📁 **Path:**

```
backend/.env
```

Add the following content:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=farmers
PORT=5000
PLANT_ID_API_KEY=whatsapp group pe
GEMINI_API_KEY=whatsapp group pe 
```

---

### 2️⃣ MySQL Setup

Open MySQL and run:

```bash
mysql -u root -p your_password
```

Then execute:

```sql
create database farmers;

USE farmers;

CREATE TABLE crop_prices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    crop_name VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE marketplace (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    state VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 3️⃣ Run the Project (Open 3 Terminals)

#### 🔹 Terminal 1: Backend

```bash
cd backend
npm install
node server.js
```

---

#### 🔹 Terminal 2: Python Server

```bash
cd backend
pip install requirement.txt
python server.py
```

---

#### 🔹 Terminal 3: Frontend

```bash
cd frontend
npm install
npm run dev
```

---

### 🌐 Access the Application

* **Frontend:** [http://localhost:5173](http://localhost:5173)
* **Backend:** [http://localhost:5000](http://localhost:5000)
* **Python Server:** [http://localhost:5001](http://localhost:5001)

---

⚠️ Make sure all three terminals are running at the same time for the project to work properly.

