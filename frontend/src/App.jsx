import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleLogin from './components/GoogleLogin';
import SignupPage from './components/SignupPage';
import Dashboard from './components/Dashboard';
import PageNotFound from './components/PageNotFound';
import { useState } from 'react';
import RefreshHandler from './components/RefreshHandler';
import VerifySuccess from './pages/VerifySuccess';
import VerifyFailed from './pages/VerifyFailed';
import EmailVerificationNotice from './pages/EmailVerificationNotice'; 

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <RefreshHandler setIsAuthenticated={setIsAuthenticated} />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<GoogleLogin />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
          <Route path="/verify-success" element={<VerifySuccess />} />
          <Route path="/verify-failed" element={<VerifyFailed />} />
          <Route path="/verify-email-notice" element={<EmailVerificationNotice />} /> {/* ✅ NEW */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
