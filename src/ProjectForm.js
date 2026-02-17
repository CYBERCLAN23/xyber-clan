import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    ChevronRight, ChevronLeft, Mail, MessageCircle, Check,
    Globe, Smartphone, Palette, Shield, Monitor, GraduationCap,
    Zap, Calendar, Clock, Coins, Banknote, Gem, HelpCircle,
    ShoppingCart, Sparkles, ArrowRight, Home, Sun, Moon,
    User, Building, Users, Crosshair, Target, FileText,
    Pencil, Timer, Wallet, Phone, Layers, Image,
    Wrench, Wifi, Lock, BookOpen, Code, Layout
} from 'lucide-react';
import { useTheme } from './context/ThemeContext';
import { getLogo } from './utils/festive';

const ProjectForm = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [direction, setDirection] = useState('forward');
    const { isDark, toggleTheme } = useTheme();

    const [formData, setFormData] = useState({
        projectType: '',
        // Common fields
        projectName: '',
        description: '',
        timeline: '',
        budget: '',
        contactName: '',
        contactPhone: '',
        contactEmail: '',
        // Website specific
        websitePages: '',
        websiteFeatures: [],
        hasDomain: '',
        // App specific
        appPlatform: '',
        appFeatures: [],
        // Shop specific
        shopProducts: '',
        shopPayment: '',
        // Design specific
        designType: [],
        hasColors: '',
        // Security specific
        securityType: '',
        // Computer specific
        computerIssue: '',
        // Training specific
        trainingTopic: '',
        trainingPeople: ''
    });

    // Base questions that appear for all project types
    const baseQuestions = {
        projectType: {
            id: 'projectType',
            icon: <Crosshair className="w-8 h-8 text-cyan-500" />,
            question: 'What can we help you with?',
            subtitle: 'Pick one to get started',
            type: 'choice',
            autoAdvance: true,
            options: [
                { value: 'website', label: 'Website', desc: 'Business sites, portfolios, landing pages', icon: <Globe className="w-10 h-10" />, color: 'cyan' },
                { value: 'app', label: 'Mobile App', desc: 'iOS, Android, or both', icon: <Smartphone className="w-10 h-10" />, color: 'purple' },
                { value: 'shop', label: 'Online Shop', desc: 'Sell products online', icon: <ShoppingCart className="w-10 h-10" />, color: 'green' },
                { value: 'design', label: 'Logo & Design', desc: 'Branding, graphics, UI/UX', icon: <Palette className="w-10 h-10" />, color: 'pink' },
                { value: 'security', label: 'Cybersecurity', desc: 'Audits, protection, testing', icon: <Shield className="w-10 h-10" />, color: 'red' },
                { value: 'computer', label: 'Computer Help', desc: 'Repair, setup, networks', icon: <Monitor className="w-10 h-10" />, color: 'orange' },
                { value: 'training', label: 'Tech Training', desc: 'Courses & workshops', icon: <GraduationCap className="w-10 h-10" />, color: 'blue' },
                { value: 'other', label: 'Something Else', desc: 'Custom request', icon: <Sparkles className="w-10 h-10" />, color: 'gray' }
            ]
        },
        projectName: {
            id: 'projectName',
            icon: <FileText className="w-8 h-8 text-cyan-500" />,
            question: 'What\'s your project called?',
            subtitle: 'Your business or project name',
            type: 'text',
            placeholder: 'e.g., My Coffee Shop, Tech Solutions...'
        },
        timeline: {
            id: 'timeline',
            icon: <Timer className="w-8 h-8 text-cyan-500" />,
            question: 'When do you need it?',
            subtitle: 'Pick the closest option',
            type: 'choice',
            autoAdvance: true,
            options: [
                { value: 'urgent', label: 'ASAP', desc: 'Within a week', icon: <Zap className="w-10 h-10" />, color: 'red' },
                { value: 'soon', label: '2 Weeks', desc: 'Pretty soon', icon: <Calendar className="w-10 h-10" />, color: 'orange' },
                { value: 'month', label: '1 Month', desc: 'No rush', icon: <Calendar className="w-10 h-10" />, color: 'blue' },
                { value: 'flexible', label: 'Flexible', desc: 'Take your time', icon: <Clock className="w-10 h-10" />, color: 'green' }
            ]
        },
        budget: {
            id: 'budget',
            icon: <Wallet className="w-8 h-8 text-cyan-500" />,
            question: 'What\'s your budget?',
            subtitle: 'We have options for everyone',
            type: 'choice',
            autoAdvance: true,
            options: [
                { value: 'starter', label: 'Under 100K XAF', desc: 'Basic projects', icon: <Coins className="w-10 h-10" />, color: 'green' },
                { value: 'standard', label: '100K - 300K XAF', desc: 'Standard projects', icon: <Banknote className="w-10 h-10" />, color: 'blue' },
                { value: 'premium', label: '300K - 500K XAF', desc: 'Premium quality', icon: <Gem className="w-10 h-10" />, color: 'purple' },
                { value: 'enterprise', label: '500K+ XAF', desc: 'Large projects', icon: <Building className="w-10 h-10" />, color: 'cyan' },
                { value: 'discuss', label: 'Let\'s Discuss', desc: 'Need consultation', icon: <HelpCircle className="w-10 h-10" />, color: 'gray' }
            ]
        },
        contact: {
            id: 'contact',
            icon: <Phone className="w-8 h-8 text-cyan-500" />,
            question: 'How do we reach you?',
            subtitle: 'We\'ll contact you within 24 hours',
            type: 'contact',
            fields: [
                { id: 'contactName', label: 'Your Name', placeholder: 'John Doe', type: 'text', icon: <User className="w-5 h-5" /> },
                { id: 'contactPhone', label: 'WhatsApp Number', placeholder: '+237 6XX XXX XXX', type: 'tel', icon: <MessageCircle className="w-5 h-5" /> },
                { id: 'contactEmail', label: 'Email (optional)', placeholder: 'john@example.com', type: 'email', icon: <Mail className="w-5 h-5" /> }
            ]
        }
    };

    // Type-specific questions
    const typeSpecificQuestions = {
        website: [
            {
                id: 'websitePages',
                icon: <Layout className="w-8 h-8 text-cyan-500" />,
                question: 'How many pages do you need?',
                subtitle: 'Approximate number is fine',
                type: 'choice',
                autoAdvance: true,
                options: [
                    { value: '1-3', label: '1-3 Pages', desc: 'Simple landing page', icon: <FileText className="w-10 h-10" />, color: 'green' },
                    { value: '4-7', label: '4-7 Pages', desc: 'Small business site', icon: <Layers className="w-10 h-10" />, color: 'blue' },
                    { value: '8-15', label: '8-15 Pages', desc: 'Medium website', icon: <Layers className="w-10 h-10" />, color: 'purple' },
                    { value: '15+', label: '15+ Pages', desc: 'Large website', icon: <Building className="w-10 h-10" />, color: 'cyan' }
                ]
            },
            {
                id: 'websiteFeatures',
                icon: <Code className="w-8 h-8 text-cyan-500" />,
                question: 'What features do you need?',
                subtitle: 'Select all that apply',
                type: 'multiChoice',
                options: [
                    { value: 'contact', label: 'Contact Form', icon: <Mail className="w-6 h-6" /> },
                    { value: 'gallery', label: 'Photo Gallery', icon: <Image className="w-6 h-6" /> },
                    { value: 'booking', label: 'Booking System', icon: <Calendar className="w-6 h-6" /> },
                    { value: 'blog', label: 'Blog/News', icon: <FileText className="w-6 h-6" /> },
                    { value: 'login', label: 'User Login', icon: <Lock className="w-6 h-6" /> },
                    { value: 'multilang', label: 'Multi-language', icon: <Globe className="w-6 h-6" /> }
                ]
            },
            {
                id: 'hasDomain',
                icon: <Globe className="w-8 h-8 text-cyan-500" />,
                question: 'Do you have a domain name?',
                subtitle: 'Like www.yoursite.com',
                type: 'choice',
                autoAdvance: true,
                options: [
                    { value: 'yes', label: 'Yes, I Have One', desc: 'Already registered', icon: <Check className="w-10 h-10" />, color: 'green' },
                    { value: 'no', label: 'No, Need One', desc: 'Help me get one', icon: <ShoppingCart className="w-10 h-10" />, color: 'blue' },
                    { value: 'unsure', label: 'Not Sure', desc: 'Need guidance', icon: <HelpCircle className="w-10 h-10" />, color: 'gray' }
                ]
            }
        ],
        app: [
            {
                id: 'appPlatform',
                icon: <Smartphone className="w-8 h-8 text-cyan-500" />,
                question: 'Which platform?',
                subtitle: 'Where should the app work?',
                type: 'choice',
                autoAdvance: true,
                options: [
                    { value: 'android', label: 'Android', desc: 'Samsung, Tecno, etc.', icon: <Smartphone className="w-10 h-10" />, color: 'green' },
                    { value: 'ios', label: 'iPhone (iOS)', desc: 'Apple devices', icon: <Smartphone className="w-10 h-10" />, color: 'blue' },
                    { value: 'both', label: 'Both Platforms', desc: 'Android & iOS', icon: <Layers className="w-10 h-10" />, color: 'purple' }
                ]
            },
            {
                id: 'appFeatures',
                icon: <Code className="w-8 h-8 text-cyan-500" />,
                question: 'What features do you need?',
                subtitle: 'Select all that apply',
                type: 'multiChoice',
                options: [
                    { value: 'login', label: 'User Accounts', icon: <User className="w-6 h-6" /> },
                    { value: 'payments', label: 'Payments', icon: <Wallet className="w-6 h-6" /> },
                    { value: 'notifications', label: 'Notifications', icon: <MessageCircle className="w-6 h-6" /> },
                    { value: 'maps', label: 'Maps/Location', icon: <Target className="w-6 h-6" /> },
                    { value: 'camera', label: 'Camera/Photos', icon: <Image className="w-6 h-6" /> },
                    { value: 'offline', label: 'Works Offline', icon: <Wifi className="w-6 h-6" /> }
                ]
            }
        ],
        shop: [
            {
                id: 'shopProducts',
                icon: <ShoppingCart className="w-8 h-8 text-cyan-500" />,
                question: 'How many products?',
                subtitle: 'Approximate number',
                type: 'choice',
                autoAdvance: true,
                options: [
                    { value: '1-20', label: '1-20 Products', desc: 'Small catalog', icon: <ShoppingCart className="w-10 h-10" />, color: 'green' },
                    { value: '21-100', label: '21-100 Products', desc: 'Medium store', icon: <Layers className="w-10 h-10" />, color: 'blue' },
                    { value: '100+', label: '100+ Products', desc: 'Large store', icon: <Building className="w-10 h-10" />, color: 'purple' }
                ]
            },
            {
                id: 'shopPayment',
                icon: <Wallet className="w-8 h-8 text-cyan-500" />,
                question: 'Payment methods needed?',
                subtitle: 'How will customers pay?',
                type: 'choice',
                autoAdvance: true,
                options: [
                    { value: 'mobile', label: 'Mobile Money', desc: 'MTN, Orange Money', icon: <Phone className="w-10 h-10" />, color: 'orange' },
                    { value: 'card', label: 'Card Payments', desc: 'Visa, MasterCard', icon: <Wallet className="w-10 h-10" />, color: 'blue' },
                    { value: 'both', label: 'Both', desc: 'Mobile & Card', icon: <Layers className="w-10 h-10" />, color: 'green' },
                    { value: 'cash', label: 'Cash on Delivery', desc: 'Pay when received', icon: <Coins className="w-10 h-10" />, color: 'gray' }
                ]
            }
        ],
        design: [
            {
                id: 'designType',
                icon: <Palette className="w-8 h-8 text-cyan-500" />,
                question: 'What design work?',
                subtitle: 'Select all you need',
                type: 'multiChoice',
                options: [
                    { value: 'logo', label: 'Logo Design', icon: <Image className="w-6 h-6" /> },
                    { value: 'brand', label: 'Full Branding', icon: <Palette className="w-6 h-6" /> },
                    { value: 'flyers', label: 'Flyers/Posters', icon: <FileText className="w-6 h-6" /> },
                    { value: 'social', label: 'Social Media', icon: <Globe className="w-6 h-6" /> },
                    { value: 'cards', label: 'Business Cards', icon: <Layout className="w-6 h-6" /> },
                    { value: 'ui', label: 'App/Web UI', icon: <Smartphone className="w-6 h-6" /> }
                ]
            },
            {
                id: 'hasColors',
                icon: <Sparkles className="w-8 h-8 text-cyan-500" />,
                question: 'Do you have brand colors?',
                subtitle: 'Colors you want to use',
                type: 'choice',
                autoAdvance: true,
                options: [
                    { value: 'yes', label: 'Yes, I Have Colors', desc: 'Use my existing colors', icon: <Check className="w-10 h-10" />, color: 'green' },
                    { value: 'ideas', label: 'Some Ideas', desc: 'I have preferences', icon: <Sparkles className="w-10 h-10" />, color: 'blue' },
                    { value: 'no', label: 'Help Me Choose', desc: 'Suggest colors', icon: <Palette className="w-10 h-10" />, color: 'purple' }
                ]
            }
        ],
        security: [
            {
                id: 'securityType',
                icon: <Shield className="w-8 h-8 text-cyan-500" />,
                question: 'What security service?',
                subtitle: 'What do you need?',
                type: 'choice',
                autoAdvance: true,
                options: [
                    { value: 'audit', label: 'Security Audit', desc: 'Check for vulnerabilities', icon: <Target className="w-10 h-10" />, color: 'blue' },
                    { value: 'pentest', label: 'Penetration Test', desc: 'Test defenses', icon: <Shield className="w-10 h-10" />, color: 'red' },
                    { value: 'training', label: 'Security Training', desc: 'Train my team', icon: <BookOpen className="w-10 h-10" />, color: 'green' },
                    { value: 'recovery', label: 'Incident Response', desc: 'Got hacked, need help', icon: <Zap className="w-10 h-10" />, color: 'orange' }
                ]
            }
        ],
        computer: [
            {
                id: 'computerIssue',
                icon: <Wrench className="w-8 h-8 text-cyan-500" />,
                question: 'What do you need?',
                subtitle: 'Select the service',
                type: 'choice',
                autoAdvance: true,
                options: [
                    { value: 'repair', label: 'Computer Repair', desc: 'Fix issues', icon: <Wrench className="w-10 h-10" />, color: 'orange' },
                    { value: 'setup', label: 'New Setup', desc: 'Install & configure', icon: <Monitor className="w-10 h-10" />, color: 'blue' },
                    { value: 'network', label: 'Network Setup', desc: 'WiFi, cables, etc.', icon: <Wifi className="w-10 h-10" />, color: 'green' },
                    { value: 'upgrade', label: 'Upgrade', desc: 'Make it faster', icon: <Zap className="w-10 h-10" />, color: 'purple' }
                ]
            }
        ],
        training: [
            {
                id: 'trainingTopic',
                icon: <BookOpen className="w-8 h-8 text-cyan-500" />,
                question: 'What topic?',
                subtitle: 'What do you want to learn?',
                type: 'choice',
                autoAdvance: true,
                options: [
                    { value: 'web', label: 'Web Development', desc: 'HTML, CSS, JavaScript', icon: <Code className="w-10 h-10" />, color: 'cyan' },
                    { value: 'mobile', label: 'Mobile Apps', desc: 'React Native, Flutter', icon: <Smartphone className="w-10 h-10" />, color: 'purple' },
                    { value: 'design', label: 'Design Tools', desc: 'Figma, Canva, Adobe', icon: <Palette className="w-10 h-10" />, color: 'pink' },
                    { value: 'security', label: 'Cybersecurity', desc: 'Hacking, defense', icon: <Shield className="w-10 h-10" />, color: 'red' },
                    { value: 'basics', label: 'Computer Basics', desc: 'Office, internet', icon: <Monitor className="w-10 h-10" />, color: 'green' }
                ]
            },
            {
                id: 'trainingPeople',
                icon: <Users className="w-8 h-8 text-cyan-500" />,
                question: 'How many people?',
                subtitle: 'Number of students',
                type: 'choice',
                autoAdvance: true,
                options: [
                    { value: '1', label: 'Just Me', desc: 'Private lessons', icon: <User className="w-10 h-10" />, color: 'blue' },
                    { value: '2-5', label: '2-5 People', desc: 'Small group', icon: <Users className="w-10 h-10" />, color: 'green' },
                    { value: '6-15', label: '6-15 People', desc: 'Class', icon: <Users className="w-10 h-10" />, color: 'purple' },
                    { value: '15+', label: '15+ People', desc: 'Workshop', icon: <Building className="w-10 h-10" />, color: 'cyan' }
                ]
            }
        ],
        other: []
    };

    // Build dynamic questions based on selected project type
    const questions = useMemo(() => {
        const q = [baseQuestions.projectType];

        if (formData.projectType) {
            // Add type-specific questions
            const specificQs = typeSpecificQuestions[formData.projectType] || [];
            q.push(...specificQs);

            // Add common questions
            q.push(baseQuestions.projectName);
            q.push({
                id: 'description',
                icon: <Pencil className="w-8 h-8 text-cyan-500" />,
                question: 'Tell us more details',
                subtitle: getDescriptionSubtitle(formData.projectType),
                type: 'textarea',
                placeholder: getDescriptionPlaceholder(formData.projectType)
            });
            q.push(baseQuestions.timeline);
            q.push(baseQuestions.budget);
            q.push(baseQuestions.contact);
        }

        return q;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.projectType]);

    function getDescriptionSubtitle(type) {
        const subtitles = {
            website: 'Describe your ideal website',
            app: 'What should the app do?',
            shop: 'What products will you sell?',
            design: 'Describe your vision',
            security: 'What needs protection?',
            computer: 'Describe the issue or need',
            training: 'What do you want to achieve?',
            other: 'Tell us about your project'
        };
        return subtitles[type] || subtitles.other;
    }

    function getDescriptionPlaceholder(type) {
        const placeholders = {
            website: 'Example: I need a professional website for my restaurant with an online menu, table reservation system, and photo gallery of our dishes...',
            app: 'Example: I want an app where my customers can order food, track delivery, and pay with mobile money...',
            shop: 'Example: I sell handmade jewelry and want to reach customers across Cameroon with mobile money payments...',
            design: 'Example: I\'m starting a new tech company and need a modern logo, business cards, and social media graphics...',
            security: 'Example: I run an e-commerce site and want to make sure customer data is safe from hackers...',
            computer: 'Example: My laptop is very slow, crashes often, and I need help installing software for my business...',
            training: 'Example: I want to learn web development to build my own websites and maybe start freelancing...',
            other: 'Describe what you need help with in detail...'
        };
        return placeholders[type] || placeholders.other;
    }

    const handleNext = () => {
        if (isStepValid()) {
            setDirection('forward');
            setCurrentStep(prev => Math.min(prev + 1, questions.length));
        }
    };

    const handlePrevious = () => {
        setDirection('backward');
        setCurrentStep(prev => Math.max(prev - 1, 0));
    };

    const handleChoice = (value) => {
        const currentQuestion = questions[currentStep];
        setFormData(prev => ({ ...prev, [currentQuestion.id]: value }));

        if (currentQuestion.autoAdvance) {
            setTimeout(() => {
                setDirection('forward');
                setCurrentStep(prev => Math.min(prev + 1, questions.length));
            }, 300);
        }
    };

    const handleMultiChoice = (value) => {
        const currentQuestion = questions[currentStep];
        const currentValues = formData[currentQuestion.id] || [];
        const newValues = currentValues.includes(value)
            ? currentValues.filter(v => v !== value)
            : [...currentValues, value];
        setFormData(prev => ({ ...prev, [currentQuestion.id]: newValues }));
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const isStepValid = () => {
        const currentQuestion = questions[currentStep];
        if (!currentQuestion) return true;
        if (currentQuestion.type === 'choice') {
            return formData[currentQuestion.id] !== '' && formData[currentQuestion.id] !== undefined;
        } else if (currentQuestion.type === 'multiChoice') {
            return (formData[currentQuestion.id] || []).length > 0;
        } else if (currentQuestion.type === 'text' || currentQuestion.type === 'textarea') {
            return formData[currentQuestion.id]?.trim() !== '';
        } else if (currentQuestion.type === 'contact') {
            return formData.contactName?.trim() !== '' && formData.contactPhone?.trim() !== '';
        }
        return true;
    };

    const progress = questions.length > 0 ? ((currentStep) / questions.length) * 100 : 0;



    const getIconColor = (color) => {
        const colors = {
            cyan: 'text-cyan-500', blue: 'text-blue-500', purple: 'text-purple-500',
            green: 'text-green-500', red: 'text-red-500', orange: 'text-orange-500',
            pink: 'text-pink-500', gray: 'text-gray-500'
        };
        return colors[color] || 'text-cyan-500';
    };

    const getProjectLabel = (value) => {
        const labels = {
            website: 'Website', app: 'Mobile App', shop: 'Online Shop',
            design: 'Logo & Design', security: 'Cybersecurity', computer: 'Computer Help',
            training: 'Tech Training', other: 'Custom Project'
        };
        return labels[value] || value;
    };

    const getDetailedSummary = () => {
        let details = [];

        // Type-specific details
        if (formData.projectType === 'website') {
            if (formData.websitePages) details.push(`Pages: ${formData.websitePages}`);
            if (formData.websiteFeatures?.length) details.push(`Features: ${formData.websiteFeatures.join(', ')}`);
            if (formData.hasDomain) details.push(`Has Domain: ${formData.hasDomain}`);
        } else if (formData.projectType === 'app') {
            if (formData.appPlatform) details.push(`Platform: ${formData.appPlatform}`);
            if (formData.appFeatures?.length) details.push(`Features: ${formData.appFeatures.join(', ')}`);
        } else if (formData.projectType === 'shop') {
            if (formData.shopProducts) details.push(`Products: ${formData.shopProducts}`);
            if (formData.shopPayment) details.push(`Payment: ${formData.shopPayment}`);
        } else if (formData.projectType === 'design') {
            if (formData.designType?.length) details.push(`Design Work: ${formData.designType.join(', ')}`);
            if (formData.hasColors) details.push(`Has Colors: ${formData.hasColors}`);
        } else if (formData.projectType === 'security') {
            if (formData.securityType) details.push(`Service: ${formData.securityType}`);
        } else if (formData.projectType === 'computer') {
            if (formData.computerIssue) details.push(`Service: ${formData.computerIssue}`);
        } else if (formData.projectType === 'training') {
            if (formData.trainingTopic) details.push(`Topic: ${formData.trainingTopic}`);
            if (formData.trainingPeople) details.push(`People: ${formData.trainingPeople}`);
        }

        return details;
    };

    const generateWhatsAppMessage = () => {
        const projectLabel = getProjectLabel(formData.projectType);
        const details = getDetailedSummary();

        let message = `*NEW PROJECT REQUEST* 🚀

━━━━━━━━━━━━━━━━━━━━━

*SERVICE:* ${projectLabel}
*PROJECT NAME:* ${formData.projectName}

*SPECIFIC DETAILS:*
${details.length > 0 ? details.map(d => `• ${d}`).join('\n') : '• No additional details'}

*PROJECT DESCRIPTION:*
${formData.description}

*TIMELINE:* ${formData.timeline}
*BUDGET:* ${formData.budget}

━━━━━━━━━━━━━━━━━━━━━

*CONTACT INFORMATION:*
👤 Name: ${formData.contactName}
📱 Phone: ${formData.contactPhone}
${formData.contactEmail ? `📧 Email: ${formData.contactEmail}` : ''}

━━━━━━━━━━━━━━━━━━━━━

Looking forward to working together! 🙌

_Sent from XyberClan Website_`;

        return encodeURIComponent(message);
    };

    const generateEmailContent = () => {
        const projectLabel = getProjectLabel(formData.projectType);
        const details = getDetailedSummary();

        const subject = `New ${projectLabel} Project: ${formData.projectName}`;
        const body = `NEW PROJECT REQUEST

SERVICE: ${projectLabel}
PROJECT NAME: ${formData.projectName}

SPECIFIC DETAILS:
${details.length > 0 ? details.map(d => `- ${d}`).join('\n') : '- No additional details'}

PROJECT DESCRIPTION:
${formData.description}

TIMELINE: ${formData.timeline}
BUDGET: ${formData.budget}

CONTACT INFORMATION:
- Name: ${formData.contactName}
- Phone: ${formData.contactPhone}
- Email: ${formData.contactEmail || 'Not provided'}

---
Sent from XyberClan Website`;

        return { subject: encodeURIComponent(subject), body: encodeURIComponent(body) };
    };

    const handleWhatsAppSend = () => {
        window.open(`https://wa.me/237654269488?text=${generateWhatsAppMessage()}`, '_blank');
    };

    const handleEmailSend = () => {
        const { subject, body } = generateEmailContent();
        window.location.href = `mailto:contact@xyberclan.com?subject=${subject}&body=${body}`;
    };

    return (
        <div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-500`}>

            {/* ─── Header ─── */}
            <div className={`fixed top-0 left-0 right-0 z-50 px-4 py-4 transition-all duration-300 ${isDark ? 'bg-black/80 backdrop-blur-xl' : 'bg-white/80 backdrop-blur-xl'}`}>
                <div className="max-w-3xl mx-auto flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <img src={getLogo()} alt="XyberClan" className="w-9 h-9 object-contain rounded-xl" />
                        <span className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>
                            Xyber<span className="text-cyan-500">Clan</span>
                        </span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <span className={`hidden sm:inline text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            Step {currentStep + 1} of {questions.length}
                        </span>
                        <button onClick={toggleTheme} className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${isDark ? 'bg-white/5 text-yellow-400 hover:bg-white/10' : 'bg-black/5 text-blue-600 hover:bg-black/10'}`}>
                            {isDark ? <Sun size={16} /> : <Moon size={16} />}
                        </button>
                        <Link to="/" className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-black/5 hover:bg-black/10'}`}>
                            <Home size={16} />
                        </Link>
                    </div>
                </div>
            </div>

            {/* ─── Progress Bar ─── */}
            <div className="fixed top-[60px] left-0 right-0 z-40 px-4 py-2">
                <div className="max-w-3xl mx-auto">
                    <div className={`h-1 rounded-full overflow-hidden ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
                        <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
                    </div>
                </div>
            </div>

            {/* ─── Main Content ─── */}
            <div className="pt-28 pb-20 px-4">
                <div className="max-w-3xl mx-auto">
                    {currentStep < questions.length ? (
                        <div key={`${formData.projectType}-${currentStep}`} className={`${direction === 'forward' ? 'animate-slide-in-right' : 'animate-slide-in-left'}`}>

                            {/* Question Header */}
                            <div className="text-center mb-10">
                                {questions[currentStep].icon && (
                                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5 ${isDark ? 'bg-cyan-500/10' : 'bg-cyan-50'}`}>
                                        {questions[currentStep].icon}
                                    </div>
                                )}
                                <h1 className="text-3xl md:text-5xl font-black mb-3 tracking-tight leading-[1.1]" style={{ fontFamily: "'Inter', sans-serif" }}>
                                    {questions[currentStep].question}
                                </h1>
                                <p className={`text-base md:text-lg ${isDark ? 'text-gray-500' : 'text-gray-500'}`} style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
                                    {questions[currentStep].subtitle}
                                </p>
                            </div>

                            {/* ── Choice Cards ── */}
                            {questions[currentStep].type === 'choice' && (
                                <div className={`grid gap-3 ${questions[currentStep].options.length > 4 ? 'grid-cols-2' : 'grid-cols-2'}`}>
                                    {questions[currentStep].options.map((option) => {
                                        const isSelected = formData[questions[currentStep].id] === option.value;
                                        return (
                                            <button key={option.value} onClick={() => handleChoice(option.value)}
                                                className={`group relative p-5 rounded-2xl border transition-all duration-300 text-center hover:scale-[1.02] active:scale-[0.98] overflow-hidden
                                                    ${isSelected
                                                        ? `border-cyan-500/60 shadow-lg shadow-cyan-500/10 ${isDark ? 'bg-cyan-500/8' : 'bg-cyan-50'}`
                                                        : `${isDark ? 'border-white/8 hover:border-white/20 bg-white/[0.02]' : 'border-gray-200 hover:border-gray-300 bg-white'}`
                                                    }`}>
                                                {isSelected && (
                                                    <div className="absolute top-3 right-3">
                                                        <div className="w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center">
                                                            <Check className="w-3 h-3 text-white" />
                                                        </div>
                                                    </div>
                                                )}
                                                <div className={`${getIconColor(option.color)} mb-3 flex justify-center transition-transform duration-300 group-hover:scale-110`}>
                                                    {React.cloneElement(option.icon, { className: 'w-8 h-8' })}
                                                </div>
                                                <h3 className="text-base font-bold mb-0.5 tracking-tight">{option.label}</h3>
                                                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{option.desc}</p>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {/* ── Multi Choice ── */}
                            {questions[currentStep].type === 'multiChoice' && (
                                <>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                                        {questions[currentStep].options.map((option) => {
                                            const isSelected = (formData[questions[currentStep].id] || []).includes(option.value);
                                            return (
                                                <button key={option.value} onClick={() => handleMultiChoice(option.value)}
                                                    className={`group relative p-4 rounded-2xl border transition-all duration-300 text-center hover:scale-[1.02]
                                                        ${isSelected
                                                            ? `border-cyan-500/60 shadow-md shadow-cyan-500/10 ${isDark ? 'bg-cyan-500/8' : 'bg-cyan-50'}`
                                                            : `${isDark ? 'border-white/8 hover:border-white/20' : 'border-gray-200 hover:border-gray-300 bg-white'}`
                                                        }`}>
                                                    {isSelected && (
                                                        <div className="absolute top-2 right-2">
                                                            <div className="w-4 h-4 rounded-full bg-cyan-500 flex items-center justify-center">
                                                                <Check className="w-2.5 h-2.5 text-white" />
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div className={`mb-2 flex justify-center ${isSelected ? 'text-cyan-500' : isDark ? 'text-gray-400' : 'text-gray-500'}`}>{option.icon}</div>
                                                    <span className="font-semibold text-sm">{option.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div className="flex justify-center mt-8">
                                        <button onClick={handleNext} disabled={!isStepValid()}
                                            className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm transition-all ${isStepValid()
                                                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/30 hover:scale-[1.03]'
                                                : `${isDark ? 'bg-white/5 text-gray-600' : 'bg-gray-200 text-gray-400'} cursor-not-allowed`}`}>
                                            Continue <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* ── Text Input ── */}
                            {questions[currentStep].type === 'text' && (
                                <div className={`rounded-2xl p-6 border ${isDark ? 'bg-white/[0.02] border-white/8' : 'bg-white border-gray-200 shadow-sm'}`}>
                                    <input type="text" value={formData[questions[currentStep].id] || ''} onChange={(e) => handleInputChange(questions[currentStep].id, e.target.value)}
                                        placeholder={questions[currentStep].placeholder} autoFocus
                                        className={`w-full px-0 py-3 text-xl font-medium bg-transparent border-0 border-b ${isDark ? 'border-white/10 focus:border-cyan-500 text-white placeholder-gray-600' : 'border-gray-200 focus:border-cyan-500 text-gray-900 placeholder-gray-400'} focus:outline-none transition-colors`}
                                        style={{ fontFamily: "'Inter', sans-serif" }} />
                                </div>
                            )}

                            {/* ── Textarea ── */}
                            {questions[currentStep].type === 'textarea' && (
                                <div className={`rounded-2xl p-6 border ${isDark ? 'bg-white/[0.02] border-white/8' : 'bg-white border-gray-200 shadow-sm'}`}>
                                    <textarea value={formData[questions[currentStep].id] || ''} onChange={(e) => handleInputChange(questions[currentStep].id, e.target.value)}
                                        placeholder={questions[currentStep].placeholder} rows={5} autoFocus
                                        className={`w-full px-0 py-3 text-base bg-transparent border-0 resize-none ${isDark ? 'text-white placeholder-gray-600' : 'text-gray-900 placeholder-gray-400'} focus:outline-none`}
                                        style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }} />
                                </div>
                            )}

                            {/* ── Contact Fields ── */}
                            {questions[currentStep].type === 'contact' && (
                                <div className={`rounded-2xl p-6 border space-y-5 ${isDark ? 'bg-white/[0.02] border-white/8' : 'bg-white border-gray-200 shadow-sm'}`}>
                                    {questions[currentStep].fields.map((field) => (
                                        <div key={field.id}>
                                            <label className={`block text-xs font-bold uppercase tracking-[0.12em] mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{field.label}</label>
                                            <div className="relative">
                                                <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{field.icon}</div>
                                                <input type={field.type} value={formData[field.id] || ''} onChange={(e) => handleInputChange(field.id, e.target.value)} placeholder={field.placeholder}
                                                    className={`w-full pl-11 pr-4 py-3.5 rounded-xl border text-base transition-all ${isDark ? 'bg-white/[0.03] border-white/8 focus:border-cyan-500 text-white placeholder-gray-600' : 'bg-gray-50/50 border-gray-200 focus:border-cyan-500 text-gray-900 placeholder-gray-400'} focus:outline-none`}
                                                    style={{ fontFamily: "'Inter', sans-serif" }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* ── Navigation Buttons ── */}
                            {!questions[currentStep].autoAdvance && questions[currentStep].type !== 'multiChoice' && (
                                <div className="flex justify-between items-center mt-8">
                                    <button onClick={handlePrevious} className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all ${currentStep === 0 ? 'opacity-0 pointer-events-none' : ''} ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-black/5 hover:bg-black/10'}`}>
                                        <ChevronLeft className="w-4 h-4" /> Back
                                    </button>
                                    <button onClick={handleNext} disabled={!isStepValid()}
                                        className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm transition-all ${isStepValid()
                                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/30 hover:scale-[1.03]'
                                            : `${isDark ? 'bg-white/5 text-gray-600' : 'bg-gray-200 text-gray-400'} cursor-not-allowed`}`}>
                                        Continue <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            )}

                            {questions[currentStep].autoAdvance && currentStep > 0 && (
                                <div className="flex justify-center mt-8">
                                    <button onClick={handlePrevious} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-black/5 hover:bg-black/10'}`}>
                                        <ChevronLeft className="w-4 h-4" /> Go Back
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* ── Summary ── */
                        <div className="animate-slide-in-right">
                            <div className="text-center mb-10">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 mb-5 shadow-lg shadow-green-500/20">
                                    <Check className="w-8 h-8 text-white" />
                                </div>
                                <h1 className="text-3xl md:text-5xl font-black mb-3 tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>All Set!</h1>
                                <p className={`text-base ${isDark ? 'text-gray-500' : 'text-gray-500'}`} style={{ fontWeight: 300 }}>We'll get back to you within 24 hours</p>
                            </div>

                            {/* Summary Card */}
                            <div className={`rounded-2xl p-6 mb-8 border ${isDark ? 'bg-white/[0.02] border-white/8' : 'bg-white border-gray-200 shadow-sm'}`}>
                                <div className="space-y-0">
                                    {[
                                        { label: 'Service', value: getProjectLabel(formData.projectType) },
                                        { label: 'Project', value: formData.projectName },
                                        ...getDetailedSummary().map(detail => ({
                                            label: detail.split(':')[0],
                                            value: detail.split(':')[1]
                                        })),
                                        { label: 'Timeline', value: formData.timeline },
                                        { label: 'Contact', value: formData.contactName }
                                    ].map((item, i, arr) => (
                                        <div key={i} className={`flex justify-between items-center py-3.5 ${i < arr.length - 1 ? `border-b ${isDark ? 'border-white/5' : 'border-gray-100'}` : ''}`}>
                                            <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{item.label}</span>
                                            <span className="font-bold text-sm">{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <button onClick={handleWhatsAppSend} className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl font-bold text-base transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-green-500/20">
                                    <MessageCircle className="w-5 h-5" /> Send via WhatsApp <ArrowRight className="w-4 h-4" />
                                </button>
                                <button onClick={handleEmailSend} className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-4 rounded-xl font-bold text-base transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-cyan-500/20">
                                    <Mail className="w-5 h-5" /> Send via Email <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex justify-center mt-6">
                                <button onClick={handlePrevious} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-black/5 hover:bg-black/10'}`}>
                                    <ChevronLeft className="w-4 h-4" /> Edit Answers
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── Step Dots ── */}
                    {questions.length > 0 && (
                        <div className="flex justify-center gap-1.5 mt-10">
                            {questions.map((_, idx) => (
                                <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentStep ? 'w-7 bg-cyan-500' : idx < currentStep ? 'w-1.5 bg-cyan-500/40' : `w-1.5 ${isDark ? 'bg-white/10' : 'bg-black/10'}`}`} />
                            ))}
                            <div className={`h-1.5 w-1.5 rounded-full ${currentStep === questions.length ? 'bg-green-500' : isDark ? 'bg-white/10' : 'bg-black/10'}`} />
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes slideInRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
                @keyframes slideInLeft { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
                .animate-slide-in-right { animation: slideInRight 0.4s cubic-bezier(0.16,1,0.3,1); }
                .animate-slide-in-left { animation: slideInLeft 0.4s cubic-bezier(0.16,1,0.3,1); }
            `}</style>
        </div>
    );
};

export default ProjectForm;

