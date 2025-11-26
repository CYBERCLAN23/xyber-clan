import React, { useState } from 'react';
import { Shield, Eye, Zap, Cloud, FileCheck, Headphones, Lock, Target, ChevronRight, Menu, X, Sun, Moon } from 'lucide-react';

const XyberClanWebsite = () => {
  const [theme, setTheme] = useState('dark');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
      {/* Navigation */}
      <nav className={`fixed w-full z-50 ${isDark ? 'bg-black/90' : 'bg-white/90'} backdrop-blur-sm border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold">
                <span className={isDark ? 'text-white' : 'text-gray-900'}>Xyber</span>
                <span className="text-cyan-400">Clan</span>
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className={`${isDark ? 'text-white hover:text-cyan-400' : 'text-gray-900 hover:text-cyan-600'} transition-colors`}>Home</a>
              <a href="#about" className={`${isDark ? 'text-white hover:text-cyan-400' : 'text-gray-900 hover:text-cyan-600'} transition-colors`}>About</a>
              <a href="#services" className={`${isDark ? 'text-white hover:text-cyan-400' : 'text-gray-900 hover:text-cyan-600'} transition-colors`}>Services</a>
              <a href="#contact" className={`${isDark ? 'text-white hover:text-cyan-400' : 'text-gray-900 hover:text-cyan-600'} transition-colors`}>Contact</a>
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden ${isDark ? 'bg-gray-900' : 'bg-white'} border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
            <div className="px-4 py-4 space-y-3">
              <a href="#home" className="block py-2">Home</a>
              <a href="#about" className="block py-2">About</a>
              <a href="#services" className="block py-2">Services</a>
              <a href="#contact" className="block py-2">Contact</a>
              <button onClick={toggleTheme} className="flex items-center space-x-2 py-2">
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                <span>Toggle Theme</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className={`pt-32 pb-20 px-4 ${isDark ? 'bg-black' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Your Trusted <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Tech Partner</span> in Cameroon
          </h1>
          <p className={`text-lg md:text-xl mb-6 max-w-3xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            From web development to cybersecurity, graphic design to network infrastructure — XyberClan delivers comprehensive technology solutions that empower your business to thrive in the digital age.
          </p>
          <div className={`flex flex-wrap gap-6 justify-center mb-8 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <div className="flex items-center space-x-2">
              <span className="text-cyan-400 font-bold text-xl">✓</span>
              <span>University-Trained Experts</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-cyan-400 font-bold text-xl">✓</span>
              <span>6 Core Service Domains</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-cyan-400 font-bold text-xl">✓</span>
              <span>Based in Yaoundé</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 hover:-translate-y-0.5">
              <span className="flex items-center justify-center gap-2">
                Start Your Project
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button className={`${isDark ? 'border-gray-700 hover:border-cyan-400 text-white bg-gray-900/50' : 'border-gray-300 hover:border-cyan-600 text-gray-900 bg-white'} border-2 px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5`}>
              Explore Services
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className={`py-20 px-4 ${isDark ? 'bg-gray-950' : 'bg-gray-100'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              About <span className="text-cyan-400">XyberClan</span>
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              We're a dynamic tech collective based in Yaoundé, Cameroon, founded by passionate Computer Science (INF) students at the University of Yaoundé 1. Our team combines academic excellence with real-world expertise to deliver professional technology solutions across all domains.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'Mission',
                desc: 'Empower businesses and individuals with comprehensive technology solutions that drive growth and innovation.'
              },
              {
                icon: <Eye className="w-8 h-8" />,
                title: 'Vision',
                desc: 'To be Cameroon\'s leading tech partner, making cutting-edge technology accessible to everyone.'
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'Why XyberClan',
                desc: 'Complete tech solutions under one roof, from development to design, hardware to education.'
              }
            ].map((item, idx) => (
              <div key={idx} className={`group ${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-800 border-gray-800' : 'bg-white border-gray-200'} p-8 rounded-2xl border hover:border-cyan-400 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-1`}>
                <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 w-16 h-16 rounded-xl flex items-center justify-center mb-4 text-cyan-400 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>{item.desc}</p>
              </div>
            ))}
          </div>

          {/* The Clan */}
          <div className={`${isDark ? 'bg-gradient-to-r from-cyan-900/20 to-blue-900/20' : 'bg-gradient-to-r from-cyan-100 to-blue-100'} rounded-xl p-8 md:p-12`}>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl font-bold mb-4">The Clan</h3>
                <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Founded by Computer Science students at the University of Yaoundé 1, XyberClan is a team of tech enthusiasts with expertise across all technology domains. We're active in the tech community, regularly participating in workshops, hackathons, and training events across Cameroon.
                </p>
                <ul className="space-y-3">
                  {['Full-Stack Web Developers (React, Node.js, Next.js)', 'Mobile App Developers (React Native, Flutter)', 'Graphic Designers & UI/UX Experts (Adobe Suite, Figma)', 'Hardware & Network Technicians (Computer Repair, Network Setup)', 'Cybersecurity Specialists (Penetration Testing, Security Audits)', 'Tech Educators & Trainers (All Tech Domains)'].map((item, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <ChevronRight className="w-5 h-5 text-cyan-400" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`relative rounded-2xl h-64 overflow-hidden ${isDark ? 'bg-gradient-to-br from-cyan-900/30 via-blue-900/30 to-purple-900/30' : 'bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50'}`}>
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <img src="/team/logo.jpg" alt="XyberClan Logo" className="w-full h-full object-contain drop-shadow-2xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className={`py-20 px-4 ${isDark ? 'bg-black' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Our <span className="text-cyan-400">Services</span>
            </h2>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Comprehensive technology solutions across 6 core domains — from development to deployment, design to security.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Target className="w-6 h-6" />,
                title: 'Web & App Development',
                desc: 'Custom websites, web applications, e-commerce platforms, and mobile apps for iOS and Android. Built with modern technologies like React, Next.js, Node.js, React Native, and Flutter for scalable, high-performance solutions.'
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: 'Graphic Design & Branding',
                desc: 'Professional logo design, complete brand identity packages, business flyers, marketing materials, infographics, UI/UX design, and graphical charts. We create visual content that elevates your brand and communicates your message effectively.'
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: 'Cybersecurity Solutions',
                desc: 'Comprehensive security audits, penetration testing, vulnerability assessments, security consulting, and enterprise network protection. We identify threats and implement robust security strategies to protect your digital assets.'
              },
              {
                icon: <Cloud className="w-6 h-6" />,
                title: 'Hardware & Computer Services',
                desc: 'Computer maintenance and repair, hardware troubleshooting, machine diagnostics, component upgrades, and comprehensive technical support for all your hardware needs. Fast, reliable service for businesses and individuals.'
              },
              {
                icon: <FileCheck className="w-6 h-6" />,
                title: 'Network Infrastructure',
                desc: 'Enterprise network setup and installation, printer and machine configuration in establishments, network maintenance, structured cabling, WiFi deployment, and ongoing network management to keep your business connected.'
              },
              {
                icon: <Headphones className="w-6 h-6" />,
                title: 'Tech Education & Training',
                desc: 'Comprehensive training programs across all technology domains including network maintenance, programming, cybersecurity, hardware repair, and software development. One-on-one mentoring and group workshops for all skill levels.'
              }
            ].map((service, idx) => (
              <div key={idx} className={`group ${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-800/50 border-gray-800' : 'bg-white border-gray-200'} p-6 rounded-2xl border hover:border-cyan-400 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-2`}>
                <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-cyan-400 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team in Action Section */}
      <section className={`py-20 px-4 ${isDark ? 'bg-gray-950' : 'bg-gray-100'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Our Team <span className="text-cyan-400">in Action</span>
            </h2>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Active members of Cameroon's tech community, regularly participating in workshops, hackathons, and collaborative coding sessions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                image: '/team/team-coding-1.jpg',
                title: 'Hands-On Coding Sessions',
                desc: 'Our team members actively engaged in collaborative coding and problem-solving sessions.'
              },
              {
                image: '/team/team-python.jpg',
                title: 'Python Workshop Participation',
                desc: 'Continuous learning and skill development through community workshops and training events.'
              },
              {
                image: '/team/team-coding-2.jpg',
                title: 'Technical Collaboration',
                desc: 'Working together on real-world projects and technical challenges.'
              },
              {
                image: '/team/team-group.jpg',
                title: 'Tech Community Engagement',
                desc: 'Building connections and sharing knowledge within Cameroon\'s growing tech ecosystem.'
              }
            ].map((item, idx) => (
              <div key={idx} className={`group ${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-800 border-gray-800' : 'bg-white border-gray-200'} border rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 hover:-translate-y-1`}>
                <div className="h-64 overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className={`py-20 px-4 ${isDark ? 'bg-gray-950' : 'bg-gray-100'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Our <span className="text-cyan-400">Tech Stack</span>
            </h2>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Modern technologies and professional tools we use to deliver exceptional results.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                name: 'Modern Web Technologies',
                desc: 'We build with the latest and most powerful web technologies to ensure your projects are fast, scalable, and maintainable.',
                features: ['React, Next.js, and Vue.js for dynamic interfaces', 'Node.js and Express for robust backends', 'Tailwind CSS and modern styling solutions']
              },
              {
                name: 'Mobile Development',
                desc: 'Cross-platform and native mobile development using industry-standard frameworks.',
                features: ['React Native for cross-platform apps', 'Native iOS and Android development', 'Flutter for beautiful, fast applications']
              },
              {
                name: 'Design Tools',
                desc: 'Professional design software to create stunning visuals and user experiences.',
                features: ['Adobe Creative Suite (Photoshop, Illustrator)', 'Figma for UI/UX design and prototyping', 'Canva and other modern design tools']
              },
              {
                name: 'Development & Collaboration',
                desc: 'Industry-standard tools for version control, project management, and team collaboration.',
                features: ['Git and GitHub for version control', 'Agile project management methodologies', 'Continuous integration and deployment']
              }
            ].map((tech, idx) => (
              <div key={idx} className={`group ${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-800 border-gray-800' : 'bg-white border-gray-200'} p-8 rounded-2xl border hover:border-cyan-400 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10`}>
                <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-cyan-400 group-hover:scale-110 transition-transform duration-300">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{tech.name}</h3>
                <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{tech.desc}</p>
                <ul className="space-y-2">
                  {tech.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-start space-x-2">
                      <ChevronRight className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className={`py-20 px-4 ${isDark ? 'bg-black' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              What We <span className="text-cyan-400">Deliver</span>
            </h2>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Professional technology solutions that drive real results for businesses and individuals across Cameroon.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                category: 'Web Development',
                title: 'Modern Business Websites',
                desc: 'Custom-built responsive websites with modern designs, fast performance, and seamless user experiences. From landing pages to full e-commerce platforms.',
                result: 'Professional online presence that converts visitors to customers'
              },
              {
                category: 'Graphic Design',
                title: 'Complete Brand Identity',
                desc: 'Professional logos, business flyers, marketing materials, and complete visual identity packages that make your brand stand out in the market.',
                result: 'Memorable branding that attracts and retains customers'
              },
              {
                category: 'IT Infrastructure',
                title: 'Enterprise Network Solutions',
                desc: 'Complete network setup and maintenance for businesses, including printer installation, hardware configuration, and ongoing technical support.',
                result: 'Reliable IT infrastructure that keeps your business running smoothly'
              }
            ].map((story, idx) => (
              <div key={idx} className={`group ${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-800 border-gray-800' : 'bg-white border-gray-200'} border rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 hover:-translate-y-1`}>
                <div className={`${isDark ? 'bg-gradient-to-br from-cyan-900/20 to-blue-900/20' : 'bg-gradient-to-br from-cyan-50 to-blue-50'} h-48 flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                  <Shield className="w-16 h-16 text-cyan-400/30" />
                </div>
                <div className="p-6">
                  <span className="text-cyan-400 text-sm font-semibold">{story.category}</span>
                  <h3 className="text-xl font-bold mt-2 mb-3">{story.title}</h3>
                  <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{story.desc}</p>
                  <div className={`${isDark ? 'bg-cyan-900/20' : 'bg-cyan-50'} p-3 rounded-lg`}>
                    <p className="text-sm font-semibold text-cyan-400">Outcome:</p>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{story.result}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button className="text-cyan-400 hover:text-cyan-300 font-semibold inline-flex items-center space-x-2">
              <span>Start Your Project Today</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Latest Insights */}
      <section className={`py-20 px-4 ${isDark ? 'bg-gray-950' : 'bg-gray-100'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Tech <span className="text-cyan-400">Insights</span>
            </h2>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Stay updated with the latest trends, best practices, and insights across all technology domains.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                category: 'Web Development',
                date: 'Nov 2024',
                title: 'Modern Web Development with React and Next.js',
                desc: 'Discover how modern frameworks like React and Next.js are transforming web development with better performance and user experiences.'
              },
              {
                category: 'Design Trends',
                date: 'Nov 2024',
                title: 'Creating Effective Brand Identity in 2024',
                desc: 'Learn the essential elements of memorable brand design, from logos to complete visual identity systems that resonate with your audience.'
              },
              {
                category: 'Cybersecurity',
                date: 'Nov 2024',
                title: 'Essential Security Practices for Small Businesses',
                desc: 'Protect your business with fundamental cybersecurity practices including network security, data protection, and employee training.'
              }
            ].map((article, idx) => (
              <div key={idx} className={`group ${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-800 border-gray-800' : 'bg-white border-gray-200'} border rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 hover:-translate-y-1`}>
                <div className={`${isDark ? 'bg-gradient-to-br from-cyan-900/20 to-purple-900/20' : 'bg-gradient-to-br from-cyan-50 to-purple-50'} h-48 flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                  <Lock className="w-16 h-16 text-cyan-400/30" />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-cyan-400 text-sm font-semibold">{article.category}</span>
                    <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{article.date}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{article.title}</h3>
                  <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{article.desc}</p>
                  <button className="text-cyan-400 hover:text-cyan-300 font-semibold text-sm inline-flex items-center space-x-1">
                    <span>Learn More</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button className={`${isDark ? 'border-gray-700 hover:border-cyan-400' : 'border-gray-300 hover:border-cyan-600'} border-2 px-6 py-3 rounded-lg font-semibold transition-colors`}>
              Explore More Insights
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className={`py-20 px-4 ${isDark ? 'bg-black' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Get <span className="text-cyan-400">Started</span>
            </h2>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Ready to bring your tech project to life? Contact us today for a consultation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h3 className="text-2xl font-bold mb-6">Contact Us</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    className={`${isDark ? 'bg-gray-900 border-gray-800 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} border rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-400`}
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    className={`${isDark ? 'bg-gray-900 border-gray-800 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} border rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-400`}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Company Name"
                  className={`${isDark ? 'bg-gray-900 border-gray-800 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-400`}
                />
                <select className={`${isDark ? 'bg-gray-900 border-gray-800 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-400`}>
                  <option>Select a service</option>
                  <option>Web Development</option>
                  <option>App Development</option>
                  <option>Graphic Design</option>
                  <option>Hardware Services</option>
                  <option>Cybersecurity</option>
                  <option>Tech Education</option>
                </select>
                <textarea
                  placeholder="Tell us about your project or tech needs..."
                  rows="4"
                  className={`${isDark ? 'bg-gray-900 border-gray-800 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-400`}
                ></textarea>
                <div className="flex items-start space-x-2">
                  <input type="checkbox" id="agree" className="mt-1" />
                  <label htmlFor="agree" className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    I agree to the privacy policy and terms of service
                  </label>
                </div>
                <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-lg font-semibold transition-colors">
                  Submit Request
                </button>
                <p className={`text-xs text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  🔒 Secure Form - Your information is encrypted
                </p>
              </form>
            </div>

            {/* Why Choose & Emergency */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-6">Why Choose XyberClan</h3>
                <div className="space-y-4">
                  {[
                    {
                      icon: <Shield className="w-5 h-5" />,
                      title: 'Local Expertise',
                      desc: 'Based in Yaoundé, we understand the local market and provide personalized service to businesses across Cameroon.'
                    },
                    {
                      icon: <Eye className="w-5 h-5" />,
                      title: 'Complete Solutions',
                      desc: 'From development to design, hardware to education - get all your tech needs met under one roof.'
                    },
                    {
                      icon: <Lock className="w-5 h-5" />,
                      title: 'Student Innovation',
                      desc: 'Founded by passionate INF students, we bring fresh perspectives and cutting-edge knowledge to every project.'
                    }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <div className="bg-cyan-500/10 p-2 rounded-lg text-cyan-400 flex-shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="font-bold mb-1">{item.title}</h4>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl p-6 text-white">
                <h4 className="text-xl font-bold mb-2">Get In Touch</h4>
                <p className="text-sm mb-4 text-cyan-50">
                  Have a project in mind or need tech support? We're here to help!
                </p>
                <div className="space-y-2">
                  <a href="tel:+237673806298" className="flex items-center space-x-2 text-white hover:text-cyan-100">
                    <span>📞</span>
                    <span className="font-semibold">+237 673806298</span>
                  </a>
                  <a href="mailto:xyberclan@gmail.com" className="flex items-center space-x-2 text-white hover:text-cyan-100">
                    <span>✉️</span>
                    <span className="font-semibold">xyberclan@gmail.com</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`${isDark ? 'bg-gray-950 border-gray-900' : 'bg-gray-900 text-white'} border-t py-12 px-4`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="text-2xl font-bold mb-4">
                <span className="text-white">Xyber</span>
                <span className="text-cyan-400">Clan</span>
              </div>
              <p className="text-gray-400 text-sm mb-4">Building Digital Dreams in Yaoundé</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Solutions */}
            <div>
              <h4 className="font-bold mb-4 text-white">Solutions</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Threat Intelligence</a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Penetration Testing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Incident Response</a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Cloud Security</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-bold mb-4 text-white">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Partners</a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">News</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-bold mb-4 text-white">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Whitepapers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Case Studies</a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Documentation</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-bold mb-4 text-white">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 XyberClan — Building Digital Dreams in Yaoundé, Cameroon. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default XyberClanWebsite;