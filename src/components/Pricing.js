import React from 'react';
import { Check, ArrowRight, Zap, Gem, Building } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Pricing = () => {
    const { isDark } = useTheme();

    const plans = [
        {
            name: 'Starter',
            icon: <Zap className="w-8 h-8" />,
            price: '50K',
            currency: 'XAF',
            description: 'Perfect for small projects and getting started',
            color: 'green',
            features: [
                'Simple landing page (1-3 pages)',
                'Mobile responsive design',
                'Contact form',
                'Basic SEO setup',
                '1 week delivery',
                '7 days support after delivery'
            ],
            cta: 'Start Small'
        },
        {
            name: 'Professional',
            icon: <Gem className="w-8 h-8" />,
            price: '200K',
            currency: 'XAF',
            description: 'Most popular for growing businesses',
            color: 'cyan',
            popular: true,
            features: [
                'Full business website (5-10 pages)',
                'Premium responsive design',
                'Contact & booking forms',
                'Photo gallery & portfolio',
                'Social media integration',
                'Advanced SEO optimization',
                '2 weeks delivery',
                '30 days support'
            ],
            cta: 'Go Pro'
        },
        {
            name: 'Enterprise',
            icon: <Building className="w-8 h-8" />,
            price: '500K+',
            currency: 'XAF',
            description: 'Custom solutions for large projects',
            color: 'purple',
            features: [
                'Full web application',
                'E-commerce capabilities',
                'User authentication system',
                'Admin dashboard',
                'Payment integration',
                'Custom features',
                'Dedicated team',
                'Priority support & maintenance'
            ],
            cta: 'Contact Us'
        }
    ];

    const getColorClasses = (color, popular) => {
        if (popular) {
            return {
                border: 'border-cyan-500',
                icon: 'text-cyan-500 bg-cyan-500/10',
                button: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/30'
            };
        }
        const colors = {
            green: { border: isDark ? 'border-white/10' : 'border-gray-200', icon: 'text-green-500 bg-green-500/10', button: isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-900 text-white hover:bg-gray-800' },
            cyan: { border: 'border-cyan-500', icon: 'text-cyan-500 bg-cyan-500/10', button: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white' },
            purple: { border: isDark ? 'border-white/10' : 'border-gray-200', icon: 'text-purple-500 bg-purple-500/10', button: isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-900 text-white hover:bg-gray-800' }
        };
        return colors[color] || colors.cyan;
    };

    return (
        <section className={`py-24 px-4 ${isDark ? 'bg-black' : 'bg-white'}`} id="pricing">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                        Simple, Transparent <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">Pricing</span>
                    </h2>
                    <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Choose a plan that fits your needs. All plans include our quality guarantee.
                    </p>
                </div>

                {/* Plans Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    {plans.map((plan, index) => {
                        const colors = getColorClasses(plan.color, plan.popular);
                        return (
                            <div
                                key={index}
                                className={`relative rounded-3xl border-2 p-8 transition-all duration-300 hover:scale-[1.02] ${colors.border} ${isDark ? 'bg-neutral-900/50' : 'bg-gray-50'} ${plan.popular ? 'shadow-2xl shadow-cyan-500/20' : ''}`}
                            >
                                {/* Popular badge */}
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <span className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold px-4 py-1 rounded-full">
                                            Most Popular
                                        </span>
                                    </div>
                                )}

                                {/* Icon */}
                                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 ${colors.icon}`}>
                                    {plan.icon}
                                </div>

                                {/* Name & Description */}
                                <h3 className="text-2xl font-black mb-2">{plan.name}</h3>
                                <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {plan.description}
                                </p>

                                {/* Price */}
                                <div className="mb-8">
                                    <span className="text-5xl font-black">{plan.price}</span>
                                    <span className={`text-lg ml-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{plan.currency}</span>
                                </div>

                                {/* Features */}
                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.popular ? 'text-cyan-500' : 'text-green-500'}`} />
                                            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA */}
                                <Link
                                    to="/start-project"
                                    className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 ${colors.button}`}
                                >
                                    {plan.cta}
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>
                        );
                    })}
                </div>

                {/* Note */}
                <p className={`text-center mt-12 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    All prices are starting points. Final quote depends on specific requirements.
                </p>
            </div>
        </section>
    );
};

export default Pricing;
