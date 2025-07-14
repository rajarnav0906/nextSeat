import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useState } from "react";
import { Toaster } from "react-hot-toast";

import RefreshHandler from "./components/RefreshHandler";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import MainLayout from "./components/MainLayout";

import LandingPage from "./pages/LandingPage";
import GoogleLogin from "./components/GoogleLogin";
import SignupPage from "./components/SignupPage";
import Dashboard from "./components/Dashboard";
import IDUpload from "./components/IDUpload";

import EmailVerificationNotice from "./pages/EmailVerificationNotice";
import VerifySuccess from "./pages/VerifySuccess";
import VerifyFailed from "./pages/VerifyFailed";
import PageNotFound from "./components/PageNotFound";
import TravelPage from "./pages/TravelPage";
import AddTripPage from "./pages/AddTripPage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <RefreshHandler setIsAuthenticated={setIsAuthenticated} />
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <GoogleLogin />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignupPage />
              </PublicRoute>
            }
          />

          <Route
            path="/verify-email-notice"
            element={<EmailVerificationNotice />}
          />
          <Route path="/verify-success" element={<VerifySuccess />} />
          <Route path="/verify-failed" element={<VerifyFailed />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
  path="/add-trip"
  element={
    <MainLayout>
      <AddTripPage />
    </MainLayout>
  }
/>
          <Route
            path="/upload-id"
            element={
              <ProtectedRoute checkVerifiedOnly={true}>
                <IDUpload />
              </ProtectedRoute>
            }
          />

          <Route
  path="/travel"
  element={
    <MainLayout>
      <TravelPage />
    </MainLayout>
  }
/>
          <Route
            path="/tickets"
            element={
              <MainLayout>
                <div>Tickets Page Coming Soon</div>
              </MainLayout>
            }
          />

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
