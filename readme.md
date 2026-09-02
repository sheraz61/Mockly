# Mockly - Complete Case Study
## AI-Powered Technical Interview Platform

---

## Executive Summary

**Mockly** is a comprehensive, production-grade AI-powered mock interview platform built with modern full-stack JavaScript technologies. The platform seamlessly helps developers practice technical interviews by leveraging advanced AI to generate context-aware questions, evaluate answers, and provide actionable feedback.

### Key Value Propositions:
- **Intelligent Assessment**: Utilizes Google Gemini AI to generate tailored questions and evaluate responses with detailed feedback.
- **Voice-Enabled Interface**: Integrates native Web Speech API for real-time speech-to-text, simulating a natural conversational interview environment.
- **Comprehensive Analytics**: Tracks performance over time with visual data representation and detailed history logs.
- **Robust Security and Abuse Prevention**: Implements JWT authentication, OTP verification via Brevo, and rate-limiting to prevent API abuse.

---

## Project Goals & Objectives

### Primary Objectives
1. **Simulate Real Interviews**: Build a platform that closely mimics technical interviews using AI-generated questions and voice-to-text input.
2. **Deliver Actionable Feedback**: Provide users with immediate, AI-driven evaluation, including a score and constructive feedback.
3. **Ensure Platform Sustainability**: Implement rate limits (3 interviews per day) to manage API token consumption and prevent abuse.
4. **Provide Secure Authentication**: Use OTP email verification and JWTs for secure user registration and session management.
5. **Track User Progress**: Create comprehensive dashboards and profile pages to visualize performance trends over time.

### Secondary Objectives
- Allow users to enter custom interview topics beyond predefined categories.
- Ensure a responsive, accessible, and modern user interface using React and Tailwind CSS.
- Maintain public profiles so users can share their interview performance.

---

## System Architecture

### High-Level System Architecture

```mermaid
graph TB
  subgraph "Client Layer"
    FrontendApp[" Frontend Application<br/>(React SPA)"]
  end

  subgraph "API Layer"
    APIGateway[" Express.js API<br/>REST Endpoints<br/>v1/user, v1/interview, v1/dashboard"]
  end

  subgraph "Business Logic Layer"
    UserAuth["User Authentication<br/>JWT + bcrypt + OTP"]
    ProfileMgmt["Profile Management<br/>Public/Private profiles"]
    InterviewEngine["Interview Engine<br/>Session management, Rate limiting"]
    EvaluationEngine["Evaluation Engine<br/>Scoring and feedback"]
    AnalyticsEngine["Analytics Engine<br/>Performance aggregation"]
  end

  subgraph "Data Layer"
    MongoDB[("MongoDB Atlas<br/>Document Database<br/>Users, Interviews collections")]
  end

  subgraph "External Services"
    GeminiAI["Google Gemini API<br/>AI Model (gemini-2.5-flash)"]
    BrevoAPI["Brevo API<br/>Transactional Email Service"]
    WebSpeech["Web Speech API<br/>Browser Native Speech-to-Text"]
  end

  FrontendApp -->|HTTP REST| APIGateway
  FrontendApp -.->|Browser API| WebSpeech
  
  APIGateway --> UserAuth
  APIGateway --> ProfileMgmt
  APIGateway --> InterviewEngine
  APIGateway --> EvaluationEngine
  APIGateway --> AnalyticsEngine
  
  UserAuth --> MongoDB
  ProfileMgmt --> MongoDB
  InterviewEngine --> MongoDB
  EvaluationEngine --> MongoDB
  AnalyticsEngine --> MongoDB
  
  InterviewEngine --> GeminiAI
  EvaluationEngine --> GeminiAI
  UserAuth --> BrevoAPI
```

---

## Database Design Architecture

### Database Schema Relationships

