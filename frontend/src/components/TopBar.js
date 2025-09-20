import React from "react";
import { useNavigate } from "react-router-dom";
import "../Style/TopBar.css";
import logo from "../Photo/logo.jpg";

function TopBar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="topbar-container">
            <div className="topbar-left">
                <img src={logo} alt="Notes.ai Logo" className="topbar-logo" />
                <span className="topbar-title">notes.ai</span>
            </div>
            <button className="topbar-logout-btn" onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
}

export default TopBar;