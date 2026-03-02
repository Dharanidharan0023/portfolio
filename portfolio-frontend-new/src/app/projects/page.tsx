'use client';

import * as React from 'react';
import { Container } from '@/components/ui/Container';
import { ProjectCard } from '@/components/ui/ProjectCard';
import api from '@/lib/api';

export default function ProjectsPage() {
    const [projects, setProjects] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await api.get('/Projects/public');
                setProjects(response.data);
            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="py-20 animate-in">
            <Container>
                <div className="max-w-3xl mb-16">
                    <h1 className="text-4xl font-extrabold mb-6">Featured Projects</h1>
                    <p className="text-xl text-muted-foreground">
                        A selection of my recent work, ranging from web applications to creative digital experiences.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <ProjectCard
                            key={project.id}
                            title={project.title}
                            description={project.description}
                            imageUrl={project.thumbnailUrl || project.imageUrl}
                            liveUrl={project.liveUrl}
                            githubUrl={project.githubUrl}
                            tags={project.technologies?.split(',')}
                            index={index}
                        />
                    ))}
                </div>

                {projects.length === 0 && (
                    <div className="text-center py-20 bg-secondary/20 rounded-3xl border border-dashed border-border">
                        <p className="text-muted-foreground">No projects found. Check back later!</p>
                    </div>
                )}
            </Container>
        </div>
    );
}
