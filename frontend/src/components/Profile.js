import React, { useState } from "react";
import TopBar from "./TopBar";
import profileIcon from "../Photo/profile.png";
import "../Style/Profile.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Profile() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleDelete = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.delete("http://localhost:8080/api/auth/delete_account", {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
                data: { username, password }, // ✅ axios lets you send body with DELETE
            });

            setMessage(response.data);

            if (response.data.includes("successfully")) {
                localStorage.removeItem("token");
                navigate("/login");
            }
        } catch (err) {
            setMessage("Error deleting account: " + (err.response?.data || err.message));
        }
    };

    return (
        <div className="profile-page">
            <TopBar />
            <div className="profile-content">
                <img src={profileIcon} alt="Profile" className="profile-avatar" />
                <h2 className="profile-username">USER</h2>

                <form className="delete-form" onSubmit={handleDelete}>
                    <h3>Delete Account</h3>
                    <input
                        type="text"
                        placeholder="Enter Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="delete-btn">
                        Delete Account
                    </button>
                </form>

                {message && <p className="delete-message">{message}</p>}
            </div>
        </div>
    );
}

export default Profile;
