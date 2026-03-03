
# 🚀 How to Run the Project

---

## 1️⃣ Environment Configuration

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
```

---

## 2️⃣ MySQL Setup

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

## 3️⃣ Run the Project (Open 3 Terminals)

### 🔹 Terminal 1: Backend

```bash
cd backend
npm install
node server.js
```

---

### 🔹 Terminal 2: Python Server

```bash
cd backend
pip install requirement.txt
python server.py
```

---

### 🔹 Terminal 3: Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 Access the Application

* **Frontend:** [http://localhost:5173](http://localhost:5173)
* **Backend:** [http://localhost:5000](http://localhost:5000)
* **Python Server:** [http://localhost:5001](http://localhost:5001)

---

⚠️ Make sure all three terminals are running at the same time for the project to work properly.

