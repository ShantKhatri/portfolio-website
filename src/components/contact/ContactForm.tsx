"use client"
import { useState } from 'react';
import { Send } from 'lucide-react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Note: This doesn't need authentication since we're allowing public create operations
const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');
    
    try {
      // Direct submission without auth - security rules allow this
      await addDoc(collection(db, 'contact-messages'), {
        ...formData,
        createdAt: serverTimestamp(),
        read: false
      });
      
      // Clear form and show success
      setFormData({
        name: '',
        email: '',
        message: '',
      });
      
      setSubmitStatus('success');
    } catch (error: any) {
      console.error("Contact form submission error:", error);
      setSubmitStatus('error');
      setErrorMessage(error.message || 'Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
      
      {submitStatus === 'success' && (
        <div className="p-4 bg-green-500/20 text-green-300 border border-green-800 rounded-lg animate-fadeIn">
          Thank you for your message! I&apos;ll get back to you soon.
        </div>
      )}
      
      {submitStatus === 'error' && (
        <div className="p-4 bg-red-500/20 text-red-300 border border-red-800 rounded-lg animate-fadeIn">
          {errorMessage || 'An error occurred. Please try again.'}
        </div>
      )}
    </form>
  );
};

export default ContactForm;