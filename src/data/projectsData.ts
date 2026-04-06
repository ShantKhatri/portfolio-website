export interface Project {
  id: number;
  title: string;
  description: string;
  tech: string[];
  color: string;
  icon: string;
  category: string;
  links: {
    github?: string;
    live?: string;
  };
}

export const projects: Project[] = [
  {
    id: 1,
    title: 'CommitHunter',
    description: 'An automated system using rule-based logic and ML models to identify test-breaking Git commits with high precision. Integrated into CI pipelines and GitHub workflows.',
    tech: ['Python', 'NLP', 'ML', 'GitHub APIs', 'Jenkins', 'MongoDB'],
    color: '#8b5cf6',
    icon: 'search',
    category: 'AI/ML',
    links: {
      github: 'https://github.com/adoptium/CommitHunter',
    },
  },
  {
    id: 2,
    title: 'Financial Agent',
    description: 'A privacy-first desktop AI assistant that guides users through financial processes like loans and KYC using an offline, chat-based interface with multilingual support.',
    tech: ['LLMs', 'BrowserUse', 'OCR', 'Python', 'P2P Caching'],
    color: '#06b6d4',
    icon: 'bot',
    category: 'AI/ML',
    links: {
      github: 'https://github.com/SampattiCard/FinancialAgent',
    },
  },
  {
    id: 3,
    title: 'FloraFinder: Nature Mate',
    description: 'Mobile application to identify any plant by scanning it. Uses Cloud Vision API and Trefle API with boolean queries for accurate plant identification.',
    tech: ['React Native', 'Node.js', 'MongoDB', 'Firebase', 'Cloud Vision API', 'Trefle API'],
    color: '#22c55e',
    icon: 'leaf',
    category: 'Mobile',
    links: {
      github: 'https://github.com/ShantKhatri/florafinder',
    },
  },
  {
    id: 4,
    title: 'PrintSec',
    description: 'Cloud-based secure printing service enabling users to print documents from devices or cloud storage to any geographically nearby printer, with fully secured document handling.',
    tech: ['React Native', 'React', 'Firebase', 'Capacitor', 'Cloud Storage'],
    color: '#3b82f6',
    icon: 'printer',
    category: 'Full Stack',
    links: {
      github: 'https://github.com/ShantKhatri/printsec',
    },
  },
  {
    id: 5,
    title: 'DigitalWiseon.com',
    description: 'Business website with professional UI, order placement, tracking, service query, email notifications, integrated chatbot, and secure user experience.',
    tech: ['Next.js', 'Node.js', 'Express.js', 'Firebase', 'react-chatbot-kit'],
    color: '#f59e0b',
    icon: 'globe',
    category: 'Full Stack',
    links: {
      github: 'https://github.com/ShantKhatri/digitalwiseon',
      live: 'https://digitalwiseon.com',
    },
  },
];