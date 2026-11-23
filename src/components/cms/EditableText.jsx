import React, { useState, useRef, useEffect } from 'react';
import { useCMS } from '../../context/CMSContext';

/**
 * EditableText — Wraps any text content.
 * In public mode: renders plain text.
 * In CMS mode: click to edit inline.
 * 
 * Props:
 *   contentKey  — dot-path like "en.hero.titlePrefix"
 *   fallback    — default text value (from translations)
 *   tag         — HTML tag to render (default "span")
 *   className   — CSS classes
 *   style       — inline styles
 *   multiline   — allow newlines (renders textarea-like)
 */
const EditableText = ({
  contentKey,
  fallback = '',
  tag: Tag = 'span',
  className = '',
  style = {},
  multiline = false,
  children,
  ...rest
}) => {
  const { isEditing, getContent, updateContent } = useCMS();
  const [isActive, setIsActive] = useState(false);
  const ref = useRef(null);

  // Get the displayed value: CMS overrides → fallback → children text
  const displayValue = getContent(contentKey, fallback || (typeof children === 'string' ? children : ''));

  // Sync contentEditable element with value when it changes externally
  useEffect(() => {
    if (ref.current && !isActive) {
      ref.current.innerText = displayValue;
    }
  }, [displayValue, isActive]);

  if (!isEditing) {
    // Public mode — render normally
    return <Tag className={className} style={style} {...rest}>{displayValue || children}</Tag>;
  }

  // CMS mode
  const handleClick = (e) => {
    e.stopPropagation();
    setIsActive(true);
  };

  const handleBlur = () => {
    setIsActive(false);
    if (ref.current) {
      const newValue = ref.current.innerText;
      if (newValue !== displayValue) {
        updateContent(contentKey, newValue);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (!multiline && e.key === 'Enter') {
      e.preventDefault();
      ref.current?.blur();
    }
    // Ctrl+S / Cmd+S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      ref.current?.blur();
    }
  };

  return (
    <Tag
      ref={ref}
      contentEditable={isActive}
      suppressContentEditableWarning
      onClick={handleClick}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={`${className} cms-editable ${isActive ? 'cms-editable-active' : ''}`}
      data-cms-tooltip={isEditing ? `Edit Text: ${contentKey.split('.').pop()}` : undefined}
      style={{
        ...style,
        cursor: isEditing ? 'pointer' : undefined,
        outline: 'none',
        minWidth: isActive ? '20px' : undefined,
      }}
      {...rest}
    >
      {displayValue || children}
    </Tag>
  );
};

export default EditableText;
