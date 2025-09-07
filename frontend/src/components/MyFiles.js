import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Style/MyFiles.css";
import folderIcon from "../Photo/folder.png";

function MyFiles() {
    const [files, setFiles] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setMessage("You must log in first.");
            return;
        }

        axios
            .get("http://localhost:8080/files/fileSystem/all", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                setFiles(response.data);
            })
            .catch(() => {
                setMessage("Failed to fetch files ❌");
            });
    }, []);

    return (
        <div className="files-container">
            <h2 className="files-title">My Files</h2>
            {message && <p className="files-message">{message}</p>}
            <div className="files-grid">
                {files.length > 0 ? (
                    files.map((file, index) => (
                        <div className="file-card" key={index}>
                            <img src={folderIcon} alt="file" className="file-icon" />
                            <p className="file-name">{file}</p>
                        </div>
                    ))
                ) : (
                    <p>No files found.</p>
                )}
            </div>
        </div>
    );
}

export default MyFiles;
