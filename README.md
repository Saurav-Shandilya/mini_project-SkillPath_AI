<p align="center">
  <h1 align="center">🚀 SkillPath AI</h1>
  <p align="center">
    <strong>AI-Powered Immersive Learning Platform — Learn Faster, Build Real Skills</strong>
  </p>
  <p align="center">
    <a href="#-devops--deployment">Architecture & Deployment</a> •
    <a href="#-key-features">Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#%EF%B8%8F-installation--setup">Setup</a>
  </p>
</p>

---

## 📖 Introduction

In a world overflowing with generic online courses, learners often waste time on redundant topics instead of writing actual code. 

**SkillPath AI** is an intelligent, zero-setup immersive learning platform. It analyzes your **Resume**, identifies your **technical gaps**, and dynamically generates a personalized interactive syllabus based on exactly what you need to learn. Every lesson drops you into a split-pane Interactive Lab where you read the theory on the left and execute AI-generated micro-tasks directly in the browser terminal on the right.

---

## ☁️ DevOps & Deployment

This project is a containerized MERN stack web application built using MongoDB, Express, React, and Node.js, following a scalable 3-tier architecture. The frontend is developed with React, the backend is powered by Node.js and Express, and MongoDB is used for efficient data storage.

The application is fully containerized using Docker and managed with Docker Compose to ensure consistency across environments. A complete CI/CD pipeline is implemented using Jenkins, where every code push automatically triggers build, testing, Docker image creation, and deployment.

The application is deployed on Amazon Web Services EC2, enabling seamless, automated, and scalable deployment with minimal manual effort. This project demonstrates real-world DevOps practices including continuous integration, continuous deployment, and cloud-based container orchestration.

---

## ✨ Key Features

### 1. 📂 Resume Analyzer & Gap Detection
Upload your existing resume to discover immediate technical gaps for your targeted role. Our AI engine builds a hyper-customized course structure covering exactly what you don't know, skipping the fluff.

### 2. 💻 Immersive Split-Pane Workspace
Zero context-switching. Real execution. Read dynamically generated theory on the left, and execute actual code in the real-time terminal natively in the browser on the right.

### 3. ✅ AI Micro-Tasks & 1-Click Code Copy
Dynamic checklists of practical hands-on tasks are generated alongside every new lesson. Features a custom Markdown renderer that injects 1-click "Copy Code" modules so you can instantly transfer AI's step-by-step guidance into your interactive terminal.

### 4. ▶️ In-Browser Terminal Execution
Run Python (via WebAssembly / Pyodide) and JavaScript natively in your browser. No local environment setup, missing dependencies, or pip install errors required. 

### 5. 🗺️ Dynamic Course Generation
Courses are generated dynamically, module-by-module, executing multi-turn LLM inference to ensure up-to-date, highly personalized content that adapts to your target goals.

---

## 🛠️ Tech Stack

### Frontend
- **React 19** + **Vite 8**
- **Tailwind CSS 4** (Aurora Nexus styling logic, Glassmorphism UI)
- **Framer Motion** (Smooth transitions and immersive IDE resizing)
- **React Markdown** (Custom code renderers)

### Backend
- **Node.js** + **Express 5**
- **Mongoose / MongoDB** (Caching dynamically generated courses)
- **AWS SDK** (LLM inference integration)

### Infrastructure & DevOps
- **Docker** & **Docker Compose**
- **Jenkins** (Continuous Integration & Continuous Deployment)
- **AWS EC2** (Cloud Hosting / Production deployment)

----

## 🖥️ Installation & Setup

### Prerequisites
- **Docker** and **Docker Compose** installed
- **AWS Account** (For deployment purposes)
- **MongoDB** (Local or Atlas URI)

### Local Development Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/Saurav-Shandilya/SkillPath-AI.git
cd SkillPath-AI
```

#### 2. Configure Environments

Create a `.env` in `client/`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
YOUTUBE_API_KEY=your_key
```

Create a `.env` in `server/`:
```env
PORT=5000
MONGODB_URI=your_mongo_url
JWT_SECRET=supersecret
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_id
AWS_SECRET_ACCESS_KEY=your_secret
```

#### 3. Run via Docker Compose (Recommended)
```bash
docker-compose up --build
```
Your application will be live at `http://localhost:5173`.

---


