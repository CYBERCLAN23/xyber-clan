import React, { useState, useMemo, useEffect, useRef } from 'react';
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
import { useLanguage } from './context/LanguageContext';
import { getLogo } from './utils/festive';
import { translations } from './translations';
import Meta from './components/Meta';
import gsap from 'gsap';

const FONT = "'Inter', 'Helvetica Neue', sans-serif";

const ProjectForm = () => {
    const { isDark, toggleTheme } = useTheme();
    const { language, toggleLanguage } = useLanguage();
    const t = translations[language].form;
    
    const [currentStep, setCurrentStep] = useState(0);
    const [, setDirection] = useState('forward');
    const [isMobile, setIsMobile] = useState(false);
    
    const leftPanelRef = useRef(null);
    const rightPanelRef = useRef(null);

    const [answers, setAnswers] = useState({
        projectType: '',
        projectName: '',
        description: '',
        timeline: '',
        budget: '',
        contactName: '',
        contactPhone: '',
        contactEmail: ''
    });

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 960);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // ─── Step Transition GSAP Animation ─────────────────────────────────────
    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate left side questions
            if (leftPanelRef.current) {
                const elements = leftPanelRef.current.querySelectorAll('.animate-left');
                gsap.fromTo(elements,
                    { opacity: 0, y: 15, filter: 'blur(3px)' },
                    { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5, stagger: 0.08, ease: 'power2.out' }
                );
            }
            // Animate right side form elements
            if (rightPanelRef.current) {
                const elements = rightPanelRef.current.children;
                gsap.fromTo(elements,
                    { opacity: 0, y: 25, filter: 'blur(5px)' },
                    { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, stagger: 0.06, ease: 'power3.out' }
                );
            }
        });
        return () => ctx.revert();
    }, [currentStep]);

    const steps = useMemo(() => {
        const baseSteps = [];

        const typeToKey = {
            [translations[language].form.options.web]: 'web',
            [translations[language].form.options.mobile]: 'mobile',
            [translations[language].form.options.design]: 'design',
            [translations[language].form.options.cybersec]: 'cybersec',
            [translations[language].form.options.hardware]: 'hardware',
            [translations[language].form.options.training]: 'training'
        };

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
                return React.cloneElement(serviceIcons[optionIndex], { className: "w-6 h-6" });
            }
            return <Layers className="w-6 h-6" />;
        };

        const colors = ['#06b6d4', '#a855f7', '#ec4899', '#3b82f6', '#f97316', '#22c55e', '#6366f1', '#f43f5e', '#f59e0b'];

        // Step 0: Initial Choice
        baseSteps.push({
            id: 'projectType',
            type: 'choice',
            question: t.questions.projectType,
            description: 'Select the primary focus of your project. We build bespoke solutions tailored for your unique vertical.',
            options: [
                { value: t.options.web, label: t.options.web, icon: <Globe className="w-6 h-6" />, color: '#06b6d4' },
                { value: t.options.mobile, label: t.options.mobile, icon: <Smartphone className="w-6 h-6" />, color: '#a855f7' },
                { value: t.options.design, label: t.options.design, icon: <Palette className="w-6 h-6" />, color: '#ec4899' },
                { value: t.options.cybersec, label: t.options.cybersec, icon: <Shield className="w-6 h-6" />, color: '#3b82f6' },
                { value: t.options.hardware, label: t.options.hardware, icon: <Monitor className="w-6 h-6" />, color: '#f97316' },
                { value: t.options.training, label: t.options.training, icon: <Sparkles className="w-6 h-6" />, color: '#22c55e' }
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
                    description: `Define your requirements. ${sq.multi ? 'Select all that apply to your business.' : 'Select the best matching option.'}`,
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
                description: 'What name should we use to reference your project during the design and engineering stages?',
                placeholder: t.placeholders.projectName,
                icon: <Hash className="w-8 h-8 text-cyan-500" />
            },
            {
                id: 'description',
                type: 'textarea',
                question: t.questions.description,
                description: 'Briefly explain your vision, goals, target audience, and any reference sites or products you admire.',
                placeholder: t.placeholders.description,
                icon: <FileText className="w-8 h-8 text-cyan-500" />
            },
            {
                id: 'timeline',
                type: 'choice',
                question: t.questions.timeline,
                description: 'When do you hope to launch this project? Select a schedule that matches your operational needs.',
                options: [
                    { value: t.options.asap, label: t.options.asap, icon: <Zap className="w-6 h-6" />, color: '#ef4444' },
                    { value: t.options.weeks, label: t.options.weeks, icon: <Clock className="w-6 h-6" />, color: '#f97316' },
                    { value: t.options.month, label: t.options.month, icon: <Calendar className="w-6 h-6" />, color: '#eab308' },
                    { value: t.options.months, label: t.options.months, icon: <History className="w-6 h-6" />, color: '#3b82f6' },
                    { value: t.options.flexible, label: t.options.flexible, icon: <Compass className="w-6 h-6" />, color: '#06b6d4' }
                ]
            },
            {
                id: 'budget',
                type: 'choice',
                question: t.questions.budget,
                description: 'Select your budget range. This helps us propose appropriate technology stacks and development phases.',
                options: [
                    { value: t.options.under100k, label: t.options.under100k, icon: <Coins className="w-6 h-6" />, color: '#6b7280' },
                    { value: t.options.range1, label: t.options.range1, icon: <CreditCard className="w-6 h-6" />, color: '#06b6d4' },
                    { value: t.options.range2, label: t.options.range2, icon: <Briefcase className="w-6 h-6" />, color: '#3b82f6' },
                    { value: t.options.over1m, label: t.options.over1m, icon: <Rocket className="w-6 h-6" />, color: '#a855f7' },
                    { value: t.options.notSure, label: t.options.notSure, icon: <Search className="w-6 h-6" />, color: '#6b7280' }
                ]
            },
            {
                id: 'contact',
                type: 'contact',
                question: t.questions.contact,
                description: 'Provide your contact details so our chief architect can get back to you with a structured proposal.',
                fields: [
                    { id: 'contactName', label: t.contactLabels.name, placeholder: t.placeholders.contactName, type: 'text', icon: <User className="w-5 h-5" /> },
                    { id: 'contactPhone', label: t.contactLabels.phone, placeholder: t.placeholders.contactPhone, type: 'tel', icon: <Phone className="w-5 h-5" /> },
                    { id: 'contactEmail', label: t.contactLabels.email, placeholder: t.placeholders.contactEmail, type: 'email', icon: <Mail className="w-5 h-5" /> }
                ]
            }
        );

        return baseSteps;
    }, [answers.projectType, language, t]);

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

    const generateSummaryText = () => {
        let text = `*NEW PROJECT REQUEST* 🚀\n\n`;
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
        text += `━━━━━━━━━━━━━━━━━━━━━\n`;
        text += `*CONTACT INFO:*\n`;
        text += `👤 ${answers.contactName}\n`;
        text += `📱 ${answers.contactPhone}\n`;
        if (answers.contactEmail) text += `✉️ ${answers.contactEmail}\n`;
        return text;
    };

    const handleWhatsAppSend = () => {
        window.open(`https://wa.me/237654269488?text=${encodeURIComponent(generateSummaryText())}`, '_blank');
    };

    const handleEmailSend = () => {
        const subject = `New Project: ${answers.projectName}`;
        window.location.href = `mailto:xyberclandev@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(generateSummaryText())}`;
    };

    const bg = isDark ? '#0a0a0a' : '#f5f4f2';
    const textCol = isDark ? '#f0f0f0' : '#111';
    const mutedCol = isDark ? '#666' : '#888';
    const borderCol = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
    const cardBg = isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.9)';

    return (
        <div style={{
            minHeight: '100vh',
            background: bg,
            color: textCol,
            fontFamily: FONT,
            display: 'flex',
            flexDirection: 'column',
            overflowX: 'hidden'
        }}>
            <Meta
                title="Start Your Project | Free Quote"
                description="Ready to build your next big thing? Start your project with XyberClan. Our experts will help you design, develop and secure your digital future."
            />

            {/* Header */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 50,
                padding: '16px 24px',
                borderBottom: `1px solid ${borderCol}`,
                background: isDark ? 'rgba(10,10,10,0.85)' : 'rgba(245,244,242,0.85)',
                backdropFilter: 'blur(20px)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                        <img src={getLogo()} alt="XyberClan" style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'contain' }} />
                        <span style={{ fontSize: '1.1rem', fontWeight: 900, color: textCol, letterSpacing: '-0.02em' }}>
                            Xyber<span style={{ color: '#06b6d4' }}>Clan</span>
                        </span>
                    </Link>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <button onClick={toggleLanguage} style={{
                            background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                            color: '#06b6d4',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: 6,
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            letterSpacing: '0.12em',
                            cursor: 'pointer'
                        }}>
                            {language}
                        </button>
                        <button onClick={toggleTheme} style={{
                            background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                            color: isDark ? '#fbbf24' : '#2563eb',
                            border: 'none',
                            width: 36,
                            height: 36,
                            borderRadius: 8,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                        }}>
                            {isDark ? <Sun size={16} /> : <Moon size={16} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Split Editorial Panel Layout */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                paddingTop: 69,
                minHeight: 'calc(100vh - 69px)'
            }}>
                {/* LEFT PANEL: Step details, progress, narrative */}
                <div 
                    ref={leftPanelRef}
                    style={{
                        width: isMobile ? '100%' : '42%',
                        borderRight: isMobile ? 'none' : `1px solid ${borderCol}`,
                        borderBottom: isMobile ? `1px solid ${borderCol}` : 'none',
                        background: isDark ? '#070707' : '#fafafa',
                        padding: isMobile ? '32px 24px' : '64px 48px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        position: 'relative'
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        {currentStep < steps.length ? (
                            <>
                                <p className="animate-left text-[#06b6d4]" style={{
                                    fontSize: '0.65rem',
                                    fontWeight: 800,
                                    letterSpacing: '0.2em',
                                    textTransform: 'uppercase',
                                    margin: 0
                                }}>
                                    {t.step} {String(currentStep + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}
                                </p>
                                <h1 className="animate-left" style={{
                                    fontWeight: 300,
                                    fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
                                    lineHeight: 1.1,
                                    letterSpacing: '-0.03em',
                                    color: textCol,
                                    margin: 0
                                }}>
                                    {currentQuestion.question}
                                </h1>
                                <p className="animate-left" style={{
                                    fontSize: '0.85rem',
                                    fontWeight: 300,
                                    lineHeight: 1.6,
                                    color: mutedCol,
                                    maxWidth: 320,
                                    margin: 0
                                }}>
                                    {currentQuestion.description}
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="animate-left text-[#06b6d4]" style={{
                                    fontSize: '0.65rem',
                                    fontWeight: 800,
                                    letterSpacing: '0.2em',
                                    textTransform: 'uppercase',
                                    margin: 0
                                }}>
                                    Final Stage
                                </p>
                                <h1 className="animate-left" style={{
                                    fontWeight: 300,
                                    fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
                                    lineHeight: 1.1,
                                    letterSpacing: '-0.03em',
                                    color: textCol,
                                    margin: 0
                                }}>
                                    {t.summaryTitle}
                                </h1>
                                <p className="animate-left" style={{
                                    fontSize: '0.85rem',
                                    fontWeight: 300,
                                    lineHeight: 1.6,
                                    color: mutedCol,
                                    maxWidth: 320,
                                    margin: 0
                                }}>
                                    {t.summaryDesc}
                                </p>
                            </>
                        )}
                    </div>

                    {/* Timeline Tracker */}
                    {!isMobile && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 48, borderTop: `1px solid ${borderCol}`, paddingTop: 28 }}>
                            {steps.map((step, idx) => {
                                const isActive = idx === currentStep;
                                const isPassed = idx < currentStep;
                                return (
                                    <div key={step.id} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 12,
                                        opacity: isActive ? 1 : isPassed ? 0.6 : 0.25,
                                        transition: 'all 0.4s ease'
                                    }}>
                                        <span style={{
                                            fontSize: '0.6rem',
                                            fontWeight: 800,
                                            fontFamily: 'monospace',
                                            color: isActive ? '#06b6d4' : textCol
                                        }}>{String(idx + 1).padStart(2, '0')}</span>
                                        <span style={{
                                            fontSize: '0.65rem',
                                            fontWeight: 700,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.14em',
                                            color: isActive ? '#06b6d4' : textCol
                                        }}>
                                            {step.id === 'projectType' ? t.projectType :
                                             step.id === 'projectName' ? t.projectName :
                                             step.id === 'description' ? t.description :
                                             step.id === 'timeline' ? t.timeline :
                                             step.id === 'budget' ? t.budget :
                                             step.id === 'contact' ? t.contactInfo :
                                             'Details'}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Left Bottom Branding Red Dot */}
                    <div style={{
                        position: 'absolute',
                        bottom: 24,
                        left: 24,
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: '#dc2626',
                        boxShadow: '0 0 8px rgba(220,38,38,0.5)',
                        display: isMobile ? 'none' : 'block'
                    }} />
                </div>

                {/* RIGHT PANEL: Input interaction */}
                <div 
                    style={{
                        flex: 1,
                        background: isDark ? '#0d0d0d' : '#ffffff',
                        padding: isMobile ? '32px 24px 80px 24px' : '64px 48px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        overflowY: 'auto'
                    }}
                >
                    <div ref={rightPanelRef} style={{ width: '100%', maxWidth: 640, margin: '0 auto', flex: 1 }}>
                        {currentStep < steps.length ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                {/* Choice grid */}
                                {currentQuestion.type === 'choice' && (
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                                        gap: 16
                                    }}>
                                        {currentQuestion.options.map((opt) => {
                                            const isSelected = currentQuestion.multi
                                                ? (answers[currentQuestion.id] || []).includes(opt.value)
                                                : answers[currentQuestion.id] === opt.value;

                                            return (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => handleChoice(currentQuestion.id, opt.value, currentQuestion.multi)}
                                                    style={{
                                                        background: isSelected ? (isDark ? 'rgba(6, 182, 212, 0.08)' : 'rgba(6, 182, 212, 0.04)') : 'transparent',
                                                        border: `1px solid ${isSelected ? '#06b6d4' : borderCol}`,
                                                        borderRadius: 8,
                                                        padding: 24,
                                                        textAlign: 'left',
                                                        cursor: 'pointer',
                                                        color: textCol,
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        gap: 16,
                                                        position: 'relative',
                                                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                                                    }}
                                                    onMouseEnter={e => {
                                                        if (!isSelected) e.currentTarget.style.borderColor = '#06b6d4';
                                                    }}
                                                    onMouseLeave={e => {
                                                        if (!isSelected) e.currentTarget.style.borderColor = borderCol;
                                                    }}
                                                >
                                                    {isSelected && (
                                                        <div style={{
                                                            position: 'absolute',
                                                            top: 16,
                                                            right: 16,
                                                            background: '#06b6d4',
                                                            color: '#fff',
                                                            width: 18,
                                                            height: 18,
                                                            borderRadius: '50%',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}>
                                                            <Check size={11} strokeWidth={4} />
                                                        </div>
                                                    )}
                                                    <div style={{
                                                        color: isSelected ? '#06b6d4' : textCol,
                                                        opacity: isSelected ? 1 : 0.6
                                                    }}>
                                                        {opt.icon}
                                                    </div>
                                                    <span style={{ fontSize: '0.9rem', fontWeight: 600, letterSpacing: '-0.01em' }}>
                                                        {opt.label}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Single line text input */}
                                {currentQuestion.type === 'text' && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                        <input
                                            autoFocus
                                            type="text"
                                            value={answers[currentQuestion.id] || ''}
                                            onChange={(e) => handleInputChange(currentQuestion.id, e.target.value)}
                                            placeholder={currentQuestion.placeholder}
                                            style={{
                                                width: '100%',
                                                background: 'none',
                                                border: 'none',
                                                borderBottom: `2px solid ${borderCol}`,
                                                padding: '16px 0',
                                                fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                                                fontWeight: 800,
                                                color: textCol,
                                                outline: 'none',
                                                letterSpacing: '-0.02em',
                                                transition: 'border-color 0.3s'
                                            }}
                                            onFocus={e => e.currentTarget.style.borderColor = '#06b6d4'}
                                            onBlur={e => e.currentTarget.style.borderColor = borderCol}
                                        />
                                    </div>
                                )}

                                {/* Textarea input */}
                                {currentQuestion.type === 'textarea' && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                        <textarea
                                            autoFocus
                                            rows={5}
                                            value={answers[currentQuestion.id] || ''}
                                            onChange={(e) => handleInputChange(currentQuestion.id, e.target.value)}
                                            placeholder={currentQuestion.placeholder}
                                            style={{
                                                width: '100%',
                                                background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
                                                border: `1px solid ${borderCol}`,
                                                borderRadius: 8,
                                                padding: 20,
                                                fontSize: '1rem',
                                                lineHeight: 1.6,
                                                color: textCol,
                                                outline: 'none',
                                                resize: 'none',
                                                transition: 'all 0.3s'
                                            }}
                                            onFocus={e => {
                                                e.currentTarget.style.borderColor = '#06b6d4';
                                                e.currentTarget.style.boxShadow = '0 0 0 1px rgba(6,182,212,0.2)';
                                            }}
                                            onBlur={e => {
                                                e.currentTarget.style.borderColor = borderCol;
                                                e.currentTarget.style.boxShadow = 'none';
                                            }}
                                        />
                                    </div>
                                )}

                                {/* Contact form inputs */}
                                {currentQuestion.type === 'contact' && (
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 24,
                                        border: `1px solid ${borderCol}`,
                                        borderRadius: 12,
                                        padding: isMobile ? 24 : 36,
                                        background: cardBg
                                    }}>
                                        {currentQuestion.fields.map((field) => (
                                            <div key={field.id} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                                <label style={{
                                                    fontSize: '0.65rem',
                                                    fontWeight: 800,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.14em',
                                                    color: mutedCol
                                                }}>{field.label}</label>
                                                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                                    <div style={{
                                                        position: 'absolute',
                                                        left: 14,
                                                        color: mutedCol,
                                                        display: 'flex',
                                                        alignItems: 'center'
                                                    }}>
                                                        {field.icon}
                                                    </div>
                                                    <input
                                                        type={field.type}
                                                        value={answers[field.id] || ''}
                                                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                                                        placeholder={field.placeholder}
                                                        style={{
                                                            width: '100%',
                                                            padding: '12px 16px 12px 42px',
                                                            borderRadius: 8,
                                                            border: `1px solid ${borderCol}`,
                                                            background: isDark ? '#111' : '#fff',
                                                            color: textCol,
                                                            fontSize: '0.9rem',
                                                            outline: 'none',
                                                            transition: 'all 0.3s'
                                                        }}
                                                        onFocus={e => {
                                                            e.currentTarget.style.borderColor = '#06b6d4';
                                                            e.currentTarget.style.boxShadow = '0 0 0 1px rgba(6,182,212,0.2)';
                                                        }}
                                                        onBlur={e => {
                                                            e.currentTarget.style.borderColor = borderCol;
                                                            e.currentTarget.style.boxShadow = 'none';
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Final Summary screen, styled just like the team detail rows! */
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                                <div style={{ borderTop: `1px solid ${borderCol}` }}>
                                    {steps.map((step, i) => {
                                        if (step.id === 'contact') return null;
                                        const label = step.id === 'projectType' ? t.projectType :
                                            step.id === 'projectName' ? t.projectName :
                                            step.id === 'description' ? t.description :
                                            step.id === 'timeline' ? t.timeline :
                                            step.id === 'budget' ? t.budget :
                                            step.question.replace(/^[^\s]+\s/, '');

                                        const val = answers[step.id];
                                        const displayVal = Array.isArray(val) ? val.join(', ') : (val || 'N/A');

                                        return (
                                            <div
                                                key={i}
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'flex-start',
                                                    padding: '16px 0',
                                                    borderBottom: `1px solid ${borderCol}`,
                                                    gap: 16
                                                }}
                                            >
                                                <span style={{
                                                    fontSize: '0.65rem',
                                                    fontWeight: 700,
                                                    letterSpacing: '0.14em',
                                                    textTransform: 'uppercase',
                                                    color: mutedCol,
                                                    paddingTop: 2
                                                }}>{label}</span>
                                                <span style={{
                                                    fontSize: '0.85rem',
                                                    fontWeight: 500,
                                                    color: textCol,
                                                    textAlign: 'right',
                                                    maxWidth: '70%'
                                                }}>{displayVal}</span>
                                            </div>
                                        );
                                    })}
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start',
                                            padding: '16px 0',
                                            borderBottom: `1px solid ${borderCol}`,
                                            gap: 16
                                        }}
                                    >
                                        <span style={{
                                            fontSize: '0.65rem',
                                            fontWeight: 700,
                                            letterSpacing: '0.14em',
                                            textTransform: 'uppercase',
                                            color: mutedCol
                                        }}>{t.contactInfo}</span>
                                        <span style={{
                                            fontSize: '0.85rem',
                                            fontWeight: 500,
                                            color: textCol,
                                            textAlign: 'right'
                                        }}>{answers.contactName} ({answers.contactPhone})</span>
                                    </div>
                                </div>

                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                                    gap: 16
                                }}>
                                    <button
                                        onClick={handleWhatsAppSend}
                                        style={{
                                            background: '#25D366',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: 8,
                                            padding: '16px 24px',
                                            fontSize: '0.9rem',
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 8,
                                            transition: 'transform 0.2s'
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                    >
                                        <MessageCircle size={18} /> {t.sendWhatsApp}
                                    </button>
                                    <button
                                        onClick={handleEmailSend}
                                        style={{
                                            background: textCol,
                                            color: bg,
                                            border: 'none',
                                            borderRadius: 8,
                                            padding: '16px 24px',
                                            fontSize: '0.9rem',
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 8,
                                            transition: 'transform 0.2s'
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                    >
                                        <Mail size={18} /> {t.sendEmail}
                                    </button>
                                </div>

                                <button
                                    onClick={() => setCurrentStep(0)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 6,
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.12em',
                                        color: mutedCol,
                                        alignSelf: 'center'
                                    }}
                                >
                                    <ChevronLeft size={14} /> {t.backToEdit}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Navigation Buttons footer */}
                    {currentStep < steps.length && (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%',
                            maxWidth: 640,
                            margin: '40px auto 0 auto',
                            borderTop: `1px solid ${borderCol}`,
                            paddingTop: 24
                        }}>
                            <button
                                onClick={handlePrevious}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: textCol,
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.12em',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    opacity: currentStep === 0 ? 0 : 0.6,
                                    pointerEvents: currentStep === 0 ? 'none' : 'auto',
                                    transition: 'opacity 0.2s'
                                }}
                                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                                onMouseLeave={e => e.currentTarget.style.opacity = currentStep === 0 ? '0' : '0.6'}
                            >
                                <ChevronLeft size={14} /> {t.previous}
                            </button>

                            {(currentQuestion.type !== 'choice' || currentQuestion.multi) && (
                                <button
                                    onClick={handleNext}
                                    disabled={!isStepValid()}
                                    style={{
                                        background: isStepValid() ? '#06b6d4' : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                                        color: isStepValid() ? '#fff' : (isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.3)'),
                                        border: 'none',
                                        borderRadius: 6,
                                        padding: '12px 24px',
                                        fontSize: '0.7rem',
                                        fontWeight: 800,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.14em',
                                        cursor: isStepValid() ? 'pointer' : 'not-allowed',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    {t.next}
                                    <ArrowRight size={12} />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectForm;
