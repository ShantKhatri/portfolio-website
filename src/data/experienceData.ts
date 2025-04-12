interface Experience {
  title: string;
  company: string;
  period: string;
  location: string;
  description: string[];
}

export const experiences: Experience[] = [
  {
    title: 'Machine Learning Engineer Intern',
    company: 'OneStack Technologies Pvt Ltd',
    period: 'Sept 2024 - Present',
    location: 'New Delhi, India',
    description: [
      'Built a pneumonia detection model with 92% accuracy using TensorFlow & PyTorch',
      'Developed NLP sentiment analysis using BERT, boosting feedback efficiency by 40%',
      'Reduced inference time by 30% using quantization and pruning',
      'Built scalable data pipelines handling 10M+ records'
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