export interface Skill {
  name: string;
  level: number; // 0-100 proficiency
}

export interface SkillGroup {
  category: string;
  items: Skill[];
  icon: string;
  color: string;
}

export const skills: SkillGroup[] = [
  {
    category: 'Programming Languages',
    items: [
      { name: 'JavaScript', level: 95 },
      { name: 'TypeScript', level: 90 },
      { name: 'Python', level: 90 },
      { name: 'Java', level: 85 },
      { name: 'C', level: 75 },
      { name: 'Bash', level: 70 },
    ],
    icon: 'code',
    color: '#3b82f6',
  },
  {
    category: 'Frontend & Mobile',
    items: [
      { name: 'React.js', level: 95 },
      { name: 'Next.js', level: 90 },
      { name: 'React Native', level: 88 },
      { name: 'Capacitor', level: 75 },
      { name: 'MUI', level: 85 },
      { name: 'WebSockets', level: 80 },
    ],
    icon: 'smartphone',
    color: '#8b5cf6',
  },
  {
    category: 'Backend & Data',
    items: [
      { name: 'Node.js', level: 90 },
      { name: 'REST APIs', level: 92 },
      { name: 'MongoDB', level: 88 },
      { name: 'Firebase', level: 90 },
      { name: 'MySQL', level: 80 },
      { name: 'AWS (EC2, S3)', level: 78 },
    ],
    icon: 'database',
    color: '#06b6d4',
  },
  {
    category: 'Testing & Automation',
    items: [
      { name: 'Playwright', level: 90 },
      { name: 'Selenium', level: 85 },
      { name: 'Appium', level: 82 },
      { name: 'TestNG', level: 88 },
      { name: 'JUnit', level: 85 },
      { name: 'Jest', level: 88 },
      { name: 'SWTBot', level: 80 },
      { name: 'Log4j', level: 78 },
    ],
    icon: 'testTube',
    color: '#22c55e',
  },
  {
    category: 'DevOps & Tools',
    items: [
      { name: 'Git', level: 95 },
      { name: 'GitHub', level: 95 },
      { name: 'Docker', level: 82 },
      { name: 'CI/CD', level: 88 },
      { name: 'Maven', level: 80 },
      { name: 'Jenkins', level: 78 },
      { name: 'Eclipse RCP', level: 75 },
    ],
    icon: 'terminal',
    color: '#f59e0b',
  },
  {
    category: 'AI & Intelligence',
    items: [
      { name: 'NLP', level: 85 },
      { name: 'LLMs', level: 88 },
      { name: 'Prompt Engineering', level: 90 },
      { name: 'OpenAI APIs', level: 88 },
      { name: 'System Design', level: 85 },
      { name: 'Design Patterns', level: 82 },
      { name: 'OOP', level: 90 },
    ],
    icon: 'brain',
    color: '#ec4899',
  },
];

export const softSkills: string[] = [
  'Problem Solving',
  'Critical Analysis',
  'Client Handling',
  'Communication',
  'Project Management',
];