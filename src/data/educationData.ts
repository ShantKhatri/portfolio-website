export interface Education {
  degree: string;
  institution: string;
  period: string;
  cgpa: string;
  description?: string;
}

export const education: Education[] = [
  {
    degree: 'PG Certificate in Data Science & AI',
    institution: 'IIIT Bangalore',
    period: '2024 – 2025',
    cgpa: '9.47',
    description: 'Specialized training in advanced machine learning techniques, deep learning, NLP, and AI applications.',
  },
  {
    degree: 'B.Tech in Computer Engineering',
    institution: 'Jamia Millia Islamia University',
    period: '2021 – 2025',
    cgpa: '7.75',
    description: 'Core coursework in data structures, algorithms, software engineering, and computer architecture.',
  },
];