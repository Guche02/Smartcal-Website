// Routes.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./Components/Home";
import Display from "./Components/Display";
import Registration from "./Components/Register";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/display" element={<Display />} />
        <Route path="/register" element={<Registration />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;

