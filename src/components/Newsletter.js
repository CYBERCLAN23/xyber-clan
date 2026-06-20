import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '../context/ThemeContext';
import EditableText from './cms/EditableText';

gsap.registerPlugin(ScrollTrigger);

const FONT = "'Inter', 'Helvetica Neue', sans-serif";

const Newsletter = () => {
    const { isDark } = useTheme();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success
    const sectionRef = useRef(null);
    const labelRef = useRef(null);
    const headRef = useRef(null);
    const subRef = useRef(null);
    const formRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email) return;
        setStatus('loading');
        setTimeout(() => {
            setStatus('success');
            setEmail('');
            setTimeout(() => setStatus('idle'), 4000);
        }, 1500);
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(labelRef.current,
                { opacity: 0, y: 14 },
                { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
                  scrollTrigger: { trigger: labelRef.current, start: 'top 88%', toggleActions: 'play reverse play reverse' } }
            );
            gsap.fromTo(headRef.current,
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 1, ease: 'power3.out',
                  scrollTrigger: { trigger: headRef.current, start: 'top 85%', toggleActions: 'play reverse play reverse' } }
            );
            gsap.fromTo(subRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
                  scrollTrigger: { trigger: subRef.current, start: 'top 88%', toggleActions: 'play reverse play reverse' } }
            );
            gsap.fromTo(formRef.current,
                { opacity: 0, x: 30 },
                { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
                  scrollTrigger: { trigger: formRef.current, start: 'top 85%', toggleActions: 'play reverse play reverse' } }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const bg = isDark ? '#111' : '#f5f4f2';
    const text = isDark ? '#f0f0f0' : '#111';
    const muted = isDark ? '#666' : '#888';
    const border = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';
    const inputBg = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.6)';

    return (
        <section
            ref={sectionRef}
            style={{ background: bg, color: text, fontFamily: FONT, borderTop: `1px solid ${border}` }}
            className="relative overflow-hidden"
        >
            <div className="max-w-[1400px] mx-auto px-8 md:px-14 lg:px-20 py-28 md:py-36">
                <div className="grid lg:grid-cols-2 gap-14 lg:gap-24 items-center">
                    
                    {/* Left side: Content */}
                    <div>
                        <p
                            ref={labelRef}
                            className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-6"
                            style={{ color: '#06b6d4', opacity: 0 }}
                        >
                            <EditableText contentKey="en.newsletter.badge" tag="span" fallback="Newsletter" />
                        </p>
                        <h2
                            ref={headRef}
                            className="leading-[0.9] tracking-[-0.03em] mb-6"
                            style={{ fontWeight: 900, fontSize: 'clamp(2.8rem, 5.5vw, 5rem)', opacity: 0 }}
                        >
                            <EditableText contentKey="en.newsletter.title" tag="span" fallback={<>Stay in the<br />loop.</>} />
                        </h2>
                        <p
                            ref={subRef}
                            className="text-base leading-relaxed max-w-sm"
                            style={{ color: muted, fontWeight: 300, opacity: 0 }}
                        >
                            <EditableText 
                                contentKey="en.newsletter.subtitle" 
                                tag="span" 
                                fallback="Get tech tips, updates, and exclusive offers delivered directly to your inbox." 
                            />
                        </p>
                    </div>

                    {/* Right side: Form */}
                    <div ref={formRef} className="w-full" style={{ opacity: 0 }}>
                        <form onSubmit={handleSubmit} className="relative max-w-md w-full">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@company.com"
                                required
                                disabled={status !== 'idle'}
                                className="w-full pl-6 pr-16 py-5 text-sm outline-none transition-colors duration-300"
                                style={{
                                    backgroundColor: inputBg,
                                    border: `1px solid ${border}`,
                                    color: text,
                                    borderRadius: 0,
                                }}
                            />
                            <button
                                type="submit"
                                disabled={status !== 'idle'}
                                className="absolute right-0 top-0 bottom-0 px-6 flex items-center justify-center transition-all duration-300 group"
                                style={{
                                    backgroundColor: status === 'success' ? '#10b981' : '#06b6d4',
                                    color: '#fff',
                                    pointerEvents: status !== 'idle' ? 'none' : 'auto'
                                }}
                            >
                                {status === 'idle' && (
                                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                                )}
                                {status === 'loading' && (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                )}
                                {status === 'success' && (
                                    <Check size={18} className="animate-fade-in" />
                                )}
                            </button>
                        </form>
                        
                        <div className="mt-4 flex items-center gap-2">
                            <span className="block w-2 h-2 rounded-full" style={{ backgroundColor: '#06b6d4' }} />
                            <p className="text-[11px] uppercase tracking-wider" style={{ color: muted }}>
                                <EditableText contentKey="en.newsletter.note" tag="span" fallback="No spam. Unsubscribe anytime." />
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Newsletter;
