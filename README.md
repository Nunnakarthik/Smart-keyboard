# TribalType: Smart Tribal Keyboard

TribalType is a high-performance, aesthetically pleasing script workspace designed for tribal languages. It currently supports **Santali** and **Manipuri (Meitei Mayek)** with advanced features like phonetic transliteration, live translation, and voice-to-text.

![TribalType Interface](https://via.placeholder.com/800x400?text=TribalType+Interface+Mockup)

## ✨ Key Features

- **🌐 Multi-Language Support**: Seamlessly switch between Santali and Manipuri.
- **⌨️ Advanced Phonetic Typing**: Type in English and watch it transform into native scripts in real-time.
- **🤖 Live Sentence Translation**: Translate full English sentences directly into tribal scripts via a custom backend.
- **🎙️ Voice Dictation**: Integrated Web Speech API for hands-free typing in tribal scripts.
- **✨ Predictive Suggestions**: Real-time word suggestions to speed up your workflow.
- **🌓 Premium Themes**: 
  - **Studio**: A light, professional-grade workspace.
  - **Midnight**: A sleek, dark interface for prolonged productivity.
- **📱 Responsive Layout**: Fully optimized for both desktop and mobile use.

## 🏗️ Project Structure

The project is split into a modern decoupled architecture:

- **`/frontend`**: The React + Vite application. Handles the UI, transliteration logic, and dictation.
- **`/backend`**: Express.js server that manages translation requests via the Google Translate API.

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/)

### Local Setup

1. **Clone the repository**
2. **Setup Backend**:
   ```bash
   cd backend
   npm install
   npm start
   ```
   *The backend will run on `http://localhost:5000`.*

3. **Setup Frontend**:
   ```bash
   cd ../frontend
   npm install
   # Create a .env file (optional for local dev if backend is on 5000)
   # VITE_API_URL=http://localhost:5000
   npm run dev
   ```
   *The frontend will run on `http://localhost:5173`.*

## ☁️ Deployment

### Backend (Railway)
1. Push the `backend/` directory to Railway.
2. Ensure `PORT` is handled dynamically (default is 5000).

### Frontend (Vercel)
1. Deploy the `frontend/` directory to Vercel.
2. **Environment Variable**: Add `VITE_API_URL` pointing to your deployed Railway backend URL.

## 🛠️ Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)

### Backend
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Railway](https://img.shields.io/badge/Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)

### Deployment
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)

---
© 2026 TribalType Script Workspace
