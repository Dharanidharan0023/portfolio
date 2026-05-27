'use client';

import * as React from 'react';
import { Hero } from '@/components/sections/Hero';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { ProjectCard } from '@/components/ui/ProjectCard';
import api from '@/lib/api';

export default function Home() {
  const [profile, setProfile] = React.useState<any>(null);
  const [about, setAbout] = React.useState<any>(null);
  const [featuredProjects, setFeaturedProjects] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, aboutRes, projectsRes] = await Promise.all([
          api.get('/Profiles/public'),
          api.get('/Abouts/public'),
          api.get('/Projects/public')
        ]);
        setProfile(profileRes.data);
        setAbout(aboutRes.data);
        setFeaturedProjects(projectsRes.data.filter((p: any) => p.isFeatured));
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-20">
      <Hero
        name={profile?.name}
        title={profile?.title}
        bio={profile?.summary || profile?.bio}
      />

      {/* Merged About Section */}
      <section id="about" className="py-20 bg-secondary/30 relative overflow-hidden">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center justify-center gap-2 mb-6">
                <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold tracking-widest uppercase border border-primary/20">
                  About Me
                </span>
                <span className="px-4 py-1.5 rounded-full bg-secondary text-foreground text-sm font-bold tracking-widest uppercase border border-border">
                  B Tech IT
                </span>
              </div>
              <h3 className="text-4xl md:text-5xl font-extrabold mb-8 tracking-tight">
                {about?.title || "Passionate Developer & Creator"}
              </h3>
              <div className="space-y-6 text-lg md:text-xl text-muted-foreground leading-relaxed text-justify md:text-center">
                {about?.description ? (
                  about.description.split('\n').map((para: string, i: number) => (
                    <p key={i}>{para}</p>
                  ))
                ) : (
                  <p>I am a software engineer with a deep passion for building high-quality, modern web applications. With expertise in full-stack development, I strive to create seamless user experiences and robust backend systems.</p>
                )}
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Featured Projects Section */}
      {featuredProjects.length > 0 && (
        <section id="featured-projects" className="py-20 relative overflow-hidden">
          <Container>
            <div className="max-w-4xl mx-auto text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7 }}
              >
                <div className="inline-flex items-center justify-center gap-2 mb-6">
                  <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold tracking-widest uppercase border border-primary/20">
                    Selected Work
                  </span>
                </div>
                <h3 className="text-4xl md:text-5xl font-extrabold mb-8 tracking-tight">
                  Featured Projects
                </h3>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  A highlight of some of my best and most complete works.
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project, index) => (
                  <ProjectCard
                      key={project.id}
                      title={project.title}
                      description={project.description}
                      imageUrl={project.thumbnailUrl || project.imageUrl}
                      liveUrl={project.projectUrl}
                      githubUrl={project.githubUrl}
                      tags={project.technologies?.split(',')}
                      index={index}
                  />
              ))}
            </div>
            
            <div className="text-center mt-12">
               <a href="/projects" className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-secondary text-foreground hover:bg-secondary/80 border border-border transition-colors font-semibold">
                   View All Projects
               </a>
            </div>
          </Container>
        </section>
      )}

      {/* Add dark theme specific gradient overlays */}
      <div className="fixed inset-0 pointer-events-none z-[-1] dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] dark:from-background dark:via-background dark:to-black opacity-80" />
    </div>
  );
}
