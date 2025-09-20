import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Style/MyFiles.css";
import folderIcon from "../Photo/folder.png";
import FileUpload from "./UploadButton";

function MyFiles() {
    const [files, setFiles] = useState([]);
    const [message, setMessage] = useState("");
    const [viewerUrl, setViewerUrl] = useState(null); // Add this state

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
                responseType: "blob",
            })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = url;
                const contentDisposition = response.headers["content-disposition"];
                let fileName = name;
                if (contentDisposition) {
                    const match = contentDisposition.match(/filename="(.+)"/);
                    if (match && match.length > 1) {
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
                setViewerUrl(fileURL); // Set the URL for iframe
            })
            .catch(() => {
                setMessage("Failed to open file ❌");
            });
    };

    const closeViewer = () => {
        if (viewerUrl) window.URL.revokeObjectURL(viewerUrl);
        setViewerUrl(null);
    };

    return (
        <div className="files-container">
            <h2 className="files-title">My Files</h2>
            {message && <p className="files-message">{message}</p>}
            <div className="upload-section">
                <FileUpload />
            </div>
            <div className="files-grid">
                {files.length > 0 ? (
                    files.map((file, index) => (
                        <div className="file-card" key={index}>
                            <img src={folderIcon} alt="file" className="file-icon" />
                            <p className="file-name">{file}</p>
                            <div className="file-actions">
                                <button className="file-btn" onClick={() => download_file(file)}>Download</button>
                                <button className="file-btn" onClick={() => view_file(file)}>View</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No files found.</p>
                )}
            </div>
            {viewerUrl && (
                <div className="file-viewer-modal">
                    <div className="file-viewer-topbar">
                        <span className="file-viewer-title">File Viewer</span>
                        <button className="file-viewer-close-btn" onClick={closeViewer}>✕</button>
                    </div>
                    <iframe
                        src={viewerUrl}
                        title="File Viewer"
                        className="file-viewer-iframe"
                        frameBorder="0"
                        width="90%"
                        height="600px"
                        style={{ margin: "0 auto", display: "block", background: "#fff", borderRadius: "0 0 8px 8px" }}
                    />
                </div>
            )}
        </div>
    );
}

export default MyFiles;
