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

    const download_file = (name) => {
        const token = localStorage.getItem("token");
        if (!token) {
            setMessage("You must log in first.");
            return;
        }

        axios
            .get(`http://localhost:8080/files/fileSystem/${encodeURI(name)}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: "blob", // important for binary files
            })
            .then((response) => {
                // Create a download link
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = url;

                // Extract filename from headers (fallback to `name`)
                const contentDisposition = response.headers["content-disposition"];
                let fileName = name;
                if (contentDisposition) {
                    const match = contentDisposition.match(/filename="(.+)"/);
                    if (match.length > 1) {
                        fileName = match[1];
                    }
                }

                link.setAttribute("download", fileName);
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
            })
            .catch(() => {
                setMessage("Failed to fetch file ❌");
            });
    };

    const view_file = (name) => {
        const token = localStorage.getItem("token");
        if (!token) {
            setMessage("You must log in first.");
            return;
        }

        axios
            .get(`http://localhost:8080/files/fileSystem/${encodeURI(name)}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: "blob",
            })
            .then((response) => {
                const file = new Blob([response.data], { type: response.headers["content-type"] });
                const fileURL = window.URL.createObjectURL(file);

                // Open in new tab
                window.open(fileURL, "_blank");

                // Optional: revoke the URL later to free memory
                setTimeout(() => window.URL.revokeObjectURL(fileURL), 1000 * 60);
            })
            .catch(() => {
                setMessage("Failed to open file ❌");
            });
    };



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
                            <button type="button" onClick={() => download_file(file)}>Download</button>
                            <button type="button" onClick={() => view_file(file)}>View</button>
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
