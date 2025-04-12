"use client"
import { Suspense } from 'react';
import Layout from '../components/layout/Layout';
import HeroSection from '../components/home/HeroSection';
import ProjectsSection from '../components/home/ProjectsSection';
import SkillsSection from '../components/home/SkillsSection';
import ExperienceSection from '../components/home/ExperienceSection';
import EducationSection from '../components/home/EducationSection';
import AchievementsSection from '../components/home/AchievementsSection';
// import BlogSection from '../components/home/BlogSection';
import ContactSection from '../components/home/ContactSection';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Home: React.FC = () => {
  return (
    <Layout>
      {/* Hero section always loads immediately */}
      <HeroSection />
      
      {/* Lazy load sections that might be below the fold for better performance */}
      <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center"><LoadingSpinner /></div>}>
        <ProjectsSection />
      </Suspense>
      
      <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center"><LoadingSpinner /></div>}>
        <SkillsSection />
      </Suspense>
      
      <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center"><LoadingSpinner /></div>}>
        <ExperienceSection />
      </Suspense>
      
      <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center"><LoadingSpinner /></div>}>
        <EducationSection />
      </Suspense>
      
      <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center"><LoadingSpinner /></div>}>
        <AchievementsSection />
      </Suspense>
{/*       
      <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center"><LoadingSpinner /></div>}>
        <BlogSection />
      </Suspense> */}
      
      <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center"><LoadingSpinner /></div>}>
        <ContactSection />
      </Suspense>
    </Layout>
  );
};

export default Home;