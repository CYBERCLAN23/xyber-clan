import React, { useState, useEffect, useRef } from 'react';
import {
    X, ChevronLeft,
    Handshake, Trophy,
    Mail, Phone,
    User,
    Check, Rocket, ArrowRight,
    Search, Briefcase, GraduationCap,
    Cpu, Sparkles, Building2, Users,
    Landmark, Heart, Coins, Wrench,
    UserCircle, MapPin, Radio, Layout,

} from 'lucide-react';
import { useTheme } from './context/ThemeContext';
import { useLanguage } from './context/LanguageContext';
import gsap from 'gsap';

const FONT = "'Inter', 'Helvetica Neue', sans-serif";

const PartnershipForm = ({ isOpen, onClose, type, lang, t, onComplete }) => {
    const { isDark } = useTheme();
    
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [, setDirection] = useState('forward');
    const [isCompleted, setIsCompleted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const leftPanelRef = useRef(null);
    const rightPanelRef = useRef(null);

    const formConfig = type === 'partner' ? t.partnersPage.partnerForm : t.partnersPage.sponsorForm;
    const steps = formConfig.steps;
    const currentQuestion = steps[currentStep];

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 960);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (isOpen) {
            setMounted(true);
            document.body.style.overflow = 'hidden';
            setCurrentStep(0);
            setAnswers({});
            setDirection('forward');
            setIsCompleted(false);
        } else {
            setMounted(false);
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    // ─── Step Transition GSAP Animation ─────────────────────────────────────
    useEffect(() => {
        if (!isOpen) return;
        const ctx = gsap.context(() => {
            // Animate left side
            if (leftPanelRef.current) {
                const elements = leftPanelRef.current.querySelectorAll('.animate-left');
                gsap.fromTo(elements,
                    { opacity: 0, y: 15, filter: 'blur(3px)' },
                    { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5, stagger: 0.08, ease: 'power2.out' }
                );
            }
            // Animate right side
            if (rightPanelRef.current) {
                const elements = rightPanelRef.current.children;
                gsap.fromTo(elements,
                    { opacity: 0, y: 25, filter: 'blur(5px)' },
                    { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, stagger: 0.06, ease: 'power3.out' }
                );
            }
        });
        return () => ctx.revert();
    }, [currentStep, isOpen, isCompleted]);

    const getIcon = (id, option) => {
        const iconMap = {
            // Partner types
            'Technology Partner': <Cpu />,
            'Educational/University': <GraduationCap />,
            'Business Growth': <Briefcase />,
            'Creative Collaboration': <Sparkles />,

            // Sponsor types
            'Individual': <UserCircle />,
            'Company/Enterprise': <Building2 />,
            'NGO/Organization': <Heart />,
            'Public Institution': <Landmark />,

            // Contributions
            'Financial Support': <Coins />,
            'Hardware/Equipment': <Wrench />,
            'Mentorship & Coaching': <Users />,
            'Venue/Space Hosting': <MapPin />,
            'Visibility & Media': <Radio />,

            // Partner timelines
            'Immediate': <Rocket />,
            'Next Month': <ArrowRight />,
            'Within 3 Months': <Search />,
            'Flexible': <Layout />,

            // French versions
            'Partenaire Technologique': <Cpu />,
            'Éducatif / Université': <GraduationCap />,
            'Croissance d\'Affaires': <Briefcase />,
            'Collaboration Créative': <Sparkles />,
            'Individu': <UserCircle />,
            'Compagnie/Entreprise': <Building2 />,
            'ONG/Organisation': <Heart />,
            'Institution Publique': <Landmark />,
            'Soutien Financier': <Coins />,
            'Matériel/Équipement': <Wrench />,
            'Mentorat & Coaching': <Users />,
            'Hébergement / Espace': <MapPin />,
            'Visibilité & Médias': <Radio />,
            'Immédiat': <Rocket />,
            'Mois Prochain': <ArrowRight />,
            'Sous 3 Mois': <Search />
        };

        return iconMap[option] || <Sparkles />;
    };



    if (!isOpen) return null;

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

    const isStepValid = () => {
        if (!currentQuestion) return true;
        const id = currentQuestion.id;
        if (currentQuestion.fields) {
            return currentQuestion.fields.every((_, i) => !!answers[`${id}_field_${i}`]);
        }
        return !!answers[id];
    };

    const generateSummaryText = () => {
        let text = `===========================================\n`;
        text += `NEW ${type.toUpperCase()} INQUIRY - XYBERCLAN\n`;
        text += `===========================================\n\n`;

        steps.forEach(step => {
            if (!step.fields) {
                const label = step.question.replace(/\?$/, '').trim().toUpperCase();
                text += `${label}:\n> ${answers[step.id] || 'N/A'}\n\n`;
            }
        });

        text += `-------------------------------------------\n`;
        text += `CONTACT REPRESENTATIVE\n`;
        text += `-------------------------------------------\n`;
        const contactStep = steps.find(s => s.fields);
        if (contactStep) {
            text += `NAME: ${answers[contactStep.id + '_field_0'] || 'N/A'}\n`;
            text += `PHONE: ${answers[contactStep.id + '_field_1'] || 'N/A'}\n`;
            text += `EMAIL: ${answers[contactStep.id + '_field_2'] || 'N/A'}\n`;
        }
        text += `-------------------------------------------\n`;
        text += `Generated via XyberClan Network Interface\n`;
        text += `===========================================`;

        return text;
    };

    const handleWhatsAppSend = () => {
        window.open(`https://wa.me/237696814391?text=${encodeURIComponent(generateSummaryText())}`, '_blank');
        onComplete(generateSummaryText());
    };

    const handleEmailSend = () => {
        const subject = `[${type.toUpperCase()}] Request: ${answers[steps[1].id] || 'New Application'}`;
        const body = generateSummaryText();
        window.location.href = `mailto:xyberclandev@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        onComplete(generateSummaryText());
    };

    const bg = isDark ? '#0a0a0a' : '#f5f4f2';
    const textCol = isDark ? '#f0f0f0' : '#111';
    const mutedCol = isDark ? '#666' : '#888';
    const borderCol = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
    const cardBg = isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.9)';

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: bg,
            color: textCol,
            fontFamily: FONT,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        }}>
            {/* Header */}
            <div style={{
                padding: '16px 24px',
                borderBottom: `1px solid ${borderCol}`,
                background: isDark ? 'rgba(10,10,10,0.85)' : 'rgba(245,244,242,0.85)',
                backdropFilter: 'blur(20px)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 50
            }}>
                <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                            width: 36,
                            height: 36,
                            borderRadius: 8,
                            backgroundColor: isDark ? 'rgba(6,182,212,0.15)' : 'rgba(6,182,212,0.08)',
                            color: '#06b6d4',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: `1px solid ${borderCol}`
                        }}>
                            {type === 'partner' ? <Handshake size={18} /> : <Trophy size={18} />}
                        </div>
                        <div>
                            <span style={{ fontSize: '1.05rem', fontWeight: 900, color: textCol, tracking: '-0.02em', display: 'block', lineHeight: 1.1 }}>
                                {formConfig.title}
                            </span>
                            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#06b6d4', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
                                {type} program
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 8,
                            background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                            color: textCol,
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'transform 0.2s'
                        }}
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>

            {/* Split Editorial Panel Layout */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                minHeight: 'calc(100vh - 69px)',
                overflow: 'hidden'
            }}>
                {/* LEFT PANEL: Progress & Info */}
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
                        {!isCompleted ? (
                            <>
                                <p className="animate-left text-[#06b6d4]" style={{
                                    fontSize: '0.65rem',
                                    fontWeight: 800,
                                    letterSpacing: '0.2em',
                                    textTransform: 'uppercase',
                                    margin: 0
                                }}>
                                    {t.form.step} {currentStep + 1} {t.form.of} {steps.length}
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
                                    {type === 'partner' 
                                        ? 'Help us understand how we can collaborate to build meaningful ecosystems in technology and training.'
                                        : 'Sponsor our events and community initiatives to maximize brand awareness and reach local builders.'}
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
                                    Review Stage
                                </p>
                                <h1 className="animate-left" style={{
                                    fontWeight: 300,
                                    fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
                                    lineHeight: 1.1,
                                    letterSpacing: '-0.03em',
                                    color: textCol,
                                    margin: 0
                                }}>
                                    {t.form.summaryTitle}
                                </h1>
                                <p className="animate-left" style={{
                                    fontSize: '0.85rem',
                                    fontWeight: 300,
                                    lineHeight: 1.6,
                                    color: mutedCol,
                                    maxWidth: 320,
                                    margin: 0
                                }}>
                                    {t.form.summaryDesc}
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
                                            {step.id.includes('type') ? 'Classification' :
                                             step.id.includes('contri') ? 'Contribution' :
                                             step.id.includes('name') ? 'Identity' :
                                             step.id.includes('time') ? 'Timeline' :
                                             step.id.includes('contact') ? 'Contact' : 'Details'}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Branding Dot */}
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
                        {!isCompleted ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                {/* Choice grid */}
                                {currentQuestion.options && (
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                                        gap: 16
                                    }}>
                                        {currentQuestion.options.map((opt, i) => {
                                            const isSelected = answers[currentQuestion.id] === opt;

                                            return (
                                                <button
                                                    key={i}
                                                    onClick={() => handleChoice(currentQuestion.id, opt)}
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
                                                        {getIcon(currentQuestion.id, opt)}
                                                    </div>
                                                    <span style={{ fontSize: '0.9rem', fontWeight: 600, letterSpacing: '-0.01em' }}>
                                                        {opt}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Single line text input */}
                                {currentQuestion.placeholder && !currentQuestion.fields && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                        {currentQuestion.id.toLowerCase().includes('name') ? (
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
                                        ) : (
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
                                        )}
                                    </div>
                                )}

                                {/* Multi-field Contact */}
                                {currentQuestion.fields && (
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 24,
                                        border: `1px solid ${borderCol}`,
                                        borderRadius: 12,
                                        padding: isMobile ? 24 : 36,
                                        background: cardBg
                                    }}>
                                        {currentQuestion.fields.map((field, i) => (
                                            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                                <label style={{
                                                    fontSize: '0.65rem',
                                                    fontWeight: 800,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.14em',
                                                    color: mutedCol
                                                }}>{field}</label>
                                                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                                    <div style={{
                                                        position: 'absolute',
                                                        left: 14,
                                                        color: mutedCol,
                                                        display: 'flex',
                                                        alignItems: 'center'
                                                    }}>
                                                        {i === 0 ? <User size={18} /> : i === 1 ? <Phone size={18} /> : <Mail size={18} />}
                                                    </div>
                                                    <input
                                                        type={i === 2 ? 'email' : i === 1 ? 'tel' : 'text'}
                                                        value={answers[`${currentQuestion.id}_field_${i}`] || ''}
                                                        onChange={(e) => handleInputChange(`${currentQuestion.id}_field_${i}`, e.target.value)}
                                                        placeholder={field}
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
                            /* Summary review screen */
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                                <div style={{ borderTop: `1px solid ${borderCol}` }}>
                                    {steps.map((step, idx) => {
                                        if (step.fields) return null;
                                        const val = answers[step.id];
                                        return (
                                            <div
                                                key={idx}
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
                                                }}>{step.question.replace(/\?$/, '')}</span>
                                                <span style={{
                                                    fontSize: '0.85rem',
                                                    fontWeight: 500,
                                                    color: textCol,
                                                    textAlign: 'right',
                                                    maxWidth: '70%'
                                                }}>{val || 'N/A'}</span>
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
                                        }}>Representative</span>
                                        <span style={{
                                            fontSize: '0.85rem',
                                            fontWeight: 500,
                                            color: textCol,
                                            textAlign: 'right'
                                        }}>
                                            {answers[steps.find(s => s.fields)?.id + '_field_0']} ({answers[steps.find(s => s.fields)?.id + '_field_1']})
                                        </span>
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
                                        <MessageCircle size={18} /> {t.form.sendWhatsApp}
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
                                        <Mail size={18} /> {t.form.sendEmail}
                                    </button>
                                </div>

                                <button
                                    onClick={() => setIsCompleted(false)}
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
                                    <ChevronLeft size={14} /> {t.form.backToEdit}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Navigation Buttons footer */}
                    {!isCompleted && (
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
                                onClick={handlePrev}
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
                                <ChevronLeft size={14} /> {t.form.previous}
                            </button>

                            {(currentQuestion.placeholder || currentQuestion.fields) && (
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
                                    {currentStep === steps.length - 1 ? t.form.submit : t.form.next}
                                    {currentStep === steps.length - 1 ? <Rocket size={12} /> : <ArrowRight size={12} />}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PartnershipForm;
