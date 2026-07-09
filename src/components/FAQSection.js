import React, { useState, useEffect, useRef } from 'react';
import { Plus, Minus } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import EditableText from './cms/EditableText';

gsap.registerPlugin(ScrollTrigger);

const FONT = "'Inter', 'Helvetica Neue', sans-serif";

const faqs = [
    {
        question: "How much does a website cost?",
        answer: "Our websites start from 50,000 XAF for basic landing pages. Business websites with multiple pages, contact forms, and galleries typically range from 150,000 - 500,000 XAF. E-commerce sites and web applications are custom-quoted based on features needed."
    },
    {
        question: "How long does it take to build a website?",
        answer: "A simple landing page can be completed in 3-5 days. Standard business websites take 1-2 weeks. More complex projects like e-commerce stores or web applications typically take 3-6 weeks depending on features and revisions."
    },
    {
        question: "Do you offer mobile app development?",
        answer: "Yes! We build mobile apps for both Android and iOS using modern technologies like React Native and Flutter. This allows us to create one app that works on both platforms, saving you time and money."
    },
    {
        question: "What payment methods do you accept?",
        answer: "We accept Mobile Money (MTN, Orange), bank transfers, and cash payments. We typically require 50% upfront to start the project, with the remaining 50% due upon completion."
    },
    {
        question: "Do you provide ongoing support?",
        answer: "Absolutely! We offer maintenance packages starting from 15,000 XAF/month that include hosting, security updates, backups, and minor content changes. We're always here to help even after your project is complete."
    },
    {
        question: "Can you help with branding and design?",
        answer: "Yes, we offer complete branding services including logo design, business cards, social media graphics, flyers, and full brand identity packages. Our designers create modern, professional designs that make your business stand out."
    },
    {
        question: "Do I need to provide content for my website?",
        answer: "While we can work with content you provide, we also offer content writing services. We can help write compelling copy for your website and source professional stock images if needed."
    },
    {
        question: "What if I'm not satisfied with the design?",
        answer: "We work closely with you throughout the design process and include revision rounds in all our packages. We won't stop until you're 100% happy with the result. Your satisfaction is our priority."
    }
];

const FAQItem = ({ faq, index, isOpen, onToggle, onScrollOpen, text, muted, border, lang }) => {
    const itemRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: itemRef.current,
                start: 'top center',
                onEnter: () => onScrollOpen(index),
                onEnterBack: () => onScrollOpen(index),
            });
        }, itemRef);
        return () => ctx.revert();
    }, [index, onScrollOpen]);

    useEffect(() => {
        if (contentRef.current) {
            gsap.to(contentRef.current, {
                height: isOpen ? contentRef.current.scrollHeight : 0,
                opacity: isOpen ? 1 : 0,
                duration: 0.4,
                ease: 'power2.inOut',
            });
        }
    }, [isOpen]);

    return (
        <div
            ref={itemRef}
            className="border-b transition-colors duration-300"
            style={{ borderColor: border }}
        >
            <button
                onClick={onToggle}
                className="w-full py-7 md:py-8 flex items-center justify-between text-left gap-6 group"
            >
                <div className="flex items-center gap-3 sm:gap-5 md:gap-8">
                    <span
                        className="text-[11px] font-mono tracking-widest shrink-0"
                        style={{ color: '#06b6d4' }}
                    >
                        0{index + 1}
                    </span>
                    <span
                        className="text-base md:text-lg font-semibold tracking-tight group-hover:text-cyan-500 transition-colors duration-200"
                        style={{ color: text }}
                    >
                        <EditableText contentKey={`${lang}.faq.items.${index}.question`} tag="span" fallback={faq.question} />
                    </span>
                </div>
                <div
                    className="w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300"
                    style={{
                        borderColor: isOpen ? '#06b6d4' : border,
                        backgroundColor: isOpen ? 'rgba(6,182,212,0.1)' : 'transparent',
                    }}
                >
                    {isOpen
                        ? <Minus size={14} style={{ color: '#06b6d4' }} />
                        : <Plus size={14} style={{ color: muted }} />
                    }
                </div>
            </button>

            <div
                ref={contentRef}
                className="overflow-hidden"
                style={{ height: 0, opacity: 0 }}
            >
                <div
                    className="pb-8 pl-10 md:pl-[4.5rem] pr-14 text-[14.5px] leading-[1.8]"
                    style={{ color: muted, fontWeight: 300 }}
                >
                    <EditableText contentKey={`${lang}.faq.items.${index}.answer`} tag="span" fallback={faq.answer} />
                </div>
            </div>
        </div>
    );
};

