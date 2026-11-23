import React, { useState, useRef, useEffect } from 'react';
import { useCMS } from '../../context/CMSContext';
import { Video, Check, X, Upload, Loader2 } from 'lucide-react';

/**
 * EditableVideo — Wraps a video element.
 * In CMS mode: double-click opens a popover to edit the video URL.
 */
const EditableVideo = ({
  contentKey,
  src: fallbackSrc = '',
  className = '',
  videoClassName = '',
  poster = '', // Default poster
  posterContentKey, // So we can bind the poster as well
  ...rest
}) => {
  const { isEditing, getContent, updateContent, updateImage } = useCMS();
  const [showEditor, setShowEditor] = useState(false);
  const [editUrl, setEditUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);

  const currentSrc = getContent(contentKey, fallbackSrc);
  const currentPoster = posterContentKey ? getContent(posterContentKey, poster) : poster;

  // Close popover on click outside
  useEffect(() => {
    if (!showEditor) return;
    const handleClickOutside = (e) => {
      if (editorRef.current && !editorRef.current.contains(e.target)) {
        setShowEditor(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEditor]);

  const handleDoubleClick = (e) => {
    if (!isEditing) return;
    e.preventDefault();
    e.stopPropagation();
    setEditUrl(currentSrc);
    setShowEditor(true);
  };

  const handleSave = () => {
    if (editUrl !== currentSrc) {
      updateContent(contentKey, editUrl);
    }
    setShowEditor(false);
  };

  const handleCancel = () => {
    setShowEditor(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/')) {
      alert('Please select a video file');
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Video must be under 5MB. For larger videos, please upload to YouTube/Vimeo/hosting and paste the URL here.');
      return;
    }

    setIsUploading(true);
    try {
      // Reuse updateImage which reads file as Base64 Data URL
      await updateImage(contentKey, file);
      setUploadSuccess(true);
      setShowEditor(false);
      setTimeout(() => setUploadSuccess(false), 2000);
    } catch (err) {
      alert('Failed to upload video. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') handleCancel();
  };

  return (
    <div
      className={`relative inline-block ${isEditing ? 'cms-editable-video group' : ''} ${className}`}
      onDoubleClick={handleDoubleClick}
      data-cms-tooltip={isEditing ? `Edit Video: ${contentKey.split('.').pop()}` : undefined}
      title={isEditing ? "Double-click to edit video URL" : ""}
      style={{ display: 'flex', width: '100%', height: '100%' }}
    >
      <video
        src={currentSrc}
        poster={currentPoster}
        className={`w-full h-full object-cover ${videoClassName}`}
        {...rest}
      />

      {isEditing && !showEditor && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          {isUploading ? (
            <div className="flex flex-col items-center gap-2 text-white">
              <Loader2 size={28} className="animate-spin" />
              <span className="text-xs font-semibold">Uploading...</span>
            </div>
          ) : uploadSuccess ? (
            <div className="flex flex-col items-center gap-2 text-emerald-400">
              <Check size={28} />
              <span className="text-xs font-semibold">Updated!</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-white">
              <Video size={28} />
              <span className="text-xs font-semibold">Double-click to edit</span>
            </div>
          )}
        </div>
      )}

      {/* Editor popover */}
      {showEditor && (
        <div
          ref={editorRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] bg-gray-900 border border-gray-700 rounded-xl shadow-2xl p-4 min-w-[320px]"
          style={{ animation: 'cmsPopIn 0.2s ease-out' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Video size={16} className="text-cyan-400" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Edit Video URL</span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={editUrl}
              onChange={(e) => setEditUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500"
              autoFocus
              placeholder="https://..."
            />
            <button
              onClick={handleSave}
              className="p-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-white transition-colors"
            >
              <Check size={16} />
            </button>
            <button
              onClick={handleCancel}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-700">
            <span className="text-xs text-gray-400">Or</span>
            <button onClick={handleUploadClick} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg text-white text-xs font-medium transition-colors">
              <Upload size={14} /> Upload from PC (Max 5MB)
            </button>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default EditableVideo;
