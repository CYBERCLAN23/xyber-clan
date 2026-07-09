import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import EditableText from './cms/EditableText';
import EditableImage from './cms/EditableImage';

gsap.registerPlugin(ScrollTrigger);

const FONT = "'Inter', 'Helvetica Neue', sans-serif";

const ROLES_EN = {
    cedrik: 'Co-Founder, CEO & Cybersecurity Analyst',
    josias: 'Co-Founder & CTO / AI Security Architect',
    onana: 'COO, IT & Cybersecurity Eng.',
    ange: 'Data Analyst & UI/UX Designer',
    william: 'Visual Content Designer',
    yann: 'Network Eng & Python',
    zealda: 'Fullstack Dev & Systems Eng.',
    lembou: 'Cybersecurity, DevOps & AI',
    theresa: 'CEO of Greenfarmers · GDG Yaoundé Volunteer · Hult Prize Organiser'
};

const ROLES_FR = {
    cedrik: 'Co-Fondateur, CEO & Analyste Cybersécurité',
    josias: 'Co-Fondateur & CTO / Architecte IA Sécurité',
    onana: 'COO, Ing. IT & Cybersécurité',
    ange: 'Analyste Données & Designer UI/UX',
    william: 'Designer de Contenu Visuel',
    yann: 'Ing. Réseau & Python',
    zeal: 'Dév Fullstack & Ing. Systèmes',
    lembou: 'Cybersécurité, DevOps & IA',
    theresa: 'CEO de Greenfarmers · Bénévole GDG Yaoundé · Organisatrice Hult Prize'
};

const teamMembers = [
    { key: 'cedrik', name: 'Cedrik Darel Yepmo', image: '/team/ceo-member.jpg' },
    { key: 'josias', name: 'Akana Signing Josias Aaron', image: '/team/cto-redteamer.jpg' },
    { key: 'onana', name: 'Onana Gregoire Legrand', image: '/team/communications-manager.jpeg' },
    { key: 'ange', name: 'Ange Demanou', image: '/team/ange-demanou.png' },
    { key: 'william', name: 'William Chandler', image: '/team/william-chandler.png' },
    { key: 'yann', name: 'Wandji Tchaleu Yann Félix', image: '/team/yann-felix-wandji.png' },
    { key: 'zealda', name: 'ADJIA MVOA NDJI GABRIEL MONFILS', image: '/team/frontend-designer.png' },
    { key: 'lembou', name: 'Lembou Pharel', image: '/team/cybersecurity-chief.jpg' },
    { key: 'theresa', name: 'Theresa Tcheme', image: '/team/theresa-tcheme.jpg' }
];

const TeamMinimal = () => {
    const { isDark } = useTheme();
    const { language: lang } = useLanguage();
    const sectionRef = useRef(null);
    const labelRef = useRef(null);
    const headRef = useRef(null);
    const membersRef = useRef([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(labelRef.current,
                { opacity: 0, y: 14 },
                {
                    opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
                    scrollTrigger: { trigger: labelRef.current, start: 'top 88%', toggleActions: 'play reverse play reverse' }
                }
            );
            gsap.fromTo(headRef.current,
                { opacity: 0, y: 40 },
                {
                    opacity: 1, y: 0, duration: 1, ease: 'power3.out',
                    scrollTrigger: { trigger: headRef.current, start: 'top 85%', toggleActions: 'play reverse play reverse' }
                }
            );
            gsap.fromTo(membersRef.current,
                { opacity: 0, y: 32 },
                {
                    opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: 'power3.out',
                    scrollTrigger: { trigger: headRef.current, start: 'top 85%', toggleActions: 'play reverse play reverse' }
                }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const bg = isDark ? '#0a0a0a' : '#fff';
    const text = isDark ? '#f0f0f0' : '#111';
    const muted = isDark ? '#666' : '#888';
    const border = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';
    const cardBg = isDark ? '#1a1a1a' : '#f5f4f2';

    return (
        <section
            id="team"
            ref={sectionRef}
            style={{ background: bg, color: text, fontFamily: FONT, borderTop: `1px solid ${border}` }}
            className="relative overflow-hidden py-28 md:py-36"
        >
            <div className="max-w-[1400px] mx-auto px-8 md:px-14 lg:px-20 mb-16">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                    <div>
                        <p
                            ref={labelRef}
                            className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-6"
                            style={{ color: '#06b6d4', opacity: 0 }}
                        >
                            <EditableText contentKey={`${lang}.team_minimal.badge`} fallback="The XyberClan" />
                        </p>
                        <h2
                            ref={headRef}
                            className="leading-[0.9] tracking-[-0.03em]"
                            style={{ fontWeight: 900, fontSize: 'clamp(2.8rem, 5.5vw, 5rem)', opacity: 0 }}
                        >
                            <EditableText contentKey={`${lang}.team_minimal.title`} fallback={<>The people<br />behind the code.</>} />
                        </h2>
                    </div>
                    <p
                        className="text-sm leading-relaxed max-w-xs"
                        style={{ color: muted, fontWeight: 300 }}
                    >
                        <EditableText
                            contentKey={`${lang}.team_minimal.subtitle`}
                            fallback="A collective of engineers, designers, and security specialists dedicated to building what matters."
                        />
                    </p>
                </div>
            </div>

            {/* Horizontal Team Grid */}
            <div className="w-full overflow-x-auto hide-scrollbar cursor-grab active:cursor-grabbing pb-8 px-8 md:px-14 lg:px-20">
                <div className="flex w-max" style={{ border: `1px solid ${border}` }}>
                    {teamMembers.map((member, i) => (
                        <div
                            key={i}
                            ref={el => membersRef.current[i] = el}
                            className="group relative w-[220px] sm:w-[260px] md:w-[320px] h-[280px] sm:h-[350px] md:h-[420px] overflow-hidden flex-shrink-0"
                            style={{
                                opacity: 0,
                                backgroundColor: cardBg,
                                borderRight: i < teamMembers.length - 1 ? `1px solid ${border}` : 'none'
                            }}
                        >
                            {/* Image */}
                            <EditableImage
                                contentKey={`en.team.${member.key}.image`}
                                src={member.image}
                                alt={member.name}
                                className="w-full h-full object-cover object-center grayscale opacity-80 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
                            />

                            {/* Hover overlay for name */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 text-white">
                                <h3 className="text-xl font-bold tracking-tight mb-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                                    {member.name}
                                </h3>
                                <p className="text-[11px] uppercase font-mono tracking-[0.1em] text-cyan-400 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out delay-75">
                                    {lang === 'fr' ? ROLES_FR[member.key] : ROLES_EN[member.key]}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TeamMinimal;
