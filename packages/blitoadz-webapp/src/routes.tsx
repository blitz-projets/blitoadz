import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import FAQ from "./components/FAQ/FAQ";
import Team from "./components/Team/Team";

function RoutesWrapper() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/team" element={<Team />} />
    </Routes>
  );
}

export default RoutesWrapper;
