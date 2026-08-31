import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  FiArrowRight,
  FiStar,
  FiUsers,
  FiAward,
  FiCpu,
  FiBarChart2,
  FiBriefcase,
  FiZap,
  FiTarget,
  FiSmartphone,
} from 'react-icons/fi';

const Home = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-64px)] flex items-center bg-slate-900 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-medium mb-7">
              <span className="w-1.5 h-1.5 bg-teal-400 rounded-full" />
              Trusted by 10,000+ job seekers worldwide
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-[1.1] tracking-tight">
              Interview preparation,
              <span className="block text-transparent pb-3 bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
                engineered for offers.
              </span>
            </h1>

            <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Practice with realistic AI-driven mock interviews, receive precise feedback,
              and track your growth with a platform built for serious candidates.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-14">
              <Link
                to="/register"
                className="group inline-flex items-center gap-2 bg-white text-slate-900 px-7 py-3 rounded-lg font-semibold text-sm hover:bg-slate-100 transition-colors duration-200"
              >
                Get started for free
                <FiArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 border border-white/15 text-white px-7 py-3 rounded-lg font-semibold text-sm hover:bg-white/5 transition-colors duration-200"
              >
                Sign in
              </Link>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3 text-slate-400">
              <div className="flex items-center gap-2 text-sm">
                <FiStar className="text-amber-400" size={16} />
                <span className="font-medium">4.9/5 average rating</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FiUsers className="text-teal-400" size={16} />
                <span className="font-medium">10,000+ active users</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FiAward className="text-amber-400" size={16} />
                <span className="font-medium">95% success rate</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <span className="text-xs font-semibold text-teal-700 tracking-widest uppercase">
              Why Ascend
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3 mb-4">
              Everything you need to walk in prepared
            </h2>
            <p className="text-slate-500 leading-relaxed">
              A complete, structured toolkit for interview readiness — not another generic
              question bank.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white p-7 rounded-xl border border-slate-200 hover:border-teal-200 hover:shadow-md transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-lg bg-slate-900 flex items-center justify-center mb-5 group-hover:bg-teal-700 transition-colors duration-300">
                  <feature.icon className="text-white" size={19} />
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="py-14 bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-slate-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold text-teal-700 tracking-widest uppercase">
              Success stories
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">
              What our candidates say
            </h2>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-slate-50 p-8 md:p-10 rounded-2xl border border-slate-200">
              <div className="flex gap-1 mb-5 justify-center">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} size={16} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <blockquote className="text-lg text-slate-700 text-center mb-7 leading-relaxed">
                "{testimonials[currentTestimonial].quote}"
              </blockquote>
              <div className="flex items-center justify-center gap-3">
                <div className="w-11 h-11 rounded-full bg-teal-700 flex items-center justify-center text-white font-semibold text-sm">
                  {testimonials[currentTestimonial].name.charAt(0)}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-slate-900 text-sm">
                    {testimonials[currentTestimonial].name}
                  </div>
                  <div className="text-slate-500 text-xs">{testimonials[currentTestimonial].role}</div>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-6 gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  aria-label={`Show testimonial ${index + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${index === currentTestimonial ? 'bg-teal-700 w-7' : 'bg-slate-200 w-1.5 hover:bg-slate-300'
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-2xl px-8 py-14 md:py-16 text-center relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
            <div className="relative z-10 max-w-xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Ready to walk into your next interview prepared?
              </h2>
              <p className="text-slate-400 mb-8 text-sm leading-relaxed">
                Create your free account in under a minute and start practicing today.
              </p>
              <Link
                to="/register"
                className="group inline-flex items-center gap-2 bg-white text-slate-900 px-7 py-3 rounded-lg font-semibold text-sm hover:bg-slate-100 transition-colors duration-200"
              >
                Create your free account
                <FiArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const features = [
  {
    icon: FiCpu,
    title: 'AI-Powered Practice',
    description:
      'Realistic interview simulations with intelligent feedback and scoring that adapts to your skill level.',
  },
  {
    icon: FiBarChart2,
    title: 'Progress Tracking',
    description: 'Monitor your improvement with detailed analytics, performance metrics, and insights.',
  },
  {
    icon: FiBriefcase,
    title: 'Industry Specific',
    description: 'Tailored questions for tech, business, healthcare, finance, and 20+ other industries.',
  },
  {
    icon: FiZap,
    title: 'Instant Feedback',
    description: 'Get immediate, detailed feedback on your answers with clear suggestions for improvement.',
  },
  {
    icon: FiTarget,
    title: 'Personalized Learning',
    description: 'AI-driven recommendations based on your performance and career goals.',
  },
  {
    icon: FiSmartphone,
    title: 'Practice Anywhere',
    description: 'A fully responsive experience so you can prepare on desktop, tablet, or mobile.',
  },
];

const stats = [
  { value: '10,000+', label: 'Candidates coached' },
  { value: '250,000+', label: 'Mock interviews run' },
  { value: '95%', label: 'Report increased confidence' },
  { value: '4.9/5', label: 'Average user rating' },
];

const testimonials = [
  {
    quote:
      'Ascend helped me land my dream job at Google. The AI feedback was incredibly detailed and helped me identify my weak areas — I went from failing interviews to getting multiple offers.',
    name: 'Sarah Chen',
    role: 'Software Engineer at Google',
  },
  {
    quote:
      'The practice sessions are so realistic. I felt completely prepared for my actual interviews, and the progress tracking showed me exactly where I needed to improve.',
    name: 'Michael Rodriguez',
    role: 'Product Manager at Microsoft',
  },
  {
    quote:
      'As a career changer, I was nervous about technical interviews. The industry-specific questions and feedback gave me the confidence I needed to succeed.',
    name: 'Emily Johnson',
    role: 'Data Scientist at Amazon',
  },
  {
    quote:
      "The AI interviewer is incredibly smart and asks follow-up questions just like a real interviewer would. It's like having a personal interview coach available 24/7.",
    name: 'David Kim',
    role: 'Full Stack Developer at Netflix',
  },
];

export default Home;