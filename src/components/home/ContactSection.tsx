"use client"
import { useState } from 'react';
import { Mail, MapPin, Phone, Send, Github, Linkedin, ExternalLink } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitError, setSubmitError] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');
    setSubmitError(false);
    
    try {
      // Replace with actual form submission logic
      // Example with EmailJS or similar service:
      // await emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', e.target as HTMLFormElement, 'YOUR_USER_ID');
      
      // For now, simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setSubmitMessage('Thank you! Your message has been sent successfully.');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setSubmitError(true);
      setSubmitMessage('Something went wrong. Please try again later or contact me directly via email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 px-8 bg-black/30">
      <div className="max-w-7xl mx-auto">
        <SectionHeading 
          title="Get In Touch" 
          subtitle="Have a project in mind or interested in collaboration? Let's connect!"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
          {/* Contact info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-6">Contact Information</h3>
              <p className="text-gray-400 mb-8">
                I&apos;m currently available for freelance work, full-time positions, and open source collaborations. 
                Feel free to reach out if you&apos;re looking for a developer with expertise in Machine Learning and Automation.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start group">
                <div className="p-3 rounded-full bg-purple-900/30 group-hover:bg-purple-900/50 transition-colors mt-1 mr-4">
                  <Mail className="w-6 h-6 text-purple-400 group-hover:text-purple-300" />
                </div>
                <div>
                  <h4 className="font-medium">Email</h4>
                  <a 
                    href="mailto:prashantkhatri202@gmail.com" 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    prashantkhatri202@gmail.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start group">
                <div className="p-3 rounded-full bg-purple-900/30 group-hover:bg-purple-900/50 transition-colors mt-1 mr-4">
                  <Phone className="w-6 h-6 text-purple-400 group-hover:text-purple-300" />
                </div>
                <div>
                  <h4 className="font-medium">Phone</h4>
                  <a 
                    href="tel:+919023261902" 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    +91 9023261902
                  </a>
                </div>
              </div>
              
              <div className="flex items-start group">
                <div className="p-3 rounded-full bg-purple-900/30 group-hover:bg-purple-900/50 transition-colors mt-1 mr-4">
                  <MapPin className="w-6 h-6 text-purple-400 group-hover:text-purple-300" />
                </div>
                <div>
                  <h4 className="font-medium">Location</h4>
                  <p className="text-gray-400">New Delhi, India</p>
                  <p className="text-gray-500 text-sm mt-1">Available for remote work worldwide</p>
                </div>
              </div>
            </div>
            
            <div className="pt-8 border-t border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Find Me Online</h3>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="https://github.com/ShantKhatri" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Github className="w-5 h-5 mr-2" />
                  <span>GitHub</span>
                </a>
                <a 
                  href="https://linkedin.com/in/prashantkumar-khatri" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Linkedin className="w-5 h-5 mr-2" />
                  <span>LinkedIn</span>
                </a>
                <a 
                  href="https://www.upwork.com/freelancers/~013eb705bbd0af4810" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  <span>Upwork</span>
                </a>
              </div>
            </div>
          </div>
          
          {/* Contact form */}
          <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl p-8 border border-gray-800/50 hover:border-gray-700/50 transition-colors">
            <h3 className="text-xl font-semibold mb-6">Send a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6" suppressHydrationWarning>
              <div className="group">
                <label htmlFor="name" className="block text-sm font-medium mb-2 group-focus-within:text-purple-400 transition-colors">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Your name"
                />
              </div>
              
              <div className="group">
                <label htmlFor="email" className="block text-sm font-medium mb-2 group-focus-within:text-purple-400 transition-colors">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="your@email.com"
                />
              </div>
              
              <div className="group">
                <label htmlFor="message" className="block text-sm font-medium mb-2 group-focus-within:text-purple-400 transition-colors">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all"
                  placeholder="I'm interested in collaborating on..."
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium rounded-lg transition-all duration-300 disabled:opacity-70 transform hover:translate-y-[-2px]"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </>
                )}
              </button>
              
              {submitMessage && (
                <div className={`p-4 rounded-lg ${
                  submitError 
                    ? 'bg-red-500/20 text-red-300 border border-red-800' 
                    : 'bg-green-500/20 text-green-300 border border-green-800'
                } animate-fadeIn`}>
                  {submitMessage}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;