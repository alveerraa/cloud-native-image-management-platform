import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:5001';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  // New states for enhanced features
  const [modalImage, setModalImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest'

  const showMessage = useCallback((text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  }, []);

  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/images`);
      setImages(response.data.images || []);
    } catch (error) {
      console.error('Error fetching images:', error);
      showMessage('Failed to load images', 'error');
    } finally {
      setLoading(false);
    }
  }, [showMessage]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showMessage('Please select an image file', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showMessage('File size must be less than 5MB', 'error');
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(file);
  };

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
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      showMessage('Image uploaded successfully!', 'success');

      setSelectedFile(null);
      setPreviewUrl(null);
      document.getElementById('fileInput').value = '';

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

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelection(file);
    } else {
      showMessage('Please drop an image file', 'error');
    }
  };

  const handleFileSelection = (file) => {
    if (file.size > 5 * 1024 * 1024) {
      showMessage('File size must be less than 5MB', 'error');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(file);
  };

  // Modal handlers
  const openModal = (image) => {
    setModalImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setModalImage(null);
    document.body.style.overflow = 'auto';
  };

  // Image actions
  const downloadImage = (image) => {
    const link = document.createElement('a');
    link.href = image.url || image.thumbnail;
    link.download = `image-${image.imageId}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showMessage('Image downloaded!', 'success');
  };

  const copyImageUrl = (image) => {
    navigator.clipboard.writeText(image.url || image.thumbnail);
    showMessage('Image URL copied to clipboard!', 'success');
  };

  // Filter and sort images
  const filteredImages = images
    .filter(img => {
      const searchLower = searchTerm.toLowerCase();
      const date = new Date(img.uploadedAt).toLocaleDateString().toLowerCase();
      return date.includes(searchLower) || img.imageId.toLowerCase().includes(searchLower);
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.uploadedAt) - new Date(a.uploadedAt);
      } else {
        return new Date(a.uploadedAt) - new Date(b.uploadedAt);
      }
    });

  // Keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && modalImage) {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [modalImage]);

  return (
    <div className="App">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="header-title">
            <span className="header-icon">☁️</span> Cloud-Native Image Management Platform
          </h1>
          <p className="header-subtitle">Upload, manage, and share your images in the cloud</p>
        </div>
      </header>

      {/* Message Display */}
      {message.text && (
        <div className={`message ${message.type}`}>
          <span className="message-icon">
            {message.type === 'success' ? '✓' : '⚠'}
          </span>
          {message.text}
        </div>
      )}

      {/* Upload Section */}
      <div className="upload-section">
        <div className="upload-card">
          <h2 className="section-title">📤 Upload Image</h2>
          
          <div 
            className="upload-area"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="file-input"
            />
            
            <label htmlFor="fileInput" className="upload-label">
              <div className="upload-icon">📁</div>
              <div className="upload-text">
                <strong>Click to upload</strong> or drag and drop
              </div>
              <div className="upload-hint">
                PNG, JPG, GIF up to 5MB
              </div>
            </label>

            {previewUrl && (
              <div className="preview">
                <img src={previewUrl} alt="Preview" className="preview-image" />
                <div className="preview-info">
                  <p className="file-name">{selectedFile?.name}</p>
                  <p className="file-size">
                    {(selectedFile?.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <button
                  className="clear-button"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                    document.getElementById('fileInput').value = '';
                  }}
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <button
            className="upload-btn"
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
          >
            {uploading ? (
              <>
                <span className="spinner">⟳</span> Uploading...
              </>
            ) : (
              '🚀 Upload to Cloud'
            )}
          </button>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="gallery-section">
        <div className="gallery-header">
          <h2 className="section-title">
            🖼️ Image Gallery ({filteredImages.length})
          </h2>
          
          <div className="gallery-controls">
            <input
              type="text"
              placeholder="🔍 Search by date or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="select-input"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>

            <div className="view-toggle">
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                ⊞
              </button>
              <button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                ☰
              </button>
            </div>

            <button 
              className="refresh-btn" 
              onClick={fetchImages} 
              disabled={loading}
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading">
            <div className="loading-spinner">⟳</div>
            <p>Loading images...</p>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📷</div>
            <p className="empty-title">No images found</p>
            <p className="empty-text">
              {searchTerm ? 'Try a different search term' : 'Upload your first image to get started!'}
            </p>
          </div>
        ) : (
          <div className={`gallery-${viewMode}`}>
            {filteredImages.map((image, index) => (
              <div 
                key={image.imageId || index} 
                className="gallery-item"
                onClick={() => openModal(image)}
              >
                <div className="image-wrapper">
                  <img 
                    src={image.thumbnail} 
                    alt={`Upload ${index + 1}`} 
                    className="gallery-image"
                  />
                  <div className="image-overlay">
                    <button className="overlay-btn">
                      👁️ View Full Image
                    </button>
                  </div>
                </div>
                <div className="image-info">
                  <p className="image-date">
                    📅 {new Date(image.uploadedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  <div className="image-actions">
                    <button
                      className="action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadImage(image);
                      }}
                      title="Download"
                    >
                      ⬇️
                    </button>
                    <button
                      className="action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyImageUrl(image);
                      }}
                      title="Copy URL"
                    >
                      🔗
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Modal */}
      {modalImage && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              ✕
            </button>
            
            <div className="modal-image-container">
              <img 
                src={modalImage.url || modalImage.thumbnail} 
                alt="Full size" 
                className="modal-image"
              />
            </div>
            
            <div className="modal-info">
              <div className="modal-details">
                <p><strong>📅 Uploaded:</strong> {new Date(modalImage.uploadedAt).toLocaleString()}</p>
                <p><strong>🆔 Image ID:</strong> {modalImage.imageId}</p>
              </div>
              
              <div className="modal-actions">
                <button
                  className="modal-action-btn primary"
                  onClick={() => downloadImage(modalImage)}
                >
                  ⬇️ Download
                </button>
                <button
                  className="modal-action-btn primary"
                  onClick={() => copyImageUrl(modalImage)}
                >
                  🔗 Copy URL
                </button>
                <button
                  className="modal-action-btn secondary"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <p className="footer-text">
          Built with React + Node.js + AWS S3 + DynamoDB + Lambda + LocalStack
        </p>
        <p className="footer-text">
          🚀 Cloud-Native DevOps Project
        </p>
      </footer>
    </div>
  );
}

export default App;