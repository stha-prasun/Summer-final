import { useEffect, useRef, useState } from 'react';
import { FaPaperPlane, FaEnvelope, FaPhone, FaLocationDot, FaGithub, FaDiscord, FaXTwitter } from 'react-icons/fa6';
import toast from 'react-hot-toast';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

gsap.registerPlugin(ScrollTrigger);

const infoCards = [
  {
    icon: FaEnvelope,
    title: 'Email',
    value: 'hello@wheelsrus.com',
    href: 'mailto:hello@wheelsrus.com',
    color: 'from-red-500/20 to-amber-500/20',
    border: 'border-red-500/20',
    accent: 'bg-red-500',
  },
  {
    icon: FaPhone,
    title: 'Phone',
    value: '+1 (555) 123-4567',
    href: 'tel:+15551234567',
    color: 'from-blue-500/20 to-cyan-500/20',
    border: 'border-blue-500/20',
    accent: 'bg-blue-500',
  },
  {
    icon: FaLocationDot,
    title: 'Location',
    value: 'Los Angeles, CA',
    href: null,
    color: 'from-amber-500/20 to-yellow-500/20',
    border: 'border-amber-500/20',
    accent: 'bg-amber-500',
  },
];

const Contact = () => {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const formRef = useRef(null);
  const infoRefs = useRef([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success("Message sent! We'll get back to you soon.");
    setFormData({ name: '', email: '', subject: '', message: '' });
    setSubmitting(false);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        y: 60,
        opacity: 0,
        duration: 1.4,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top 85%',
          end: 'top 40%',
          scrub: 1.5,
        },
      });

      gsap.from(formRef.current, {
        x: -60,
        opacity: 0,
        duration: 1.2,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: formRef.current,
          start: 'top 85%',
          end: 'top 40%',
          scrub: 1.2,
        },
      });

      infoRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.from(el, {
          x: 60,
          opacity: 0,
          duration: 1,
          ease: 'power4.out',
          delay: i * 0.15,
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            end: 'top 40%',
            scrub: 1.2,
          },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  const inputClass =
    'w-full bg-black/40 border border-zinc-800 rounded-none px-4 py-3.5 font-body text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-red-500/50 transition-colors duration-300';

  return (
    <>
      <Navbar />
      <section ref={sectionRef} className="relative bg-neutral-950 min-h-screen pt-32 pb-32 md:pt-40 md:pb-40 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.03) 40px, rgba(255,255,255,0.03) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.03) 40px, rgba(255,255,255,0.03) 41px)',
          }}
        />
        <div className="absolute top-0 left-1/4 right-1/4 h-full bg-gradient-to-b from-red-500/[0.02] to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 lg:px-12">
          <div ref={headerRef} className="mb-16 md:mb-20">
            <p className="font-body text-[10px] md:text-xs uppercase tracking-[0.45em] text-zinc-600 mb-4">
              Get in Touch
            </p>
            <h2 className="font-display text-5xl sm:text-6xl md:text-8xl lg:text-9xl text-white tracking-tight uppercase leading-[0.85]">
              Contact
              <br />
              <span className="text-red-500">Us</span>
            </h2>
            <div className="w-12 h-[2px] bg-zinc-800 mt-6" />
            <p className="font-body text-xs md:text-sm text-zinc-500 mt-6 max-w-md leading-relaxed">
              Have a question about a drop, a model, or just want to talk cars? Drop us a line.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-10">
            <div ref={formRef} className="lg:col-span-3">
              <div className="relative bg-neutral-900/80 border border-zinc-800/60 p-6 md:p-8">
                <span className="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full bg-zinc-700 shadow-inner shadow-black/60 border border-zinc-600" />
                <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-zinc-700 shadow-inner shadow-black/60 border border-zinc-600" />
                <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 rounded-full bg-zinc-700 shadow-inner shadow-black/60 border border-zinc-600" />
                <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 rounded-full bg-zinc-700 shadow-inner shadow-black/60 border border-zinc-600" />

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block font-body text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block font-body text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-body text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="What's this about?"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block font-body text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us what's on your mind..."
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full font-body text-[11px] uppercase tracking-[0.35em] text-white bg-red-500/90 hover:bg-red-500 disabled:opacity-50 px-8 py-4 transition-all duration-500 flex items-center justify-center gap-3 group"
                  >
                    {submitting ? (
                      <span className="flex items-center gap-3">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center gap-3">
                        Send Message
                        <FaPaperPlane className="text-xs group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                      </span>
                    )}
                  </button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-5 md:space-y-6">
              {infoCards.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    ref={(el) => (infoRefs.current[i] = el)}
                    className="group cursor-default"
                  >
                    <div className="relative bg-neutral-900/80 border border-zinc-800/60 p-6">
                      <span className="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full bg-zinc-700 shadow-inner shadow-black/60 border border-zinc-600" />
                      <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-zinc-700 shadow-inner shadow-black/60 border border-zinc-600" />
                      <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 rounded-full bg-zinc-700 shadow-inner shadow-black/60 border border-zinc-600" />
                      <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 rounded-full bg-zinc-700 shadow-inner shadow-black/60 border border-zinc-600" />

                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-full bg-gradient-to-br ${item.color} border ${item.border} flex items-center justify-center shrink-0`}
                        >
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-body text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                            {item.title}
                          </p>
                          {item.href ? (
                            <a
                              href={item.href}
                              className="font-body text-sm text-white hover:text-red-400 transition-colors duration-300 mt-0.5 block"
                            >
                              {item.value}
                            </a>
                          ) : (
                            <p className="font-body text-sm text-white mt-0.5">{item.value}</p>
                          )}
                        </div>
                      </div>

                      <div className={`w-8 h-0.5 ${item.accent} mt-4`} />

                      <div
                        className="absolute -inset-px rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{
                          border: `1px solid ${
                            i === 0
                              ? 'rgba(239,68,68,0.4)'
                              : i === 1
                                ? 'rgba(59,130,246,0.4)'
                                : 'rgba(245,158,11,0.4)'
                          }`,
                          boxShadow: `0 0 20px ${
                            i === 0
                              ? 'rgba(239,68,68,0.08)'
                              : i === 1
                                ? 'rgba(59,130,246,0.08)'
                                : 'rgba(245,158,11,0.08)'
                          }`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}

              <div className="relative bg-neutral-900/80 border border-zinc-800/60 p-6">
                <span className="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full bg-zinc-700 shadow-inner shadow-black/60 border border-zinc-600" />
                <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-zinc-700 shadow-inner shadow-black/60 border border-zinc-600" />
                <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 rounded-full bg-zinc-700 shadow-inner shadow-black/60 border border-zinc-600" />
                <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 rounded-full bg-zinc-700 shadow-inner shadow-black/60 border border-zinc-600" />

                <p className="font-body text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-3">Follow Us</p>
                <div className="flex items-center gap-4">
                  {[
                    { icon: FaGithub, label: 'GitHub' },
                    { icon: FaDiscord, label: 'Discord' },
                    { icon: FaXTwitter, label: 'X' },
                  ].map(({ icon: Icon, label }) => (
                    <a
                      key={label}
                      href="#"
                      aria-label={label}
                      className="w-10 h-10 rounded-full bg-black/40 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:border-red-500/30 transition-all duration-300"
                    >
                      <Icon size={16} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Contact;
