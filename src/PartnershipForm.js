import React, { useState, useEffect } from 'react';
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
    Hash, MessageCircle, Info
} from 'lucide-react';

const PartnershipForm = ({ isOpen, onClose, type, lang, t, onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [mounted, setMounted] = useState(false);
    const [direction, setDirection] = useState('forward');
    const [isCompleted, setIsCompleted] = useState(false);

    const formConfig = type === 'partner' ? t.partnersPage.partnerForm : t.partnersPage.sponsorForm;
    const steps = formConfig.steps;
    const currentQuestion = steps[currentStep];

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

    const colors = ['cyan', 'purple', 'pink', 'blue', 'orange', 'green', 'indigo', 'rose', 'amber'];

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
        window.open(`https://wa.me/237672446810?text=${encodeURIComponent(generateSummaryText())}`, '_blank');
        onComplete(generateSummaryText());
    };

    const handleEmailSend = () => {
        const subject = `[${type.toUpperCase()}] Request: ${answers[steps[1].id] || 'New Application'}`;
        const body = generateSummaryText();
        window.location.href = `mailto:xyberclandev@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        onComplete(generateSummaryText());
    };

    const progress = isCompleted ? 100 : ((currentStep + 1) / steps.length) * 100;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden">
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/95 backdrop-blur-3xl transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className={`relative w-full h-full flex flex-col transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-40 scale-95'}`}>

                {/* Nav Header */}
                <div className="px-6 py-6 flex justify-between items-center max-w-5xl mx-auto w-full">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
                            {type === 'partner' ? <Handshake size={24} /> : <Trophy size={24} />}
                        </div>
                        <div>
                            <h3 className="text-white font-black text-xl tracking-tight leading-none mb-1">{formConfig.title}</h3>
                            <p className="text-cyan-500/60 text-[10px] font-black uppercase tracking-[0.2em]">{type} program</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all active:scale-90 border border-white/5 hover:border-white/10"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Progress Bar Container */}
                <div className="px-6 max-w-4xl mx-auto w-full mb-12">
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 rounded-full transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto px-6 pb-24">
                    <div className="max-w-2xl mx-auto">
                        {!isCompleted ? (
                            <div key={currentStep} className={`${direction === 'forward' ? 'animate-slide-up' : 'animate-slide-down'}`}>

                                <p className="text-center text-[11px] font-black uppercase tracking-[0.3em] text-cyan-500 mb-8">
                                    {t.form.step} {currentStep + 1} {t.form.of} {steps.length}
                                </p>

                                <div className="text-center mb-16">
                                    <h2 className="text-4xl md:text-6xl text-white font-black tracking-tighter leading-[1.1] mb-6">
                                        {currentQuestion.question}
                                    </h2>
                                </div>

                                {/* Choice Options */}
                                {currentQuestion.options && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {currentQuestion.options.map((opt, i) => {
                                            const isSelected = answers[currentQuestion.id] === opt;
                                            const color = colors[i % colors.length];

                                            return (
                                                <button
                                                    key={i}
                                                    onClick={() => handleChoice(currentQuestion.id, opt)}
                                                    className={`group relative p-8 rounded-[2.5rem] border-[2.5px] transition-all duration-500 text-left hover:scale-[1.02] active:scale-[0.98] overflow-hidden ${isSelected
                                                        ? 'border-cyan-500 bg-cyan-500/10 shadow-2xl shadow-cyan-500/10'
                                                        : 'border-white/5 bg-white/[0.03] hover:border-white/20'}`}
                                                >
                                                    {isSelected && (
                                                        <div className="absolute top-6 right-6 animate-scale-in">
                                                            <div className="bg-cyan-500 text-white p-1 rounded-full">
                                                                <Check size={14} strokeWidth={4} />
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className={`mb-8 p-5 rounded-2xl inline-block transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 ${color === 'cyan' ? 'bg-cyan-500/10 text-cyan-500' :
                                                        color === 'purple' ? 'bg-purple-500/10 text-purple-500' :
                                                            color === 'pink' ? 'bg-pink-500/10 text-pink-500' :
                                                                color === 'blue' ? 'bg-blue-500/10 text-blue-500' :
                                                                    color === 'orange' ? 'bg-orange-500/10 text-orange-500' :
                                                                        color === 'green' ? 'bg-green-500/10 text-green-500' :
                                                                            color === 'indigo' ? 'bg-indigo-500/10 text-indigo-500' :
                                                                                color === 'rose' ? 'bg-rose-500/10 text-rose-500' :
                                                                                    'bg-amber-500/10 text-amber-500'
                                                        }`}>
                                                        {React.cloneElement(getIcon(currentQuestion.id, opt), { size: 32 })}
                                                    </div>
                                                    <h3 className="text-xl font-black text-white tracking-tight leading-tight">{opt}</h3>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Text / Input Placeholder */}
                                {currentQuestion.placeholder && !currentQuestion.fields && (
                                    <div className="relative group max-w-xl mx-auto">
                                        {currentQuestion.id.toLowerCase().includes('name') ? (
                                            <div className="relative">
                                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-cyan-500">
                                                    <Hash size={28} />
                                                </div>
                                                <input
                                                    autoFocus
                                                    type="text"
                                                    value={answers[currentQuestion.id] || ''}
                                                    onChange={(e) => handleInputChange(currentQuestion.id, e.target.value)}
                                                    placeholder={currentQuestion.placeholder}
                                                    className="w-full bg-white/[0.03] border-[2.5px] border-white/5 focus:border-cyan-500 focus:bg-white/[0.06] rounded-3xl py-8 pl-20 pr-8 text-2xl font-bold text-white outline-none transition-all placeholder:text-white/10 shadow-2xl"
                                                />
                                            </div>
                                        ) : (
                                            <div className="relative">
                                                <textarea
                                                    autoFocus
                                                    rows={5}
                                                    value={answers[currentQuestion.id] || ''}
                                                    onChange={(e) => handleInputChange(currentQuestion.id, e.target.value)}
                                                    placeholder={currentQuestion.placeholder}
                                                    className="w-full bg-white/[0.03] border-[2.5px] border-white/5 focus:border-cyan-500 focus:bg-white/[0.06] rounded-[2.5rem] p-8 text-xl font-medium text-white outline-none transition-all placeholder:text-white/10 resize-none shadow-2xl"
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Multi-field Contact */}
                                {currentQuestion.fields && (
                                    <div className="max-w-xl mx-auto bg-white/[0.02] border border-white/5 rounded-[3rem] p-10 space-y-10 shadow-2xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl rounded-full" />
                                        {currentQuestion.fields.map((field, i) => (
                                            <div key={i} className="relative group">
                                                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-4 ml-1 italic">{field}</label>
                                                <div className="relative">
                                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-cyan-500 transition-all duration-500">
                                                        {i === 0 ? <User size={20} /> : i === 1 ? <Phone size={20} /> : <Mail size={20} />}
                                                    </div>
                                                    <input
                                                        type={i === 2 ? 'email' : i === 1 ? 'tel' : 'text'}
                                                        value={answers[`${currentQuestion.id}_field_${i}`] || ''}
                                                        onChange={(e) => handleInputChange(`${currentQuestion.id}_field_${i}`, e.target.value)}
                                                        placeholder={field}
                                                        className="w-full bg-black/20 border-2 border-white/5 focus:border-cyan-500/50 rounded-2xl py-5 pl-14 pr-6 text-white outline-none transition-all focus:ring-4 focus:ring-cyan-500/5"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Nav Buttons */}
                                <div className="mt-16 flex items-center justify-between max-w-2xl mx-auto">
                                    <button
                                        onClick={handlePrev}
                                        className={`group flex items-center gap-2 px-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/5 transition-all ${currentStep === 0 ? 'opacity-0 pointer-events-none' : ''}`}
                                    >
                                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> {t.form.previous}
                                    </button>

                                    {(currentQuestion.placeholder || currentQuestion.fields) && (
                                        <button
                                            onClick={handleNext}
                                            disabled={!isStepValid()}
                                            className={`group flex items-center gap-4 px-12 py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all duration-500 ${isStepValid()
                                                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-2xl shadow-cyan-500/30 hover:scale-[1.05] hover:shadow-cyan-500/50 active:scale-95'
                                                : 'bg-white/5 text-white/20 cursor-not-allowed'}`}
                                        >
                                            {currentStep === steps.length - 1 ? t.form.submit : t.form.next}
                                            {currentStep === steps.length - 1 ? <Rocket size={20} /> : <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="animate-scale-in flex flex-col items-center max-w-2xl mx-auto">
                                <div className="relative mb-8">
                                    <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full animate-pulse" />
                                    <div className="relative w-20 h-20 rounded-[2rem] bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-2xl shadow-green-500/30">
                                        <Check className="w-10 h-10 text-white stroke-[4px]" />
                                    </div>
                                </div>

                                <h2 className="text-3xl md:text-5xl text-white font-black tracking-tighter text-center mb-3 leading-none">
                                    {t.form.summaryTitle}
                                </h2>
                                <p className="text-white/40 text-lg font-medium text-center mb-10 max-w-md mx-auto">
                                    {t.form.summaryDesc}
                                </p>

                                {/* Structured Summary List */}
                                <div className="w-full space-y-4 mb-10">
                                    {steps.map((step, idx) => {
                                        if (step.fields) return null;
                                        return (
                                            <div key={idx} className="group relative bg-white/[0.03] border border-white/5 rounded-3xl p-6 transition-all hover:bg-white/[0.05] hover:border-cyan-500/30">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 shrink-0">
                                                        {idx === 0 ? <Briefcase size={20} /> : <Info size={20} />}
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-500/60 mb-1">{step.question}</p>
                                                        <p className="text-lg font-bold text-white">{answers[step.id] || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {/* Contact Representative Card */}
                                    <div className="bg-gradient-to-br from-indigo-600/20 via-blue-600/10 to-transparent border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-10">
                                            <User size={80} />
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-6">Contact Representative</p>
                                        <div className="space-y-4">
                                            {[
                                                { icon: <User size={18} />, label: 'Name', value: answers[steps.find(s => s.fields)?.id + '_field_0'] },
                                                { icon: <Phone size={18} />, label: 'Phone', value: answers[steps.find(s => s.fields)?.id + '_field_1'] },
                                                { icon: <Mail size={18} />, label: 'Email', value: answers[steps.find(s => s.fields)?.id + '_field_2'] }
                                            ].map((contact, i) => (
                                                <div key={i} className="flex items-center gap-4 text-white/80">
                                                    <div className="text-indigo-400">{contact.icon}</div>
                                                    <span className="font-bold">{contact.value || 'N/A'}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <button onClick={handleWhatsAppSend} className="group flex items-center justify-center gap-3 bg-[#25D366] text-white px-8 py-6 rounded-3xl font-black text-lg transition-all hover:scale-[1.03] hover:shadow-2xl hover:shadow-[#25D366]/30 active:scale-95 shadow-xl shadow-[#25D366]/10">
                                        <MessageCircle className="w-6 h-6" /> {t.form.sendWhatsApp}
                                    </button>
                                    <button onClick={handleEmailSend} className="group flex items-center justify-center gap-3 bg-white text-black px-8 py-6 rounded-3xl font-black text-lg transition-all hover:scale-[1.03] hover:shadow-2xl hover:shadow-white/20 active:scale-95 shadow-xl">
                                        <Mail className="w-6 h-6" /> {t.form.sendEmail}
                                    </button>
                                </div>

                                <button onClick={() => setIsCompleted(false)} className="mt-12 flex items-center gap-2 text-white/40 hover:text-white transition-colors font-black text-[10px] uppercase tracking-widest">
                                    <ChevronLeft size={16} /> {t.form.backToEdit}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Background Decor */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-1/4 -right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] animate-pulse delay-1000" />
                </div>
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
                .animate-slide-up { animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
                .animate-slide-down { animation: slide-down 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
                .animate-scale-in { animation: scale-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
            `}</style>
        </div>
    );
};

export default PartnershipForm;
