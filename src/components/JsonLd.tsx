'use client';

export default function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: 'Prashantkumar Khatri',
          url: 'https://prashantkhatri.com',
          image: 'https://prashantkhatri.com/profile-photo.png',
          jobTitle: 'Full Stack & ML Automation Engineer',
          worksFor: {
            '@type': 'Organization',
            name: 'Shucon Tech',
          },
          alumniOf: [
            {
              '@type': 'EducationalOrganization',
              name: 'International Institute of Information Technology, Bangalore',
            },
            {
              '@type': 'EducationalOrganization',
              name: 'Jamia Millia Islamia University',
            }
          ],
          sameAs: [
            'https://github.com/ShantKhatri',
            'https://linkedin.com/in/prashantkumar-khatri',
            'https://www.upwork.com/freelancers/~013eb705bbd0af4810'
          ],
          knowsAbout: [
            'Full Stack Development',
            'Machine Learning',
            'Test Automation',
            'React',
            'TypeScript',
            'Next.js',
            'CI/CD Pipelines',
            'DevOps Practices',
            'MLOps',
            'Cloud Architecture',
            'SWTBot',
            'Eclipse RCP'
          ],
          description: 'Experienced Full Stack Developer specializing in Machine Learning, Test Automation, CI/CD pipelines, and Cloud Architecture.'
        })
      }}
    />
  );
}