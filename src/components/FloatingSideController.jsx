import React, { useState } from 'react';
import { Sun, Moon, Globe } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const FONT = "'Inter', 'Helvetica Neue', sans-serif";

const FloatingSideController = () => {
    const { isDark, toggleTheme } = useTheme();
    const { language, toggleLanguage } = useLanguage();
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                position: 'fixed',
                left: 0,
                top: '55%',
                transform: 'translateY(-50%)',
                zIndex: 99999,
                display: 'flex',
                alignItems: 'center',
                fontFamily: FONT,
            }}
        >
            {/* The actual control panel */}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 16,
                    padding: '20px 10px',
                    borderRadius: '0 16px 16px 0',
                    border: '1px solid rgba(6, 182, 212, 0.25)',
                    borderLeft: 'none',
                    background: isDark ? 'rgba(10, 10, 10, 0.85)' : 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(12px)',
                    boxShadow: isDark 
                        ? '0 10px 30px rgba(0,0,0,0.5), 0 0 15px rgba(6,182,212,0.15)' 
                        : '0 10px 30px rgba(0,0,0,0.06), 0 0 15px rgba(6,182,212,0.08)',
                    transform: isHovered ? 'translateX(0)' : 'translateX(-82%)',
                    transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
            >
                {/* Theme Toggle Button */}
                <button
                    onClick={toggleTheme}
                    aria-label="Toggle Theme"
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 8,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isDark ? '#f0f0f0' : '#111',
                        backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                        transition: 'background-color 0.2s, transform 0.2s, color 0.2s',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = '#06b6d4';
                        e.currentTarget.style.color = '#fff';
                        e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)';
                        e.currentTarget.style.color = isDark ? '#f0f0f0' : '#111';
                        e.currentTarget.style.transform = 'scale(1)';
                    }}
                >
                    {isDark ? <Sun size={15} /> : <Moon size={15} />}
                </button>

                {/* Divider Line */}
                <div style={{
                    width: 16,
                    height: 1,
                    background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                }} />

                {/* Language Toggle Button */}
                <button
                    onClick={toggleLanguage}
                    aria-label="Toggle Language"
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 8,
                        borderRadius: '50%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isDark ? '#f0f0f0' : '#111',
                        backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                        transition: 'background-color 0.2s, transform 0.2s, color 0.2s',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = '#06b6d4';
                        e.currentTarget.style.color = '#fff';
                        e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)';
                        e.currentTarget.style.color = isDark ? '#f0f0f0' : '#111';
                        e.currentTarget.style.transform = 'scale(1)';
                    }}
                >
                    <Globe size={15} style={{ marginBottom: 2 }} />
                    <span style={{ fontSize: '7px', fontWeight: 800 }}>
                        {language.toUpperCase()}
                    </span>
                </button>
            </div>

            {/* Handle visual indicator when hidden */}
            <div
                style={{
                    width: 4,
                    height: 48,
                    background: '#06b6d4',
                    borderRadius: '0 4px 4px 0',
                    boxShadow: '0 0 10px rgba(6,182,212,0.8)',
                    marginLeft: 2,
                    opacity: isHovered ? 0 : 0.75,
                    transition: 'opacity 0.3s ease',
                    pointerEvents: 'none',
                }}
            />
        </div>
    );
};

export default FloatingSideController;
