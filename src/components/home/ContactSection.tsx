"use client"
import { Mail, MapPin, Phone, Github, Linkedin, ExternalLink } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import ContactForm from '../contact/ContactForm';

const ContactSection: React.FC = () => {

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
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;