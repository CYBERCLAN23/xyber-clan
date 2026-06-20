import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    ChevronLeft, Mail, Check,
    Sparkles, ArrowRight, Sun, Moon,
    User, Briefcase, MapPin, Clock,
    Globe, Code, Send,
    GraduationCap, CalendarDays, Phone, Linkedin,
    FileText, Users, Star, Target,     MessageCircle, Heart,
} from 'lucide-react';
import { useTheme } from './context/ThemeContext';
import { useLanguage } from './context/LanguageContext';
import { getLogo } from './utils/festive';
import Meta from './components/Meta';
import gsap from 'gsap';
import mountainBg from './assets/hero-mountain.png';

const CareerForm = () => {
    const { isDark, toggleTheme } = useTheme();
    const { language, toggleLanguage } = useLanguage();

    const formRef = useRef(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [direction, setDirection] = useState('forward');
    const [answers, setAnswers] = useState({});
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(formRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }
            );
        }, formRef);
        return () => ctx.revert();
    }, [currentStep]);

    const steps = useMemo(() => [
        {
            id: 'welcome',
            type: 'welcome',
            question: "Community Manager",
            subtitle: "Join XyberClan and help shape our growing community. We're looking for a passionate person to connect, engage, and build meaningful relationships.",
            badge: "We're Hiring!"
        },
        {
            id: 'fullName',
            type: 'input',
            question: "What's your full name?",
            placeholder: "Enter your full name",
            icon: <User size={28} />
        },
        {
            id: 'email',
            type: 'input',
            question: "What's your email address?",
            placeholder: "you@example.com",
            inputType: 'email',
            icon: <Mail size={28} />
        },
        {
            id: 'phone',
            type: 'input',
            question: "What's your phone number?",
            placeholder: "+1 (555) 000-0000",
            inputType: 'tel',
            icon: <Phone size={28} />
        },
        {
            id: 'experience',
            type: 'choice',
            question: "Years of community management experience?",
            options: [
                { label: "Less than 1 year", icon: <GraduationCap size={28} /> },
                { label: "1–2 years", icon: <Star size={28} /> },
                { label: "3–5 years", icon: <Target size={28} /> },
                { label: "5+ years", icon: <Briefcase size={28} /> },
            ]
        },
        {
            id: 'status',
            type: 'choice',
            question: "What's your current status?",
            options: [
                { label: "Student", icon: <GraduationCap size={28} /> },
                { label: "Freelancer", icon: <Code size={28} /> },
                { label: "Employed", icon: <Briefcase size={28} /> },
                { label: "Open to work", icon: <Users size={28} /> },
            ]
        },
        {
            id: 'location',
            type: 'input',
            question: "Where are you located?",
            placeholder: "City, Country (or Remote)",
            icon: <MapPin size={28} />
        },
        {
            id: 'interest',
            type: 'textarea',
            question: "Why are you interested in community management?",
            placeholder: "Tell us about your passion for building communities..."
        },
        {
            id: 'links',
            type: 'fields',
            question: "Share your profiles",
            fields: [
                { label: "LinkedIn URL", placeholder: "https://linkedin.com/in/...", icon: <Linkedin size={20} /> },
                { label: "Portfolio / GitHub", placeholder: "https://github.com/...", icon: <Code size={20} /> },
                { label: "Community you manage / Social media", placeholder: "https://facebook.com/... or https://t.me/...", icon: <Globe size={20} /> },
            ]
        },
        {
            id: 'availability',
            type: 'choice',
            question: "When can you start?",
            options: [
                { label: "Immediately", icon: <Sparkles size={28} /> },
                { label: "In 2 weeks", icon: <CalendarDays size={28} /> },
                { label: "In 1 month", icon: <Clock size={28} /> },
                { label: "Flexible", icon: <Globe size={28} /> },
            ]
        },
        {
            id: 'skills',
            type: 'multiselect',
            question: "Which skills describe you best?",
            subtitle: "Pick all that apply",
            options: [
                { label: "Communication", icon: <MessageCircle size={24} /> },
                { label: "Content Creation", icon: <FileText size={24} /> },
                { label: "Social Media Management", icon: <Users size={24} /> },
                { label: "Empathy & Listening", icon: <Heart size={24} /> },
                { label: "Event Planning", icon: <CalendarDays size={24} /> },
                { label: "Conflict Resolution", icon: <Target size={24} /> },
                { label: "Data & Analytics", icon: <Briefcase size={24} /> },
                { label: "Public Speaking", icon: <Star size={24} /> },
            ]
        },
    ], []);

    const colors = ['cyan', 'purple', 'pink', 'blue', 'orange', 'green', 'indigo', 'rose', 'amber'];

    const currentQuestion = steps[currentStep];

    const handleNext = () => {
        if (isStepValid()) {
            if (currentStep < steps.length - 1) {
                setDirection('forward');
                setCurrentStep(prev => prev + 1);
            } else {
                setDirection('forward');
                setIsCompleted(true);
            }
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setDirection('backward');
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleChoice = (id, value) => {
        setAnswers({ ...answers, [id]: value });
        setTimeout(() => {
            if (currentStep < steps.length - 1) {
                setDirection('forward');
                setCurrentStep(prev => prev + 1);
            } else {
                setDirection('forward');
                setIsCompleted(true);
            }
        }, 300);
    };

    const handleInputChange = (id, value) => {
        setAnswers({ ...answers, [id]: value });
    };

    const handleMultiSelect = (id, value) => {
        const current = answers[id] || [];
        const updated = current.includes(value)
            ? current.filter(v => v !== value)
            : [...current, value];
        setAnswers({ ...answers, [id]: updated });
    };

    const isStepValid = () => {
        if (!currentQuestion) return true;
        const id = currentQuestion.id;

        if (currentQuestion.type === 'welcome') return true;

        if (currentQuestion.type === 'fields' && currentQuestion.fields) {
            return currentQuestion.fields.every((_, i) => {
                const val = answers[`${id}_field_${i}`];
                return val && val.trim().length > 0;
            });
        }

        if (currentQuestion.type === 'choice') return !!answers[id];

        if (currentQuestion.type === 'multiselect') {
            return answers[id] && answers[id].length > 0;
        }

        if (currentQuestion.type === 'input' || currentQuestion.type === 'textarea') {
            const val = answers[id];
            return val && val.trim().length > 0;
        }

        return !!answers[id];
    };

    const generateSummaryText = () => {
        let text = `===========================================\n`;
        text += `COMMUNITY MANAGER APPLICATION - XYBERCLAN\n`;
        text += `===========================================\n\n`;

        steps.forEach(step => {
            if (step.type === 'welcome') return;
            if (step.type === 'fields') {
                step.fields.forEach((field, i) => {
                    text += `${field.label.toUpperCase()}:\n> ${answers[step.id + '_field_' + i] || 'N/A'}\n\n`;
                });
                return;
            }
            if (step.type === 'multiselect') {
                const selected = answers[step.id] || [];
                text += `${step.question.replace(/\?$/, '').trim().toUpperCase()}:\n> ${selected.length > 0 ? selected.join(', ') : 'N/A'}\n\n`;
                return;
            }
            const label = step.question.replace(/\?$/, '').trim().toUpperCase();
            text += `${label}:\n> ${answers[step.id] || 'N/A'}\n\n`;
        });

        text += `-------------------------------------------\n`;
        text += `Submitted via XyberClan Careers Portal\n`;
        text += `===========================================`;

        return text;
    };

    const handleEmailSend = () => {
        const subject = `Community Manager Application: ${answers.fullName || 'New Applicant'}`;
        const body = generateSummaryText();
        window.location.href = `mailto:xyberclandev@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    const progress = isCompleted ? 100 : ((currentStep + 1) / steps.length) * 100;

    return (
        <div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
            {/* Fixed Mountain Background */}
            <div className="fixed inset-0 -z-20">
                <img
                    src={mountainBg}
                    alt=""
                    className="w-full h-full object-cover"
                    style={{ filter: isDark ? 'brightness(0.3) saturate(0.4)' : 'brightness(0.9) saturate(0.6)', transform: 'scale(1.1)' }}
                />
            </div>

            <Meta
                title="Apply: Community Manager | XyberClan Careers"
                description="Join XyberClan as our Community Manager. Apply now to help shape our digital community."
            />

            {/* Nav */}
            <div className={`fixed top-0 left-0 right-0 z-50 ${isDark ? 'bg-black/80' : 'bg-white/80'} backdrop-blur-2xl border-b ${isDark ? 'border-white/5' : 'border-black/5'}`}>
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 group">
                        <img src={getLogo()} alt="XyberClan" className="w-10 h-10 object-contain" />
                        <span className={`font-bold tracking-tight hidden sm:block ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Xyber<span className="text-cyan-500">Clan</span>
                        </span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleTheme}
                            className={`p-2.5 rounded-xl transition-all ${isDark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:text-gray-900 hover:bg-black/5'}`}
                        >
                            {isDark ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                        <button
                            onClick={toggleLanguage}
                            className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${isDark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:text-gray-900 hover:bg-black/5'}`}
                        >
                            {language}
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Form Content */}
            <div className="pt-20 min-h-screen flex flex-col">
                {/* Progress Bar */}
                <div className="px-6 max-w-4xl mx-auto w-full mt-8 mb-12">
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 rounded-full transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Content Area */}
                <div ref={formRef} className="flex-1 px-6 pb-24">
                    <div className="max-w-2xl mx-auto">
                        {!isCompleted ? (
                            <div key={currentStep} className={`${direction === 'forward' ? 'animate-slide-up' : 'animate-slide-down'}`}>

                                {currentQuestion.type !== 'welcome' && (
                                    <p className="text-center text-[11px] font-black uppercase tracking-[0.3em] text-cyan-500 mb-8">
                                        Step {currentStep} of {steps.length - 1}
                                    </p>
                                )}

                                {/* WELCOME STEP */}
                                {currentQuestion.type === 'welcome' && (
                                    <div className="text-center">
                                        <div className="inline-flex items-center gap-2 px-5 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-8">
                                            <Sparkles className="w-4 h-4 text-cyan-500" />
                                            <span className="text-sm font-bold text-cyan-500">{currentQuestion.badge}</span>
                                        </div>

                                        <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-cyan-500/30">
                                            <Users className="w-10 h-10 text-white" />
                                        </div>

                                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.1] mb-4">
                                            {currentQuestion.question}
                                        </h2>
                                        <p className={`text-lg max-w-lg mx-auto leading-relaxed mb-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {currentQuestion.subtitle}
                                        </p>

                                        <button
                                            onClick={handleNext}
                                            className="group inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-10 py-5 rounded-[2rem] font-black text-lg transition-all hover:scale-[1.05] hover:shadow-2xl hover:shadow-cyan-500/30 active:scale-95 shadow-xl shadow-cyan-500/20"
                                        >
                                            Start Application
                                            <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                )}

                                {/* CHOICE OPTIONS */}
                                {currentQuestion.type === 'choice' && (
                                    <>
                                        <div className="text-center mb-16">
                                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.1] mb-6">
                                                {currentQuestion.question}
                                            </h2>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {currentQuestion.options.map((opt, i) => {
                                                const isSelected = answers[currentQuestion.id] === opt.label;
                                                const color = colors[i % colors.length];

                                                return (
                                                    <button
                                                        key={i}
                                                        onClick={() => handleChoice(currentQuestion.id, opt.label)}
                                                        className={`group relative p-8 rounded-[2.5rem] border-[2.5px] transition-all duration-500 text-left hover:scale-[1.02] active:scale-[0.98] overflow-hidden ${isSelected
                                                            ? 'border-cyan-500 bg-cyan-500/10 shadow-2xl shadow-cyan-500/10'
                                                            : `${isDark ? 'border-white/5 bg-white/[0.03] hover:border-white/20' : 'border-gray-200 bg-white hover:border-cyan-300'}`}`}
                                                    >
                                                        {isSelected && (
                                                            <div className="absolute top-6 right-6 animate-scale-in">
                                                                <div className="bg-cyan-500 text-white p-1 rounded-full">
                                                                    <Check size={14} strokeWidth={4} />
                                                                </div>
                                                            </div>
                                                        )}
                                                        <div className={`mb-8 p-5 rounded-2xl inline-block transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 ${
                                                            color === 'cyan' ? 'bg-cyan-500/10 text-cyan-500' :
                                                            color === 'purple' ? 'bg-purple-500/10 text-purple-500' :
                                                            color === 'pink' ? 'bg-pink-500/10 text-pink-500' :
                                                            color === 'blue' ? 'bg-blue-500/10 text-blue-500' :
                                                            color === 'orange' ? 'bg-orange-500/10 text-orange-500' :
                                                            color === 'green' ? 'bg-green-500/10 text-green-500' :
                                                            color === 'indigo' ? 'bg-indigo-500/10 text-indigo-500' :
                                                            color === 'rose' ? 'bg-rose-500/10 text-rose-500' :
                                                            'bg-amber-500/10 text-amber-500'
                                                        }`}>
                                                            {React.cloneElement(opt.icon, {})}
                                                        </div>
                                                        <h3 className={`text-xl font-black tracking-tight leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{opt.label}</h3>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </>
                                )}

                                {/* TEXT INPUT */}
                                {currentQuestion.type === 'input' && (
                                    <>
                                        <div className="text-center mb-16">
                                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.1] mb-6">
                                                {currentQuestion.question}
                                            </h2>
                                        </div>
                                        <div className="relative max-w-xl mx-auto">
                                            <div className="relative">
                                                <div className={`absolute left-6 top-1/2 -translate-y-1/2 ${isDark ? 'text-cyan-500' : 'text-cyan-600'}`}>
                                                    {currentQuestion.icon}
                                                </div>
                                                <input
                                                    autoFocus
                                                    type={currentQuestion.inputType || 'text'}
                                                    value={answers[currentQuestion.id] || ''}
                                                    onChange={(e) => handleInputChange(currentQuestion.id, e.target.value)}
                                                    placeholder={currentQuestion.placeholder}
                                                    className={`w-full border-[2.5px] rounded-3xl py-8 pl-20 pr-8 text-2xl font-bold outline-none transition-all placeholder:text-white/10 shadow-2xl ${
                                                        isDark
                                                            ? 'bg-white/[0.03] border-white/5 focus:border-cyan-500 focus:bg-white/[0.06] text-white'
                                                            : 'bg-white border-gray-200 focus:border-cyan-500 text-gray-900'
                                                    }`}
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* MULTISELECT */}
                                {currentQuestion.type === 'multiselect' && (
                                    <>
                                        <div className="text-center mb-12">
                                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.1] mb-4">
                                                {currentQuestion.question}
                                            </h2>
                                            {currentQuestion.subtitle && (
                                                <p className={`text-lg max-w-lg mx-auto leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    {currentQuestion.subtitle}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto">
                                            {currentQuestion.options.map((opt, i) => {
                                                const selected = answers[currentQuestion.id] || [];
                                                const isSelected = selected.includes(opt.label);
                                                const color = colors[i % colors.length];

                                                return (
                                                    <button
                                                        key={i}
                                                        onClick={() => handleMultiSelect(currentQuestion.id, opt.label)}
                                                        className={`group relative flex items-center gap-3 px-6 py-4 rounded-2xl border-2 transition-all duration-300 hover:scale-[1.03] active:scale-95 ${
                                                            isSelected
                                                                ? 'bg-cyan-500/10 border-cyan-500 shadow-xl shadow-cyan-500/10'
                                                                : `${isDark ? 'bg-white/[0.03] border-white/5 hover:border-white/20' : 'bg-white border-gray-200 hover:border-cyan-300'}`
                                                        }`}
                                                    >
                                                        {isSelected && (
                                                            <div className="absolute -top-2 -right-2 bg-cyan-500 text-white p-0.5 rounded-full">
                                                                <Check size={12} strokeWidth={4} />
                                                            </div>
                                                        )}
                                                        <div className={`p-3 rounded-xl transition-all ${
                                                            isSelected
                                                                ? 'bg-cyan-500/20 text-cyan-500 scale-110'
                                                                : color === 'cyan' ? 'bg-cyan-500/10 text-cyan-500' :
                                                                color === 'purple' ? 'bg-purple-500/10 text-purple-500' :
                                                                color === 'pink' ? 'bg-pink-500/10 text-pink-500' :
                                                                color === 'blue' ? 'bg-blue-500/10 text-blue-500' :
                                                                color === 'orange' ? 'bg-orange-500/10 text-orange-500' :
                                                                'bg-gray-500/10 text-gray-400'
                                                        }`}>
                                                            {React.cloneElement(opt.icon, {})}
                                                        </div>
                                                        <span className={`font-bold text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>{opt.label}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </>
                                )}

                                {/* TEXTAREA */}
                                {currentQuestion.type === 'textarea' && (
                                    <>
                                        <div className="text-center mb-16">
                                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.1] mb-6">
                                                {currentQuestion.question}
                                            </h2>
                                        </div>
                                        <div className="relative max-w-xl mx-auto">
                                            <textarea
                                                autoFocus
                                                rows={5}
                                                value={answers[currentQuestion.id] || ''}
                                                onChange={(e) => handleInputChange(currentQuestion.id, e.target.value)}
                                                placeholder={currentQuestion.placeholder}
                                                className={`w-full border-[2.5px] rounded-[2.5rem] p-8 text-xl font-medium outline-none transition-all placeholder:text-white/10 resize-none shadow-2xl ${
                                                    isDark
                                                        ? 'bg-white/[0.03] border-white/5 focus:border-cyan-500 focus:bg-white/[0.06] text-white'
                                                        : 'bg-white border-gray-200 focus:border-cyan-500 text-gray-900'
                                                }`}
                                            />
                                        </div>
                                    </>
                                )}

                                {/* MULTI-FIELD */}
                                {currentQuestion.type === 'fields' && (
                                    <>
                                        <div className="text-center mb-16">
                                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.1] mb-6">
                                                {currentQuestion.question}
                                            </h2>
                                        </div>
                                        <div className={`max-w-xl mx-auto rounded-[3rem] p-10 space-y-10 shadow-2xl relative overflow-hidden ${
                                            isDark ? 'bg-white/[0.02] border border-white/5' : 'bg-white border border-gray-200'
                                        }`}>
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl rounded-full" />
                                            {currentQuestion.fields.map((field, i) => (
                                                <div key={i} className="relative group">
                                                    <label className={`block text-[10px] font-black uppercase tracking-[0.3em] mb-4 ml-1 italic ${isDark ? 'text-white/30' : 'text-gray-400'}`}>{field.label}</label>
                                                    <div className="relative">
                                                        <div className={`absolute left-5 top-1/2 -translate-y-1/2 transition-all duration-500 ${
                                                            isDark ? 'text-white/20 group-focus-within:text-cyan-500' : 'text-gray-400 group-focus-within:text-cyan-600'
                                                        }`}>
                                                            {field.icon}
                                                        </div>
                                                        <input
                                                            type="url"
                                                            value={answers[`${currentQuestion.id}_field_${i}`] || ''}
                                                            onChange={(e) => handleInputChange(`${currentQuestion.id}_field_${i}`, e.target.value)}
                                                            placeholder={field.placeholder}
                                                            className={`w-full border-2 rounded-2xl py-5 pl-14 pr-6 outline-none transition-all focus:ring-4 ${
                                                                isDark
                                                                    ? 'bg-black/20 border-white/5 focus:border-cyan-500/50 text-white focus:ring-cyan-500/5'
                                                                    : 'bg-gray-50 border-gray-200 focus:border-cyan-500 text-gray-900 focus:ring-cyan-500/10'
                                                            }`}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {/* Nav Buttons */}
                                <div className="mt-16 flex items-center justify-between max-w-2xl mx-auto">
                                    <button
                                        onClick={handlePrev}
                                        className={`group flex items-center gap-2 px-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all ${currentStep === 0 ? 'opacity-0 pointer-events-none' : ''} ${isDark ? 'text-white/40 hover:text-white hover:bg-white/5' : 'text-gray-400 hover:text-gray-900 hover:bg-black/5'}`}
                                    >
                                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back
                                    </button>

                                    {(currentQuestion.type !== 'welcome' && currentQuestion.type !== 'choice') && (
                                        <button
                                            onClick={handleNext}
                                            disabled={!isStepValid()}
                                            className={`group flex items-center gap-4 px-12 py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all duration-500 ${isStepValid()
                                                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-2xl shadow-cyan-500/30 hover:scale-[1.05] hover:shadow-cyan-500/50 active:scale-95'
                                                : 'bg-white/5 text-white/20 cursor-not-allowed'}`}
                                        >
                                            {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
                                            {currentStep === steps.length - 1 ? <Send size={20} /> : <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            /* SUMMARY SCREEN */
                            <div className="animate-scale-in flex flex-col items-center max-w-2xl mx-auto">
                                <div className="relative mb-8">
                                    <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full animate-pulse" />
                                    <div className="relative w-20 h-20 rounded-[2rem] bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-2xl shadow-green-500/30">
                                        <Check className="w-10 h-10 text-white stroke-[4px]" />
                                    </div>
                                </div>

                                <h2 className={`text-3xl md:text-5xl font-black tracking-tighter text-center mb-3 leading-none ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    Application Summary
                                </h2>
                                <p className={`text-lg font-medium text-center mb-10 max-w-md mx-auto ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                                    Review your answers before sending
                                </p>

                                <div className="w-full space-y-4 mb-10">
                                    {steps.map((step, idx) => {
                                        if (step.type === 'welcome') return null;
                                        if (step.type === 'fields') {
                                            return (
                                                <div key={idx} className={`rounded-3xl p-6 ${isDark ? 'bg-white/[0.03] border border-white/5' : 'bg-white border border-gray-200'}`}>
                                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-500/60 mb-3">{step.question.replace(/\?$/, '')}</p>
                                                    {step.fields.map((field, fi) => (
                                                        <p key={fi} className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                            {field.label}: {answers[`${step.id}_field_${fi}`] || 'N/A'}
                                                        </p>
                                                    ))}
                                                </div>
                                            );
                                        }
                                        if (step.type === 'multiselect') {
                                            const selected = answers[step.id] || [];
                                            return (
                                                <div key={idx} className={`group relative rounded-3xl p-6 transition-all ${
                                                    isDark
                                                        ? 'bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] hover:border-cyan-500/30'
                                                        : 'bg-white border border-gray-200 hover:border-cyan-500/30'
                                                }`}>
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 shrink-0">
                                                            <Star size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-500/60 mb-1">{step.question.replace(/\?$/, '')}</p>
                                                            <div className="flex flex-wrap gap-2 mt-1">
                                                                {selected.map((s, si) => (
                                                                    <span key={si} className="inline-block px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-500 font-bold text-sm">
                                                                        {s}
                                                                    </span>
                                                                ))}
                                                                {selected.length === 0 && <span className={`text-lg font-bold ${isDark ? 'text-white/30' : 'text-gray-400'}`}>N/A</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return (
                                            <div key={idx} className={`group relative rounded-3xl p-6 transition-all ${
                                                isDark
                                                    ? 'bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] hover:border-cyan-500/30'
                                                    : 'bg-white border border-gray-200 hover:border-cyan-500/30'
                                            }`}>
                                                <div className="flex items-start gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 shrink-0">
                                                        {idx === 1 ? <User size={20} /> : idx === 2 ? <Mail size={20} /> : <FileText size={20} />}
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-500/60 mb-1">{step.question.replace(/\?$/, '')}</p>
                                                        <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{answers[step.id] || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <button
                                        onClick={handleEmailSend}
                                        className="group flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-6 rounded-3xl font-black text-lg transition-all hover:scale-[1.03] hover:shadow-2xl hover:shadow-cyan-500/30 active:scale-95 shadow-xl shadow-cyan-500/10"
                                    >
                                        <Mail className="w-6 h-6" /> Send Application
                                    </button>
                                    <button
                                        onClick={() => setIsCompleted(false)}
                                        className={`group flex items-center justify-center gap-3 px-8 py-6 rounded-3xl font-black text-lg transition-all hover:scale-[1.03] active:scale-95 shadow-xl ${
                                            isDark
                                                ? 'bg-white/5 text-white hover:bg-white/10'
                                                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                        }`}
                                    >
                                        <ChevronLeft size={20} /> Back to Edit
                                    </button>
                                </div>

                                <Link
                                    to="/"
                                    className={`mt-8 flex items-center gap-2 transition-colors font-black text-[10px] uppercase tracking-widest ${isDark ? 'text-white/40 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}
                                >
                                    Return to Homepage
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-1/4 -right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] animate-pulse delay-1000" />
            </div>

            <style>{`
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(40px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes slide-down {
                    from { opacity: 0; transform: translateY(-40px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes scale-in {
                    from { opacity: 0; transform: scale(0.8); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-slide-up { animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
                .animate-slide-down { animation: slide-down 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
                .animate-scale-in { animation: scale-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
            `}</style>
        </div>
    );
};

export default CareerForm;
