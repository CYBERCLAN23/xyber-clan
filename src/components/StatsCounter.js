import React, { useState, useEffect, useRef } from 'react';
import { Briefcase, Users, Calendar, Award } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const StatsCounter = () => {
    const { isDark } = useTheme();
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    const stats = [
        { icon: <Briefcase className="w-8 h-8" />, value: 50, suffix: '+', label: 'Projects Completed', color: 'cyan' },
        { icon: <Users className="w-8 h-8" />, value: 30, suffix: '+', label: 'Happy Clients', color: 'blue' },
        { icon: <Award className="w-8 h-8" />, value: 9, suffix: '', label: 'Team Experts', color: 'purple' },
        { icon: <Calendar className="w-8 h-8" />, value: 3, suffix: '+', label: 'Years Experience', color: 'green' }
    ];

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.3 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const AnimatedNumber = ({ value, suffix, isVisible }) => {
        const [count, setCount] = useState(0);

        useEffect(() => {
            if (!isVisible) return;

            const duration = 2000;
            const steps = 60;
            const increment = value / steps;
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= value) {
                    setCount(value);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(current));
                }
            }, duration / steps);

            return () => clearInterval(timer);
        }, [isVisible, value]);

        return <span>{count}{suffix}</span>;
    };

    const getColorClasses = (color) => {
        const colors = {
            cyan: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
            blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
            purple: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
            green: 'text-green-500 bg-green-500/10 border-green-500/20'
        };
        return colors[color] || colors.cyan;
    };

    return (
        <section
            ref={sectionRef}
            className={`py-24 px-4 ${isDark ? 'bg-neutral-950' : 'bg-gray-100'}`}
        >
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                        Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">Impact</span>
                    </h2>
                    <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Numbers that speak for themselves
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className={`relative p-8 rounded-3xl border text-center transition-all duration-500 hover:scale-105 ${isDark
                                ? 'bg-neutral-900/50 border-white/10 hover:border-white/20'
                                : 'bg-white border-gray-200 hover:border-gray-300 shadow-lg'}`}
                            style={{
                                opacity: isVisible ? 1 : 0,
                                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                                transitionDelay: `${index * 100}ms`
                            }}
                        >
                            {/* Icon */}
                            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl border mb-4 ${getColorClasses(stat.color)}`}>
                                {stat.icon}
                            </div>

                            {/* Number */}
                            <div className="text-5xl md:text-6xl font-black mb-2">
                                <AnimatedNumber value={stat.value} suffix={stat.suffix} isVisible={isVisible} />
                            </div>

                            {/* Label */}
                            <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsCounter;
