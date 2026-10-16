
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";
import Navbar2 from "./components/Navbar2";
import Chatbot from "./components/Chatbot";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Report from "./pages/Report";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <LandingPage />
            </Layout>
          }
        />

        <Route
          path="/login"
          element={
            <Layout>
              <Login />
            </Layout>
          }
        />

        <Route
          path="/signup"
          element={
            <Layout>
              <SignUp />
            </Layout>
          }
        />

        <Route
          path="/dashboard"
          element={
            <Navbar2>
              <Dashboard />
            </Navbar2>
          }
        />

        <Route
          path="/report"
          element={
            <Navbar2>
              <Report />
            </Navbar2>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Floating AI chatbot available across all routes */}
      <Chatbot />
    </BrowserRouter>
  );
}

export default App;
