import React, { useState } from "react";
import axios from "axios";
import "../Style/Login.css";
import logo from "../Photo/logo.jpg";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8080/api/auth/signin", {
                username,
                password,
            });
            const token = response.data; // backend returns JWT as plain string
            localStorage.setItem("token", token);
            setMessage("Login successful ✅");
        } catch (error) {
            setMessage("Invalid credentials ❌");
        }
    };

    return (
        <div className="login-background">
            <div className="login-box">
                <img src={logo} alt="App Logo" className="login-logo" />
                <h2 className="login-title">Login</h2>
                <form onSubmit={handleLogin} className="login-form">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="login-input"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="login-input"
                    />
                    <button type="submit" className="login-button">
                        Login
                    </button>
                </form>
                {message && <p className="login-message">{message}</p>}
            </div>
        </div>
    );
}

export default Login;
