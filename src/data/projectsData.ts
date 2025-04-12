export interface Project {
  id: number;
  title: string;
  description: string;
  tech: string[];
  color: string;
  icon: string;
  links: {
    github?: string;
    live?: string;
  };
}

export const projects: Project[] = [
  {
    id: 1,
    title: 'FloraFinder – AI Plant Identifier App',
    description: 'ML-powered plant recognition mobile application with 95% accuracy rate for identifying plant species from photos.',
    tech: ['React Native', 'TensorFlow', 'Cloud Vision API', 'Node.js', 'Firebase'],
    color: '#4caf50',
    icon: 'leaf',
    links: {
      github: 'https://github.com/ShantKhatri/florafinder',
      live: 'https://florafinder-demo.vercel.app'
    }
  },
  {
    id: 2,
    title: 'PrintSEC – Secure Printing System',
    description: 'Cloud-based secure printing platform with AI-based redaction and document handling with geolocation-based printing.',
    tech: ['React Native', 'React', 'Firebase', 'OCR', 'NLP'],
    color: '#2196f3',
    icon: 'printer',
    links: {
      github: 'https://github.com/ShantKhatri/printsec',
    }
  },
  {
    id: 3,
    title: 'DigitalWiseon – AI Chatbot Business Site',
    description: 'Full-stack solution for service bookings with an integrated intelligent chatbot for customer queries and support.',
    tech: ['Next.js', 'Firebase', 'React-Chatbot-Kit'],
    color: '#9c27b0',
    icon: 'messageSquare',
    links: {
      github: 'https://github.com/ShantKhatri/digitalwiseon',
      live: 'https://digitalwiseon.com'
    }
  },
  {
    id: 4,
    title: 'Generic Testing Framework',
    description: 'Comprehensive testing framework for native and web applications using Playwright and TestNG with enhanced logging.',
    tech: ['Playwright', 'TestNG', 'Java', 'Log4j', 'SimpleJavaMailer'],
    color: '#ff9800',
    icon: 'testTube',
    links: {
      github: 'https://github.com/ShantKhatri/testing-framework'
    }
  },
  {
    id: 5,
    title: 'Eclipse 4diac Editor Tools',
    description: 'Automation tools for graphical editors with hierarchical nesting and syntax error detection for IoT applications.',
    tech: ['Java', 'SWTBot', 'JUnit', 'Eclipse RCP'],
    color: '#f44336',
    icon: 'code',
    links: {
      github: 'https://github.com/eclipse-4diac/4diac-ide'
    }
  }
];