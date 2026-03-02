'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Briefcase, Calendar, MapPin } from 'lucide-react';
import api from '@/lib/api';

export default function ExperiencePage() {
    const [experiences, setExperiences] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchExperiences = async () => {
            try {
                const response = await api.get('/Experiences/public');
                setExperiences(response.data);
            } catch (error) {
                console.error('Error fetching experiences:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchExperiences();
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
                    <h1 className="text-4xl font-extrabold mb-6">Professional Journey</h1>
                    <p className="text-xl text-muted-foreground">
                        A timeline of my professional experience and educational background.
                    </p>
                </div>

                <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                    {experiences.map((exp, index) => (
                        <motion.div
                            key={exp.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                        >
                            {/* Icon */}
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background group-[.is-active]:bg-primary group-[.is-active]:text-primary-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                <Briefcase className="w-5 h-5" />
                            </div>
                            {/* Content */}
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl glass hover:border-primary/50 transition-colors">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                                    <time className="text-sm font-semibold text-primary flex items-center">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        {new Date(exp.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : 'Present'}
                                    </time>
                                    {exp.location && (
                                        <span className="text-xs text-muted-foreground flex items-center">
                                            <MapPin className="w-3 h-3 mr-1" />
                                            {exp.location}
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-xl font-bold mb-1">{exp.role}</h3>
                                <div className="text-lg font-medium text-foreground/80 mb-4">{exp.company}</div>
                                <div className="text-muted-foreground text-sm space-y-2 prose prose-sm dark:prose-invert max-w-none">
                                    {exp.description ? exp.description.split('\n').map((line: string, i: number) => (
                                        <p key={i}>{line}</p>
                                    )) : "No description provided."}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </Container>
        </div>
    );
}