const FAQSection = () => {
    const { isDark } = useTheme();
    const { language: lang } = useLanguage();
    const [openIndex, setOpenIndex] = useState(0);
    const sectionRef = useRef(null);
    const labelRef = useRef(null);
    const headRef = useRef(null);
    const listRef = useRef(null);
    const ctaRef = useRef(null);

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
            gsap.fromTo(listRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
                  scrollTrigger: { trigger: listRef.current, start: 'top 88%', toggleActions: 'play reverse play reverse' } }
            );
            gsap.fromTo(ctaRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
                  scrollTrigger: { trigger: ctaRef.current, start: 'top 92%', toggleActions: 'play reverse play reverse' } }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const bg = isDark ? '#0a0a0a' : '#fff';
    const text = isDark ? '#f0f0f0' : '#111';
    const muted = isDark ? '#666' : '#888';
    const border = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';

    return (
        <section
            id="faq"
            ref={sectionRef}
            style={{ background: bg, color: text, fontFamily: FONT, borderTop: `1px solid ${border}` }}
            className="relative overflow-hidden"
        >
            <div className="max-w-[1400px] mx-auto px-8 md:px-14 lg:px-20 py-28 md:py-36">

                {/* ── Header ── */}
                <div className="grid lg:grid-cols-2 gap-10 lg:gap-24 mb-20">
                    <div>
                        <p
                            ref={labelRef}
                            className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-6"
                            style={{ color: '#06b6d4', opacity: 0 }}
                        >
                            <EditableText contentKey={`${lang}.faq.badge`} tag="span" fallback="FAQ" />
                        </p>
                        <h2
                            ref={headRef}
                            className="leading-[0.9] tracking-[-0.03em]"
                            style={{ fontWeight: 900, fontSize: 'clamp(2.8rem, 5.5vw, 5rem)', opacity: 0 }}
                        >
                            <EditableText contentKey={`${lang}.faq.title`} tag="span" fallback={<>Questions?<br />Answers.</>} />
                        </h2>
                    </div>
                    <div className="flex items-end">
                        <p
                            className="text-sm leading-relaxed max-w-sm"
                            style={{ color: muted, fontWeight: 300 }}
                        >
                            <EditableText
                                contentKey={`${lang}.faq.subtitle`}
                                tag="span"
                                fallback="Everything you need to know about our services, pricing, process, and how we work with you."
                            />
                        </p>
                    </div>
                </div>

                {/* ── FAQ Items ── */}
                <div
                    ref={listRef}
                    className="border-t"
                    style={{ borderColor: border, opacity: 0 }}
                >
                    {faqs.map((faq, index) => (
                        <FAQItem
                            key={index}
                            faq={faq}
                            index={index}
                            isOpen={openIndex === index}
                            onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
                            onScrollOpen={setOpenIndex}
                            text={text}
                            muted={muted}
                            border={border}
                            lang={lang}
                        />
                    ))}
                </div>

                {/* ── CTA ── */}
                <div
                    ref={ctaRef}
                    className="flex flex-col md:flex-row items-center justify-between gap-6 mt-16 pt-8"
                    style={{ borderTop: `1px solid ${border}`, opacity: 0 }}
                >
                    <p className="text-sm" style={{ color: muted, fontWeight: 300 }}>
                        <EditableText contentKey={`${lang}.faq.ctaText`} tag="span" fallback="Still have questions? We're happy to help." />
                    </p>
                    <a
                        href="https://wa.me/237654269488?text=Hi%20XyberClan!%20I%20have%20a%20question..."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 text-sm font-semibold tracking-wide border-b pb-0.5 transition-colors duration-200 hover:text-cyan-500 hover:border-cyan-500"
                        style={{ color: text, borderColor: text }}
                    >
                        <EditableText contentKey={`${lang}.faq.ctaButton`} tag="span" fallback="Chat with us" />
                        <span className="transition-transform group-hover:translate-x-1">→</span>
                    </a>
                </div>

            </div>
        </section>
    );
};

export default FAQSection;
