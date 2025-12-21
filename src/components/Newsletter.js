import React, { useState } from 'react';
import { Mail, Send, CheckCircle, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Newsletter = () => {
    const { isDark } = useTheme();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');

        // Simulate API call - replace with actual newsletter service
        setTimeout(() => {
            setStatus('success');
            setEmail('');
        }, 1500);
    };

    return (
        <section className={`py-20 px-4 ${isDark ? 'bg-gradient-to-b from-neutral-950 to-black' : 'bg-gradient-to-b from-gray-100 to-white'}`}>
            <div className="max-w-3xl mx-auto text-center">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 mb-6">
                    <Sparkles className="w-8 h-8 text-white" />
                </div>

                {/* Heading */}
                <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
                    Stay in the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">Loop</span>
                </h2>
                <p className={`text-lg mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Get tech tips, updates, and exclusive offers delivered to your inbox
                </p>

                {/* Form */}
                {status === 'success' ? (
                    <div className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl ${isDark ? 'bg-green-500/10 border border-green-500/20' : 'bg-green-50 border border-green-200'}`}>
                        <CheckCircle className="w-6 h-6 text-green-500" />
                        <span className="font-bold text-green-500">You're subscribed! Check your inbox.</span>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                        <div className="relative flex-1">
                            <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                                className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 text-lg font-medium transition-all focus:outline-none focus:ring-4 focus:ring-cyan-500/20 ${isDark
                                    ? 'bg-white/5 border-white/10 focus:border-cyan-500 text-white placeholder-gray-500'
                                    : 'bg-white border-gray-200 focus:border-cyan-500 text-gray-900 placeholder-gray-400'}`}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className={`px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${status === 'loading'
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/30 hover:scale-105'}`}
                        >
                            {status === 'loading' ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Subscribing...
                                </>
                            ) : (
                                <>
                                    Subscribe
                                    <Send className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>
                )}

                {/* Note */}
                <p className={`text-sm mt-6 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                    No spam, unsubscribe anytime. We respect your privacy.
                </p>
            </div>
        </section>
    );
};

export default Newsletter;
