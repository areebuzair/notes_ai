import React, { useState } from "react";
import axios from "axios";
import "../Style/MyFiles.css";

function FileUpload() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadMessage, setUploadMessage] = useState("");

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
        setUploadMessage("");
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setUploadMessage("Please select a file to upload.");
            return;
        }
        const token = localStorage.getItem("token");
        if (!token) {
            setUploadMessage("You must log in first.");
            return;
        }
        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            await axios.post("http://localhost:8080/files/fileSystem", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            setUploadMessage("File uploaded successfully!");
            setSelectedFile(null);
            window.location.reload(); // reload to show new file
        } catch (error) {
            setUploadMessage("Upload failed ❌");
        }
    };

    return (
        <div className="upload-box">
            <input
                type="file"
                onChange={handleFileChange}
                className="upload-input"
                id="file-upload"
            />
            <button className="upload-btn" onClick={handleUpload}>
                Upload File
            </button>
            {uploadMessage && <p className="upload-message">{uploadMessage}</p>}
        </div>
    );
}

export default FileUpload;
