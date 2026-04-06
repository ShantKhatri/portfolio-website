export interface Experience {
  title: string;
  company: string;
  period: string;
  location: string;
  description: string[];
  tech?: string[];
}

export const experiences: Experience[] = [
  {
    title: 'Freelance Software Engineer',
    company: 'Self-Employed',
    period: 'Jan 2026 - Present',
    location: 'Remote',
    description: [
      'Delivering production-grade full-stack and AI-powered solutions for global clients',
      'Specializing in React, Next.js, and intelligent automation systems',
      'Building scalable web and mobile applications with modern tech stacks',
    ],
    tech: ['React.js', 'Next.js', 'TypeScript', 'Node.js', 'AI/ML'],
  },
  {
    title: 'Software Engineer',
    company: 'Shucon Tech (From Upwork)',
    period: 'Jan 2025 - Jan 2026',
    location: 'Remote',
    description: [
      'Built the frontend for an advanced Hospital Management System (HMS) for the Swami Vivekanand Health Mission Society, enabling efficient healthcare operations',
      'Developed modules for patient records, appointment scheduling, billing, and inventory management with a focus on usability and responsive design',
      'Utilized React.js, JavaScript, and MUI to deliver scalable, maintainable, and high-performance user interfaces',
    ],
    tech: ['React.js', 'JavaScript', 'MUI', 'REST APIs'],
  },
  {
    title: 'Open Source Developer (GSoC 2025)',
    company: 'Eclipse Adoptium',
    period: 'May 2025 - Sep 2025',
    location: 'Remote',
    description: [
      'Designed and built CommitHunter, an automated system using rule-based logic and ML models to identify test-breaking Git commits with high precision',
      'Integrated the tool into CI pipelines and GitHub workflows, reducing manual debugging effort and accelerating test triage',
      'Worked across key Eclipse repositories using Python, GitHub APIs, NLP, Jenkins, and MongoDB',
    ],
    tech: ['Python', 'NLP', 'ML', 'GitHub APIs', 'Jenkins', 'MongoDB'],
  },
  {
    title: 'Open Source Developer (DMP 2025)',
    company: 'SampattiCard — Code for GovTech',
    period: 'May 2025 - Sep 2025',
    location: 'Remote',
    description: [
      'Contributed to building Financial Agent, a privacy-first desktop AI assistant that guides users through financial processes like loans and KYC using an offline, chat-based interface',
      'Engineered automation features for local LLM processing, multilingual support, and P2P caching to ensure accessibility in low-connectivity and low-literacy scenarios',
      'Enhanced infrastructure using BrowserUse, SLMs, and OCR',
    ],
    tech: ['LLMs', 'BrowserUse', 'OCR', 'Python', 'P2P'],
  },
  {
    title: 'Open Source Developer (GSoC 2024)',
    company: 'Eclipse 4diac',
    period: 'May 2024 - Sep 2024',
    location: 'Remote',
    description: [
      'Automated test suites to improve graphical editors\' reliability, enhancing user satisfaction',
      'Collaborated with a global community to ensure robust error detection and debugging',
      'Utilized Eclipse SWTBot, Java, JUnit, and Maven to develop and maintain test infrastructure',
    ],
    tech: ['Java', 'SWTBot', 'JUnit', 'Maven', 'Eclipse RCP'],
  },
  {
    title: 'Open Source Developer (DMP 2024)',
    company: 'Shikshalokam — Code for GovTech',
    period: 'May 2024 - Sep 2024',
    location: 'Remote',
    description: [
      'Automated core workflows to ensure seamless functionality for P1 use cases',
      'Developed a generic testing framework for mobile and web platforms, improving efficiency and code reuse',
      'Utilized Playwright, TestNG, and Log4j to optimize automation testing processes',
    ],
    tech: ['Playwright', 'TestNG', 'Log4j', 'Java'],
  },
];