```mermaid
graph TB
    subgraph "User Management"
        USER["<b>USER</b><br/>_id, name, email<br/>password, isVerified<br/>profile (bio, techStack, etc)<br/>createdAt"]
    end
    
    subgraph "Interview Management"
        INTERVIEW["<b>INTERVIEW</b><br/>_id, userId, technology<br/>difficulty, status, questions[]<br/>overallScore, feedback<br/>createdAt"]
    end
    
    %% User Relationships
    USER -->|takes| INTERVIEW
    
```

### Key Collections

| Collection | Purpose | Key Fields |
|-----------|---------|-----------|
| **Users** | Account authentication and profile data | name, email, password, isVerified, profile object |
| **Interviews**| Interview session tracking and AI evaluations | userId, technology, difficulty, questions array, status, overallScore, feedback |

---

## Application Flow Diagrams

### User Authentication & Onboarding

```mermaid
graph LR
  Start([Visit Mockly]) --> Signup{Has Account?}
  
  Signup -->|No| Register["Register (Email, Name, Password)"]
  Signup -->|Yes| Login["Login (Email, Password)"]
  
  Register --> OTP["OTP Verification via Brevo"]
  OTP --> Login
  
  Login --> AuthCheck{Credentials Valid?}
  AuthCheck -->|No| Login
  AuthCheck -->|Yes| Dashboard["User Dashboard"]
```

### Interview Session Flow

```mermaid
graph TD
  Dashboard([Dashboard]) --> StartInterview["Start Interview Setup"]
  
  StartInterview --> EnterTopic["Select/Enter Topic & Difficulty"]
  EnterTopic --> RateLimitCheck{Daily Limit Reached?}
  
  RateLimitCheck -->|Yes| LimitError["Error: Daily limit (3) reached"]
  RateLimitCheck -->|No| GenerateQ["Generate 8 Questions via Gemini AI"]
  
  GenerateQ --> SessionStart["Interview Session Begins"]
  
  SessionStart --> AnswerQ["Answer Question<br/>(Typing or Speech-to-Text)"]
  AnswerQ --> SubmitA["Submit Answer"]
  
  SubmitA --> NextQ{More Questions?}
  NextQ -->|Yes| AnswerQ
  
  NextQ -->|No| Evaluate["Evaluate Complete Interview via Gemini AI"]
  Evaluate --> SaveResults["Save Score & Feedback to DB"]
  SaveResults --> ViewResults["View Results Page"]
  
  ViewResults --> ProfileUpdate["Stats updated on User Profile"]
```

---

## Project Structure Overview

The project is organized into two main deployment units:

```mermaid
graph TB
  subgraph "Deployment Units"
    Backend["Backend API<br/>Express.js + Node.js"]
    Frontend["Frontend App<br/>React + Vite"]
    Database["Database<br/>MongoDB Atlas"]
  end
  
  subgraph "Key Directories - Backend"
    Controllers["Controllers<br/>Route handlers"]
    Models["Models<br/>Mongoose schemas"]
    Middleware["Middleware<br/>Auth, Error handlers"]
    Utils["Utilities<br/>Gemini, Brevo APIs"]
  end
  
  subgraph "Key Directories - Frontend"
    Pages["Pages<br/>App views"]
    Components["Components<br/>Reusable UI"]
    Redux["Redux Store<br/>State management"]
  end
  
  Backend --> Controllers
  Backend --> Models
  Backend --> Middleware
  Backend --> Utils
  
  Frontend --> Pages
  Frontend --> Components
  Frontend --> Redux
  
  Backend --> Database
  Frontend -->|HTTP/REST| Backend
```

**For detailed directory structure and file descriptions, refer to PROJECT_STRUCTURE.md**

---

## Core Features & Capabilities

### AI-Powered Interview Engine
- **Question Generation**: Uses Google Gemini (gemini-2.5-flash) to generate 8 contextual questions based on technology and difficulty.
- **Custom Topics**: Users can input custom technologies or frameworks for niche interview practice.
- **Automated Evaluation**: AI grades the entire session, providing a score out of 10 and constructive feedback.

### Voice-Enabled Input
- **Speech-to-Text**: Integrates the native Web Speech API allowing users to dictate answers in real-time.
- **Visual Feedback**: Pulsing recording indicators and graceful fallbacks for unsupported browsers.

