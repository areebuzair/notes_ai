import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TopBar from './TopBar';
import Quiz from './Quiz';
import '../Style/FileAnalysis.css';

function FileAnalysis() {
    const [files, setFiles] = useState([]);
    const [selectedFileName, setSelectedFileName] = useState('');
    const [fileUri, setFileUri] = useState({ "uri": "https://generativelanguage.googleapis.com/v1beta/files/z6qw1dm13ik3", "fileType": "application/pdf" });
    const [summary, setSummary] = useState('');
    const [questions, setQuestions] = useState([]);
    const [explanation, setExplanation] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Fetch available files when component mounts
    useEffect(() => {
        const fetchFiles = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setMessage('You must be logged in');
                return;
            }

            try {
                const response = await axios.get('http://localhost:8080/files/fileSystem/all', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setFiles(response.data);
            } catch (error) {
                setMessage('Failed to fetch files');
            }
        };

        fetchFiles();
    }, []);

    const analyzeFile = async () => {
        if (!selectedFileName) {
            setMessage('Please select a file first');
            return;
        }

        setLoading(true);
        const token = localStorage.getItem('token');

        try {
            const response = await axios.post(
                'http://localhost:8080/ai/files/upload',
                { fileName: selectedFileName },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setFileUri(response.data);
            setMessage('File analyzed successfully!');
        } catch (error) {
            console.error('Analysis error:', error);
            setMessage(error.response?.data?.message || 'Failed to analyze file');
        } finally {
            console.log({ fileUri })
            setLoading(false);
        }
    };

    const getSummary = async () => {
        if (!fileUri) {
            setMessage('Please analyze a file first');
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
            setMessage('Please analyze a file first');
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
            // console.log(response.data)
            setQuestions(response.data);
        } catch (error) {
            setMessage('Failed to generate questions');
        } finally {
            setLoading(false);
        }
    };

    const submitExplanation = async () => {
        if (!fileUri || !explanation) {
            setMessage('Please analyze a file and provide an explanation');
            return;
        }

        setLoading(true);
        const token = localStorage.getItem('token');

        console.log(fileUri)

        try {
            const response = await axios.post('http://localhost:8080/ai/files/analyze_explanation', {
                uri: fileUri.uri,
                fileType: fileUri.fileType,
                explanation: explanation
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setAiResponse(response.data);
        } catch (error) {
            console.log(error)
            setMessage('Failed to analyze explanation');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <TopBar />
            <div className="analysis-container">
                <h2 className="analysis-title">File Analysis</h2>

                <div className="analysis-wrapper">
                    <div className="analysis-select-section">
                        <div className="select-container">
                            <input
                                type="text"
                                value={selectedFileName}
                                onChange={(e) => setSelectedFileName(e.target.value)}
                                placeholder="Select or type file name"
                                list="file-list"
                                className="analysis-file-input"
                            />
                            <datalist id="file-list">
                                {files.map((file, index) => (
                                    <option key={index} value={file} />
                                ))}
                            </datalist>
                        </div>
                        <button
                            onClick={analyzeFile}
                            className="analysis-button"
                            disabled={loading || !selectedFileName}
                        >
                            Analyze File
                        </button>
                    </div>
                </div>

                <div className="analysis-blocks">
                    <div className="analysis-block">
                        <p className="block-description">Get a comprehensive summary of your document's content</p>
                        <button
                            onClick={getSummary}
                            className="analysis-button"
                            disabled={loading || !fileUri}
                        >
                            Get Summary
                        </button>
                        <p className="block-hint">Click to generate a concise overview</p>
                    </div>

                    <div className="analysis-block">
                        <p className="block-description">Generate practice questions from your content</p>
                        <button
                            onClick={getQuestions}
                            className="analysis-button"
                            disabled={loading || !fileUri}
                        >
                            Generate Questions
                        </button>
                        <p className="block-hint">Perfect for self-assessment and learning</p>
                    </div>
                </div>

                <div className="explanation-section">
                    <h3>Provide Your Explanation</h3>
                    <textarea
                        value={explanation}
                        onChange={(e) => setExplanation(e.target.value)}
                        placeholder="Enter your explanation here..."
                        className="explanation-input"
                        disabled={!fileUri}
                    />
                    <button
                        onClick={submitExplanation}
                        className="analysis-button"
                        disabled={loading || !fileUri || !explanation}
                    >
                        Submit Explanation
                    </button>
                </div>

                {message && <p className="analysis-message">{message}</p>}
                {loading && <div className="analysis-loading">Processing...</div>}



                {questions.length != 0 && (
                    <div className="analysis-result">
                        <h3>Generated Questions</h3>
                        <div className="analysis-content">
                            <Quiz Data={questions} />
                        </div>
                    </div>
                )}

                {summary && (
                    <div className="analysis-result">
                        <h3>Summary</h3>
                        <div className="analysis-content">{summary}</div>
                    </div>
                )}

                {aiResponse && (
                    <div className="analysis-result">
                        <h3>AI Response to Your Explanation</h3>
                        <div className="analysis-content">{aiResponse}</div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FileAnalysis;