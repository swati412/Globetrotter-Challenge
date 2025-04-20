# Headout-Globetrotter-Challenge
Globetrotter is a full-stack web app where users get cryptic clues about a famous place and must guess which destination it refers to. Once they guess, they'll unlock fun facts, trivia, and surprises about the destination!


## 🛠 Tech Stack & Architecture

### Backend
- **Framework**: FastAPI
- **Database**: MongoDB
- **Key Features**:
  * RESTful API design
  * Async support
  * Data validation
  * Efficient database operations

### Frontend
- **Framework**: React.js
- **Styling**: Tailwind CSS
- **Technologies**:
  * HTML5
  * Responsive design
  * Component-based architecture

### Deployment
- **Platform**: Netlify
- **Continuous Deployment**: Automated CI/CD pipeline

## 🎯 Project Overview

### 1. Dataset
- [x] Created a comprehensive dataset of 100+ destinations
- [x] Utilized AI tools for dataset expansion
- [x] Dataset includes:
  * Cryptic clues for each destination
  * Fun facts
  * Interesting trivia

### 2. Web Application Features
#### Gameplay Mechanics
- [x] Randomly select 1-2 clues for a destination
- [ ] Multiple-choice destination guessing
- [x] Immediate feedback system
  * Correct Answer:
    - Confetti animation
    - Reveal a fun fact
  * Incorrect Answer:
    - Sad-face animation
    - Reveal a fun fact
- [x] 'Play Again' or 'Next' button to load a different destination
- [x] User score tracking
  * Total correct answers
  * Total incorrect answers

#### Backend Requirements
- [x] Storing dataset on backend
- [x] Preventing users from accessing all questions/answers through source code

### 3. "Challenge a Friend" Feature
#### User Registration
- [x] Username is entered before playing
- [x] It Creates user profile in the system if username is found unique, else re-enter username message is displayed

#### Friend Challenge Mechanism
- [x] 'Challenge a Friend' button functionality
- [x] Share popup with:
  * Dynamic invite image
  * WhatsApp invitation link
- [x] Display invitee's score to the invited friend
- [x] Invitation link provides full game access

## Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/BelieveInTheLimitless/Headout-Globetrotter-Challenge.git
cd Headout-Globetrotter-Challenge
```

### 2. Running the application with Docker

#### Easy Start (Recommended)
We've created convenient scripts to start the entire application with a single command:

**On Linux/Mac:**
```bash
./run.sh
```

**On Windows:**
```bash
run.bat
```

These scripts will start MongoDB, the backend API, and the frontend UI. You can access:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5002
- MongoDB: mongodb://localhost:27017

#### Manual Docker Compose
Alternatively, you can use Docker Compose directly:

```bash
# Build and start all services
docker-compose up --build

# Or run in the background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### 3. Running Locally (Without Docker)

#### Backend
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 5002 --reload
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

#### MongoDB
You'll need MongoDB running locally or via Docker:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```
