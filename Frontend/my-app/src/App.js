import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import Working from "./pages/Working";
import Pricing from "./pages/Pricing";
import FeaturesPage from "./pages/Features";
import Resources from "./pages/Resources";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Report from "./pages/Report";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={< SignUp/>} />
          <Route path="/working" element={< Working/>} />
          <Route path="/pricing" element={< Pricing/>} />
          <Route path="/features" element={< FeaturesPage/>} />
          <Route path="/resources" element={< Resources/>} />
          <Route path="/home" element={< Home/>} />
          <Route path="/dashboard" element={< Dashboard/>} />
          <Route path="/report" element={< Report/>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;