import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignInSignUp from "./pages/SignInSignUp";
import Home from "./pages/Home";
import History from "./pages/History";
import Inventory from "./pages/Inventory";
import Navbar from "./components/Navbar";

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<SignInSignUp />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/history" element={<History />} />
        <Route path="/inventory" element={<Inventory />} />
      </Routes>
    </Router>
  );
};

export default App;
