import React, { useState } from 'react';
import { Sun, Moon, Globe, Menu, X, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

/**
 * Shared Navigation Component
 * @param {Object} props
 * @param {Object} props.translations - Translation object
 * @param {string} props.lang - Current language
 * @param {Function} props.toggleLang - Language toggle function
 * @param {Array} props.navItems - Override nav items if needed
 */
const Navigation = ({
    translations: t,
    lang,
    toggleLang,
    navItems = null,
}) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { isDark, toggleTheme } = useTheme();

    const defaultNavItems = [
        { name: t.nav.home, href: '/' },
        { name: t.nav.about, href: '/#about' },
        { name: t.nav.services, href: '/#services' },
        { name: t.nav.team, href: '/team' },
        { name: t.nav.contact, href: '/#contact' },
    ];

    const items = navItems || defaultNavItems;

    return (
        <nav
            className={`fixed w-full z-50 ${isDark ? 'bg-gray-950/80' : 'bg-white/80'
                } backdrop-blur-xl border-b ${isDark ? 'border-cyan-500/10' : 'border-gray-200/50'
                } shadow-lg ${isDark ? 'shadow-cyan-500/5' : 'shadow-gray-200/50'}`}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <a href="/" className="flex items-center group cursor-pointer">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 blur-lg opacity-20 group-hover:opacity-30 transition-opacity" />
                            <span className="relative text-3xl font-black tracking-tight">
                                <span
                                    className={`${isDark ? 'text-white' : 'text-gray-900'
                                        } transition-colors`}
                                >
                                    Xyber
                                </span>
                                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                    Clan
                                </span>
                            </span>
                        </div>
                    </a>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {items.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className={`relative px-5 py-2.5 text-[15px] font-semibold ${isDark
                                        ? 'text-gray-300 hover:text-white'
                                        : 'text-gray-700 hover:text-gray-900'
                                    } transition-all duration-300 group`}
                            >
                                <span className="relative z-10">{item.name}</span>
                                <span
                                    className={`absolute inset-0 ${isDark ? 'bg-cyan-500/10' : 'bg-cyan-50'
                                        } rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 ease-out`}
                                />
                                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-3/4 transition-all duration-300" />
                            </a>
                        ))}

                        {/* Language Toggle Button */}
                        <button
                            onClick={toggleLang}
                            className={`ml-4 p-3 rounded-xl ${isDark
                                    ? 'bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800'
                                    : 'bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300'
                                } transition-all duration-300 hover:scale-110 shadow-lg ${isDark ? 'shadow-cyan-500/10' : 'shadow-gray-300/50'
                                }`}
                            aria-label="Toggle language"
                        >
                            <div className="flex items-center gap-1 font-bold text-sm">
                                <Globe
                                    className={`w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-cyan-600'
                                        }`}
                                />
                                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                                    {lang.toUpperCase()}
                                </span>
                            </div>
                        </button>

                        {/* Theme Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            className={`ml-2 p-3 rounded-xl ${isDark
                                    ? 'bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800'
                                    : 'bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300'
                                } transition-all duration-300 hover:scale-110 hover:rotate-12 shadow-lg ${isDark ? 'shadow-cyan-500/10' : 'shadow-gray-300/50'
                                }`}
                            aria-label="Toggle theme"
                        >
                            {isDark ? (
                                <Sun className="w-5 h-5 text-amber-400" />
                            ) : (
                                <Moon className="w-5 h-5 text-indigo-600" />
                            )}
                        </button>

                        {/* CTA Button */}
                        <a
                            href="/start-project"
                            className="ml-3 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-[15px] font-bold rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/30 hover:-translate-y-0.5"
                        >
                            {t.nav.getStarted}
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className={`md:hidden p-3 rounded-xl ${isDark
                                ? 'bg-gray-800/50 hover:bg-gray-700/50'
                                : 'bg-gray-100 hover:bg-gray-200'
                            } transition-all duration-300`}
                        aria-label="Toggle menu"
                        aria-expanded={mobileMenuOpen}
                    >
                        {mobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu - Slide-in Animation */}
            <div
                className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${mobileMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div
                    className={`${isDark
                            ? 'bg-gradient-to-b from-gray-900/95 to-gray-950/95'
                            : 'bg-gradient-to-b from-white/95 to-gray-50/95'
                        } backdrop-blur-xl border-t ${isDark ? 'border-cyan-500/10' : 'border-gray-200/50'
                        } px-6 py-6 space-y-1`}
                >
                    {items.map((item, idx) => (
                        <a
                            key={item.name}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`block px-5 py-3.5 text-[16px] font-semibold ${isDark
                                    ? 'text-gray-300 hover:text-white hover:bg-cyan-500/10'
                                    : 'text-gray-700 hover:text-gray-900 hover:bg-cyan-50'
                                } rounded-xl transition-all duration-300 transform hover:translate-x-2`}
                            style={{
                                animation: mobileMenuOpen
                                    ? `slideIn 0.3s ease-out ${idx * 0.1}s both`
                                    : 'none',
                            }}
                        >
                            {item.name}
                        </a>
                    ))}

                    {/* Mobile Language Toggle */}
                    <button
                        onClick={toggleLang}
                        className={`w-full flex items-center justify-between px-5 py-3.5 text-[16px] font-semibold ${isDark
                                ? 'text-gray-300 hover:text-white hover:bg-cyan-500/10'
                                : 'text-gray-700 hover:text-gray-900 hover:bg-cyan-50'
                            } rounded-xl transition-all duration-300`}
                    >
                        <span>Language: {lang === 'en' ? 'English' : 'Français'}</span>
                        <Globe
                            className={`w-5 h-5 ${isDark ? 'text-cyan-400' : 'text-cyan-600'
                                }`}
                        />
                    </button>

                    {/* Mobile Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className={`w-full flex items-center justify-between px-5 py-3.5 text-[16px] font-semibold ${isDark
                                ? 'text-gray-300 hover:text-white hover:bg-cyan-500/10'
                                : 'text-gray-700 hover:text-gray-900 hover:bg-cyan-50'
                            } rounded-xl transition-all duration-300`}
                    >
                        <span>{t.nav.toggleTheme}</span>
                        {isDark ? (
                            <Sun className="w-5 h-5 text-amber-400" />
                        ) : (
                            <Moon className="w-5 h-5 text-indigo-600" />
                        )}
                    </button>

                    {/* Mobile CTA */}
                    <a
                        href="/start-project"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block mt-4 px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-center text-[16px] font-bold rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/20"
                    >
                        {t.nav.getStarted}
                    </a>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
