export interface SkillGroup {
  category: string;
  items: string[];
  icon: string;
  color: string;
}

export const skills: SkillGroup[] = [
  {
    category: 'Machine Learning & AI',
    items: [
      'TensorFlow', 'PyTorch', 'Scikit-learn', 
      'Pandas', 'NumPy', 'OpenCV',
      'NLP', 'Computer Vision'
    ],
    icon: 'brain',
    color: '#9c27b0' // Purple
  },
  {
    category: 'Programming Languages',
    items: [
      'Python', 'Java', 'JavaScript', 
      'TypeScript', 'C'
    ],
    icon: 'code',
    color: '#2196f3' // Blue
  },
  {
    category: 'Web & Mobile Development',
    items: [
      'React', 'React Native', 'Redux',
      'Node.js', 'Express.js', 'Next.js'
    ],
    icon: 'smartphone',
    color: '#4caf50' // Green
  },
  {
    category: 'Database & Backend',
    items: [
      'MongoDB', 'Firebase', 'REST APIs',
      'Cloud Functions', 'AWS'
    ],
    icon: 'database',
    color: '#ff9800' // Orange
  },
  {
    category: 'Testing & Automation',
    items: [
      'Playwright', 'Selenium', 'Appium',
      'TestNG', 'JUnit', 'Log4j', 'SWTBot',
      'Jest'
    ],
    icon: 'testTube',
    color: '#f44336' // Red
  },
  {
    category: 'DevOps & Tools',
    items: [
      'Git', 'GitHub', 'Docker', 'AWS',
      'Maven', 'CI/CD', 'Eclipse RCP'
    ],
    icon: 'terminal',
    color: '#673ab7' // Indigo
  }
];