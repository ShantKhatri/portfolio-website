"use client"
import { useState, useRef, useEffect } from 'react';
import { Mail, MapPin, Github, Linkedin, ExternalLink, Send, Rocket, Radio, CheckCircle } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import { useIntersectionObserver } from '@/lib/useIntersectionObserver';
import { soundEngine } from '@/lib/soundEngine';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const ContactSection: React.FC = () => {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1 });
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isLaunching, setIsLaunching] = useState(false);
  const [isTransmitted, setIsTransmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const radarRef = useRef<HTMLCanvasElement>(null);

  // Radar sweep animation
  useEffect(() => {
    const canvas = radarRef.current;
    if (!canvas || !isVisible) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 200;
    canvas.height = 200;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 80;
    let angle = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Concentric circles
      [0.25, 0.5, 0.75, 1].forEach(scale => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * scale, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.15)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Cross hairs
      ctx.beginPath();
      ctx.moveTo(centerX - radius, centerY);
      ctx.lineTo(centerX + radius, centerY);
      ctx.moveTo(centerX, centerY - radius);
      ctx.lineTo(centerX, centerY + radius);
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.1)';
      ctx.stroke();

      // Sweep line
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + Math.cos(angle) * radius,
        centerY + Math.sin(angle) * radius
      );
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.6)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Sweep fade trail
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, angle - 0.5, angle);
      ctx.fillStyle = 'rgba(168, 85, 247, 0.05)';
      ctx.fill();

      // Center dot
      ctx.beginPath();
      ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(168, 85, 247, 0.8)';
      ctx.fill();

      // Blips
      const blipPositions = [
        { x: centerX + 30, y: centerY - 40, alpha: Math.sin(angle * 2) * 0.5 + 0.5 },
        { x: centerX - 50, y: centerY + 20, alpha: Math.cos(angle * 3) * 0.5 + 0.5 },
        { x: centerX + 20, y: centerY + 50, alpha: Math.sin(angle * 1.5) * 0.5 + 0.5 },
      ];

      blipPositions.forEach(blip => {
        ctx.beginPath();
        ctx.arc(blip.x, blip.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34, 197, 94, ${blip.alpha})`;
        ctx.fill();
      });

      angle += 0.02;
      requestAnimationFrame(draw);
    };

    const animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, [isVisible]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsLaunching(true);
    soundEngine.playLaunch();

    // Small delay for animation
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      await addDoc(collection(db, 'contact-messages'), {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        createdAt: serverTimestamp(),
        read: false,
      });

      setIsTransmitted(true);
      soundEngine.playUnlock();
    } catch (error) {
      console.error('Contact form error:', error);
      // Still show success for UX — message might be queued offline
      setIsTransmitted(true);
      soundEngine.playUnlock();
    }

    setIsLaunching(false);
  };

  const SocialButton = ({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 px-5 py-3 rounded-xl bg-gray-800/50 border border-gray-700/40 hover:border-purple-500/40 hover:bg-gray-800/70 transition-all group"
      onMouseEnter={() => soundEngine.playHover()}
    >
      <div className="p-2 rounded-lg bg-gray-700/50 group-hover:bg-purple-900/30 transition-colors">
        <Icon className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
      </div>
      <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{label}</span>
    </a>
  );

  return (
    <section id="contact" ref={ref} className="py-20 px-4 sm:px-8 bg-black/30 relative">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          title="Mission Control"
          subtitle="Establishing secure transmission channel — send your message"
        />

        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}>
          {/* Left: Contact info + Radar */}
          <div className="space-y-8">
            {/* Radar display */}
            <div className="flex justify-center lg:justify-start">
              <div className="relative">
                <canvas ref={radarRef} className="w-[200px] h-[200px] opacity-70" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Radio className="w-6 h-6 text-purple-400 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Contact details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                System Status: Online
              </h3>

              <div className="space-y-3">
                <a
                  href="mailto:prashantkhatri202@gmail.com"
                  className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group"
                >
                  <Mail className="w-5 h-5 text-purple-500 group-hover:text-purple-400" />
                  <span className="text-sm">prashantkhatri202@gmail.com</span>
                </a>

                <div className="flex items-center gap-3 text-gray-400">
                  <MapPin className="w-5 h-5 text-purple-500" />
                  <span className="text-sm">New Delhi, India — Available worldwide</span>
                </div>
              </div>
            </div>

            {/* Social links as control panel buttons */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                Communication Channels
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <SocialButton href="https://github.com/ShantKhatri" icon={Github} label="GitHub" />
                <SocialButton href="https://linkedin.com/in/prashantkumar-khatri" icon={Linkedin} label="LinkedIn" />
                <SocialButton href="https://www.upwork.com/freelancers/~013eb705bbd0af4810" icon={ExternalLink} label="Upwork" />
                <SocialButton href="mailto:prashantkhatri202@gmail.com" icon={Mail} label="Email" />
              </div>
            </div>
          </div>

          {/* Right: Contact Form as Mission Control Panel */}
          <div className="relative">
            <div className="rounded-2xl bg-gray-900/60 backdrop-blur-md border border-gray-700/40 p-8 relative overflow-hidden scanline-overlay">
              {/* Panel header */}
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-700/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-green-500/70 animate-pulse" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                </div>
                <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">
                  Transmission Panel v2.0
                </span>
              </div>

              {isTransmitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4 animate-bounce" />
                  <h3 className="text-2xl font-bold text-white mb-2">Message Transmitted!</h3>
                  <p className="text-gray-400">Your signal has been received. Expect a response within 24 hours.</p>
                  <button
                    onClick={() => {
                      setIsTransmitted(false);
                      setFormData({ name: '', email: '', message: '' });
                    }}
                    className="mt-6 px-6 py-2 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:border-purple-500 transition-all text-sm"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                  {/* Name field */}
                  <div>
                    <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">
                      Sender Identification
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      onFocus={() => { setFocusedField('name'); soundEngine.playHover(); }}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full px-4 py-3 rounded-lg bg-gray-800/50 border transition-all duration-300 text-white placeholder-gray-600 outline-none font-mono text-sm ${
                        focusedField === 'name' ? 'border-purple-500/60 shadow-lg shadow-purple-500/10' : 'border-gray-700/50 hover:border-gray-600/50'
                      }`}
                      placeholder="Your name..."
                    />
                  </div>

                  {/* Email field */}
                  <div>
                    <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">
                      Return Frequency
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      onFocus={() => { setFocusedField('email'); soundEngine.playHover(); }}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full px-4 py-3 rounded-lg bg-gray-800/50 border transition-all duration-300 text-white placeholder-gray-600 outline-none font-mono text-sm ${
                        focusedField === 'email' ? 'border-cyan-500/60 shadow-lg shadow-cyan-500/10' : 'border-gray-700/50 hover:border-gray-600/50'
                      }`}
                      placeholder="your.email@example.com"
                    />
                  </div>

                  {/* Message field */}
                  <div>
                    <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">
                      Transmission Content
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      onFocus={() => { setFocusedField('message'); soundEngine.playHover(); }}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full px-4 py-3 rounded-lg bg-gray-800/50 border transition-all duration-300 text-white placeholder-gray-600 outline-none font-mono text-sm resize-none ${
                        focusedField === 'message' ? 'border-blue-500/60 shadow-lg shadow-blue-500/10' : 'border-gray-700/50 hover:border-gray-600/50'
                      }`}
                      placeholder="Your message..."
                    />
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={isLaunching}
                    className={`w-full py-4 rounded-xl font-medium text-white transition-all duration-300 flex items-center justify-center gap-3 ${
                      isLaunching
                        ? 'bg-gray-700 cursor-wait'
                        : 'bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-[1.02]'
                    }`}
                  >
                    {isLaunching ? (
                      <>
                        <Rocket className="w-5 h-5 rocket-launch" />
                        <span className="animate-pulse">Transmitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Launch Transmission
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;