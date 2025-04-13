interface Experience {
  title: string;
  company: string;
  period: string;
  location: string;
  description: string[];
}

export const experiences: Experience[] = [
  {
    title: 'Independent ML Research Engineer',
    company: 'Self-driven',
    period: 'Sept 2024 - Present',
    location: 'New Delhi, India',
    description: [
      'Conducting applied ML/AI research with a focus on real-world healthcare, NLP, and computer vision problems',
      'Developed novel prototypes and filed patents for intelligent systems',
      'Built and deployed models using TensorFlow, PyTorch, and deep learning APIs',
    ]
  },
  {
    title: 'Software Engineer',
    company: 'Shucon Tech',
    period: 'Feb 2025 - Present',
    location: 'New Delhi, India',
    description: [
      'Engineered robust and intuitive UI for the Hospital Management System (HMS) using React.js.',
      'Delivered performant and scalable healthcare tech interfaces, enhancing operational efficiency and user satisfaction',
      'Collaborated with backend and design teams to ensure seamless integration and responsive experience',
    ]
  },
  {
    title: 'Open Source Developer (GSoC)',
    company: 'Eclipse 4diac',
    period: 'May 2024 - Sept 2024',
    location: 'Remote',
    description: [
      'Developed automation for graphical editors using SWTBot, JUnit, Eclipse RCP',
      'Enabled hierarchical nesting/syntax error detection in editors',
      'Enhanced editor reliability for IoT applications'
    ]
  },
  {
    title: 'Open Source Developer (DMP)',
    company: 'Shikshalokam',
    period: 'May 2024 - Sept 2024',
    location: 'Remote',
    description: [
      'Built a generic testing framework (Playwright + TestNG) for native/web apps',
      'Automated core workflows & P1 sanity test cases',
      'Enhanced logging/reporting with Log4j & SimpleJavaMailer'
    ]
  },
  {
    title: 'Software Engineer',
    company: 'OneStack Technologies',
    period: 'Jun 2021 - May 2024',
    location: 'New Delhi, India',
    description: [
      'Led development of PrintSEC, a cloud-based secure printing platform',
      'Optimized performance and implemented modular microservices',
      'Streamlined CI/CD and Git workflows'
    ]
  },
  {
    title: 'Freelance Software Developer',
    company: 'Upwork & Other Platforms',
    period: 'Jun 2020 - Present',
    location: 'Remote',
    description: [
      'Delivered 25+ projects (100% satisfaction) using React Native/React',
      'Developed cross-platform mobile apps, backends, and intelligent systems'
    ]
  }
];