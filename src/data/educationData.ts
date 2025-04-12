export interface Education {
  degree: string;
  institution: string;
  period: string;
  description?: string;
}

export const education: Education[] = [
  {
    degree: 'Post Graduate Certificate in Data Science & AI',
    institution: 'International Institute of Information Technology, Bangalore',
    period: '2023 - 2024',
    description: 'Specialized training in advanced machine learning techniques, deep learning, and AI applications.'
  },
  {
    degree: 'B.Tech, Computer Engineering',
    institution: 'Jamia Millia Islamia University',
    period: '2021 - 2025',
    description: 'Core coursework in data structures, algorithms, software engineering, and computer architecture.'
  }
];