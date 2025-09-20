import React from "react";
import { useNavigate, Link } from "react-router-dom";
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
                <div className="topbar-nav-buttons">
                    <Link to="/myfiles" className="topbar-nav-btn">My Files</Link>
                    <Link to="/analysis" className="topbar-nav-btn">Analysis</Link>
                </div>
            </div>
            <button className="topbar-logout-btn" onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
}

export default TopBar;