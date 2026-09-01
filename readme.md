# Mockly 🎯

A full-stack AI-powered mock interview platform that helps developers practice technical interviews. The application uses Google Gemini AI to generate interview questions and provide intelligent feedback on candidate responses.

## ✨ Features

- **User Authentication**: Secure registration and login with OTP email verification
- **AI-Powered Interviews**: Generate interview questions using Google Gemini AI based on technology and difficulty level
- **Real-time Interview Sessions**: Interactive interview interface with question-by-question progression
- **AI Evaluation**: Automated scoring and detailed feedback on interview performance
- **Interview History**: Track and review all past interview sessions
- **User Profiles**: Manage and view user profiles with interview statistics
- **Dashboard**: Comprehensive overview of interview performance and statistics
- **Email Notifications**: OTP verification and interview updates via email

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **AI Integration**: Google Gemini AI (gemini-2.5-flash)
- **Authentication**: JWT (JSON Web Tokens) with cookie-based sessions
- **Email Service**: Nodemailer
- **Security**: bcrypt for password hashing

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit with Redux Persist
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios
- **Icons**: React Icons

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local instance or MongoDB Atlas account)
- **Google Gemini API Key** (from [Google AI Studio](https://makersuite.google.com/app/apikey))

## 🚀 Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd interviewPrep
```

### 2. Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend` directory:
```env
PORT=5000
MONGODB_URL=your_mongodb_connection_string
GEMINI_API_KEY=your_google_gemini_api_key
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password
FRONTEND_URL=http://localhost:5173
```

### 3. Frontend Setup

```bash
cd Frontend
npm install
```

Create a `.env` file in the `Frontend` directory (if needed):
```env
VITE_API_URL=http://localhost:5000/api/v1
```

## 🏃 Running the Application

### Development Mode

**Backend:**
```bash
cd Backend
npm run dev
```
The backend server will start on `http://localhost:5000`

**Frontend:**
```bash
cd Frontend
npm run dev
```
The frontend will start on `http://localhost:5173`

### Production Mode

**Backend:**
```bash
cd Backend
npm start
```

**Frontend:**
```bash
cd Frontend
npm run build
npm run preview
```

## 📁 Project Structure

```
interviewPrep/
├── Backend/
│   ├── app.js                 # Express app configuration
│   ├── index.js               # Server entry point
│   ├── package.json
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── user.controller.js
│   │   ├── interview.controller.js
│   │   └── dashboard.controller.js
│   ├── middelwares/
│   │   └── auth.js            # JWT authentication middleware
│   ├── models/
│   │   ├── User.model.js
│   │   └── Interview.model.js
│   ├── routes/
│   │   ├── user.routes.js
│   │   ├── interview.routes.js
│   │   └── dashboard.routes.js
│   └── utils/
│       ├── gemini.js          # Google Gemini AI integration
│       └── sendEmail.js       # Email service
│
└── Frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── public/
    └── src/
        ├── App.jsx             # Main app component with routing
        ├── main.jsx            # React entry point
        ├── Layout.jsx          # Layout wrapper
        ├── components/
        │   ├── Header.jsx
        │   ├── Footer.jsx
        │   ├── ProtectedRoute.jsx
        │   ├── ProfileForm.jsx
        │   ├── UserProfileCard.jsx
        │   ├── InterviewHistory.jsx
        │   └── OTPInput.jsx
        ├── pages/
        │   ├── Home.jsx
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── OTPVerification.jsx
        │   ├── Dashboard.jsx
        │   ├── Interview.jsx
        │   ├── InterviewSession.jsx
        │   ├── InterviewResults.jsx
        │   ├── UserProfile.jsx
        │   └── ViewProfile.jsx
        └── store/
            ├── index.js        # Redux store configuration
            └── slices/
                ├── authSlice.js
                ├── interviewSlice.js
                ├── dashboardSlice.js
                └── profileSlice.js
```

## 🔌 API Endpoints

### User Routes (`/api/v1/user`)
- `POST /register` - Register a new user
- `POST /verify` - Verify email with OTP
- `POST /login` - User login
- `GET /logout` - User logout
- `POST /resend` - Resend OTP
- `GET /my-profile` - Get logged-in user's profile (Protected)
- `PUT /profile` - Update user profile (Protected)
- `GET /profile/:userId` - Get specific user's public profile

### Interview Routes (`/api/v1/interview`)
- `POST /start` - Start a new interview session (Protected)
- `POST /submit/:id` - Submit answer for a question (Protected)
- `GET /results/:interviewId` - Get interview results (Protected)
- `GET /history` - Get user's interview history (Protected)

### Dashboard Routes (`/api/v1/dashboard`)
- Various dashboard statistics endpoints (Protected)

## 🎯 Key Features Explained

### AI-Powered Question Generation
The application uses Google Gemini AI to generate contextual interview questions based on:
- **Technology**: e.g., JavaScript, Python, React, Node.js
- **Difficulty Level**: Beginner, Intermediate, Advanced

### Interview Evaluation
After completing an interview, the AI evaluates:
- Overall score (out of 10)
- Detailed feedback on strengths and areas for improvement
- Performance analysis based on difficulty level

### Authentication Flow
1. User registers with email
2. OTP sent to email for verification
3. After verification, user can login
4. JWT tokens stored in HTTP-only cookies for security

## 🔒 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- HTTP-only cookies for token storage
- Protected routes on both frontend and backend
- CORS configuration for secure cross-origin requests

## 📝 Environment Variables

### Backend `.env`
| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGODB_URL` | MongoDB connection string |
| `GEMINI_API_KEY` | Google Gemini API key |
| `JWT_SECRET` | Secret for JWT token signing |
| `JWT_REFRESH_SECRET` | Secret for refresh token signing |
| `EMAIL_HOST` | SMTP server host |
| `EMAIL_PORT` | SMTP server port |
| `EMAIL_USER` | Email address for sending emails |
| `EMAIL_PASS` | App-specific password for email |
| `FRONTEND_URL` | Frontend application URL |

## 🧪 Development

### Available Scripts

**Backend:**
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Google Gemini AI for interview question generation and evaluation
- React and Vite communities for excellent tooling
- Express.js and MongoDB for robust backend infrastructure

---

**Note**: Make sure to set up all environment variables before running the application. The application requires a valid MongoDB connection and Google Gemini API key to function properly.
