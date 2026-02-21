import React, { useState, useEffect } from 'react';
import { useTheme } from './context/ThemeContext';
import { translations } from './translations';
import { ArrowRight, Users, Trophy, Handshake, Globe, Zap, Mail, Briefcase } from 'lucide-react';
import Footer from './components/Footer';
import SharedNavbar from './components/SharedNavbar';
import PageHero from './components/PageHero';

const PartnersPage = () => {
    const { isDark } = useTheme();
    const [lang] = useState('en');
    const [mounted, setMounted] = useState(false);

    // Form State
    const [focusedField, setFocusedField] = useState(null);
    const [formData, setFormData] = useState({ name: '', contact: '', email: '', type: '', message: '' });

    const t = translations[lang];
    const p = t.partnersPage;

    useEffect(() => {
        window.scrollTo(0, 0);
        setMounted(true);
    }, []);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        alert('Thank you for your partnership request! XyberClan will contact you shortly.');
        setFormData({ name: '', contact: '', email: '', type: '', message: '' });
    };

    return (
        <div className={`min-h-screen transition-colors duration-500 overflow-x-hidden ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>

            {/* ─── SHARED NAVIGATION ─── */}
            <SharedNavbar transparentHero={true} />

            {/* ─── HERO SECTION ─── */}
            {/* Using the PageHero component but passing in a stunning collaborative tech image */}
            <PageHero
                lang={lang}
                badgeText={t.nav.partners}
                title={p.title}
                subtitle={`"${p.subtitle}"`}
                imageSrc="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop" // People collaborating image
                stats={[
                    { value: 'Global', label: 'Reach' },
                    { value: '100%', label: 'Commitment' }
                ]}
                trustBadges={[
                    { icon: <Handshake size={14} />, label: 'Strategic Alliance' },
                    { icon: <Globe size={14} />, label: 'Worldwide Network' }
                ]}
            />

            {/* ─── PARTNERSHIP: HULT PRIZE SECTION (Ultra Premium Redesign) ─── */}
            <section className="py-24 px-6 relative mt-12">
                {/* Background Decor */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-[600px] pointer-events-none">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-pink-500/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                        {/* ─── VISUAL SIDE (Image Beside Text) ─── */}
                        <div className={`relative group transition-all duration-1000 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
                            {/* Animated Gradients behind image */}
                            <div className="absolute -inset-4 bg-gradient-to-tr from-cyan-500/30 via-purple-500/30 to-pink-500/30 rounded-[3rem] blur-2xl opacity-60 group-hover:opacity-100 transition-all duration-700 animate-pulse" />

                            <div className={`relative aspect-[4/5] sm:aspect-square rounded-[2.5rem] overflow-hidden border ${isDark ? 'border-white/10' : 'border-gray-200'} shadow-2xl`}>
                                {/* Stunning Abstract Tech Image */}
                                <img
                                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop"
                                    alt="Abstract Technology Collaboration"
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                {/* Glassmorphism Overlays */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                {/* Floating Badge on Image */}
                                <div className="absolute bottom-8 left-8 right-8 p-6 rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg text-white">
                                            <Trophy size={24} />
                                        </div>
                                        <div>
                                            <p className="text-white font-black text-xl tracking-tight">Hult Prize Collaboration</p>
                                            <p className="text-white/70 font-medium text-sm">Empowering Social Innovation</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ─── CONTENT SIDE ─── */}
                        <div className={`space-y-8 transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>

                            {/* Small Badge */}
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-pink-500/30 bg-pink-500/10 text-pink-500 text-xs font-black uppercase tracking-[0.2em]">
                                <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                                Strategic Partnership
                            </span>

                            <div className="space-y-4">
                                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[1.1]" style={{ fontFamily: "'Inter', sans-serif" }}>
                                    {p.hultStory.title}
                                </h2>
                                <div className="w-24 h-1.5 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500" />
                            </div>

                            <div className="space-y-6 text-lg leading-relaxed font-light">
                                {p.hultStory.narrative.map((paragraph, idx) => (
                                    <p key={idx} className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                                        {paragraph}
                                    </p>
                                ))}
                            </div>

                            {/* Stat Cards - Interactive */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                                {p.hultStory.stats.map((stat, idx) => (
                                    <div
                                        key={idx}
                                        className={`group p-6 rounded-3xl border transition-all duration-500 hover:-translate-y-2 ${isDark ? 'border-white/10 bg-white/5 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]' : 'border-gray-200 bg-white shadow-lg hover:shadow-xl hover:border-cyan-500/30'}`}
                                    >
                                        <div className="w-10 h-10 mb-4 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-cyan-500 group-hover:scale-110 transition-transform">
                                            {idx === 0 ? <Zap size={20} /> : idx === 1 ? <Users size={20} /> : <Globe size={20} />}
                                        </div>
                                        <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-blue-600 mb-1">{stat.value}</div>
                                        <div className={`text-[11px] font-bold uppercase tracking-[0.2em] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ─── BECOME A PARTNER FORM SECTION ─── */}
            <section className={`py-32 px-6 relative overflow-hidden ${isDark ? 'bg-white/[0.02]' : 'bg-gray-100/50'}`}>
                {/* Decorative background for form */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-b from-cyan-500/5 to-transparent rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2" />

                <div className={`max-w-4xl mx-auto relative z-10 transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>

                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tighter" style={{ fontFamily: "'Inter', sans-serif" }}>
                            {p.form.title}
                        </h2>
                        <p className={`text-xl font-light ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {p.form.subtitle}
                        </p>
                    </div>

                    {/* Glassmorphic Form Container */}
                    <div className={`backdrop-blur-2xl rounded-[3rem] p-8 md:p-14 border relative overflow-hidden shadow-2xl ${isDark ? 'bg-black/40 border-white/10 shadow-black/50' : 'bg-white/70 border-white shadow-gray-200/50'}`}>
                        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-[80px] pointer-events-none" />

                        <form onSubmit={handleFormSubmit} className="relative z-10 space-y-8">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Company Name */}
                                <div className="space-y-2">
                                    <label className={`text-[11px] font-black tracking-[0.2em] uppercase ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {p.form.name}
                                    </label>
                                    <div className={`relative flex items-center rounded-2xl border transition-all duration-300 ${focusedField === 'name' ? 'border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.2)]' : (isDark ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white')}`}>
                                        <Briefcase size={18} className={`absolute left-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            onFocus={() => setFocusedField('name')}
                                            onBlur={() => setFocusedField(null)}
                                            className="w-full bg-transparent py-4 pl-12 pr-4 text-sm font-medium focus:outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Contact Person */}
                                <div className="space-y-2">
                                    <label className={`text-[11px] font-black tracking-[0.2em] uppercase ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {p.form.contact}
                                    </label>
                                    <div className={`relative flex items-center rounded-2xl border transition-all duration-300 ${focusedField === 'contact' ? 'border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.2)]' : (isDark ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white')}`}>
                                        <Users size={18} className={`absolute left-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                                        <input
                                            type="text"
                                            required
                                            value={formData.contact}
                                            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                            onFocus={() => setFocusedField('contact')}
                                            onBlur={() => setFocusedField(null)}
                                            className="w-full bg-transparent py-4 pl-12 pr-4 text-sm font-medium focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Email */}
                                <div className="space-y-2">
                                    <label className={`text-[11px] font-black tracking-[0.2em] uppercase ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {p.form.email}
                                    </label>
                                    <div className={`relative flex items-center rounded-2xl border transition-all duration-300 ${focusedField === 'email' ? 'border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.2)]' : (isDark ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white')}`}>
                                        <Mail size={18} className={`absolute left-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            onFocus={() => setFocusedField('email')}
                                            onBlur={() => setFocusedField(null)}
                                            className="w-full bg-transparent py-4 pl-12 pr-4 text-sm font-medium focus:outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Partnership Type Select */}
                                <div className="space-y-2">
                                    <label className={`text-[11px] font-black tracking-[0.2em] uppercase ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {p.form.typeLabel}
                                    </label>
                                    <div className={`relative flex items-center rounded-2xl border transition-all duration-300 ${focusedField === 'type' ? 'border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.2)]' : (isDark ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white')}`}>
                                        <Handshake size={18} className={`absolute left-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                                        <select
                                            required
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            onFocus={() => setFocusedField('type')}
                                            onBlur={() => setFocusedField(null)}
                                            className={`w-full bg-transparent py-4 pl-12 pr-10 text-sm font-medium focus:outline-none appearance-none cursor-pointer ${formData.type === '' && isDark ? 'text-gray-500' : ''}`}
                                        >
                                            <option value="" disabled className={isDark ? "bg-gray-900" : ""}>{p.form.typeOptions[0]}</option>
                                            <option value="technology" className={isDark ? "bg-gray-900" : ""}>{p.form.typeOptions[1]}</option>
                                            <option value="education" className={isDark ? "bg-gray-900" : ""}>{p.form.typeOptions[2]}</option>
                                            <option value="growth" className={isDark ? "bg-gray-900" : ""}>{p.form.typeOptions[3]}</option>
                                            <option value="other" className={isDark ? "bg-gray-900" : ""}>{p.form.typeOptions[4]}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Message Textarea */}
                            <div className="space-y-2">
                                <label className={`text-[11px] font-black tracking-[0.2em] uppercase ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {p.form.message}
                                </label>
                                <div className={`relative rounded-2xl border transition-all duration-300 ${focusedField === 'message' ? 'border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.2)]' : (isDark ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white')}`}>
                                    <textarea
                                        required
                                        rows="4"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        onFocus={() => setFocusedField('message')}
                                        onBlur={() => setFocusedField(null)}
                                        className="w-full bg-transparent py-4 px-6 text-sm font-medium focus:outline-none resize-none"
                                        placeholder="..."
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full group relative flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-5 rounded-2xl font-black text-lg transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                <span className="relative z-10">{p.form.submit}</span>
                                <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            <Footer translations={t} />

        </div>
    );
};

export default PartnersPage;
