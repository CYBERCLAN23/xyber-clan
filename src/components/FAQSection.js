import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const FAQSection = () => {
    const { isDark } = useTheme();
    const [openIndex, setOpenIndex] = useState(0);

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

    return (
        <section className={`py-24 px-4 ${isDark ? 'bg-black' : 'bg-white'}`} id="faq">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 mb-6">
                        <HelpCircle className="w-4 h-4 text-cyan-500" />
                        <span className="text-sm font-bold text-cyan-500">Got Questions?</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                        Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">Questions</span>
                    </h2>
                    <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Everything you need to know about our services
                    </p>
                </div>

                {/* FAQ Items */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`rounded-2xl border overflow-hidden transition-all duration-300 ${isDark
                                ? 'bg-neutral-900/50 border-white/10 hover:border-white/20'
                                : 'bg-gray-50 border-gray-200 hover:border-gray-300'}`}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                                className="w-full px-6 py-5 flex items-center justify-between text-left"
                            >
                                <span className="font-bold text-lg pr-4">{faq.question}</span>
                                <ChevronDown
                                    className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''} ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                                />
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96' : 'max-h-0'}`}
                            >
                                <div className={`px-6 pb-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center mt-12">
                    <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Still have questions?
                    </p>
                    <a
                        href="https://wa.me/237654269488?text=Hi%20XyberClan!%20I%20have%20a%20question..."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:scale-105 transition-transform shadow-lg shadow-cyan-500/30"
                    >
                        Chat With Us
                    </a>
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
