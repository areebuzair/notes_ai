import { useState } from "react";
import axios from "axios";

export default function FileUpload() {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage("Please select a file first.");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            setMessage("You must log in first.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post(
                "http://localhost:8080/files/fileSystem",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            setMessage(`✅ File uploaded: ${response.data}`);
            setFile(null); // reset file input
        } catch (error) {
            setMessage("❌ File upload failed");
        }
    };

    return (
        <div>
            <h2>Upload File</h2>
            <input
                type="file"
                onChange={handleFileChange}
            />
            <button
                onClick={handleUpload}
            >
                Upload
            </button>
            {message && <p>{message}</p>}
        </div>
    );
}
