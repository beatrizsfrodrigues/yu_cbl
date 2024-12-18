import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Home as HomeIcon, Clipboard, User } from "react-feather";
import Tasks from "./components/Tasks.js";
import Home from "./components/Home.js";
import Profile from "./components/Profile.js";
import Login from "./components/Login.js";
import Register from "./components/Register.js";
import Welcome from "./components/Welcome.js";
import Defenition from "./components/Defenition.js";
import "./App.css";

function App() {
  return (
    <div className="navDiv">
      <Routes>
        <Route path="/">
          <Route path="/" element={<Home />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/defenition" element={<Defenition />} />
        </Route>
      </Routes>
      <nav>
        <Link to="/" className="navLink">
          <HomeIcon className="navIcon" />
        </Link>
        <Link to="/tasks" className="navLink">
          <Clipboard className="navIcon" />
        </Link>
        <Link to="/profile" className="navLink">
          <User className="navIcon" />
        </Link>
        <Link to="/login" className="navLink">
          Login
        </Link>
        <Link to="/register" className="navLink">
          Register
        </Link>
        <Link to="/welcome" className="navLink">
          Welcome
        </Link>
      </nav>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
