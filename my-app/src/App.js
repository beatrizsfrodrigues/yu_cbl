import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import NavBar from "./components/NavBar"; 
import Tasks from "./components/Tasks";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Login from "./components/Login";
import Register from "./components/Register";
import Welcome from "./components/Welcome";
import Defenition from "./components/Defenition";
import "./App.css";


function AppContent() {
  const location = useLocation();
  const showNavRoutes = ["/", "/tasks", "/profile"];
  const shouldShowNav = showNavRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowNav && <NavBar />}
      <div className="route-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/defenition" element={<Defenition />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
