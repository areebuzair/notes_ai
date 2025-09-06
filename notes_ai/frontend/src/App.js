import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import MyFiles from "./components/MyFiles";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/myfiles" element={<MyFiles />} />
            </Routes>
        </Router>
    );
}

export default App;
