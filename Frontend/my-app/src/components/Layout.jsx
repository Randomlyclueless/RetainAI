import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <>
      <Navbar />     {/* ✅ added navbar */}
      
      {children}     {/* page content */}

      <Footer />     {/* footer stays at bottom */}
    </>
  );
}