### Profile & Analytics
- **Public & Private Profiles**: Users can view their own analytics or share their public profile link.
- **Performance Charts**: Visualizes score trends across past interviews using Recharts.
- **History Tracking**: Keeps a detailed log of all past interviews, technologies, and difficulties.

### Security & Rate Limiting
- **Daily Caps**: Hard limit of 3 interviews per user per day to manage AI token consumption.
- **Secure Authentication**: JWT-based session management and bcrypt password hashing.
- **OTP Verification**: Email verification flow using the Brevo REST API.

---

## Technology Stack

### Frontend Technologies
| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | React 19.x | UI library for dynamic interfaces |
| **Build Tool** | Vite 7.x | Fast module bundler and dev server |
| **Styling** | Tailwind CSS 3.4 | Utility-first CSS framework |
| **State Management** | Redux Toolkit | Predictable state container |
| **HTTP Client** | Axios | Promise-based HTTP client |
| **Routing** | React Router 7.x | Client-side routing solution |
| **Charts** | Recharts | Composable charting library |
| **Icons** | React Icons | SVG icon library |

### Backend Technologies
| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Runtime** | Node.js | JavaScript server runtime |
| **Framework** | Express.js 5.x | Web application framework |
| **Database** | MongoDB 5.0+ | NoSQL document database |
| **ODM** | Mongoose 8.x | MongoDB object modeling |
| **Authentication** | JWT 9.0 | JSON Web Token implementation |
| **Password Security** | bcrypt 6.0 | Password hashing library |
| **AI Integration** | @google/generative-ai | Google Gemini API client |
| **Email Service** | Brevo REST API | Transactional email delivery |
| **CORS** | CORS 2.8 | Cross-Origin Resource Sharing |
| **Environment** | dotenv 17.2 | Environment variable management |

### Infrastructure & External Services
| Service | Purpose | Details |
|---------|---------|---------|
| **MongoDB Atlas** | Database hosting | Cloud NoSQL database |
| **Google AI Studio**| AI API | Gemini-2.5-flash model |
| **Brevo** | Email API | OTP and notification delivery |

---

## API Documentation Overview

The backend exposes a RESTful API organized into main route modules:

### API Routes Structure

```
/api/v1/
├── /user           → Authentication, registration, profile management
├── /interview      → Starting sessions, submitting answers, history
└── /dashboard      → Analytical endpoints for user dashboard
```

### Key API Endpoints (Examples)

#### Authentication & User
```
POST   /api/v1/user/register          → Create user account and trigger OTP
POST   /api/v1/user/verify            → Verify email with OTP
POST   /api/v1/user/login             → Authenticate user
GET    /api/v1/user/my-profile        → Fetch logged-in user profile
PUT    /api/v1/user/profile           → Update profile data
```

#### Interview
```
POST   /api/v1/interview/start        → Initialize 8-question interview session
POST   /api/v1/interview/submit/:id   → Submit answer for current question
GET    /api/v1/interview/results/:id  → Retrieve evaluation results
GET    /api/v1/interview/history      → List all completed interviews
GET    /api/v1/interview/analytics    → Get aggregate performance data
```

---

## Known Issues & Recommendations

### Recommendations for Future Development
1. **Audio Recording**: Store actual audio clips of user responses for playback and review.
2. **Real-time AI Voice**: Implement Text-to-Speech (TTS) so the AI "speaks" the question aloud.
3. **Advanced Analytics**: Break down scoring by soft skills, technical accuracy, and clarity.
4. **OAuth Integration**: Add Google/GitHub single sign-on (SSO) for faster onboarding.
5. **Caching**: Implement Redis to cache public profile data and reduce database load.

---

## Development Team

**Architecture**: Full-stack JavaScript (MERN stack)  
**Last Updated**: September 2026

---

## Support & Documentation

For questions about specific components or implementation details:
- **Project Structure**: See PROJECT_STRUCTURE.md
- **Architecture Details**: Review system diagrams above
