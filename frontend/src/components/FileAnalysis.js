import React, { useState } from 'react';
import axios from 'axios';
import TopBar from './TopBar';
import '../Style/FileAnalysis.css';

function FileAnalysis() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileUri, setFileUri] = useState(null);
    const [summary, setSummary] = useState('');
    const [questions, setQuestions] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleFileSelect = (file) => {
        setSelectedFile(file);
        setMessage('');
        setSummary('');
        setQuestions('');
    };

    const uploadToGemini = async () => {
        if (!selectedFile) {
            setMessage('Please select a file first');
            return;
        }

        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
            setMessage('You must be logged in');
            setLoading(false);
            return;
        }

        // Create FormData with the actual file
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await axios.post(
                'http://localhost:8080/ai/files/upload', 
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                        // Remove Content-Type header to let browser set it automatically with boundary
                    }
                }
            );
            setFileUri(response.data);
            setMessage('File uploaded successfully!');
        } catch (error) {
            console.error('Upload error:', error);
            if (error.response?.status === 401) {
                setMessage('Authentication failed. Please login again.');
                
            } else {
                setMessage(error.response?.data?.message || 'Failed to upload file to Gemini');
            }
        } finally {
            setLoading(false);
        }
    };

    const getSummary = async () => {
        if (!fileUri) {
            setMessage('Please upload a file first');
            return;
        }

        setLoading(true);
        const token = localStorage.getItem('token');
        
        try {
            const response = await axios.get('http://localhost:8080/ai/files/summary', {
                params: fileUri,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setSummary(response.data);
        } catch (error) {
            setMessage('Failed to get summary');
        } finally {
            setLoading(false);
        }
    };

    const getQuestions = async () => {
        if (!fileUri) {
            setMessage('Please upload a file first');
            return;
        }

        setLoading(true);
        const token = localStorage.getItem('token');
        
        try {
            const response = await axios.get('http://localhost:8080/ai/files/generate_questions', {
                params: fileUri,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setQuestions(response.data);
        } catch (error) {
            setMessage('Failed to generate questions');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <TopBar />
            <div className="analysis-container">
                <h2 className="analysis-title">File Analysis</h2>
                
                <div className="analysis-upload-section">
                    <input
                        type="file"
                        onChange={(e) => handleFileSelect(e.target.files[0])}
                        className="analysis-file-input"
                    />
                    <button 
                        onClick={uploadToGemini}
                        className="analysis-button"
                        disabled={loading || !selectedFile}
                    >
                        Upload File for Analysis
                    </button>
                </div>

                <div className="analysis-actions">
                    <button 
                        onClick={getSummary}
                        className="analysis-button"
                        disabled={loading || !fileUri}
                    >
                        Get Summary
                    </button>
                    <button 
                        onClick={getQuestions}
                        className="analysis-button"
                        disabled={loading || !fileUri}
                    >
                        Generate Questions
                    </button>
                </div>

                {message && <p className="analysis-message">{message}</p>}
                
                {loading && <div className="analysis-loading">Processing...</div>}

                {summary && (
                    <div className="analysis-result">
                        <h3>Summary</h3>
                        <div className="analysis-content">{summary}</div>
                    </div>
                )}

                {questions && (
                    <div className="analysis-result">
                        <h3>Generated Questions</h3>
                        <div className="analysis-content">{questions}</div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FileAnalysis;