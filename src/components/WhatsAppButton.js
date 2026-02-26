import React, { useState, useEffect } from 'react';
import { isHolidaySeason } from '../utils/festive';

const WhatsAppButton = () => {
    const phoneNumbers = [
        { label: "Contact 1", number: "237654269488" },
        { label: "Contact 2", number: "237696814391" }
    ];
    const message = "Hi XyberClan, I'm interested in your services!";
    const [visible, setVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY > window.innerHeight * 0.8);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div
            className={`fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Options menu */}
            <div className={`flex flex-col gap-2 transition-all duration-300 origin-bottom right-0 ${isHovered ? 'scale-100 opacity-100 translate-y-0 pointer-events-auto' : 'scale-90 opacity-0 translate-y-4 pointer-events-none'}`}>
                {phoneNumbers.map((contact, index) => (
                    <a
                        key={index}
                        href={`https://wa.me/${contact.number}?text=${encodeURIComponent(message)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`bg-white text-gray-900 border border-gray-100 px-5 py-3 rounded-2xl shadow-xl font-bold text-sm flex items-center justify-between gap-6 transition-transform hover:scale-[1.03] active:scale-95`}
                        aria-label={`Chat on WhatsApp with ${contact.label}`}
                    >
                        <span>{contact.label}</span>
                        <span className="text-gray-500 text-xs">{contact.number.replace('237', '+237 ')}</span>
                    </a>
                ))}
            </div>

            {/* Main Button */}
            <div className="flex items-center gap-3 cursor-pointer">
                {/* Main Label tooltip */}
                <div
                    className={`bg-white text-gray-900 px-4 py-2 rounded-[var(--radius-lg)] shadow-2xl font-bold text-sm transform transition-all duration-500 origin-right ${isHovered ? 'scale-90 opacity-0 translate-x-4 pointer-events-none' : 'scale-100 opacity-100 translate-x-0'}`}
                >
                    {isHolidaySeason() ? "Merry Christmas! 🎄 Chat with us!" : "Chat with us! 👋"}
                </div>

                <div className="relative group/btn">
                    <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20 duration-1000"></div>
                    <div className={`bg-gradient-to-br from-green-400 to-green-600 text-white p-4 rounded-full shadow-2xl shadow-green-500/30 transition-all duration-500 ${isHovered ? 'scale-110 rotate-12 shadow-green-500/50' : 'hover:scale-105'}`}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-8 h-8"
                        >
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WhatsAppButton;
