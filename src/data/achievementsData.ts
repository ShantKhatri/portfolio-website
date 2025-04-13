export interface Achievement {
  title: string;
  organization: string;
  year: string;
  description?: string;
  link?: string;
}

export const achievements: Achievement[] = [
  {
    title: 'Google Summer of Code 2024',
    organization: 'Eclipse Foundation',
    year: '2024',
    description: 'Selected as a contributor for the Eclipse 4diac project, working on automation tools for graphical editors.',
    link: 'https://gist.github.com/ShantKhatri/b1c6f1a53f32b74e10c2e8617ff751d2'
  },
  {
    title: 'Code For GovTech 2024 (DMP) Contributor',
    organization: 'Shikshalokam',
    year: '2024',
    description: 'Participated in the Digital Mentorship Program, creating a generic testing framework for applications.'
  },
  {
    title: 'Top Contributor',
    organization: 'Eclipse JKube',
    year: '2023',
    description: 'Recognized for significant contributions to the Eclipse JKube open-source project.',
    link: 'https://github.com/eclipse/jkube'
  },
  {
    title: 'BazelCon 2024 Attendee',
    organization: 'Linux Foundation',
    year: '2024',
    description: 'Sponsored attendee at BazelCon, focusing on build system optimization and CI/CD pipelines.'
  }
];