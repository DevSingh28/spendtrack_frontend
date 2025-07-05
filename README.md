# 💰 SpendTracker – Smart Expense Management App

SpendTracker is a full-stack expense tracking and budget management app that allows users to add, manage, and visualize expenses, set monthly category-wise budgets, and receive smart alerts when spending crosses defined limits.

## 🔗 Live Demo

- Frontend: https://spendtrackerr.netlify.app  
- Backend API: https://spendtrack-backend-node.onrender.com  

## 🧠 Features

- Add, edit, and delete expenses with fields: amount, category, date, payment method, and optional notes  
- Filter expenses by category, date range, payment method, or keyword  
- Set monthly budgets for each category  
- Smart alerts when spending crosses 80% or 100% of the set budget  
- Generate monthly reports with:
  - Total spending  
  - Top spending category  
  - Overbudget categories  
  - Top 3 payment methods  
  - Full category breakdown  
- Interactive charts using Chart.js  
- Smooth animations using Framer Motion and React Bits  
- Fully responsive and mobile-optimized design  
- Cookie-based JWT authentication system  

## 🛠 How to Run Locally

### Backend (Node.js + Express + MongoDB)

```bash
git clone https://github.com/DevSingh28/spendtrack_backend_node
cd spendtrack_backend_node
npm install
cp .env.example .env
# Fill the required values in .env
npm start
```

### Frontend (React + Vite + Tailwind CSS)

```bash
git clone https://github.com/DevSingh28/spendtrack_frontend
cd spendtrack_frontend
npm install
npm run dev
```

> Make sure MongoDB is running and `.env` values are correctly configured.

## 🧪 Test Login

- Email: `user@example.com`  
- Password: `123456`

## 🌍 Deployed Links

- 🖥️ Frontend GitHub: [DevSingh28/spendtrack_frontend](https://github.com/DevSingh28/spendtrack_frontend)  
- 🛠️ Backend GitHub: [DevSingh28/spendtrack_backend_node](https://github.com/DevSingh28/spendtrack_backend_node)  
- 🌐 Live Site: [https://spendtrackerr.netlify.app](https://spendtrackerr.netlify.app)  
- ⚙️ API Base URL: [https://spendtrack-backend-node.onrender.com](https://spendtrack-backend-node.onrender.com)  

## 🌱 Environment Variables

Use the `.env.example` file in both frontend and backend.

### .env.example

```env
# Backend
PORT=5000
MONGO_URI=your_mongodb_connection_string
SECRET_TOKEN=your_jwt_secret

# Frontend (Vite)
VITE_BACKEND_URL=Your frontend url
```

## 🎁 Extra Features

- Animated homepage with responsive gradients and blurred blobs  
- Hero section with Framer Motion and TypeAnimation effects  
- Auth modal with smooth transitions between login/signup  
- Dynamic chart visualizations with Chart.js  
- Real-time filters and breakdowns  
- Mobile-first responsive layout  

---

Made with ❤️ by [Dev Singh](https://github.com/DevSingh28)
