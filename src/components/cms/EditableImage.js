import React, { useState, useRef, useEffect } from 'react';
import { useCMS } from '../../context/CMSContext';
import { Camera, Loader2, Check, X, Upload } from 'lucide-react';

/**
 * EditableImage — Wraps an image.
 * In public mode: renders plain <img>.
 * In CMS mode: hover shows overlay, click opens file picker.
 * 
 * Props:
 *   contentKey  — dot-path for storing the image URL
 *   src         — default image source (fallback)
 *   alt         — alt text
 *   className   — CSS classes
 *   style       — inline styles
 *   objectPosition — CSS object-position
 */
const EditableImage = ({
  contentKey,
  src: fallbackSrc = '',
  alt = '',
  className = '',
  imageClassName = '',
  style = {},
  objectPosition,
  ...rest
}) => {
  const { isEditing, getContent, updateImage, updateContent } = useCMS();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editUrl, setEditUrl] = useState('');
  const fileInputRef = useRef(null);
  const editorRef = useRef(null);

  const currentSrc = getContent(contentKey, fallbackSrc);

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

  if (!isEditing) {
    return (
      <img
        src={currentSrc}
        alt={alt}
        className={`${className} ${imageClassName}`}
        style={{ ...style, objectPosition }}
        {...rest}
      />
    );
  }

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setEditUrl(currentSrc);
    setShowEditor(true);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSaveUrl = () => {
    if (editUrl !== currentSrc) {
      updateContent(contentKey, editUrl);
    }
    setShowEditor(false);
  };

  const handleCancel = () => {
    setShowEditor(false);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be under 5MB');
      return;
    }

    setIsUploading(true);
    try {
      await updateImage(contentKey, file);
      setUploadSuccess(true);
      setShowEditor(false);
      setTimeout(() => setUploadSuccess(false), 2000);
    } catch (err) {
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div 
      className="relative group cms-editable-image" 
      style={{ display: 'inline-block', width: '100%', height: '100%' }}
      data-cms-tooltip={isEditing && contentKey ? `Edit Image: ${contentKey.split('.').pop()}` : undefined}
    >
      <img
        src={currentSrc}
        alt={alt}
        className={`${className} ${imageClassName}`}
        style={{ ...style, objectPosition }}
        {...rest}
      />

      {/* Edit overlay */}
      <div
        onClick={handleClick}
        className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer rounded-inherit"
        style={{ borderRadius: 'inherit' }}
      >
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
            <Camera size={28} />
            <span className="text-xs font-semibold">Click to change</span>
          </div>
        )}
      </div>

      {/* Editor popover */}
      {showEditor && (
        <div
          ref={editorRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] bg-gray-900 border border-gray-700 rounded-xl shadow-2xl p-4 min-w-[320px] pointer-events-auto"
          style={{ animation: 'cmsPopIn 0.2s ease-out' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-2 mb-3">
            <Camera size={16} className="text-cyan-400" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Edit Image Source</span>
          </div>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={editUrl}
              onChange={(e) => setEditUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveUrl();
                if (e.key === 'Escape') handleCancel();
              }}
              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500"
              autoFocus
              placeholder="https://..."
            />
            <button onClick={handleSaveUrl} className="p-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-white transition-colors">
              <Check size={16} />
            </button>
            <button onClick={handleCancel} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors">
              <X size={16} />
            </button>
          </div>
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-700">
            <span className="text-xs text-gray-400">Or</span>
            <button onClick={handleUploadClick} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg text-white text-xs font-medium transition-colors">
              <Upload size={14} /> Upload from PC
            </button>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default EditableImage;
