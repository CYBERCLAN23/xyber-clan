import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    ChevronLeft, Mail, MessageCircle, Check,
    Globe, Smartphone, Palette, Shield,
    Calendar, Coins,
    Sparkles, ArrowRight, Sun, Moon,
    User, FileText,
    Phone, Monitor, Hash,
    Layers, ShoppingCart, Briefcase, UserCircle,
    Layout, Files, FilePlus, Database,
    CreditCard, Lock, BookOpen, MessageSquare,
    Users, Wrench, Zap, Clock, Activity, LifeBuoy,
    Search, ShieldCheck, Terminal, Cpu, Wifi, HardDrive,
    Settings2, GraduationCap, BarChart, Code2, Package,
    Target, Compass, Trello, Slack,
    LayoutDashboard, Laptop, Rocket,
    History, Bug,
    ShieldAlert, Globe2, BarChart3, MailPlus
} from 'lucide-react';
import { useTheme } from './context/ThemeContext';
import { getLogo } from './utils/festive';
import { translations } from './translations';

const ProjectForm = () => {
    const { isDark, toggleTheme } = useTheme();
    const [lang, setLang] = useState('en');
    const t = translations[lang].form;

    const [currentStep, setCurrentStep] = useState(0);
    const [direction, setDirection] = useState('forward');
    const [answers, setAnswers] = useState({
        projectType: '',
        projectName: '',
        description: '',
        timeline: '',
        budget: '',
        contactName: '',
        contactPhone: '',
        contactEmail: ''
        // Dynamic keys will be added here
    });

    const steps = useMemo(() => {
        const baseSteps = [];

        // Map project types to translation keys
        const typeToKey = {
            [translations[lang].form.options.web]: 'web',
            [translations[lang].form.options.mobile]: 'mobile',
            [translations[lang].form.options.design]: 'design',
            [translations[lang].form.options.cybersec]: 'cybersec',
            [translations[lang].form.options.hardware]: 'hardware',
            [translations[lang].form.options.training]: 'training'
        };

        // Icon Mapping Helper
        const getDynamicIcon = (serviceId, optionIndex, label) => {
            const icons = {
                webGoal: [<ShoppingCart />, <Briefcase />, <UserCircle />, <LayoutDashboard />],
                webPages: [<FilePlus />, <Files />, <Layout />, <Database />],
                webFeatures: [
                    <MessageSquare />, <Lock />, <CreditCard />, <BookOpen />,
                    <Search />, <Globe2 />, <MailPlus />, <BarChart3 />
                ],
                mobilePlatform: [<Smartphone />, <Laptop />, <Cpu />],
                mobileType: [<ShoppingCart />, <Users />, <Wrench />, <Settings2 />],
                designType: [
                    <Palette />, <Layout />, <Slack />, <Target />,
                    <UserCircle />, <FileText />, <Layers />, <Rocket />
                ],
                designStyle: [
                    <Compass />, <Zap />, <Briefcase />, <Rocket />,
                    <History />, <Cpu />, <Sparkles />
                ],
                secType: [
                    <Search />, <ShieldCheck />, <Terminal />, <Activity />,
                    <ShieldAlert />, <Bug />, <Users />, <Lock />
                ],
                secTarget: [<Globe />, <Wifi />, <Smartphone />, <HardDrive />, <Monitor />, <Cpu />],
                hwType: [<Wrench />, <Wifi />, <Cpu />, <Settings2 />],
                hwUrgency: [<Zap />, <Clock />, <Activity />, <LifeBuoy />],
                trainingSubject: [
                    <Code2 />, <Shield />, <Palette />, <Package />,
                    <Smartphone />, <Database />, <Layout />, <Target />
                ],
                trainingLevel: [<GraduationCap />, <BarChart />, <Trello />]
            };

            const serviceIcons = icons[serviceId];
            if (serviceIcons && serviceIcons[optionIndex]) {
                return React.cloneElement(serviceIcons[optionIndex], { className: "w-8 h-8" });
            }
            return <Layers className="w-8 h-8" />;
        };

        const colors = ['cyan', 'purple', 'pink', 'blue', 'orange', 'green', 'indigo', 'rose', 'amber'];

        // Step 0: Initial Choice
        baseSteps.push({
            id: 'projectType',
            type: 'choice',
            question: t.questions.projectType,
            options: [
                { value: t.options.web, label: t.options.web, icon: <Globe className="w-8 h-8" />, color: 'cyan' },
                { value: t.options.mobile, label: t.options.mobile, icon: <Smartphone className="w-8 h-8" />, color: 'purple' },
                { value: t.options.design, label: t.options.design, icon: <Palette className="w-8 h-8" />, color: 'pink' },
                { value: t.options.cybersec, label: t.options.cybersec, icon: <Shield className="w-8 h-8" />, color: 'blue' },
                { value: t.options.hardware, label: t.options.hardware, icon: <Monitor className="w-8 h-8" />, color: 'orange' },
                { value: t.options.training, label: t.options.training, icon: <Sparkles className="w-8 h-8" />, color: 'green' }
            ]
        });

        // Dynamic Service Steps
        const selectedType = typeToKey[answers.projectType];
        if (selectedType && t.serviceQuestions[selectedType]) {
            t.serviceQuestions[selectedType].forEach((sq) => {
                baseSteps.push({
                    id: sq.id,
                    type: 'choice',
                    multi: sq.multi,
                    question: sq.question,
                    options: sq.options.map((opt, idx) => ({
                        value: opt,
                        label: opt,
                        icon: getDynamicIcon(sq.id, idx, opt),
                        color: colors[idx % colors.length]
                    }))
                });
            });
        }

        // Global Steps
        baseSteps.push(
            {
                id: 'projectName',
                type: 'text',
                question: t.questions.projectName,
                placeholder: t.placeholders.projectName,
                icon: <Hash className="w-8 h-8 text-cyan-500" />
            },
            {
                id: 'description',
                type: 'textarea',
                question: t.questions.description,
                placeholder: t.placeholders.description,
                icon: <FileText className="w-8 h-8 text-cyan-500" />
            },
            {
                id: 'timeline',
                type: 'choice',
                question: t.questions.timeline,
                options: [
                    { value: t.options.asap, label: t.options.asap, icon: <Zap className="w-8 h-8" />, color: 'red' },
                    { value: t.options.weeks, label: t.options.weeks, icon: <Clock className="w-8 h-8" />, color: 'orange' },
                    { value: t.options.month, label: t.options.month, icon: <Calendar className="w-8 h-8" />, color: 'yellow' },
                    { value: t.options.months, label: t.options.months, icon: <History className="w-8 h-8" />, color: 'blue' },
                    { value: t.options.flexible, label: t.options.flexible, icon: <Compass className="w-8 h-8" />, color: 'cyan' }
                ]
            },
            {
                id: 'budget',
                type: 'choice',
                question: t.questions.budget,
                options: [
                    { value: t.options.under100k, label: t.options.under100k, icon: <Coins className="w-8 h-8" />, color: 'gray' },
                    { value: t.options.range1, label: t.options.range1, icon: <CreditCard className="w-8 h-8" />, color: 'cyan' },
                    { value: t.options.range2, label: t.options.range2, icon: <Briefcase className="w-8 h-8" />, color: 'blue' },
                    { value: t.options.over1m, label: t.options.over1m, icon: <Rocket className="w-8 h-8" />, color: 'purple' },
                    { value: t.options.notSure, label: t.options.notSure, icon: <Search className="w-8 h-8" />, color: 'gray' }
                ]
            },
            {
                id: 'contact',
                type: 'contact',
                question: t.questions.contact,
                fields: [
                    { id: 'contactName', label: t.contactLabels.name, placeholder: t.placeholders.contactName, type: 'text', icon: <User className="w-5 h-5" /> },
                    { id: 'contactPhone', label: t.contactLabels.phone, placeholder: t.placeholders.contactPhone, type: 'tel', icon: <Phone className="w-5 h-5" /> },
                    { id: 'contactEmail', label: t.contactLabels.email, placeholder: t.placeholders.contactEmail, type: 'email', icon: <Mail className="w-5 h-5" /> }
                ]
            }
        );

        return baseSteps;
    }, [answers.projectType, lang, t]);

    const currentQuestion = steps[currentStep];

    const handleNext = () => {
        if (isStepValid()) {
            setDirection('forward');
            setCurrentStep(prev => Math.min(prev + 1, steps.length));
        }
    };

    const handlePrevious = () => {
        setDirection('backward');
        setCurrentStep(prev => Math.max(prev - 1, 0));
    };

    const handleChoice = (id, value, multi) => {
        if (multi) {
            setAnswers(prev => {
                const current = prev[id] || [];
                const updated = current.includes(value)
                    ? current.filter(v => v !== value)
                    : [...current, value];
                return { ...prev, [id]: updated };
            });
        } else {
            setAnswers(prev => ({ ...prev, [id]: value }));
            setTimeout(() => {
                setDirection('forward');
                setCurrentStep(prev => Math.min(prev + 1, steps.length));
            }, 300);
        }
    };

    const handleInputChange = (field, value) => {
        setAnswers(prev => ({ ...prev, [field]: value }));
    };

    const isStepValid = () => {
        if (!currentQuestion) return true;
        if (currentQuestion.type === 'choice') {
            if (currentQuestion.multi) {
                return (answers[currentQuestion.id] || []).length > 0;
            }
            return !!answers[currentQuestion.id];
        }
        if (currentQuestion.id === 'projectName') return !!answers.projectName;
        if (currentQuestion.id === 'description') return !!answers.description;
        if (currentQuestion.type === 'contact') return !!answers.contactName && !!answers.contactPhone;
        return !!answers[currentQuestion.id];
    };

    const progress = ((currentStep) / steps.length) * 100;

    const generateSummaryText = () => {
        let text = `*NEW PROJECT REQUEST* \ud83d\ude80\n\n`;
        steps.forEach(step => {
            if (step.id === 'contact') return;
            const label = step.id === 'projectType' ? t.projectType :
                step.id === 'projectName' ? t.projectName :
                    step.id === 'description' ? t.description :
                        step.id === 'timeline' ? t.timeline :
                            step.id === 'budget' ? t.budget :
                                step.question.replace(/^[^\s]+\s/, '');

            const val = answers[step.id];
            const displayVal = Array.isArray(val) ? val.join(', ') : (val || 'N/A');
            text += `*${label}:* ${displayVal}\n`;
        });
        text += `\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n`;
        text += `*CONTACT INFO:*\n`;
        text += `\ud83d\udc64 ${answers.contactName}\n`;
        text += `\ud83d\udcf1 ${answers.contactPhone}\n`;
        if (answers.contactEmail) text += `\ud83d\udce7 ${answers.contactEmail}\n`;
        return text;
    };

    const handleWhatsAppSend = () => {
        window.open(`https://wa.me/237672446810?text=${encodeURIComponent(generateSummaryText())}`, '_blank');
    };

    const handleEmailSend = () => {
        const subject = `New Project: ${answers.projectName}`;
        window.location.href = `mailto:xyberclandev@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(generateSummaryText())}`;
    };

    return (
        <div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-500 overflow-x-hidden`}>
            {/* Nav Header */}
            <div className={`fixed top-0 left-0 right-0 z-50 px-4 py-4 transition-all duration-300 ${isDark ? 'bg-black/80 backdrop-blur-xl' : 'bg-white/80 backdrop-blur-xl border-b border-gray-100'}`}>
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2.5 group hover:scale-[1.02] transition-transform">
                        <img src={getLogo()} alt="XyberClan" className="w-10 h-10 object-contain rounded-xl" />
                        <span className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>
                            Xyber<span className="text-cyan-500">Clan</span>
                        </span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setLang(l => l === 'en' ? 'fr' : 'en')} className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${isDark ? 'bg-white/5 text-cyan-400 hover:bg-white/10' : 'bg-black/5 text-cyan-600 hover:bg-black/10'}`}>
                            {lang}
                        </button>
                        <button onClick={toggleTheme} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isDark ? 'bg-white/5 text-yellow-400 hover:bg-white/10' : 'bg-black/5 text-blue-600 hover:bg-black/10'}`}>
                            {isDark ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="fixed top-[72px] left-0 right-0 z-40 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
                        <div className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 rounded-full transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_0_15px_rgba(34,211,238,0.3)]" style={{ width: `${progress}%` }} />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="pt-32 pb-24 px-4 min-h-screen flex flex-col items-center">
                <div className="w-full max-w-2xl mx-auto">
                    {currentStep < steps.length ? (
                        <div key={currentQuestion.id} className={`${direction === 'forward' ? 'animate-slide-up' : 'animate-slide-down'}`}>
                            <p className="text-center text-[11px] font-bold uppercase tracking-[0.3em] text-cyan-500 mb-6">
                                {t.step} {currentStep + 1} {t.of} {steps.length}
                            </p>

                            <div className="text-center mb-12">
                                <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-[1] text-gray-950 dark:text-white">
                                    {currentQuestion.question}
                                </h1>
                            </div>

                            {currentQuestion.type === 'choice' && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {currentQuestion.options.map((opt) => {
                                        const isSelected = currentQuestion.multi
                                            ? (answers[currentQuestion.id] || []).includes(opt.value)
                                            : answers[currentQuestion.id] === opt.value;

                                        return (
                                            <button key={opt.value} onClick={() => handleChoice(currentQuestion.id, opt.value, currentQuestion.multi)}
                                                className={`group relative p-8 rounded-3xl border transition-all duration-500 text-left hover:scale-[1.02] active:scale-[0.98] overflow-hidden ${isSelected
                                                    ? 'border-cyan-500 bg-cyan-500/5 shadow-2xl shadow-cyan-500/10'
                                                    : isDark ? 'border-white/5 bg-white/[0.02] hover:border-white/20' : 'border-gray-200 bg-white hover:border-gray-300 shadow-sm hover:shadow-lg'
                                                    }`}>

                                                {isSelected && (
                                                    <div className="absolute top-4 right-4 animate-scale-in">
                                                        <div className="bg-cyan-500 text-white p-1 rounded-full">
                                                            <Check size={14} strokeWidth={4} />
                                                        </div>
                                                    </div>
                                                )}

                                                <div className={`mb-6 p-4 rounded-2xl inline-block transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 ${opt.color === 'cyan' ? 'bg-cyan-500/10 text-cyan-500' :
                                                    opt.color === 'purple' ? 'bg-purple-500/10 text-purple-500' :
                                                        opt.color === 'pink' ? 'bg-pink-500/10 text-pink-500' :
                                                            opt.color === 'blue' ? 'bg-blue-500/10 text-blue-500' :
                                                                opt.color === 'orange' ? 'bg-orange-500/10 text-orange-500' :
                                                                    opt.color === 'yellow' ? 'bg-yellow-500/10 text-yellow-500' :
                                                                        opt.color === 'red' ? 'bg-red-500/10 text-red-500' :
                                                                            opt.color === 'indigo' ? 'bg-indigo-500/10 text-indigo-500' :
                                                                                opt.color === 'rose' ? 'bg-rose-500/10 text-rose-500' :
                                                                                    opt.color === 'amber' ? 'bg-amber-500/10 text-amber-500' :
                                                                                        'bg-gray-500/10 text-gray-500'
                                                    }`}>
                                                    {opt.icon}
                                                </div>
                                                <h3 className="text-xl font-black tracking-tight mb-1">{opt.label}</h3>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {currentQuestion.type === 'text' && (
                                <div className="relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-cyan-500 transition-transform group-focus-within:scale-110 transition-all duration-500">
                                        {currentQuestion.icon}
                                    </div>
                                    <input autoFocus type="text" value={answers[currentQuestion.id] || ''} onChange={(e) => handleInputChange(currentQuestion.id, e.target.value)} placeholder={currentQuestion.placeholder}
                                        className={`w-full pl-20 pr-8 py-8 rounded-3xl border-[2.5px] text-2xl font-bold transition-all outline-none ${isDark ? 'bg-white/[0.03] border-white/5 focus:border-cyan-500 focus:bg-white/[0.05]' : 'bg-white border-gray-100 shadow-xl shadow-gray-200/20 focus:border-cyan-500 focus:shadow-2xl focus:shadow-cyan-500/10'}`} />
                                </div>
                            )}

                            {currentQuestion.type === 'textarea' && (
                                <div className="relative group">
                                    <textarea autoFocus rows={5} value={answers[currentQuestion.id] || ''} onChange={(e) => handleInputChange(currentQuestion.id, e.target.value)} placeholder={currentQuestion.placeholder}
                                        className={`w-full p-8 rounded-[2.5rem] border-[2.5px] text-xl font-medium transition-all outline-none resize-none ${isDark ? 'bg-white/[0.03] border-white/5 focus:border-cyan-500 focus:bg-white/[0.05]' : 'bg-white border-gray-100 shadow-xl shadow-gray-200/20 focus:border-cyan-500 focus:shadow-2xl focus:shadow-cyan-500/10'}`} />
                                </div>
                            )}

                            {currentQuestion.type === 'contact' && (
                                <div className={`rounded-[2.5rem] p-8 md:p-12 border ${isDark ? 'bg-white/[0.02] border-white/5 shadow-2xl' : 'bg-white border-gray-100 shadow-2xl shadow-gray-200/40'} space-y-8`}>
                                    {currentQuestion.fields.map((field) => (
                                        <div key={field.id} className="relative group">
                                            <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-3 ml-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{field.label}</label>
                                            <div className="relative">
                                                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-500 ${isDark ? 'text-gray-600 group-focus-within:text-cyan-500' : 'text-gray-400 group-focus-within:text-cyan-600'}`}>
                                                    {field.icon}
                                                </div>
                                                <input type={field.type} value={answers[field.id] || ''} onChange={(e) => handleInputChange(field.id, e.target.value)} placeholder={field.placeholder}
                                                    className={`w-full pl-12 pr-6 py-4 rounded-2xl border-2 transition-all outline-none ${isDark ? 'bg-black/20 border-white/5 focus:border-cyan-500/50 text-white' : 'bg-gray-50 border-gray-100 focus:border-cyan-500/50 text-gray-900'} focus:ring-4 focus:ring-cyan-500/5`} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="mt-12 flex items-center justify-between">
                                <button onClick={handlePrevious} className={`group flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm transition-all ${currentStep === 0 ? 'opacity-0 pointer-events-none' : 'hover:bg-gray-500/5 active:scale-95'}`}>
                                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> {t.previous}
                                </button>
                                {(currentQuestion.type !== 'choice' || currentQuestion.multi) && (
                                    <button onClick={handleNext} disabled={!isStepValid()}
                                        className={`group flex items-center gap-3 px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${isStepValid()
                                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-2xl shadow-cyan-500/25 hover:scale-[1.05] hover:shadow-cyan-500/40 active:scale-95'
                                            : `${isDark ? 'bg-white/5 text-gray-600' : 'bg-gray-100 text-gray-400'} cursor-not-allowed`}`}>
                                        {t.next} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="animate-scale-in flex flex-col items-center">
                            <div className="relative mb-12">
                                <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full animate-pulse" />
                                <div className="relative w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-2xl shadow-green-500/30">
                                    <Check className="w-12 h-12 text-white stroke-[4px]" />
                                </div>
                            </div>

                            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter text-center">{t.summaryTitle}</h1>
                            <p className={`text-xl font-light text-center mb-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t.summaryDesc}</p>

                            <div className={`w-full rounded-[3rem] p-10 border mb-12 relative overflow-hidden ${isDark ? 'bg-white/[0.02] border-white/5 shadow-2xl' : 'bg-white border-gray-100 shadow-2xl shadow-gray-200/40'}`}>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl rounded-full" />
                                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-cyan-500 mb-8">{t.projectName}</h3>
                                <div className="space-y-6">
                                    {steps.map((step, i) => {
                                        if (step.id === 'contact') return null;
                                        const label = step.id === 'projectType' ? t.projectType :
                                            step.id === 'projectName' ? t.projectName :
                                                step.id === 'description' ? t.description :
                                                    step.id === 'timeline' ? t.timeline :
                                                        step.id === 'budget' ? t.budget :
                                                            step.question.replace(/^[^\s]+\s/, '');

                                        const val = answers[step.id];
                                        const displayVal = Array.isArray(val) ? val.join(', ') : (val || 'None');

                                        return (
                                            <div key={i} className="flex justify-between items-start gap-4 pb-4 border-b border-white/5 last:border-0 last:pb-0">
                                                <span className={`text-sm font-bold opacity-40 uppercase tracking-widest`}>{label}</span>
                                                <span className="text-sm font-black text-right max-w-[200px]">{displayVal}</span>
                                            </div>
                                        );
                                    })}
                                    <div className="flex justify-between items-start gap-4 pb-4 border-b border-white/5 last:border-0 last:pb-0">
                                        <span className={`text-sm font-bold opacity-40 uppercase tracking-widest`}>{t.contactInfo}</span>
                                        <span className="text-sm font-black text-right max-w-[200px]">{answers.contactName} ({answers.contactPhone})</span>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                <button onClick={handleWhatsAppSend} className="group flex items-center justify-center gap-3 bg-[#25D366] text-white px-8 py-6 rounded-3xl font-black text-lg transition-all hover:scale-[1.03] hover:shadow-2xl hover:shadow-[#25D366]/30 active:scale-95 shadow-xl shadow-[#25D366]/10">
                                    <MessageCircle className="w-6 h-6" /> {t.sendWhatsApp}
                                </button>
                                <button onClick={handleEmailSend} className="group flex items-center justify-center gap-3 bg-gray-950 dark:bg-white text-white dark:text-gray-950 px-8 py-6 rounded-3xl font-black text-lg transition-all hover:scale-[1.03] hover:shadow-2xl hover:shadow-cyan-500/20 active:scale-95 shadow-xl">
                                    <Mail className="w-6 h-6" /> {t.sendEmail}
                                </button>
                            </div>

                            <button onClick={() => setCurrentStep(0)} className={`flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-all ${isDark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}>
                                <ChevronLeft size={16} /> {t.backToEdit}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(40px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes slide-down {
                    from { opacity: 0; transform: translateY(-40px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes scale-in {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-slide-up { animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
                .animate-slide-down { animation: slide-down 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
                .animate-scale-in { animation: scale-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
            `}</style>
        </div>
    );
};

export default ProjectForm;
