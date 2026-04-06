export interface Achievement {
  title: string;
  organization: string;
  year: string;
  description?: string;
  link?: string;
  rarity: 'legendary' | 'epic' | 'rare';
  icon: string;
}

export const achievements: Achievement[] = [
  {
    title: 'Google Summer of Code 2025',
    organization: 'Eclipse Adoptium',
    year: '2025',
    description: 'Designed and built CommitHunter — an automated ML-powered system to identify test-breaking Git commits with high precision.',
    rarity: 'legendary',
    icon: '🏆',
  },
  {
    title: 'Google Summer of Code 2024',
    organization: 'Eclipse 4diac',
    year: '2024',
    description: 'Automated test suites for graphical editors using SWTBot, JUnit, Eclipse RCP, improving editor reliability for IoT applications.',
    link: 'https://gist.github.com/ShantKhatri/b1c6f1a53f32b74e10c2e8617ff751d2',
    rarity: 'legendary',
    icon: '🏆',
  },
  {
    title: 'Code for GovTech 2025 (DMP)',
    organization: 'SampattiCard',
    year: '2025',
    description: 'Built Financial Agent — a privacy-first desktop AI assistant for financial processes using offline LLMs and multilingual support.',
    rarity: 'epic',
    icon: '⚡',
  },
  {
    title: 'Code for GovTech 2024 (DMP)',
    organization: 'Shikshalokam',
    year: '2024',
    description: 'Created a generic testing framework for mobile and web platforms using Playwright, TestNG, and Log4j.',
    rarity: 'epic',
    icon: '⚡',
  },
];