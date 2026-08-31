import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import OTPVerification from './pages/OTPVerification';
import Dashboard from './pages/Dashboard';
import Interview from './pages/Interview';
import ProtectedRoute from './components/ProtectedRoute';
import ViewProfile from './pages/ViewProfile'
import UserProfile from './pages/UserProfile'
import InterviewSession from './pages/InterviewSession';
import InterviewResults from './pages/InterviewResults';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="verify" element={<OTPVerification />} />
          <Route path="interview" element={<Interview />} />
          <Route path="interview" element={<Interview />} />
          <Route path="interview-session" element={
            <ProtectedRoute>
              <InterviewSession />
            </ProtectedRoute>
          } />
          <Route path="interview-results" element={
            <ProtectedRoute>
              <InterviewResults />
            </ProtectedRoute>
          } />
          {/* Protected Routes */}
          <Route path="dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="profile" element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } />
          <Route path="profile/:userId" element={
            <ProtectedRoute>
              <ViewProfile />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;