import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import FAQ from "./components/FAQ/FAQ";

function RoutesWrapper() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/faq" element={<FAQ />} />
    </Routes>
  );
}

export default RoutesWrapper;
