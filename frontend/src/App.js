/**
 * Cloud Image Platform - Main Application Component
 * Handles image upload and gallery display
 */

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';

// Backend API URL from environment or default to localhost
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  /**
   * Fetch all uploaded images from backend
   */
  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/images`);
      setImages(response.data.images);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching images:', error);
      showMessage('Failed to load images', 'error');
      setLoading(false);
    }
  }, []);

  // Fetch images on component mount
  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  /**
   * Handle file selection
   */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showMessage('Please select an image file', 'error');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        showMessage('File size must be less than 5MB', 'error');
        return;
      }

      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * Handle image upload
   */
  const handleUpload = async () => {
    if (!selectedFile) {
      showMessage('Please select an image first', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      setUploading(true);
      await axios.post(`${API_URL}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      showMessage('Image uploaded successfully!', 'success');
      
      // Reset form
      setSelectedFile(null);
      setPreviewUrl(null);
      document.getElementById('fileInput').value = '';

      // Refresh image gallery
      fetchImages();

    } catch (error) {
      console.error('Upload error:', error);
      showMessage(
        error.response?.data?.error || 'Upload failed. Please try again.',
        'error'
      );
    } finally {
      setUploading(false);
    }
  };

  /**
   * Show temporary message
   */
  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  return (
    <div className="App">
      {/* Header */}
      <header className="header">
        <h1>☁️ Cloud Image Platform</h1>
        <p>Upload and manage your images in the cloud</p>
      </header>

      {/* Message Display */}
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Upload Section */}
      <div className="upload-section">
        <div className="upload-card">
          <h2>Upload Image</h2>
          
          <div className="upload-area">
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
            />
            
            {previewUrl && (
              <div className="preview">
                <img src={previewUrl} alt="Preview" />
                <p className="file-name">{selectedFile.name}</p>
              </div>
            )}
          </div>

          <button
            className="upload-btn"
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
          >
            {uploading ? '📤 Uploading...' : '📤 Upload to Cloud'}
          </button>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="gallery-section">
        <div className="gallery-header">
          <h2>Image Gallery</h2>
          <button className="refresh-btn" onClick={fetchImages} disabled={loading}>
            🔄 Refresh
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading images...</div>
        ) : images.length === 0 ? (
          <div className="empty-state">
            <p>No images uploaded yet</p>
            <p>Upload your first image to get started!</p>
          </div>
        ) : (
          <div className="gallery-grid">
            {images.map((image, index) => (
              <div key={index} className="gallery-item">
                <img src={image.url} alt={`Upload ${index + 1}`} />
                <div className="image-info">
                  <p className="image-size">
                    {(image.size / 1024).toFixed(2)} KB
                  </p>
                  <p className="image-date">
                    {new Date(image.lastModified).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>Built with React + Node.js + AWS S3</p>
        <p>🚀 Cloud-Native DevOps Project</p>
      </footer>
    </div>
  );
}

export default App;