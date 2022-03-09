import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";

function RoutesWrapper() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default RoutesWrapper;
