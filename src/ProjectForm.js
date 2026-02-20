import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    ChevronRight, ChevronLeft, Mail, MessageCircle, Check,
    Globe, Smartphone, Palette, Shield,
    Calendar, Coins,
    Sparkles, ArrowRight, Sun, Moon,
    User, Crosshair, FileText,
    Timer, Wallet, Phone, Loader
} from 'lucide-react';
import { useTheme } from './context/ThemeContext';
import { getLogo } from './utils/festive';

const ProjectForm = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [direction, setDirection] = useState('forward');
    const { isDark, toggleTheme } = useTheme();

    const [answers, setAnswers] = useState({});

    // Default Fallback Config
    const defaultConfig = {
        title: "Start Your Project",
        subtitle: "Tell us about your next big idea.",
        steps: [
            {
                id: 'category',
                question: "What type of project is this?",
                options: ["Web Development", "Mobile App", "Cybersecurity Audit", "UI/UX Design", "Branding", "Other"]
            },
            {
                id: 'budget',
                question: "What is your estimated budget?",
                options: ["<$1k", "$1k - $5k", "$5k - $10k", "$10k+", "Not sure yet"]
            },
            {
                id: 'timeline',
                question: "What is your desired timeline?",
                options: ["ASAP", "1 Month", "3 Months", "6+ Months"]
            }
        ],
        contactLabels: {
            name: "Full Name",
            email: "Email Address",
            details: "Project Details"
        }
    };

    const config = defaultConfig;
    const contentLoading = false;

    // Contact Step Definition
    const contactStep = {
        id: 'contact',
        type: 'contact',
        question: "How do we reach you?",
        subtitle: "We'll contact you within 24 hours",
        fields: [
            { id: 'contactName', label: config.contactLabels?.name || "Full Name", placeholder: 'John Doe', type: 'text', icon: <User className="w-5 h-5" /> },
            { id: 'contactPhone', label: "WhatsApp/Phone", placeholder: '+237 ...', type: 'tel', icon: <Phone className="w-5 h-5" /> },
            { id: 'contactEmail', label: config.contactLabels?.email || "Email Address", placeholder: 'john@example.com', type: 'email', icon: <Mail className="w-5 h-5" /> }
        ]
    };

    // Combine steps with Contact step
    const questions = useMemo(() => {
        if (!config.steps) return [contactStep];

        const mappedSteps = config.steps.map(step => ({
            ...step,
            type: step.options ? 'choice' : 'text',
            icon: getIconForStepId(step.id),
            options: step.options?.map(opt => ({
                value: opt,
                label: opt,
                desc: '',
                icon: getIconForOptionLabel(opt),
                color: getColorForOption(opt)
            }))
        }));

        return [...mappedSteps, contactStep];
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [config]);

    const handleNext = () => {
        if (isStepValid()) {
            setDirection('forward');
            setCurrentStep(prev => Math.min(prev + 1, questions.length));
        }
    };

    const handlePrevious = () => {
        setDirection('backward');
        setCurrentStep(prev => Math.max(prev - 1, 0));
    };

    const handleChoice = (value) => {
        const currentQuestion = questions[currentStep];
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));

        setTimeout(() => {
            setDirection('forward');
            setCurrentStep(prev => Math.min(prev + 1, questions.length));
        }, 300);
    };

    const handleInputChange = (field, value) => {
        setAnswers(prev => ({ ...prev, [field]: value }));
    };

    const isStepValid = () => {
        const currentQuestion = questions[currentStep];
        if (!currentQuestion) return true;

        if (currentQuestion.type === 'choice') {
            return !!answers[currentQuestion.id];
        } else if (currentQuestion.type === 'contact') {
            return !!answers.contactName && !!answers.contactPhone;
        }
        return true;
    };

    const progress = questions.length > 0 ? ((currentStep) / questions.length) * 100 : 0;

    function getIconForStepId(id) {
        const map = {
            category: <Crosshair className="w-8 h-8 text-cyan-500" />,
            budget: <Wallet className="w-8 h-8 text-cyan-500" />,
            timeline: <Timer className="w-8 h-8 text-cyan-500" />,
            contact: <Phone className="w-8 h-8 text-cyan-500" />
        };
        return map[id] || <FileText className="w-8 h-8 text-cyan-500" />;
    }

    function getIconForOptionLabel(label) {
        const l = label.toLowerCase();
        if (l.includes('web')) return <Globe className="w-10 h-10" />;
        if (l.includes('app')) return <Smartphone className="w-10 h-10" />;
        if (l.includes('design')) return <Palette className="w-10 h-10" />;
        if (l.includes('secur')) return <Shield className="w-10 h-10" />;
        if (l.includes('date') || l.includes('month') || l.includes('asap')) return <Calendar className="w-10 h-10" />;
        if (l.includes('k') || l.includes('$')) return <Coins className="w-10 h-10" />;
        return <Sparkles className="w-10 h-10" />;
    }

    function getColorForOption(label) {
        const colors = ['cyan', 'purple', 'green', 'blue', 'orange', 'pink'];
        let hash = 0;
        for (let i = 0; i < label.length; i++) hash = label.charCodeAt(i) + ((hash << 5) - hash);
        return colors[Math.abs(hash) % colors.length];
    }

    const getIconColorClass = (color) => {
        const map = {
            cyan: 'text-cyan-500', blue: 'text-blue-500', purple: 'text-purple-500',
            green: 'text-green-500', red: 'text-red-500', orange: 'text-orange-500',
            pink: 'text-pink-500', gray: 'text-gray-500'
        };
        return map[color] || 'text-cyan-500';
    };

    const generateSummaryText = () => {
        let text = `*NEW PROJECT REQUEST* \ud83d\ude80\n\n`;
        questions.forEach(q => {
            if (q.type === 'contact') return;
            text += `*${q.question}*\n\ud83d\udc49 ${answers[q.id] || 'N/A'}\n\n`;
        });

        text += `\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n`;
        text += `*CONTACT INFO:*\n`;
        text += `\ud83d\udc64 ${answers.contactName}\n`;
        text += `\ud83d\udcf1 ${answers.contactPhone}\n`;
        if (answers.contactEmail) text += `\ud83d\udce7 ${answers.contactEmail}\n`;

        return text;
    };

    const handleWhatsAppSend = () => {
        const message = generateSummaryText();
        window.open(`https://wa.me/237654269488?text=${encodeURIComponent(message)}`, '_blank');
    };

    const handleEmailSend = () => {
        const subject = `New Project Request: ${answers.category || 'Inquiry'}`;
        const body = generateSummaryText();
        window.location.href = `mailto:contact@xyberclan.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    if (contentLoading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-black' : 'bg-white'}`}>
                <Loader className="animate-spin text-cyan-500 w-12 h-12" />
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-500`}>
            {/* Header */}
            <div className={`fixed top-0 left-0 right-0 z-50 px-4 py-4 transition-all duration-300 ${isDark ? 'bg-black/80 backdrop-blur-xl' : 'bg-white/80 backdrop-blur-xl'}`}>
                <div className="max-w-3xl mx-auto flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <img src={getLogo()} alt="XyberClan — Reliable Technology Partner" className="w-9 h-9 object-contain rounded-xl" />
                        <span className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>
                            Xyber<span className="text-cyan-500">Clan</span>
                        </span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <span className={`hidden sm:inline text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            Step {currentStep + 1} of {questions.length}
                        </span>
                        <button onClick={toggleTheme} className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${isDark ? 'bg-white/5 text-yellow-400 hover:bg-white/10' : 'bg-black/5 text-blue-600 hover:bg-black/10'}`}>
                            {isDark ? <Sun size={16} /> : <Moon size={16} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="fixed top-[60px] left-0 right-0 z-40 px-4 py-2">
                <div className="max-w-3xl mx-auto">
                    <div className={`h-1 rounded-full overflow-hidden ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
                        <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="pt-32 pb-20 px-4">
                <div className="max-w-3xl mx-auto">
                    {currentStep < questions.length ? (
                        <div key={currentStep} className={`${direction === 'forward' ? 'animate-slide-in-right' : 'animate-slide-in-left'}`}>

                            {/* Question Header */}
                            <div className="text-center mb-10">
                                {questions[currentStep].icon && (
                                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5 ${isDark ? 'bg-cyan-500/10' : 'bg-cyan-50'}`}>
                                        {questions[currentStep].icon}
                                    </div>
                                )}
                                <h1 className="text-3xl md:text-5xl font-black mb-3 tracking-tight leading-[1.1]" style={{ fontFamily: "'Inter', sans-serif" }}>
                                    {questions[currentStep].question}
                                </h1>
                                <p className={`text-base md:text-lg ${isDark ? 'text-gray-500' : 'text-gray-500'}`} style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
                                    {questions[currentStep].subtitle}
                                </p>
                            </div>

                            {/* Dynamic Question Rendering */}
                            {questions[currentStep].type === 'choice' && (
                                <div className={`grid gap-3 ${questions[currentStep].options.length > 4 ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-2'}`}>
                                    {questions[currentStep].options.map((option) => {
                                        const isSelected = answers[questions[currentStep].id] === option.value;
                                        return (
                                            <button key={option.value} onClick={() => handleChoice(option.value)}
                                                className={`group relative p-5 rounded-2xl border transition-all duration-300 text-center hover:scale-[1.02] active:scale-[0.98] overflow-hidden
                                                    ${isSelected
                                                        ? `border-cyan-500/60 shadow-lg shadow-cyan-500/10 ${isDark ? 'bg-cyan-500/8' : 'bg-cyan-50'}`
                                                        : `${isDark ? 'border-white/8 hover:border-white/20 bg-white/[0.02]' : 'border-gray-200 hover:border-gray-300 bg-white'}`
                                                    }`}>
                                                <div className={`${getIconColorClass(option.color)} mb-3 flex justify-center transition-transform duration-300 group-hover:scale-110`}>
                                                    {React.cloneElement(option.icon, { className: 'w-8 h-8' })}
                                                </div>
                                                <h3 className="text-base font-bold mb-0.5 tracking-tight">{option.label}</h3>
                                                {option.desc && <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{option.desc}</p>}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {questions[currentStep].type === 'contact' && (
                                <div className={`rounded-2xl p-6 border space-y-5 ${isDark ? 'bg-white/[0.02] border-white/8' : 'bg-white border-gray-200 shadow-sm'}`}>
                                    {questions[currentStep].fields.map((field) => (
                                        <div key={field.id}>
                                            <label className={`block text-xs font-bold uppercase tracking-[0.12em] mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{field.label}</label>
                                            <div className="relative">
                                                <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{field.icon}</div>
                                                <input type={field.type} value={answers[field.id] || ''} onChange={(e) => handleInputChange(field.id, e.target.value)} placeholder={field.placeholder}
                                                    className={`w-full pl-11 pr-4 py-3.5 rounded-xl border text-base transition-all ${isDark ? 'bg-white/[0.03] border-white/8 focus:border-cyan-500 text-white placeholder-gray-600' : 'bg-gray-50/50 border-gray-200 focus:border-cyan-500 text-gray-900 placeholder-gray-400'} focus:outline-none`}
                                                    style={{ fontFamily: "'Inter', sans-serif" }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Buttons */}
                            <div className="flex justify-between items-center mt-8">
                                <button onClick={handlePrevious} className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all ${currentStep === 0 ? 'opacity-0 pointer-events-none' : ''} ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-black/5 hover:bg-black/10'}`}>
                                    <ChevronLeft className="w-4 h-4" /> Back
                                </button>
                                {/* Only show Continue button if not auto-advance choice (handled by click) OR if type is contact */}
                                {questions[currentStep].type === 'contact' && (
                                    <button onClick={handleNext} disabled={!isStepValid()}
                                        className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm transition-all ${isStepValid()
                                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/30 hover:scale-[1.03]'
                                            : `${isDark ? 'bg-white/5 text-gray-600' : 'bg-gray-200 text-gray-400'} cursor-not-allowed`}`}>
                                        Continue <ChevronRight className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        // Summary & Success View
                        <div className="animate-slide-in-right">
                            <div className="text-center mb-10">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 mb-5 shadow-lg shadow-green-500/20">
                                    <Check className="w-8 h-8 text-white" />
                                </div>
                                <h1 className="text-3xl md:text-5xl font-black mb-3 tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>All Set!</h1>
                                <p className={`text-base ${isDark ? 'text-gray-500' : 'text-gray-500'}`} style={{ fontWeight: 300 }}>We'll get back to you within 24 hours</p>
                            </div>

                            <div className={`rounded-2xl p-6 mb-8 border ${isDark ? 'bg-white/[0.02] border-white/8' : 'bg-white border-gray-200 shadow-sm'}`}>
                                <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-cyan-500">Project Summary</h3>
                                <div className="space-y-4">
                                    {questions.slice(0, questions.length - 1).map((q, i) => (
                                        <div key={i} className={`flex justify-between items-center py-2 border-b ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                                            <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{q.question}</span>
                                            <span className="font-bold text-sm text-right">{answers[q.id]}</span>
                                        </div>
                                    ))}
                                    <div className="flex justify-between items-center py-2">
                                        <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Contact</span>
                                        <span className="font-bold text-sm text-right">{answers.contactName} ({answers.contactPhone})</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <button onClick={handleWhatsAppSend} className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl font-bold text-base transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-green-500/20">
                                    <MessageCircle className="w-5 h-5" /> Send via WhatsApp <ArrowRight className="w-4 h-4" />
                                </button>
                                <button onClick={handleEmailSend} className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-4 rounded-xl font-bold text-base transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-cyan-500/20">
                                    <Mail className="w-5 h-5" /> Send via Email <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex justify-center mt-6">
                                <button onClick={handlePrevious} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-black/5 hover:bg-black/10'}`}>
                                    <ChevronLeft className="w-4 h-4" /> Edit Answers
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <style jsx>{`
                @keyframes slide-in-right {
                    from { opacity: 0; transform: translateX(30px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes slide-in-left {
                    from { opacity: 0; transform: translateX(-30px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-slide-in-right { animation: slide-in-right 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
                .animate-slide-in-left { animation: slide-in-left 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
            `}</style>
        </div>
    );
};

export default ProjectForm;
