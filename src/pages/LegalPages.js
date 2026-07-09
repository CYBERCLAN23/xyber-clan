import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import SharedNavbar from '../components/SharedNavbar';
import Meta from '../components/Meta';

const FONT = "'Inter', 'Helvetica Neue', sans-serif";

const PrivacyPage = () => {
  const { isDark } = useTheme();
  const bg = isDark ? '#0a0a0a' : '#f5f4f2';
  const text = isDark ? '#f0f0f0' : '#111';
  const muted = isDark ? '#666' : '#888';

  return (
    <div style={{ background: bg, color: text, fontFamily: FONT }} className="min-h-screen">
      <Meta title="Privacy Policy | XyberClan" description="Privacy Policy for XyberClan, a cybersecurity and tech innovation startup. Learn how we collect, use, and protect your data across our digital solutions." />
      <SharedNavbar transparentHero={false} />
      <div className="max-w-3xl mx-auto px-6 py-32">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-8">Privacy Policy</h1>
        <p className="text-sm mb-8" style={{ color: muted }}>Last updated: July 4, 2026</p>
        <div className="space-y-6 text-base leading-relaxed" style={{ color: isDark ? '#ccc' : '#444' }}>
          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: text }}>1. Information We Collect</h2>
            <p>We collect information you provide when using our contact forms, project inquiry forms, and career application forms. This includes your name, email address, phone number, and project details.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: text }}>2. How We Use Your Information</h2>
            <p>We use your information to respond to inquiries, process project requests, evaluate job applications, and improve our services. We do not sell your personal data to third parties.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: text }}>3. Data Protection</h2>
            <p>We implement industry-standard security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: text }}>4. Contact</h2>
            <p>For privacy-related inquiries, contact us at xyberclandev@gmail.com.</p>
          </section>
        </div>
        <Link to="/" className="inline-block mt-12 text-sm font-semibold text-cyan-500 hover:text-cyan-400 transition-colors">&larr; Back to Home</Link>
      </div>
    </div>
  );
};

const TermsPage = () => {
  const { isDark } = useTheme();
  const bg = isDark ? '#0a0a0a' : '#f5f4f2';
  const text = isDark ? '#f0f0f0' : '#111';
  const muted = isDark ? '#666' : '#888';

  return (
    <div style={{ background: bg, color: text, fontFamily: FONT }} className="min-h-screen">
      <Meta title="Terms of Service | XyberClan" description="Terms of Service for XyberClan, a cybersecurity and tech innovation startup. Understand the terms governing the use of our digital solutions and services." />
      <SharedNavbar transparentHero={false} />
      <div className="max-w-3xl mx-auto px-6 py-32">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-8">Terms of Service</h1>
        <p className="text-sm mb-8" style={{ color: muted }}>Last updated: July 4, 2026</p>
        <div className="space-y-6 text-base leading-relaxed" style={{ color: isDark ? '#ccc' : '#444' }}>
          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: text }}>1. Services</h2>
            <p>XyberClan provides web development, cybersecurity consulting, UI/UX design, and related digital services. Project scope, deliverables, and timelines are defined in individual service agreements.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: text }}>2. Intellectual Property</h2>
            <p>Upon full payment, clients retain ownership of the final deliverables. XyberClan reserves the right to display completed work in its portfolio unless otherwise agreed.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: text }}>3. Limitation of Liability</h2>
            <p>XyberClan shall not be liable for indirect, incidental, or consequential damages arising from the use of our services or website.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: text }}>4. Contact</h2>
            <p>For questions about these terms, contact us at xyberclandev@gmail.com.</p>
          </section>
        </div>
        <Link to="/" className="inline-block mt-12 text-sm font-semibold text-cyan-500 hover:text-cyan-400 transition-colors">&larr; Back to Home</Link>
      </div>
    </div>
  );
};

export { PrivacyPage, TermsPage };
