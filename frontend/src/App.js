import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Registration from './components/Registration';
import MyFiles from './components/MyFiles';
import FileAnalysis from './components/FileAnalysis';
import Profile from "./components/Profile";
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/myfiles" element={<MyFiles />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/analysis" element={<FileAnalysis />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;