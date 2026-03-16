import React, { useState, useRef, useEffect } from 'react';
import { useCMS } from '../../context/CMSContext';
import { Link as RouterLink } from 'react-router-dom';
import { LinkIcon, Check, X } from 'lucide-react';

/**
 * EditableLink — Wraps a link.
 * In public mode: renders <a> or <Link>.
 * In CMS mode: double-click opens a popover to edit URL and label.
 */
const EditableLink = ({
  contentKey,
  hrefKey,
  href: fallbackHref = '#',
  to,
  className = '',
  style = {},
  children,
  external = false,
  ...rest
}) => {
  const { isEditing, getContent, updateContent } = useCMS();
  const [showEditor, setShowEditor] = useState(false);
  const [editUrl, setEditUrl] = useState('');
  const editorRef = useRef(null);

  const currentHref = hrefKey ? getContent(hrefKey, fallbackHref || to || '#') : (fallbackHref || to || '#');

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

  if (!isEditing) {
    // Public mode — render normally
    if (to || (!external && currentHref.startsWith('/'))) {
      return (
        <RouterLink to={currentHref} className={className} style={style} {...rest}>
          {children}
        </RouterLink>
      );
    }
    return (
      <a href={currentHref} className={className} style={style} {...rest}>
        {children}
      </a>
    );
  }

  // CMS mode
  const handleDoubleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setEditUrl(currentHref);
    setShowEditor(true);
  };

  const handleSave = () => {
    if (hrefKey && editUrl !== currentHref) {
      updateContent(hrefKey, editUrl);
    }
    setShowEditor(false);
  };

  const handleCancel = () => {
    setShowEditor(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') handleCancel();
  };

  return (
    <span className="relative inline-block">
      <span
        onDoubleClick={handleDoubleClick}
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
        className={`${className} cms-editable-link`}
        data-cms-tooltip={isEditing ? `Edit Link: ${hrefKey ? hrefKey.split('.').pop() : 'URL'}` : undefined}
        style={{ ...style, cursor: 'pointer' }}
        title="Double-click to edit link URL"
        {...rest}
      >
        {children}
      </span>

      {/* Link editor popover */}
      {showEditor && (
        <div
          ref={editorRef}
          className="absolute top-full left-0 mt-2 z-[9999] bg-gray-900 border border-gray-700 rounded-xl shadow-2xl p-3 min-w-[300px]"
          style={{ animation: 'cmsPopIn 0.2s ease-out' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <LinkIcon size={14} className="text-cyan-400" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Edit Link URL</span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={editUrl}
              onChange={(e) => setEditUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500"
              autoFocus
              placeholder="/page or https://..."
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
        </div>
      )}
    </span>
  );
};

export default EditableLink;
