import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Predict from "./pages/Predict";
import Dashboard from "./pages/Dashboard"; // 👈 ADD THIS

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/predictions" element={<Predict />} />
        <Route path="/dashboard" element={<Dashboard />} /> {/* 👈 ADD THIS */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;